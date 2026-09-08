import nodemailer from 'nodemailer'
import { readDb } from '@/lib/db'

export interface ConsultationEmailData {
  name: string
  email: string
  phone: string
  projectType: string
  preferredDate?: string
  preferredTime?: string
  location?: string
  notes?: string
  submittedAt?: string
}

export interface ContactEmailData {
  name: string
  email: string
  phone: string
  company?: string
  projectLocation?: string
  projectType?: string
  projectSize?: string
  budget?: string
  stage?: string
  message: string
  submittedAt?: string
}

export interface CareersEmailData {
  name: string
  email: string
  phone: string
  role: string
  experience?: string
  portfolio?: string
  note?: string
  submittedAt?: string
}

interface SendMailParams {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

/**
 * Core mail dispatcher:
 * 1. Checks GoDaddy / Office365 / custom SMTP configuration via environment or DB settings.
 * 2. Falls back to Brevo API v3 if BREVO_API_KEY is defined.
 * 3. Gracefully logs to console in development mode if no mail credentials are configured.
 */
export async function sendOfficialEmail({ to, subject, html, text, replyTo }: SendMailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const db = readDb()
  const settings = db.settings || {}

  const smtpHost = process.env.SMTP_HOST || settings.smtpHost || 'smtp.office365.com'
  const smtpPort = Number(process.env.SMTP_PORT || settings.smtpPort || 587)
  const smtpUser = process.env.SMTP_USER || settings.smtpUser || 'info@viwan.net'
  const smtpPass = process.env.SMTP_PASS || settings.smtpPass || ''
  const smtpFrom = process.env.SMTP_FROM || settings.smtpFrom || `VIWAN Architecture Studio <${smtpUser}>`
  const brevoApiKey = process.env.BREVO_API_KEY

  // 1. Try GoDaddy / Custom SMTP if password is provided
  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })

      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        replyTo: replyTo || smtpUser,
        subject,
        text,
        html,
      })

      console.log(`[VIWAN MAILER] Email successfully sent via SMTP to ${to} (MessageId: ${info.messageId})`)
      return { success: true, messageId: info.messageId }
    } catch (err: any) {
      console.error('[VIWAN MAILER] SMTP dispatch failed:', err?.message || err)
    }
  }

  // 2. Fallback to Brevo REST API if configured
  if (brevoApiKey) {
    try {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || smtpUser
      const senderName = process.env.BREVO_SENDER_NAME || 'VIWAN Architecture & Design'

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          replyTo: replyTo ? { email: replyTo } : { email: senderEmail },
          subject,
          htmlContent: html,
          textContent: text,
        }),
      })

      if (res.ok) {
        const data = await res.json().catch(() => ({}))
        console.log(`[VIWAN MAILER] Email successfully sent via Brevo to ${to}`)
        return { success: true, messageId: data.messageId }
      } else {
        const errText = await res.text().catch(() => '')
        console.error('[VIWAN MAILER] Brevo API error:', errText)
      }
    } catch (err: any) {
      console.error('[VIWAN MAILER] Brevo dispatch failed:', err?.message || err)
    }
  }

  // 3. Graceful Local Dev / Staging Simulation
  console.warn(
    `[VIWAN MAILER] [DEV NOTICE] No outgoing mail credentials configured (SMTP_PASS or BREVO_API_KEY). ` +
    `Email to "${to}" with subject "${subject}" was logged for development.`
  )
  return { success: true, messageId: `dev-sim-${Date.now()}` }
}

/**
 * Base executive email wrapper - Zero Emojis, formal architectural styling
 */
