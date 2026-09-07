import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({
      settings: db.settings,
      siteImages: db.siteImages,
      counters: db.counters,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}
