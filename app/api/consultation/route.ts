import { NextResponse } from 'next/server'
import { readDb, writeDb, ConsultationBooking } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, preferredDate, preferredTime, projectType, location, notes } = body

    if (!name || !email || !phone || !projectType) {
      return NextResponse.json(
        { error: 'Name, email, phone and project type are required.' },
        { status: 400 },
      )
    }

    const db = readDb()
    const newBooking: ConsultationBooking = {
      id: `cb-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      preferredDate: preferredDate ? String(preferredDate) : undefined,
      preferredTime: preferredTime ? String(preferredTime) : undefined,
      projectType: String(projectType).trim(),
      location: location ? String(location).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      submittedAt: new Date().toISOString(),
      status: 'new',
    }

    db.consultations.unshift(newBooking)
    writeDb(db)

    return NextResponse.json({ success: true, id: newBooking.id })
  } catch (error) {
    console.error('Error submitting consultation:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function GET() {
  const db = readDb()
  return NextResponse.json({ total: db.consultations.length, consultations: db.consultations })
}
