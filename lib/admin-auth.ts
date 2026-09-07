import fs from 'fs'
import path from 'path'

// Database path for persistent admin password storage
const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

export const VALID_ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL?.toLowerCase(),
  'admin@viwan.studio',
  'admin@viwan.com',
  'director@viwan.studio',
].filter(Boolean) as string[]

const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'viwan_admin_2026'

// In-memory OTP & Reset Token Store (maps email -> { otp, expiresAt, resetToken, attempts })
interface OtpEntry {
  otp: string
  expiresAt: number
  attempts: number
  resetToken?: string
  resetExpiresAt?: number
}

// Keep store on global to avoid clearing during Next.js fast refresh
const globalForAuth = globalThis as unknown as {
  viwanOtpStore?: Map<string, OtpEntry>
}

const otpStore = globalForAuth.viwanOtpStore ?? new Map<string, OtpEntry>()
if (process.env.NODE_ENV !== 'production') globalForAuth.viwanOtpStore = otpStore

// Read current password from db.json or fallback
export function getAdminPassword(email?: string): string {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8')
      const data = JSON.parse(raw)
      if (email && Array.isArray(data.admins)) {
        const found = data.admins.find((a: any) => a.email?.toLowerCase() === email.trim().toLowerCase())
        if (found?.password) return found.password
      }
      if (data.adminAuth?.password) {
        return data.adminAuth.password
      }
    }
  } catch (err) {
    console.error('Error reading admin password from db.json:', err)
  }
  return DEFAULT_ADMIN_PASSWORD
}

// Update admin password in db.json
export function setAdminPassword(newPassword: string, email?: string): boolean {
  try {
    let data: Record<string, any> = {}
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8')
      data = JSON.parse(raw)
    }
    if (!data.adminAuth) {
      data.adminAuth = {}
    }
    data.adminAuth.password = newPassword
    data.adminAuth.updatedAt = new Date().toISOString()

    // Also update individual admin if found
    if (email && Array.isArray(data.admins)) {
      const idx = data.admins.findIndex((a: any) => a.email?.toLowerCase() === email.trim().toLowerCase())
      if (idx !== -1) {
        data.admins[idx].password = newPassword
      }
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Error saving new admin password to db.json:', err)
    return false
  }
}

// Verify if email belongs to administrators
export function isAuthorizedAdminEmail(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase()
  if (VALID_ADMIN_EMAILS.includes(cleanEmail)) return true

  // Also check if any additional admin email is registered in db.json
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8')
      const data = JSON.parse(raw)
      if (Array.isArray(data.adminAuth?.emails)) {
        if (data.adminAuth.emails.map((e: string) => e.toLowerCase()).includes(cleanEmail)) {
          return true
        }
      }
      if (Array.isArray(data.admins)) {
        if (data.admins.some((a: any) => a.email?.toLowerCase() === cleanEmail && a.status !== 'inactive')) {
          return true
        }
      }
    }
  } catch {}

  return false
}

// Generate a 6-digit numeric OTP and save with 10-minute expiry
export function generateOtp(email: string): string {
  const cleanEmail = email.trim().toLowerCase()
  // Generate 6-digit numeric code
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

  otpStore.set(cleanEmail, {
    otp,
    expiresAt,
    attempts: 0,
  })

  return otp
}

// Verify entered OTP
export function verifyOtpCode(email: string, enteredCode: string): { valid: boolean; error?: string; resetToken?: string } {
  const cleanEmail = email.trim().toLowerCase()
  const entry = otpStore.get(cleanEmail)

  if (!entry) {
    return { valid: false, error: 'لم يتم العثور على طلب استعادة لهذا البريد أو انتهت صلاحيته' }
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanEmail)
    return { valid: false, error: 'انتهت صلاحية كود التحقق. يرجى طلب كود جديد' }
  }

  entry.attempts += 1
  if (entry.attempts > 5) {
    otpStore.delete(cleanEmail)
    return { valid: false, error: 'تم تجاوز الحد الأقصى للمحاولات. يرجى طلب كود جديد' }
  }

  if (entry.otp !== enteredCode.trim()) {
    return { valid: false, error: 'كود التحقق غير صحيح. يرجى التأكد من الرمز المدخل' }
  }

  // OTP is correct! Generate a one-time secure resetToken (valid for 15 minutes)
  const resetToken = Buffer.from(`${cleanEmail}:${Date.now()}:${Math.random()}`).toString('hex')
  entry.resetToken = resetToken
  entry.resetExpiresAt = Date.now() + 15 * 60 * 1000
  entry.otp = '' // Clear OTP so it can't be reused

  return { valid: true, resetToken }
}

