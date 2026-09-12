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

  // Record this request
  record.timestamps.push(now);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: remaining - 1,
    resetTime,
    retryAfterSeconds: 0,
  };
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
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
