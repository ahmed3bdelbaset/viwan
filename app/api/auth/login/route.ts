import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { isAuthorizedAdminEmail, getAdminPassword, verifyPassword } from '@/lib/admin-auth';
import { INITIAL_ADMIN_USERS } from '@/lib/data/seed';
import { createSecureAdminToken } from '@/lib/security';

import { adminLoginSchema, validatePayload } from '@/lib/validations';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp, RATE_LIMITS.AUTH_LOGIN);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'RATE_LIMIT_EXCEEDED',
          error: `تم تجاوز الحد الأقصى للمحاولات (5 محاولات). يرجى الانتظار ${rateCheck.retryAfterSeconds} ثانية ثم المحاولة مجدداً.`,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await req.json();
    const validation = validatePayload(adminLoginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_INPUT',
          error: 'البيانات المدخلة غير صالحة، يرجى إدخال بريد إلكتروني وكلمة مرور صحيحين.',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const { email, password, locale } = validation.data;
    const isEn = locale === 'en';

    const currentPassword = getAdminPassword(email);
    const isPasswordCorrect = verifyPassword(password, currentPassword);

    // Check against authorized emails or initial users
    const matchedSeedUser = INITIAL_ADMIN_USERS.find(
      (u) => u.email.toLowerCase() === email
    );

    const isAuthorized = isAuthorizedAdminEmail(email) || !!matchedSeedUser;

    if (!isAuthorized || !isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_CREDENTIALS',
          error: isEn
            ? 'Invalid credentials, please check your email and password.'
            : 'بيانات الدخول غير صحيحة، يرجى التحقق من البريد وكلمة المرور',
        },
        { status: 401 }
      );
    }

    const user = matchedSeedUser || {
      id: 'usr-1',
      name: 'Tarek Mansour',
      name_ar: 'طارق منصور',
      email: email,
      role: 'Super Admin' as const,
      role_ar: 'المدير العام وكبير المعماريين',
      phone: '+20 100 234 5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      status: 'Active' as const,
      createdAt: '2024-01-15',
    };

    const token = createSecureAdminToken(email);

    const cookieStore = await cookies();
    cookieStore.set('viwan_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
