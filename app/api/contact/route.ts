import { NextResponse } from 'next/server'
import { readDb, writeDb, ContactSubmission } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, company, projectLocation, projectType, projectSize, budget, stage, message } = body

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone and message are required.' },
        { status: 400 },
      )
    }

    const db = readDb()
    const newSubmission: ContactSubmission = {
      id: `cs-${Date.now()}`,
      name: String(name).trim(),
      company: company ? String(company).trim() : undefined,
      email: String(email).trim(),
      phone: String(phone).trim(),
      projectLocation: projectLocation ? String(projectLocation).trim() : undefined,
      projectType: projectType ? String(projectType).trim() : undefined,
      projectSize: projectSize ? String(projectSize).trim() : undefined,
      budget: budget ? String(budget).trim() : undefined,
      stage: stage ? String(stage).trim() : undefined,
      message: String(message).trim(),
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    db.contacts.unshift(newSubmission)
    writeDb(db)

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
