import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import { JOBS as INITIAL_JOBS, Job } from '@/lib/jobs'

export async function GET() {
  try {
    const db = readDb()
    const jobs = Array.isArray(db.jobs) && db.jobs.length > 0 ? db.jobs : INITIAL_JOBS
    return NextResponse.json({ success: true, jobs })
  } catch (err: any) {
    console.error('Error fetching admin jobs:', err)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      titleAr,
      slug,
      experience,
      experienceAr,
      location,
      locationAr,
      type,
      typeAr,
      role,
      roleAr,
      responsibilities,
      responsibilitiesAr,
      requirements,
      requirementsAr,
      software,
    } = body

    if (!title || !titleAr) {
      return NextResponse.json(
        { error: 'Title in English and Arabic are required.' },
        { status: 400 }
      )
    }

    const db = readDb()
    if (!Array.isArray(db.jobs) || db.jobs.length === 0) {
      db.jobs = [...INITIAL_JOBS]
    }

    const generatedSlug =
      slug?.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      `job-${Date.now()}`

    // Check collision
    const existingIndex = db.jobs.findIndex((j) => j.slug === generatedSlug)
    if (existingIndex >= 0) {
      return NextResponse.json(
        { error: 'A job with this URL slug already exists.' },
        { status: 400 }
      )
    }

    const newJob: Job = {
      slug: generatedSlug,
      title: title.trim(),
      titleAr: titleAr.trim(),
      experience: experience?.trim() || '3–5 Years Experience',
      experienceAr: experienceAr?.trim() || 'خبرة من 3 إلى 5 سنوات',
      location: location?.trim() || 'Cairo, Egypt',
      locationAr: locationAr?.trim() || 'القاهرة، مصر',
      type: type?.trim() || 'Full Time',
      typeAr: typeAr?.trim() || 'دوام كامل',
      role: role?.trim() || '',
      roleAr: roleAr?.trim() || '',
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities.filter(Boolean)
        : typeof responsibilities === 'string'
        ? responsibilities.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      responsibilitiesAr: Array.isArray(responsibilitiesAr)
        ? responsibilitiesAr.filter(Boolean)
        : typeof responsibilitiesAr === 'string'
        ? responsibilitiesAr.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      requirements: Array.isArray(requirements)
        ? requirements.filter(Boolean)
        : typeof requirements === 'string'
        ? requirements.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      requirementsAr: Array.isArray(requirementsAr)
        ? requirementsAr.filter(Boolean)
        : typeof requirementsAr === 'string'
        ? requirementsAr.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      software: Array.isArray(software)
        ? software.filter(Boolean)
        : typeof software === 'string'
        ? software.split(/[,،]/).map((s) => s.trim()).filter(Boolean)
        : [],
    }

    db.jobs.unshift(newJob)
    writeDb(db)

    return NextResponse.json({ success: true, job: newJob })
  } catch (err: any) {
    console.error('Error adding job:', err)
    return NextResponse.json({ error: 'Failed to add job' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { slug, updatedJob } = body

    if (!slug) {
      return NextResponse.json({ error: 'Job slug is required' }, { status: 400 })
    }

    const db = readDb()
    if (!Array.isArray(db.jobs) || db.jobs.length === 0) {
      db.jobs = [...INITIAL_JOBS]
    }

    const index = db.jobs.findIndex((j) => j.slug === slug)
    if (index === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    db.jobs[index] = {
      ...db.jobs[index],
      ...updatedJob,
      slug: updatedJob.slug || slug,
    }

    writeDb(db)

    return NextResponse.json({ success: true, job: db.jobs[index] })
  } catch (err: any) {
    console.error('Error updating job:', err)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Job slug is required' }, { status: 400 })
    }

    const db = readDb()
    if (!Array.isArray(db.jobs) || db.jobs.length === 0) {
      db.jobs = [...INITIAL_JOBS]
    }

    db.jobs = db.jobs.filter((j) => j.slug !== slug)
    writeDb(db)

    return NextResponse.json({ success: true, deletedSlug: slug })
  } catch (err: any) {
    console.error('Error deleting job:', err)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}
