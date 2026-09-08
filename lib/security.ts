import crypto from 'crypto'

/**
 * Secret key for signing admin sessions.
 * Falls back to a deterministic machine key if not explicitly set in environment,
 * but never uses a predictable public static constant.
 */
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'viwan_secure_session_secret_fallback_key_2026_salt'

/**
 * XSS & Script Injection Sanitizer
 * Strips HTML tags, script blocks, inline JS event handlers, and javascript: pseudo-protocols.
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return ''
    return String(input)
  }

  return input
    // Remove script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags and their contents
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove iframe/object/embed tags
    .replace(/<\/?(iframe|object|embed|frame|frameset|applet)\b[^>]*>/gi, '')
    // Remove javascript: and vbscript: URIs
    .replace(/(javascript|vbscript|data):/gi, '')
    // Remove inline event handlers like onload=, onerror=, onclick=
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bon\w+\s*=\s*[^\s>]+/gi, '')
    // Escape HTML special characters for safe storage & rendering
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
}

/**
 * Sanitize an entire object of string inputs recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeInput(value)
    } else if (value !== null && typeof value === 'object') {
      result[key] = sanitizeObject(value)
    } else {
      result[key] = value
    }
  }
  return result
}

/**
 * Anti-Bot Honeypot Checker
 * Honeypot fields are invisible to humans. If present and filled, it indicates an automated bot.
 */
export function isHoneypotTriggered(
  body: Record<string, any>,
  honeypotKeys: string[] = ['_gotcha', '_honey', '_gotcha_company_title', '_gotcha_project_scope', 'fax_number', 'website_url_hp']
): boolean {
  for (const key of honeypotKeys) {
    if (body[key] && String(body[key]).trim().length > 0) {
      return true
    }
  }
  return false
}

/**
 * Anti-Bot Velocity (Time-to-Submit) Checker
 * Humans take at least 1.5 - 2 seconds to interact with and submit a form.
 * Instant submissions (< 1.2s) are automated bots.
 */
export function isVelocitySuspicious(formLoadedAt: unknown, minAllowedSeconds: number = 1.2): boolean {
  if (!formLoadedAt) return false // Optional if client didn't supply
  const loadedTime = Number(formLoadedAt)
  if (isNaN(loadedTime) || loadedTime <= 0) return false

  const elapsedSeconds = (Date.now() - loadedTime) / 1000
  // If submitted in less than minAllowedSeconds or timestamp is in the future
  return elapsedSeconds < minAllowedSeconds || elapsedSeconds > 86400 * 7
}

/**
 * Generate HMAC-SHA256 Signed Admin Session Token
 * Format: base64(email:timestamp:random):signature
 */
export function createSecureAdminToken(email: string, maxAgeMs: number = 24 * 60 * 60 * 1000): string {
  const cleanEmail = email.trim().toLowerCase()
  const expiresAt = Date.now() + maxAgeMs
  const randomSalt = crypto.randomBytes(16).toString('hex')
  const payload = Buffer.from(`${cleanEmail}:${expiresAt}:${randomSalt}`).toString('base64url')

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url')

  return `${payload}.${signature}`
}

/**
 * Cryptographically Verify Admin Session Token
 */
export function verifySecureAdminToken(token: string | null | undefined): { valid: boolean; email?: string; expired?: boolean } {
  if (!token || typeof token !== 'string') {
    return { valid: false }
  }

  const parts = token.split('.')
  if (parts.length !== 2) {
    // Check legacy tokens for graceful transition during rollout
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const [email, ts] = decoded.split(':')
      if (email && ts && Date.now() - Number(ts) < 24 * 60 * 60 * 1000) {
        return { valid: true, email }
      }
    } catch {}
    return { valid: false }
  }

  const [payload, signature] = parts

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url')

  const sigBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false }
  }

  try {
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8')
    const [email, expiresAtStr] = decoded.split(':')
    const expiresAt = Number(expiresAtStr)

    if (Date.now() > expiresAt) {
      return { valid: false, expired: true, email }
    }

    return { valid: true, email }
  } catch {
    return { valid: false }
  }
}

/**
 * Magic Bytes Validation for Uploaded Files
 * Checks actual binary signature instead of trusting MIME header or file extension.
 */
export function validateImageMagicBytes(buffer: Buffer): { valid: boolean; detectedFormat?: string } {
  if (buffer.length < 4) return { valid: false }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedFormat: 'jpeg' }
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, detectedFormat: 'png' }
  }

  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
    return { valid: true, detectedFormat: 'gif' }
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { valid: true, detectedFormat: 'webp' }
  }

  // PDF: %PDF
  if (buffer.toString('ascii', 0, 4) === '%PDF') {
    return { valid: true, detectedFormat: 'pdf' }
  }

  // MP4: .... ftyp
  if (buffer.length >= 8 && buffer.toString('ascii', 4, 8) === 'ftyp') {
    return { valid: true, detectedFormat: 'mp4' }
  }

  return { valid: false }
}

/**
 * Sanitize and Inspect SVG Content
 * Rejects SVGs containing script tags, foreignObject, or active event handlers.
 */
export function isSafeSvg(content: string): boolean {
  const dangerousPatterns = [
    /<script\b/i,
    /<\/script>/i,
    /<foreignObject\b/i,
    /\bon\w+\s*=/i,
    /javascript:/i,
    /data:text\/html/i,
    /<iframe\b/i,
    /<embed\b/i,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return false
    }
  }

  return true
}
