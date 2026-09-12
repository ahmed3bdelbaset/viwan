import { NextResponse } from 'next/server'
import { readDb, writeDb, ContactSubmission } from '@/lib/db'
import { sendContactNotification } from '@/lib/mailer'
import { isHoneypotTriggered, isVelocitySuspicious, sanitizeInput } from '@/lib/security'

import { contactFormSchema, validatePayload } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1. Anti-Bot Defense: Check invisible honeypot trap
    if (isHoneypotTriggered(body, ['_gotcha', '_honey', '_gotcha_company_title', 'fax_number'])) {
      // Silently discard bot submission with generic success response
      return NextResponse.json({ success: true, id: `cs-${Date.now()}` })
    }

    // 2. Anti-Bot Defense: Check submission velocity
    if (isVelocitySuspicious(body._formLoadedAt)) {
      return NextResponse.json({ success: true, id: `cs-${Date.now()}` })
    }

    // 3. Strict Server-Side Schema Validation & Sanitization
    const validation = validatePayload(contactFormSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'بيانات غير صالحة، يرجى مراجعة الحقول المطلوبة.',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    const {
      name,
      email,
      phone,
      company,
      projectLocation,
      projectType,
      projectSize,
      budget,
      stage,
      message,
    } = validation.data

    const db = readDb()
    const newSubmission: ContactSubmission = {
      id: `cs-${Date.now()}`,
      name: cleanName,
      company: cleanCompany,
      email: cleanEmail,
      phone: cleanPhone,
      projectLocation: cleanLocation,
      projectType: cleanType,
      projectSize: cleanSize,
      budget: cleanBudget,
      stage: cleanStage,
      message: cleanMessage,
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    db.contacts.unshift(newSubmission)
    writeDb(db)

    // Trigger instant official notification to designated professional email
    try {
      await sendContactNotification({
        name: newSubmission.name,
        email: newSubmission.email,
        phone: newSubmission.phone,
        company: newSubmission.company,
        projectLocation: newSubmission.projectLocation,
        projectType: newSubmission.projectType,
        projectSize: newSubmission.projectSize,
        budget: newSubmission.budget,
        stage: newSubmission.stage,
        message: newSubmission.message,
        submittedAt: newSubmission.submittedAt,
      })
    } catch (mailErr) {
      console.error('[CONTACT] Error sending email notification:', mailErr)
    }

    return NextResponse.json({ success: true, id: newSubmission.id })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function GET() {
  const db = readDb()
  return NextResponse.json({ total: db.contacts.length, contacts: db.contacts })
}
