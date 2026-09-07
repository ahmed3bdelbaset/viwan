import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import { Project } from '@/lib/projects'

export async function GET() {
  try {
    const db = readDb()
    const projects = (db.projects || []).map((p: any) => ({
      ...p,
      id: p.id || p.slug,
      slug: p.slug,
      title: p.title || p.name || 'Untitled Project',
      name: p.name || p.title || 'Untitled Project',
      titleAr: p.titleAr || p.nameAr || p.title || p.name,
      nameAr: p.nameAr || p.titleAr || p.title || p.name,
      cover: p.cover || p.coverImage || p.image || '/images/hero-villa.png',
      coverImage: p.coverImage || p.cover || p.image || '/images/hero-villa.png',
      category: p.category || p.type || (p.disciplines && p.disciplines[0]) || 'Architecture',
      type: p.type || p.category || (p.disciplines && p.disciplines[0]) || 'Architecture',
      categoryAr: p.categoryAr || p.typeAr || p.category || p.type || 'الهندسة المعمارية',
      location: p.location || 'Cairo',
      year: p.year || '2026',
      description: p.description || '',
    }))
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const db = readDb()

    const rawName = body.name || body.title || 'New Architectural Project'
    const rawCover = body.cover || body.coverImage || body.image || '/images/hero-villa.png'
    const rawCategory = body.type || body.category || 'Architecture'
    const generatedSlug = (body.slug || rawName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `project-${Date.now()}`

    const newProject: any = {
      slug: generatedSlug,
      index: body.index || String(db.projects.length + 1).padStart(2, '0'),
      name: rawName,
      title: rawName,
      location: body.location || 'Cairo',
      country: body.country || 'Egypt',
      year: String(body.year || new Date().getFullYear()),
      type: rawCategory,
      category: rawCategory,
      disciplines: Array.isArray(body.disciplines) && body.disciplines.length > 0 
        ? body.disciplines 
        : [rawCategory],
      scope: Array.isArray(body.scope) ? body.scope : (typeof body.scope === 'string' ? body.scope.split(',').map((s: string) => s.trim()) : ['Concept Design', 'BIM Coordination']),
      tagline: body.tagline || 'A bespoke spatial composition.',
      heading: body.heading || 'Elevating everyday spatial experience.',
      description: body.description || '',
      philosophy: body.philosophy || 'Architecture shaped by light and proportion.',
      cover: rawCover,
      coverImage: rawCover,
      interior: body.interior || body.interiorImage || '/images/interior-living-marble.jpg',
      cinematic: body.cinematic || rawCover,
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      featured: Boolean(body.featured),
    }

    // Check if slug already exists; if so, make unique
    if (db.projects.some(p => p.slug === newProject.slug)) {
      newProject.slug = `${newProject.slug}-${Date.now().toString().slice(-4)}`
    }

    db.projects.unshift(newProject)
    writeDb(db)

    return NextResponse.json({ success: true, project: newProject })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const slug = body.slug || body.updates?.slug || body.id
    const updates = body.updates || body

    if (!slug) {
      return NextResponse.json({ error: 'Project slug required' }, { status: 400 })
    }

    const db = readDb()
    const idx = db.projects.findIndex((p) => p.slug === slug || (p as any).id === slug)
    if (idx === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Sanitize updates
    const current = db.projects[idx]
    const updatedCover = updates.cover || updates.coverImage || updates.image || current.cover
    const updatedName = updates.name || updates.title || current.name
    const updatedCategory = updates.type || updates.category || current.type
    db.projects[idx] = {
      ...current,
      ...updates,
      name: updatedName,
      title: updatedName,
      cover: updatedCover,
      coverImage: updatedCover,
      type: updatedCategory,
      category: updatedCategory,
      featured: typeof updates.featured === 'boolean' ? updates.featured : current.featured,
    }

    writeDb(db)

    return NextResponse.json({ success: true, project: db.projects[idx] })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    let slug = searchParams.get('slug') || searchParams.get('id')
    if (!slug) {
      const body = await req.json().catch(() => ({}))
      slug = body?.slug || body?.id
    }

    if (!slug) {
      return NextResponse.json({ error: 'Project slug or ID required' }, { status: 400 })
    }

    const db = readDb()
    const initialLen = db.projects.length
    db.projects = db.projects.filter((p) => p.slug !== slug && (p as any).id !== slug)

    if (db.projects.length === initialLen) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    writeDb(db)
    return NextResponse.json({ success: true, message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
