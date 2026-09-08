import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'
import { JOBS as INITIAL_JOBS } from '@/lib/jobs'

export async function GET() {
  try {
    const db = readDb()
    const jobs = Array.isArray(db.jobs) && db.jobs.length > 0 ? db.jobs : INITIAL_JOBS
    return NextResponse.json({ success: true, jobs })
  } catch (err: any) {
    console.error('Error fetching public jobs:', err)
    return NextResponse.json({ success: true, jobs: INITIAL_JOBS })
  }
}
