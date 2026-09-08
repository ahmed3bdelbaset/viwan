import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({ success: true, projects: db.projects || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch public projects' }, { status: 500 })
  }
}
