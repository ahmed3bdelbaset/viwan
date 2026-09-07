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

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ArchitecturalMarquee />
      <WhoWeAre />
      <SelectedProjects />
      <RenderRealityShowcase />
      <ServicesPreview />
      <MaterialityLab />
      <FeaturedProject />
      <Philosophy />
      <ProcessPreview />
      <CinematicBreak />
      <HomeImpactSection />
      <RegionalMap />
      <FinalCta />
    </main>
  )
}
