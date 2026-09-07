import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { id, type, status } = await req.json()
    const db = readDb()

    if (type === 'contact') {
      const item = db.contacts.find((c) => c.id === id)
      if (item) {
        item.status = status || 'replied'
      }
    } else if (type === 'consultation') {
      const item = db.consultations.find((c) => c.id === id)
      if (item) {
        item.status = status || 'confirmed'
      }
    }

    writeDb(db)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inbox item' }, { status: 500 })
  }
}
