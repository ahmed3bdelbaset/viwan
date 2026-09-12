import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import { Project } from '@/lib/projects'
import { extractYouTubeId } from '@/lib/youtube'

export async function GET() {
  try {
    const db = readDb()
    const projects = (db.projects || []).map((p: any) => ({
      ...p,
      id: p.id || p.slug,
      code: p.code || `PRJ-${p.index || '01'}`,
      slug: p.slug,
      index: p.index || '01',
      title: p.title || p.name || 'Untitled Project',
      name: p.name || p.title || 'Untitled Project',
      title_en: p.title_en || p.name || p.title || 'Untitled Project',
      title_ar: p.title_ar || p.nameAr || p.titleAr || p.title || p.name,
      titleAr: p.titleAr || p.nameAr || p.title || p.name,
      nameAr: p.nameAr || p.titleAr || p.title || p.name,
      tagline: p.tagline || p.subtitle_en || '',
      subtitle_en: p.subtitle_en || p.tagline || '',
      subtitle_ar: p.subtitle_ar || p.taglineAr || '',
      heading: p.heading || '',
      headingAr: p.headingAr || '',
      description: p.description || p.details_en || '',
      descriptionAr: p.descriptionAr || p.details_ar || '',
      philosophy: p.philosophy || p.vision_en || '',
      vision_en: p.vision_en || p.philosophy || '',
      vision_ar: p.vision_ar || p.philosophyAr || '',
      cover: p.cover || p.cover_image || p.coverImage || '/images/hero-villa.png',
      cover_image: p.cover_image || p.cover || p.coverImage || '/images/hero-villa.png',
      coverImage: p.coverImage || p.cover || p.cover_image || '/images/hero-villa.png',
      interior: p.interior || p.interiorImage || '/images/interior-living-marble.jpg',
      cinematic: p.cinematic || p.cover || p.cover_image || '/images/hero-villa.png',
      category: p.category || p.type || (p.disciplines && p.disciplines[0]) || 'Architecture',
      type: p.type || p.category || (p.disciplines && p.disciplines[0]) || 'Architecture',
      sector_en: p.sector_en || p.type || p.category || 'Residential',
      sector_ar: p.sector_ar || 'سكني',
      disciplines: Array.isArray(p.disciplines) && p.disciplines.length > 0 ? p.disciplines : (p.services_en || ['Architecture']),
      services_en: Array.isArray(p.services_en) && p.services_en.length > 0 ? p.services_en : (p.disciplines || ['Architecture']),
      services_ar: Array.isArray(p.services_ar) && p.services_ar.length > 0 ? p.services_ar : ['الاستشارات المعمارية'],
      scope: Array.isArray(p.scope) ? p.scope : ['Concept Design', 'BIM Coordination'],
      location: p.location || 'Cairo',
      location_en: p.location_en || p.location || 'Cairo',
      location_ar: p.location_ar || p.locationAr || 'القاهرة',
      country: p.country || 'Egypt',
      country_en: p.country_en || p.country || 'Egypt',
      country_ar: p.country_ar || 'مصر',
      year: p.year || 2026,
      status: p.status || 'completed',
      publish_status: p.publish_status || (p.featured || p.is_featured ? 'Featured' : 'Published'),
      featured: Boolean(p.featured || p.is_featured),
      is_featured: Boolean(p.featured || p.is_featured),
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      gallery_images: Array.isArray(p.gallery_images) && p.gallery_images.length > 0 
        ? p.gallery_images 
        : (Array.isArray(p.gallery) ? p.gallery.map((g: any) => typeof g === 'string' ? g : g.src) : []),
      youtubeUrl: p.youtubeUrl || p.youtube_url || '',
      youtubeId: p.youtubeId || p.youtube_id || '',
      coordinates: p.coordinates || (p.lat && p.lng ? `${p.lat}° N, ${p.lng}° E` : ''),
      projectUrl: p.projectUrl || p.project_url || '',
    }))
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

import { verifySecureAdminToken } from '@/lib/security'
import { cookies } from 'next/headers'
import { projectItemSchema, validatePayload } from '@/lib/validations'

async function checkAdminAuth(req: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('viwan_admin_token')?.value
  const authHeader = req.headers.get('authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  const token = cookieToken || headerToken
  return verifySecureAdminToken(token).valid
}

export async function POST(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', error: 'غير مصرح: يرجى تسجيل الدخول كمسؤول' },
        { status: 401 }
      )
    }

    const rawBody = await req.json()
    const validation = validatePayload(projectItemSchema, rawBody)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'بيانات المشروع غير صالحة', details: validation.errors },
        { status: 400 }
      )
    }

    const body = validation.data
    const db = readDb()

    const rawName = body.name || body.title || body.title_en || 'New Architectural Project'
    const rawNameAr = body.nameAr || body.title_ar || rawName
    const rawCover = body.cover || '/images/hero-villa.png'
    const rawCategory = body.type || body.category || 'Architecture'
    const generatedSlug = (body.slug || rawName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `project-${Date.now()}`

    const newProject: any = {
      id: body.id || `prj-${Date.now()}`,
      code: body.code || `PRJ-${String(db.projects.length + 1).padStart(2, '0')}`,
      slug: generatedSlug,
      index: body.index || String(db.projects.length + 1).padStart(2, '0'),
      name: rawName,
      title: rawName,
      title_en: rawName,
      nameAr: rawNameAr,
      title_ar: rawNameAr,
      titleAr: rawNameAr,
      location: body.location || body.location_en || 'Cairo',
      location_en: body.location_en || body.location || 'Cairo',
      location_ar: body.location_ar || body.locationAr || 'القاهرة',
      country: body.country || body.country_en || 'Egypt',
      country_en: body.country_en || body.country || 'Egypt',
      country_ar: body.country_ar || 'مصر',
      year: body.year || new Date().getFullYear(),
      type: rawCategory,
      category: rawCategory,
      sector_en: body.sector_en || rawCategory,
      sector_ar: body.sector_ar || 'سكني',
      disciplines: Array.isArray(body.disciplines) && body.disciplines.length > 0 
        ? body.disciplines 
        : [rawCategory],
      services_en: Array.isArray(body.services_en) && body.services_en.length > 0 ? body.services_en : [rawCategory],
      services_ar: Array.isArray(body.services_ar) && body.services_ar.length > 0 ? body.services_ar : ['الاستشارات المعمارية'],
      scope: Array.isArray(body.scope) ? body.scope : (typeof body.scope === 'string' ? body.scope.split(',').map((s: string) => s.trim()) : ['Concept Design', 'BIM Coordination']),
      tagline: body.tagline || body.subtitle_en || 'A bespoke spatial composition.',
      subtitle_en: body.subtitle_en || body.tagline || 'A bespoke spatial composition.',
      subtitle_ar: body.subtitle_ar || body.taglineAr || '',
      heading: body.heading || 'Elevating everyday spatial experience.',
      headingAr: body.headingAr || '',
      description: body.description || body.details_en || '',
      descriptionAr: body.descriptionAr || body.details_ar || '',
      details_en: body.details_en || body.description || '',
      details_ar: body.details_ar || body.descriptionAr || '',
      philosophy: body.philosophy || body.vision_en || 'Architecture shaped by light and proportion.',
      vision_en: body.vision_en || body.philosophy || 'Architecture shaped by light and proportion.',
      vision_ar: body.vision_ar || body.philosophyAr || '',
      cover: rawCover,
      cover_image: rawCover,
      coverImage: rawCover,
      interior: body.interior || body.interiorImage || '/images/interior-living-marble.jpg',
      cinematic: body.cinematic || rawCover,
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      gallery_images: Array.isArray(body.gallery_images) ? body.gallery_images : (Array.isArray(body.gallery) ? body.gallery.map((g: any) => typeof g === 'string' ? g : g.src) : []),
      featured: Boolean(body.featured || body.is_featured || body.publish_status === 'Featured'),
      is_featured: Boolean(body.featured || body.is_featured || body.publish_status === 'Featured'),
      status: body.status || 'completed',
      publish_status: body.publish_status || (body.featured || body.is_featured ? 'Featured' : 'Published'),
      client_en: body.client_en || 'Private Client',
      client_ar: body.client_ar || 'عميل خاص',
      area_sqm: body.area_sqm || '1,000 m²',
      lat: Number(body.lat) || 30.0444,
      lng: Number(body.lng) || 31.2357,
      coordinates: body.coordinates || (body.lat && body.lng ? `${body.lat}° N, ${body.lng}° E` : ''),
      projectUrl: body.projectUrl || body.project_url || '',
      youtubeUrl: body.youtubeUrl || body.youtube_url || '',
      youtubeId: body.youtubeId || (body.youtubeUrl ? extractYouTubeId(body.youtubeUrl) : ''),
      display_order: Number(body.display_order) || db.projects.length + 1,
      lifecycle_stage: body.lifecycle_stage || 'handover',
    }

    if (db.projects.some((p: any) => p.slug === newProject.slug)) {
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
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', error: 'غير مصرح: يرجى تسجيل الدخول كمسؤول' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const slug = body.slug || body.updates?.slug || body.id
    const updates = body.updates || body

    if (!slug) {
      return NextResponse.json({ error: 'Project slug required' }, { status: 400 })
    }

    const db = readDb()
    const idx = db.projects.findIndex((p: any) => p.slug === slug || p.id === slug)
    if (idx === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const current: any = db.projects[idx]
    const updatedCover = updates.cover || updates.cover_image || updates.coverImage || updates.image || current.cover
    const updatedName = updates.name || updates.title || updates.title_en || current.name
    const updatedNameAr = updates.nameAr || updates.title_ar || updates.titleAr || current.nameAr || updatedName
    const updatedCategory = updates.type || updates.category || updates.sector_en || current.type
    const isFeat = typeof updates.featured === 'boolean' 
      ? updates.featured 
      : (typeof updates.is_featured === 'boolean' 
          ? updates.is_featured 
          : (updates.publish_status === 'Featured' ? true : current.featured))

    db.projects[idx] = {
      ...current,
      ...updates,
      name: updatedName,
      title: updatedName,
      title_en: updatedName,
      nameAr: updatedNameAr,
      title_ar: updatedNameAr,
      titleAr: updatedNameAr,
      cover: updatedCover,
      cover_image: updatedCover,
      coverImage: updatedCover,
      interior: updates.interior || updates.interiorImage || current.interior,
      cinematic: updates.cinematic || current.cinematic || updatedCover,
      type: updatedCategory,
      category: updatedCategory,
      sector_en: updates.sector_en || updatedCategory,
      sector_ar: updates.sector_ar || current.sector_ar || 'سكني',
      tagline: updates.tagline || updates.subtitle_en || current.tagline,
      subtitle_en: updates.subtitle_en || updates.tagline || current.subtitle_en,
      subtitle_ar: updates.subtitle_ar || updates.taglineAr || current.subtitle_ar,
      heading: updates.heading || current.heading,
      headingAr: updates.headingAr || current.headingAr,
      description: updates.description || updates.details_en || current.description,
      descriptionAr: updates.descriptionAr || updates.details_ar || current.descriptionAr,
      philosophy: updates.philosophy || updates.vision_en || current.philosophy,
      vision_en: updates.vision_en || updates.philosophy || current.vision_en,
      vision_ar: updates.vision_ar || updates.philosophyAr || current.vision_ar,
      disciplines: Array.isArray(updates.disciplines) && updates.disciplines.length > 0
        ? updates.disciplines 
        : (updates.category || updates.type ? [updatedCategory] : current.disciplines),
      scope: Array.isArray(updates.scope) ? updates.scope : current.scope,
      gallery: Array.isArray(updates.gallery) ? updates.gallery : current.gallery,
      gallery_images: Array.isArray(updates.gallery_images) 
        ? updates.gallery_images 
        : (Array.isArray(updates.gallery) ? updates.gallery.map((g: any) => typeof g === 'string' ? g : g.src) : current.gallery_images),
      featured: isFeat,
      is_featured: isFeat,
      publish_status: updates.publish_status || (isFeat ? 'Featured' : 'Published'),
      coordinates: updates.coordinates || current.coordinates || '',
      projectUrl: updates.projectUrl || current.projectUrl || '',
      youtubeUrl: typeof updates.youtubeUrl !== 'undefined' ? updates.youtubeUrl : (current.youtubeUrl || ''),
      youtubeId: updates.youtubeUrl ? (updates.youtubeId || extractYouTubeId(updates.youtubeUrl) || current.youtubeId || '') : (current.youtubeId || ''),
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
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', error: 'غير مصرح: يرجى تسجيل الدخول كمسؤول' },
        { status: 401 }
      )
    }

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
