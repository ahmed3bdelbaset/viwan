import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySecureAdminToken } from './lib/security'

// In-memory rate limiting store (IP -> array of request timestamps)
const rateLimitStore = new Map<string, number[]>()

// Periodic cleanup of rate limit store every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()

  // Clean old keys occasionally
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now
    for (const [storedIp, timestamps] of rateLimitStore.entries()) {
      const valid = timestamps.filter((t) => now - t < windowMs)
      if (valid.length === 0) {
        rateLimitStore.delete(storedIp)
      } else {
        rateLimitStore.set(storedIp, valid)
      }
    }
  }

  const timestamps = rateLimitStore.get(ip) || []
  const recent = timestamps.filter((t) => now - t < windowMs)

  if (recent.length >= limit) {
    return false // Rate limit exceeded
  }

  recent.push(now)
  rateLimitStore.set(ip, recent)
  return true
}

// Known malicious scanner user-agents to block immediately
const MALICIOUS_BOT_PATTERN =
  /(sqlmap|nikto|wpscan|masscan|zgrab|acunetix|gobuster|dirbuster|nmap|morfeus|fuzz)/i

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'

  // =========================================================================
  // 1. Anti-Bot: Block Automated Vulnerability Scanners & Exploit Probes
  // =========================================================================
  if (MALICIOUS_BOT_PATTERN.test(userAgent)) {
    return new NextResponse('Forbidden: Malicious tool or scanner detected', { status: 403 })
  }

  // =========================================================================
  // =========================================================================
  // 2. Rate Limiting for Public APIs and Authentication
  // =========================================================================
  if (pathname === '/portal-vault-vw792' || pathname === '/api/auth/login' || pathname === '/api/admin/login') {
    const allowed = checkRateLimit(`login_${ip}`, 10, 15 * 60 * 1000)
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          error: 'تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار 15 دقيقة ثم المحاولة مجدداً.',
        },
        { status: 429, headers: { 'Retry-After': '900' } }
      )
    }
  }

  // Block old predictable admin login path with 404 Not Found
  if (pathname === '/admin/login') {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (pathname.startsWith('/api/')) {
    // Rate limits for public forms (Anti-Spam & Denial of Service defense): 6 per minute
    if (
      pathname === '/api/contact' ||
      pathname === '/api/consultation' ||
      pathname === '/api/careers'
    ) {
      const allowed = checkRateLimit(`form_${ip}`, 6, 60 * 1000)
      if (!allowed) {
        return NextResponse.json(
          {
            success: false,
            code: 'RATE_LIMIT_EXCEEDED',
            error: 'تم إرسال طلبات متعددة خلال وقت قصير. يرجى الانتظار دقيقة قبل المحاولة ثانية.',
          },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      }
    }
  }

  // =========================================================================
  // 3. Default-Deny Access Control for Admin Dashboard & Admin APIs
  // =========================================================================
  const isPublicAdminRoute =
    pathname === '/portal-vault-vw792' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/admin/auth/forgot-password'

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (!isPublicAdminRoute) {
      const token =
        request.cookies.get('viwan_admin_token')?.value ||
        request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

      const authResult = verifySecureAdminToken(token)

      if (!authResult.valid) {
        // If API route, return 401 JSON
        if (pathname.startsWith('/api/admin')) {
          return NextResponse.json(
            {
              success: false,
              code: 'UNAUTHORIZED',
              error: 'غير مصرح: يجب تسجيل الدخول كمسؤول للوصول إلى هذا المسار',
            },
            { status: 401 }
          )
        }

        // If UI page, redirect to secret admin login portal
        const loginUrl = new URL('/portal-vault-vw792', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  // =========================================================================
  // 4. Strict Security Headers & Content Security Policy (Anti-XSS & Defense-in-Depth)
  // =========================================================================
  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com https://www.youtube.com https://www.youtube-nocookie.com https://*.youtube.com",
    "connect-src 'self' https://*.googleapis.com https://*.google.com https://*.gstatic.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Static asset files (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
