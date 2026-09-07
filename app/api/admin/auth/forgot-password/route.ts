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
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
    }
    const { action, email, otp, resetToken, newPassword } = body || {}

    const cleanEmail = email?.trim()?.toLowerCase()
    if (!cleanEmail) {
      return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني' }, { status: 400 })
    }

    // ── Phase 1: Request OTP ──────────────────────────────────────────────────
    if (action === 'request-otp') {
      // Step 1: Check if the email is an authorized administrator
      if (!isAuthorizedAdminEmail(cleanEmail)) {
        // User's exact prompt requirement: "لو لا يقوله هذا الحساب غير مسجل لدينا"
        return NextResponse.json(
          { error: 'هذا الحساب غير مسجل لدينا' },
          { status: 404 }
        )
      }

      // Step 2: Generate 6-digit OTP and send via Brevo
      const generatedOtp = generateOtp(cleanEmail)
      const sendRes = await sendBrevoOtpEmail(cleanEmail, generatedOtp)

      if (!sendRes.success) {
        return NextResponse.json(
          { error: sendRes.error || 'تعذر إرسال كود التحقق. يرجى المحاولة لاحقاً.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'تم إرسال كود التحقق بنجاح إلى بريدك الإلكتروني المسجل.',
      })
    }

    // ── Phase 2: Verify OTP ───────────────────────────────────────────────────
    if (action === 'verify-otp') {
      if (!otp || String(otp).trim().length < 6) {
        return NextResponse.json({ error: 'يرجى إدخال رمز التحقق المكون من 6 أرقام' }, { status: 400 })
      }

      const verifyRes = verifyOtpCode(cleanEmail, String(otp))
      if (!verifyRes.valid) {
        return NextResponse.json({ error: verifyRes.error || 'كود التحقق غير صحيح' }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        resetToken: verifyRes.resetToken,
        message: 'تم التحقق من الرمز بنجاح.',
      })
    }

    // ── Phase 3: Set New Password ─────────────────────────────────────────────
    if (action === 'reset-password') {
      if (!resetToken || !validateResetToken(cleanEmail, resetToken)) {
        return NextResponse.json(
          { error: 'انتهت صلاحية جلسة إعادة التعيين أو الرمز غير صالح. يرجى طلب كود جديد.' },
          { status: 400 }
        )
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف أو أرقام على الأقل' },
          { status: 400 }
        )
      }

      const updated = setAdminPassword(newPassword)
      if (!updated) {
        return NextResponse.json(
          { error: 'فشل حفظ كلمة المرور في قاعدة البيانات' },
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
        message: 'تم تغيير كلمة المرور وتسجيل الدخول بنجاح.',
      })
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
  } catch (err: any) {
    console.error('Forgot password API error:', err)
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}
