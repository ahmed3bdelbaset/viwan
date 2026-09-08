import { NextResponse } from 'next/server'
import { sendCareersNotification } from '@/lib/mailer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, role, experience, portfolio, note } = body || {}

    if (!name || !email || !phone || !role) {
      return NextResponse.json(
        { error: 'الاسم، البريد، الهاتف، والمسمى الوظيفي حقول مطلوبة.' },
        { status: 400 }
      )
    }

    const applicationData = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      role: String(role).trim(),
      experience: experience ? String(experience).trim() : undefined,
      portfolio: portfolio ? String(portfolio).trim() : undefined,
      note: note ? String(note).trim() : undefined,
      submittedAt: new Date().toISOString(),
    }

    // Trigger instant official notification to designated careers email (info@viwan.net)
    try {
      await sendCareersNotification(applicationData)
    } catch (mailErr) {
      console.error('[CAREERS] Error sending email notification:', mailErr)
    }

    return NextResponse.json({ success: true, message: 'تم استلام طلب التوظيف بنجاح' })
  } catch (err) {
    console.error('Error handling career application:', err)
    return NextResponse.json({ error: 'حدث خطأ في الخادم أثناء إرسال الطلب.' }, { status: 500 })
  }
}
