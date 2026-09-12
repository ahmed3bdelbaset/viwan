import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  isAuthorizedAdminEmail,
  generateOtp,
  verifyOtpCode,
  validateResetToken,
  consumeResetToken,
  setAdminPassword,
  sendBrevoOtpEmail,
} from '@/lib/admin-auth'

export async function POST(req: Request) {
  try {
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ code: 'INVALID_DATA', error: 'بيانات غير صالحة' }, { status: 400 })
    }
    const { action, email, otp, resetToken, newPassword, locale } = body || {}
    const isEn = locale === 'en'

    const cleanEmail = email?.trim()?.toLowerCase()
    if (!cleanEmail) {
      return NextResponse.json(
        { code: 'INVALID_EMAIL', error: isEn ? 'Please enter your email address.' : 'يرجى إدخال البريد الإلكتروني' },
        { status: 400 }
      )
    }

    // ── Phase 1: Request OTP ──────────────────────────────────────────────────
    if (action === 'request-otp') {
      // Step 1: Check if the email is an authorized administrator
      if (!isAuthorizedAdminEmail(cleanEmail)) {
        // OWASP Anti-Enumeration Defense: Return uniform success message so attackers cannot probe for valid admin accounts
        return NextResponse.json({
          success: true,
          code: 'OTP_SENT',
          message: isEn
            ? 'If this email is registered in our system, a verification code has been dispatched.'
            : 'إذا كان هذا البريد مسجلاً في النظام، فقد تم إرسال كود التحقق بنجاح.',
        })
      }

      // Step 2: Generate 6-digit OTP and send via Brevo
      const generatedOtp = generateOtp(cleanEmail)
      const sendRes = await sendBrevoOtpEmail(cleanEmail, generatedOtp)

      if (!sendRes.success) {
        return NextResponse.json(
          {
            code: 'SEND_FAILED',
            error: sendRes.error || (isEn ? 'Failed to send verification code. Please try again later.' : 'تعذر إرسال كود التحقق. يرجى المحاولة لاحقاً.'),
          },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        code: 'OTP_SENT',
        message: isEn
          ? 'Verification code sent successfully to your registered email.'
          : 'تم إرسال كود التحقق بنجاح إلى بريدك الإلكتروني المسجل.',
      })
    }

    // ── Phase 2: Verify OTP ───────────────────────────────────────────────────
    if (action === 'verify-otp') {
      if (!otp || String(otp).trim().length < 6) {
        return NextResponse.json(
          { code: 'INVALID_OTP', error: isEn ? 'Please enter the 6-digit verification code.' : 'يرجى إدخال رمز التحقق المكون من 6 أرقام' },
          { status: 400 }
        )
      }

      const verifyRes = verifyOtpCode(cleanEmail, String(otp))
      if (!verifyRes.valid) {
        return NextResponse.json(
          {
            code: 'INVALID_OTP',
            error: verifyRes.error || (isEn ? 'Invalid or expired verification code.' : 'كود التحقق غير صحيح أو انتهت صلاحيته'),
          },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        resetToken: verifyRes.resetToken,
        message: isEn ? 'Code verified successfully.' : 'تم التحقق من الرمز بنجاح.',
      })
    }

    // ── Phase 3: Set New Password ─────────────────────────────────────────────
    if (action === 'reset-password') {
      if (!resetToken || !validateResetToken(cleanEmail, resetToken)) {
        return NextResponse.json(
          {
            code: 'EXPIRED_TOKEN',
            error: isEn
              ? 'Reset session expired or token invalid. Please request a new code.'
              : 'انتهت صلاحية جلسة إعادة التعيين أو الرمز غير صالح. يرجى طلب كود جديد.',
          },
          { status: 400 }
        )
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          {
            code: 'PASSWORD_TOO_SHORT',
            error: isEn
              ? 'Password must be at least 6 characters long.'
              : 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف أو أرقام على الأقل',
          },
          { status: 400 }
        )
      }

      const updated = setAdminPassword(newPassword)
      if (!updated) {
        return NextResponse.json(
          {
            code: 'SAVE_FAILED',
            error: isEn ? 'Failed to save new password to database.' : 'فشل حفظ كلمة المرور في قاعدة البيانات',
          },
          { status: 500 }
        )
      }

      // Clear the reset session
      consumeResetToken(cleanEmail)

      // Automatically create authenticated session cookie so user enters dashboard directly
      const sessionToken = Buffer.from(`${cleanEmail}:${Date.now()}:viwan_secret`).toString('base64')
      const cookieStore = await cookies()
      cookieStore.set('viwan_admin_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })

      return NextResponse.json({
        success: true,
        code: 'PASSWORD_RESET_SUCCESS',
        message: isEn
          ? 'Password updated and authenticated successfully.'
          : 'تم تغيير كلمة المرور وتسجيل الدخول بنجاح.',
      })
    }

    return NextResponse.json(
      { code: 'UNKNOWN_ACTION', error: isEn ? 'Unknown action requested.' : 'إجراء غير معروف' },
      { status: 400 }
    )
  } catch (err: any) {
    console.error('Forgot password API error:', err)
    return NextResponse.json(
      { code: 'SERVER_ERROR', error: 'حدث خطأ في الخادم / Internal server error' },
      { status: 500 }
    )
  }
}
