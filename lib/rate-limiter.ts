/**
 * In-Memory Sliding-Window Rate Limiter
 * Provides robust rate limiting per client IP or custom key
 * Compatible with Next.js App Router and Edge/Node runtimes
 */

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store (cleans up stale keys periodically)
const store = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const oneHourAgo = now - 60 * 60 * 1000;
  for (const [key, record] of store.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > oneHourAgo);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum allowed requests within window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Custom prefix to isolate endpoints */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp in ms
  retryAfterSeconds: number;
}

/**
 * Check if request violates rate limit
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  cleanup();

  const now = Date.now();
  const windowStart = now - config.windowMs;
  const storageKey = `${config.prefix || 'rl'}:${key}`;

  let record = store.get(storageKey);
  if (!record) {
    record = { timestamps: [] };
    store.set(storageKey, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  const requestCount = record.timestamps.length;
  const remaining = Math.max(0, config.maxRequests - requestCount);
  const oldestTimestamp = record.timestamps[0] || now;
  const resetTime = oldestTimestamp + config.windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

  if (requestCount >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    };
  }

  // Read-only check: Do not automatically increment here - allow fine-grained control
  return {
    success: true,
    limit: config.maxRequests,
    remaining: remaining,
    resetTime,
    retryAfterSeconds: 0,
  };
}

/**
 * Check and immediately consume a slot (used for public form submissions, etc.)
 */
export function checkAndConsumeRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const result = checkRateLimit(key, config);
  if (!result.success) return result;

  const storageKey = `${config.prefix || 'rl'}:${key}`;
  let record = store.get(storageKey);
  if (!record) {
    record = { timestamps: [] };
    store.set(storageKey, record);
  }
  record.timestamps.push(Date.now());
  return {
    ...result,
    remaining: Math.max(0, result.remaining - 1),
  };
}

/**
 * Specifically record a failed attempt (e.g. wrong password or bad credentials)
 */
export function recordFailedAttempt(key: string, config: RateLimitConfig): void {
  const storageKey = `${config.prefix || 'rl'}:${key}`;
  let record = store.get(storageKey);
  if (!record) {
    record = { timestamps: [] };
    store.set(storageKey, record);
  }
  record.timestamps.push(Date.now());
}

/**
 * Reset / clear rate limit attempts for a key (e.g. upon successful authentication)
 */
export function resetRateLimit(key: string, prefix = 'auth_login'): void {
  const storageKey = `${prefix}:${key}`;
  store.delete(storageKey);
}

/**
 * Extract true client IP from request headers
 * Prioritizes Cloudflare and direct edge proxies to prevent shared IP lockouts.
 */
export function getClientIp(req: Request): string {
  // 1. Cloudflare direct connecting IP (Highest priority & tamper-proof via Cloudflare proxy)
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  // 2. True-Client-IP header (Cloudflare Enterprise / Edge)
  const trueClientIp = req.headers.get('true-client-ip');
  if (trueClientIp && trueClientIp.trim()) {
    return trueClientIp.trim();
  }

  // 3. X-Real-IP (Direct reverse proxy)
  const realIp = req.headers.get('x-real-ip');
  if (
    realIp &&
    realIp.trim() &&
    !realIp.startsWith('10.') &&
    !realIp.startsWith('172.') &&
    !realIp.startsWith('192.168.') &&
    !realIp.startsWith('127.') &&
    realIp !== '::1'
  ) {
    return realIp.trim();
  }

  // 4. X-Forwarded-For: find first public non-private IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',').map((p) => p.trim()).filter(Boolean);
    const publicIp = parts.find(
      (ip) =>
        !ip.startsWith('10.') &&
        !ip.startsWith('172.') &&
        !ip.startsWith('192.168.') &&
        !ip.startsWith('127.') &&
        ip !== '::1'
    );
    if (publicIp) return publicIp;
    if (parts[0]) return parts[0];
  }

  if (realIp && realIp.trim()) return realIp.trim();

  return '127.0.0.1';
}

/**
 * Pre-configured rate limits for Viwan Platform
 */
export const RATE_LIMITS = {
  // Login: 5 attempts per 15 minutes per IP/account
  AUTH_LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    prefix: 'auth_login',
  },
  // Public submissions (Contact, Consultation, Careers): 10 per hour per IP
  PUBLIC_FORM: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
    prefix: 'public_form',
  },
  // General public API: 120 per minute per IP
  PUBLIC_API: {
    maxRequests: 120,
    windowMs: 60 * 1000,
    prefix: 'public_api',
  },
  // Admin mutations: 60 per minute per IP
  ADMIN_MUTATION: {
    maxRequests: 60,
    windowMs: 60 * 1000,
    prefix: 'admin_mutation',
  },
} as const;
