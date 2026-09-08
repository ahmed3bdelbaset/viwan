import { Hero } from '@/components/home/hero'
import {
  ArchitecturalMarquee,
  WhoWeAre,
  SelectedProjects,
  RenderRealityShowcase,
  ServicesPreview,
  FeaturedProject,
  Philosophy,
  ProcessPreview,
  CinematicBreak,
  HomeImpactSection,
} from '@/components/home/sections'
import { MaterialityLab } from '@/components/site/materiality-lab'
import { RegionalMap } from '@/components/site/regional-map'
import { FinalCta } from '@/components/site/final-cta'
import { readDb } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  let dbProjects: any[] = []
  let featuredProject: any = null

  try {
    const db = readDb()
    if (db?.projects && Array.isArray(db.projects)) {
      dbProjects = db.projects
      featuredProject = db.projects.find((p: any) => p.featured || p.is_featured) || db.projects[0]
    }
  } catch (err) {
    console.error('Failed to read db for HomePage:', err)
  }

  return (
    <main>
      <Hero />
      <ArchitecturalMarquee />
      <WhoWeAre />
      <SelectedProjects initialProjects={dbProjects} />
      <RenderRealityShowcase />
      <ServicesPreview />
      <MaterialityLab />
      <FeaturedProject initialProject={featuredProject} />
      <Philosophy />
      <ProcessPreview />
      <CinematicBreak />
      <HomeImpactSection />
      <RegionalMap />
      <FinalCta />
    </main>
  )
}

