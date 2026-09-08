import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDb, writeDb, ConsultationBooking } from '@/lib/db'
import { sendConsultationNotification } from '@/lib/mailer'
import { isHoneypotTriggered, isVelocitySuspicious, sanitizeInput, verifySecureAdminToken } from '@/lib/security'

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

    const { name, email, phone, preferredDate, preferredTime, projectType, location, notes } = body

    if (!name || !email || !phone || !projectType) {
      return NextResponse.json(
        { error: 'Name, email, phone and project type are required.' },
        { status: 400 },
      )
    }

    // 3. XSS & Injection Defense: Sanitize all user inputs
    const cleanName = sanitizeInput(name)
    const cleanEmail = sanitizeInput(email)
    const cleanPhone = sanitizeInput(phone)
    const cleanProjectType = sanitizeInput(projectType)
    const cleanLocation = location ? sanitizeInput(location) : undefined
    const cleanNotes = notes ? sanitizeInput(notes) : undefined
    const cleanDate = preferredDate ? sanitizeInput(preferredDate) : undefined
    const cleanTime = preferredTime ? sanitizeInput(preferredTime) : undefined

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
