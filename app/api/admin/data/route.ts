import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({
      projects: db.projects,
      jobs: db.jobs,
      contacts: db.contacts,
      consultations: db.consultations,
      settings: db.settings,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 })
  }
}