// Validate resetToken before saving new password
export function validateResetToken(email: string, token: string): boolean {
  const cleanEmail = email.trim().toLowerCase()
  const entry = otpStore.get(cleanEmail)
  if (!entry || !entry.resetToken || !entry.resetExpiresAt) return false
  if (Date.now() > entry.resetExpiresAt) return false
  return entry.resetToken === token
}

// Consume resetToken
export function consumeResetToken(email: string): void {
  const cleanEmail = email.trim().toLowerCase()
  otpStore.delete(cleanEmail)
}

// Send OTP via Brevo API v3
export async function sendBrevoOtpEmail(toEmail: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'admin@viwan.studio'
  const senderName = process.env.BREVO_SENDER_NAME || 'VIWAN Architecture & Design'

  console.log(`[VIWAN SECURITY] Generated OTP for ${toEmail}: ${otp}`)

  // If no Brevo API key is provided, log to console for development & return success
  if (!apiKey) {
    console.warn('[VIWAN SECURITY] BREVO_API_KEY is not configured in environment. The OTP code was logged to console above.')
    return {
      success: true,
      error: undefined,
    }
  }

  try {
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>كود التحقق - استوديو إيوان</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0E0E0C; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #FAF8F5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0E0E0C; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="540px" style="max-width: 540px; background-color: #141311; border: 1px solid #C5A88033; border-radius: 4px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 35px 30px 25px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.35em; color: #FAF8F5;">VIWAN</h1>
              <p style="margin: 6px 0 0; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #C5A880;">Studio Gateway · Security Access</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 35px 30px; text-align: center;">
              <h2 style="margin: 0 0 15px; font-size: 18px; color: #FAF8F5; font-weight: 500;">رمز التحقق لإعادة تعيين كلمة المرور</h2>
              <p style="margin: 0 0 25px; font-size: 13px; color: rgba(250,248,245,0.75); line-height: 1.6;">
                تم استلام طلب لإعادة تعيين كلمة المرور الخاصة ببوابة إدارة <strong>VIWAN Studio</strong>. استخدم الرمز التالي لإكمال العملية:
              </p>

              <!-- OTP Box -->
              <div style="margin: 25px auto; padding: 20px 30px; background-color: rgba(197,168,128,0.08); border: 1px dashed #C5A880; border-radius: 4px; display: inline-block;">
                <span style="font-family: monospace, 'Courier New', Courier; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #C5A880; display: block; direction: ltr;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 25px 0 0; font-size: 11px; color: rgba(250,248,245,0.5); line-height: 1.6;">
                * هذا الرمز صالح لمدة <strong>10 دقائق</strong> فقط.<br>
                إذا لم تكن قد طلبت هذا الرمز، يُرجى تجاهل هذه الرسالة فوراً.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0E0E0C; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0; font-size: 10px; color: rgba(250,248,245,0.4); letter-spacing: 0.1em;">
                © 2026 VIWAN ARCHITECTURE & DESIGN STUDIO · CAIRO & RIYADH
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail }],
        subject: `VIWAN Studio · Security Verification Code [${otp}]`,
        htmlContent,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.error('Brevo API Error:', errData)
      return { success: false, error: errData.message || 'فشل إرسال البريد الإلكتروني عبر مزود الخدمة' }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Brevo send exception:', error)
    return { success: false, error: error.message || 'خطأ في الاتصال بخدمة البريد' }
  }
}