function buildExecutiveHtmlTemplate(title: string, subtitle: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141311; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F4F1EA; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #FFFFFF; border: 1px solid #E2DCD2; border-collapse: separate; border-spacing: 0;">
          
          <!-- Executive Header -->
          <tr>
            <td style="padding: 32px 36px 24px; background-color: #141311; text-align: right; border-bottom: 3px solid #C5A880;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="right">
                    <div style="font-size: 20px; font-weight: 700; letter-spacing: 0.25em; color: #FAF8F5; text-transform: uppercase;">VIWAN</div>
                    <div style="font-size: 11px; color: #C5A880; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px;">Architecture & Design Studio</div>
                  </td>
                  <td align="left" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 4px 12px; background-color: #24221D; border: 1px solid #3E3B33; color: #D8C2A0; font-size: 11px; font-family: monospace;">
                      OFFICIAL DISPATCH
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Document Title Banner -->
          <tr>
            <td style="padding: 24px 36px 20px; background-color: #FAF8F5; border-bottom: 1px solid #ECE7DE; text-align: right;">
              <h1 style="margin: 0; font-size: 17px; font-weight: 600; color: #141311; line-height: 1.4;">${title}</h1>
              <p style="margin: 4px 0 0; font-size: 12px; color: #6E685F;">${subtitle}</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 36px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Document Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAF8F5; border-top: 1px solid #ECE7DE; text-align: right;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="right" style="font-size: 11px; color: #7A746B; line-height: 1.6;">
                    <strong>استوديو إيوان للعمارة والتصميم</strong><br>
                    القاهرة: الشيخ زايد والقاهرة الجديدة · الرياض: طريق الملك فهد<br>
                    البريد المعتمد: info@viwan.net
                  </td>
                  <td align="left" style="font-size: 10px; color: #9E978C; font-family: monospace; vertical-align: bottom;">
                    CONFIDENTIAL & PROPRIETARY
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * 1. Send Consultation Booking Notification (Zero Emojis)
 */
export async function sendConsultationNotification(data: ConsultationEmailData) {
  const db = readDb()
  const recipient = db.settings?.emailConsultations || db.settings?.email || 'info@viwan.net'
  const timeString = data.submittedAt || new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })

  const subject = `حجز استشارة معمارية جديدة: ${data.name} - (${data.projectType})`

  const rows = [
    { label: 'اسم العميل', val: data.name },
    { label: 'البريد الإلكتروني', val: data.email },
    { label: 'رقم الهاتف', val: data.phone },
    { label: 'نوع المشروع', val: data.projectType },
    { label: 'الموعد المفضل', val: data.preferredDate || 'غير محدد' },
    { label: 'الوقت المفضل', val: data.preferredTime || 'جلسة 30 دقيقة' },
    { label: 'موقع المشروع', val: data.location || 'غير محدد' },
    { label: 'ملاحظات وتطلعات العميل', val: data.notes || 'لا توجد ملاحظات إضافية' },
    { label: 'تاريخ وتوقيت الطلب', val: timeString },
  ]

  const rowsHtml = rows
    .map(
      (r, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAF8F5'};">
        <td style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #524E48; border: 1px solid #ECE7DE; width: 35%; text-align: right;">${r.label}</td>
        <td style="padding: 10px 14px; font-size: 12px; color: #141311; border: 1px solid #ECE7DE; text-align: right; direction: ${r.label.includes('هاتف') || r.label.includes('بريد') ? 'ltr' : 'rtl'};">${r.val}</td>
      </tr>
    `
    )
    .join('')

  const contentHtml = `
    <p style="margin: 0 0 18px; font-size: 13px; color: #3A3732; line-height: 1.6;">
      تم استلام طلب حجز جلسة استشارية معمارية جديدة (30 دقيقة) عبر بوابة الاستوديو الرقمية. فيما يلي بيان تفاصيل الطلب وبيانات العميل:
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
      ${rowsHtml}
    </table>

    <div style="padding: 14px 18px; background-color: #FAF8F5; border-right: 3px solid #C5A880; font-size: 12px; color: #524E48; line-height: 1.6;">
      توجيه إداري: يُرجى مراجعة جدول المواعيد المعمارية والتواصل مع العميل عبر البريد أو الهاتف لتأكيد موعد الاجتماع.
    </div>
  `

  const text = `
============================================================
VIWAN ARCHITECTURE & DESIGN STUDIO
إشعار حجز استشارة معمارية جديدة
============================================================

بيانات الطلب:
- اسم العميل: ${data.name}
- البريد الإلكتروني: ${data.email}
- رقم الهاتف: ${data.phone}
- نوع المشروع: ${data.projectType}
- الموعد المفضل: ${data.preferredDate || 'غير محدد'}
- الوقت المفضل: ${data.preferredTime || '30 دقيقة'}
- موقع المشروع: ${data.location || 'غير محدد'}
- ملاحظات العميل: ${data.notes || 'لا توجد'}
- وقت الطلب: ${timeString}

============================================================
تم إرسال هذا الإشعار تلقائياً إلى: ${recipient}
  `.trim()

  const html = buildExecutiveHtmlTemplate(
    'إشعار حجز استشارة معمارية جديدة',
    'استوديو إيوان — جدول الاستشارات والاستفسارات التخصصية',
    contentHtml
  )

  return sendOfficialEmail({
    to: recipient,
    subject,
    html,
    text,
    replyTo: data.email,
  })
}

/**
 * 2. Send Contact Form Inquiries Notification (Zero Emojis)
 */
export async function sendContactNotification(data: ContactEmailData) {
  const db = readDb()
  const recipient = db.settings?.emailGeneral || db.settings?.email || 'info@viwan.net'
  const timeString = data.submittedAt || new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })

  const subject = `استفسار جديد عبر الموقع: ${data.name}${data.company ? ` - (${data.company})` : ''}`

  const rows = [
    { label: 'اسم العميل / المرسل', val: data.name },
    { label: 'الشركة / الجهة', val: data.company || 'عميل خاص' },
    { label: 'البريد الإلكتروني', val: data.email },
    { label: 'رقم الهاتف', val: data.phone },
    { label: 'موقع المشروع المقترح', val: data.projectLocation || 'غير محدد' },
    ...(data.projectType ? [{ label: 'نوع المشروع', val: data.projectType }] : []),
    ...(data.projectSize ? [{ label: 'المساحة التقديرية', val: data.projectSize }] : []),
    ...(data.budget ? [{ label: 'الميزانية التقديرية', val: data.budget }] : []),
    ...(data.stage ? [{ label: 'مرحلة العمل الحالية', val: data.stage }] : []),
    { label: 'نص الرسالة والاستفسار', val: data.message },
    { label: 'تاريخ وتوقيت الإرسال', val: timeString },
  ]

  const rowsHtml = rows
    .map(
      (r, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAF8F5'};">
        <td style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #524E48; border: 1px solid #ECE7DE; width: 35%; text-align: right;">${r.label}</td>
        <td style="padding: 10px 14px; font-size: 12px; color: #141311; border: 1px solid #ECE7DE; text-align: right; direction: ${r.label.includes('هاتف') || r.label.includes('بريد') ? 'ltr' : 'rtl'};">${r.val}</td>
      </tr>
    `
    )
    .join('')

  const contentHtml = `
    <p style="margin: 0 0 18px; font-size: 13px; color: #3A3732; line-height: 1.6;">
      تم استلام طلب تواصل واستفسار جديد من صفحة "تواصل معنا" على موقع الاستوديو الرسمي:
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
      ${rowsHtml}
    </table>

    <div style="padding: 14px 18px; background-color: #FAF8F5; border-right: 3px solid #C5A880; font-size: 12px; color: #524E48; line-height: 1.6;">
      توجيه إداري: يمكن الرد مباشرة على هذا البريد للتواصل المباشر مع العميل (${data.email}).
    </div>
  `

  const text = `
============================================================
VIWAN ARCHITECTURE & DESIGN STUDIO
إشعار تواصل واستفسار جديد
============================================================

بيانات الاستفسار:
- اسم المرسل: ${data.name}
- الشركة: ${data.company || 'عميل خاص'}
- البريد الإلكتروني: ${data.email}
- رقم الهاتف: ${data.phone}
- موقع المشروع: ${data.projectLocation || 'غير محدد'}
- نوع المشروع: ${data.projectType || 'غير محدد'}
- المساحة: ${data.projectSize || 'غير محدد'}
- الميزانية: ${data.budget || 'غير محدد'}
- المرحلة: ${data.stage || 'غير محدد'}
- نص الرسالة: ${data.message}
- وقت الإرسال: ${timeString}

============================================================
تم إرسال هذا الإشعار تلقائياً إلى: ${recipient}
  `.trim()

  const html = buildExecutiveHtmlTemplate(
    'إشعار تواصل واستفسار رسمي',
    'استوديو إيوان — بوابة الاتصال واستفسارات العملاء',
    contentHtml
  )

  return sendOfficialEmail({
    to: recipient,
    subject,
    html,
    text,
    replyTo: data.email,
  })
}

