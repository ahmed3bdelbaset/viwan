import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { readDb } from '@/lib/db'
import { PROJECTS, type Project } from '@/lib/projects'
import { ProjectDetailClient } from '@/components/projects/project-detail-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  params: Promise<{ slug: string }>
}

function getDynamicProjects(): Project[] {
  try {
    const db = readDb()
    if (db?.projects && Array.isArray(db.projects) && db.projects.length > 0) {
      return db.projects.map((p: any) => ({
        slug: p.slug,
        index: p.index || '01',
        name: p.name || p.title || '',
        nameAr: p.nameAr || p.titleAr || p.title_ar,
        location: p.location || p.location_en || '',
        locationAr: p.locationAr || p.location_ar,
        country: p.country || p.country_en || 'Egypt',
        countryAr: p.countryAr || p.country_ar,
        year: String(p.year || 2026),
        type: p.type || p.category || 'Architecture',
        disciplines: Array.isArray(p.disciplines) ? p.disciplines : [p.discipline || 'Architecture'],
        scope: Array.isArray(p.scope) ? p.scope : [],
        scopeAr: Array.isArray(p.scopeAr) ? p.scopeAr : [],
        tagline: p.tagline || p.subtitle_en || '',
        taglineAr: p.taglineAr || p.subtitle_ar || '',
        heading: p.heading || p.name || '',
        headingAr: p.headingAr || p.nameAr || '',
        description: p.description || p.details_en || '',
        descriptionAr: p.descriptionAr || p.details_ar || '',
        philosophy: p.philosophy || p.vision_en || '',
        philosophyAr: p.philosophyAr || p.vision_ar || '',
        cover: p.cover || p.coverImage || p.cover_image || '/images/project-private-residence.png',
        interior: p.interior || p.cover || '/images/interior-living-marble.jpg',
        cinematic: p.cinematic || p.cover || '/images/hero-villa.png',
        gallery: Array.isArray(p.gallery) ? p.gallery : [],
        featured: Boolean(p.featured || p.is_featured),
      }))
    }
  } catch (err) {
    console.error('Failed to read dynamic projects:', err)
  }
  return PROJECTS
}

export async function generateStaticParams() {
  const projects = getDynamicProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const projects = getDynamicProjects()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.name} — VIWAN`,
    description: (project.description || project.tagline || '').slice(0, 160),
    openGraph: {
      title: `${project.name} — VIWAN Architecture`,
      description: project.tagline,
      images: [project.cover],
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const projects = getDynamicProjects()
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  if (currentIndex === -1) notFound()

  const project = projects[currentIndex]
  const nextProject = projects[(currentIndex + 1) % projects.length]
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length]

  return (
    <ProjectDetailClient
      project={project}
      nextProject={nextProject}
      prevProject={prevProject}
    />
  )
}
