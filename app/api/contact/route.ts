import { NextResponse } from 'next/server'
import { readDb, writeDb, ContactSubmission } from '@/lib/db'
import { sendContactNotification } from '@/lib/mailer'
import { isHoneypotTriggered, isVelocitySuspicious, sanitizeInput } from '@/lib/security'

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

    const { name, email, phone, company, projectLocation, projectType, projectSize, budget, stage, message } = body

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone and message are required.' },
        { status: 400 },
      )
    }

    // 3. XSS & Injection Defense: Sanitize all user inputs
    const cleanName = sanitizeInput(name)
    const cleanEmail = sanitizeInput(email)
    const cleanPhone = sanitizeInput(phone)
    const cleanMessage = sanitizeInput(message)
    const cleanCompany = company ? sanitizeInput(company) : undefined
    const cleanLocation = projectLocation ? sanitizeInput(projectLocation) : undefined
    const cleanType = projectType ? sanitizeInput(projectType) : undefined
    const cleanSize = projectSize ? sanitizeInput(projectSize) : undefined
    const cleanBudget = budget ? sanitizeInput(budget) : undefined
    const cleanStage = stage ? sanitizeInput(stage) : undefined

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
