import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDb, writeDb, ConsultationBooking } from '@/lib/db'
import { sendConsultationNotification } from '@/lib/mailer'
import { isHoneypotTriggered, isVelocitySuspicious, sanitizeInput, verifySecureAdminToken } from '@/lib/security'

import { consultationFormSchema, validatePayload } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 1. Anti-Bot Defense: Check invisible honeypot trap
    if (isHoneypotTriggered(body, ['_gotcha', '_honey', '_gotcha_project_scope', 'fax_number'])) {
      // Silently discard bot submission with generic success response
      return NextResponse.json({ success: true, id: `cb-${Date.now()}` })
    }

    // 2. Anti-Bot Defense: Check submission velocity
    if (isVelocitySuspicious(body._formLoadedAt)) {
      return NextResponse.json({ success: true, id: `cb-${Date.now()}` })
    }

    // 3. Strict Server-Side Schema Validation & Sanitization
    const validation = validatePayload(consultationFormSchema, body)
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
      preferredDate,
      date,
      preferredTime,
      timeSlot,
      projectType,
      location,
      notes,
    } = validation.data

    const cleanDate = preferredDate || date
    const cleanTime = preferredTime || timeSlot

    const db = readDb()
    const newBooking: ConsultationBooking = {
      id: `cb-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      preferredDate: cleanDate,
      preferredTime: cleanTime,
      projectType: cleanProjectType,
      location: cleanLocation,
      notes: cleanNotes,
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    db.consultations.unshift(newBooking)
    writeDb(db)

    // Trigger instant official notification to designated professional email
    try {
      await sendConsultationNotification({
        name: newBooking.name,
        email: newBooking.email,
        phone: newBooking.phone,
        projectType: newBooking.projectType,
        preferredDate: newBooking.preferredDate,
        preferredTime: newBooking.preferredTime,
        location: newBooking.location,
        notes: newBooking.notes,
        submittedAt: newBooking.submittedAt,
      })
    } catch (mailErr) {
      console.error('[CONSULTATION] Error sending email notification:', mailErr)
    }

    return NextResponse.json({ success: true, id: newBooking.id })
  } catch (error) {
    console.error('Error submitting consultation:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// Protected: Only authenticated admins may list consultations
export async function GET(req: Request) {
  const cookieStore = await cookies()
  const token =
    cookieStore.get('viwan_admin_token')?.value ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  const authResult = verifySecureAdminToken(token)
  if (!authResult.valid) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const db = readDb()
  return NextResponse.json({ total: db.consultations.length, consultations: db.consultations })
}