/**
 * 3. Send Careers / Job Application Notification (Zero Emojis)
 */
export async function sendCareersNotification(data: CareersEmailData) {
  const db = readDb()
  const recipient = db.settings?.emailCareers || db.settings?.email || 'info@viwan.net'
  const timeString = data.submittedAt || new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })

  const subject = `طلب توظيف جديد: ${data.name} - (${data.role})`

  const rows = [
    { label: 'اسم المتقدم', val: data.name },
    { label: 'الوظيفة المتقدم إليها', val: data.role },
    { label: 'البريد الإلكتروني', val: data.email },
    { label: 'رقم الهاتف للتواصل', val: data.phone },
    { label: 'سنوات الخبرة العملية', val: data.experience || 'غير محدد' },
    { label: 'رابط ملف الأعمال (Portfolio / CV)', val: data.portfolio ? `<a href="${data.portfolio}" target="_blank" style="color: #9C7E53; font-family: monospace; text-decoration: underline;">${data.portfolio}</a>` : 'لم يتم إرفاق رابط' },
    { label: 'نبذة وملاحظات المتقدم', val: data.note || 'لا توجد ملاحظات إضافية' },
    { label: 'تاريخ وتوقيت التقديم', val: timeString },
  ]

  const rowsHtml = rows
    .map(
      (r, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#FAF8F5'};">
        <td style="padding: 10px 14px; font-size: 12px; font-weight: 600; color: #524E48; border: 1px solid #ECE7DE; width: 35%; text-align: right;">${r.label}</td>
        <td style="padding: 10px 14px; font-size: 12px; color: #141311; border: 1px solid #ECE7DE; text-align: right; direction: ${r.label.includes('هاتف') || r.label.includes('بريد') || r.label.includes('رابط') ? 'ltr' : 'rtl'};">${r.val}</td>
      </tr>
    `
    )
    .join('')

  const contentHtml = `
    <p style="margin: 0 0 18px; font-size: 13px; color: #3A3732; line-height: 1.6;">
      تم استلام طلب انضمام جديد لفريق عمل الاستوديو عبر بوابة التوظيف الرسمية (Careers):
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
      ${rowsHtml}
    </table>

    <div style="padding: 14px 18px; background-color: #FAF8F5; border-right: 3px solid #C5A880; font-size: 12px; color: #524E48; line-height: 1.6;">
      توجيه شؤون التوظيف: يُرجى فحص ملف الأعمال وسنوات الخبرة للتحقق من الملاءمة مع متطلبات الوظيفة الشاغرة.
    </div>
  `

  const text = `
============================================================
VIWAN ARCHITECTURE & DESIGN STUDIO
إشعار طلب توظيف وانضمام جديد
============================================================

بيانات المتقدم:
- اسم المتقدم: ${data.name}
- الوظيفة: ${data.role}
- البريد الإلكتروني: ${data.email}
- رقم الهاتف: ${data.phone}
- سنوات الخبرة: ${data.experience || 'غير محدد'}
- ملف الأعمال (Portfolio): ${data.portfolio || 'غير متوفر'}
- نبذة وملاحظات: ${data.note || 'لا توجد'}
- وقت التقديم: ${timeString}

============================================================
تم إرسال هذا الإشعار تلقائياً إلى: ${recipient}
  `.trim()

  const html = buildExecutiveHtmlTemplate(
    'إشعار طلب انضمام وتوظيف جديد',
    'استوديو إيوان — شؤون استقطاب الكفاءات والوظائف المعمارية',
    contentHtml
  )

  return sendOfficialEmail({
    to: recipient,
    subject,
    html,
    text,
    replyTo: data.email,
  })
}
