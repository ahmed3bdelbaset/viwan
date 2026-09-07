import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PROJECTS } from '@/lib/projects'
import { ProjectDetailClient } from '@/components/projects/project-detail-client'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.name} — VIWAN`,
    description: project.description.slice(0, 160),
    openGraph: {
      title: `${project.name} — VIWAN Architecture`,
      description: project.tagline,
      images: [project.cover],
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug)
  if (currentIndex === -1) notFound()

  const project = PROJECTS[currentIndex]
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length]
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length]

  return (
    <ProjectDetailClient
      project={project}
      nextProject={nextProject}
      prevProject={prevProject}
    />
  )
}
