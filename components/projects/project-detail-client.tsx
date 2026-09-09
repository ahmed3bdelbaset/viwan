'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Project, PROJECTS } from '@/lib/projects'
import { Display, Eyebrow, SectionIndex, ButtonLink } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { extractYouTubeId } from '@/lib/youtube'
import { FinalCta } from '@/components/site/final-cta'
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers, FileDown, MapPin, ExternalLink, Play } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  ArchitecturalFrame,
  ArchitecturalDivider,
  TechnicalStamp,
  DraftingRuler,
} from '@/components/site/architectural-frame'
import { ProjectSiteMapCard } from './project-site-map-card'

interface ProjectDetailClientProps {
  project: Project
  nextProject: Project
  prevProject: Project
}

export function ProjectDetailClient({
  project,
  nextProject,
  prevProject,
}: ProjectDetailClientProps) {
  const { t, lang } = useLanguage()
  const isAr = lang === 'ar'
  const [blueprintMode, setBlueprintMode] = useState(false)

  const displayName = isAr && project.nameAr ? project.nameAr : project.name
  const displayLocation = isAr && project.locationAr ? project.locationAr : project.location
  const displayCountry = isAr && project.countryAr ? project.countryAr : project.country
  const displayTagline = isAr && project.taglineAr ? project.taglineAr : project.tagline
  const displayHeading = isAr && project.headingAr ? project.headingAr : project.heading
  const displayDescription = isAr && project.descriptionAr ? project.descriptionAr : project.description
  const displayPhilosophy = isAr && project.philosophyAr ? project.philosophyAr : project.philosophy
  const displayScope = isAr && project.scopeAr && project.scopeAr.length > 0 ? project.scopeAr : project.scope

  const prevName = isAr && prevProject.nameAr ? prevProject.nameAr : prevProject.name
  const nextName = isAr && nextProject.nameAr ? nextProject.nameAr : nextProject.name

  const disciplineTranslations: Record<string, string> = {
    Architecture: 'عمارة',
    'Interior Design': 'تصميم داخلي',
    Landscape: 'لاندسكيب',
    Engineering: 'هندسة متكاملة',
  }

  return (
    <main>
      {/* Hero Cover */}
      <section className="relative min-h-[90svh] flex flex-col justify-between pt-32 pb-16 surface-dark overflow-hidden">
        <div className="absolute inset-0 z-0 transition-all duration-700">
          <Image
            src={project.cinematic || project.cover}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className={cn(
              'object-cover transition-all duration-700',
              blueprintMode
                ? 'invert hue-rotate-[195deg] contrast-[1.8] brightness-[0.75] opacity-90'
                : 'opacity-80'
            )}
          />
          {/* Blueprint Technical CAD Grid Overlay */}
          {blueprintMode && (
            <div className="absolute inset-0 bg-[#002244]/40 backdrop-contrast-125 pointer-events-none select-none z-10">
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0, 210, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 210, 255, 0.4) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute top-28 end-8 sm:end-14 font-mono text-[10px] text-cyan-300/90 flex flex-col gap-1 border border-cyan-400/40 p-3.5 bg-black/75 backdrop-blur-md">
                <span className="text-cyan-400 font-bold">// ARCHITECTURAL CAD OVERLAY</span>
                <span>// AXIS REF: A-01 / ELEVATION NORTH</span>
                <span>// STRUCTURAL GRID: 6.0m x 8.4m</span>
                <span>// LEVEL: ROOF APEX +14.200m</span>
                <span>// DATUM: FINISHED FLOOR ±0.000</span>
                <span>// REVIT BIM MODEL: LOD-400 VERIFIED</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/80" />
        </div>

        {/* Back Link & Blueprint Mode Toggle */}
        <div className="relative z-10 container-viwan flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 eyebrow text-ivory/70 hover:text-gold transition-colors duration-300"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{lang === 'ar' ? 'العودة إلى الأعمال المختارة' : 'Back to Selected Work'}</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Technical Blueprint Toggle Button */}
            <button
              type="button"
              onClick={() => setBlueprintMode(!blueprintMode)}
              className={cn(
                'px-3 py-1.5 rounded-xs border text-[11px] tracking-wider uppercase font-mono flex items-center gap-2 transition-all duration-300 cursor-pointer',
                blueprintMode
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                  : 'bg-black/40 border-white/20 text-ivory/80 hover:text-ivory hover:border-gold'
              )}
            >
              <Layers className="size-3.5" />
              <span>{blueprintMode ? (lang === 'ar' ? 'المخطط الهندسي: مفعّل' : 'BLUEPRINT: ON') : (lang === 'ar' ? 'وضع المخطط الهندسي' : 'BLUEPRINT MODE')}</span>
            </button>

            <span className="eyebrow text-gold text-xs">
              {lang === 'ar' ? 'مشروع' : 'PROJECT'} {project.index} / {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Main Title & Tagline */}
        <div className="relative z-10 container-viwan flex flex-col gap-6 max-w-4xl mt-auto">
          <Eyebrow gold className="animate-fade-up">
            {project.type} · {displayLocation}, {displayCountry}
          </Eyebrow>
          <Display as="h1" size="xl" className="animate-fade-up [animation-delay:100ms] text-ivory">
            {displayName}
          </Display>
          <p className="text-base md:text-xl text-ivory/85 leading-relaxed max-w-2xl animate-fade-up [animation-delay:200ms]">
            {displayTagline}
          </p>
        </div>
      </section>

      {/* Overview & Metadata Grid */}
      <section className="section-gap border-b border-stone/40 relative">
        <div className="container-viwan mb-10">
          <ArchitecturalDivider
            axis="AXIS 01"
            label={displayName.toUpperCase()}
            level="ARCHITECTURAL MONOGRAPH"
          />
        </div>

        <div className="container-viwan grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <SectionIndex n="01" label={lang === 'ar' ? 'الموجز المعماري' : 'ARCHITECTURAL BRIEF'} axis="BRIEF-01" />
            <Display as="h2" size="sm" className="text-charcoal leading-tight">
              {displayHeading}
            </Display>
            <div className="flex flex-col gap-6 text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
              <p>{displayDescription}</p>
            </div>

            {/* Architecture philosophy block */}
            <div className="mt-8 p-8 md:p-12 border-s-2 border-gold bg-secondary/60 relative overflow-hidden corner-ticks">
              <div className="flex items-center justify-between mb-3">
                <p className="eyebrow text-gold">{lang === 'ar' ? 'فلسفة التصميم' : 'Design Intent'}</p>
                <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest">[DATUM // CONCEPT]</span>
              </div>
              <p className="font-serif italic text-xl md:text-2xl text-charcoal leading-relaxed">
                &ldquo;{displayPhilosophy}&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Project Specifications Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="flex items-center justify-between">
              <SectionIndex n="02" label={lang === 'ar' ? 'المواصفات الفنية' : 'SPECIFICATIONS'} axis="SPEC-01" />
              <DraftingRuler />
            </div>

            <div className="flex flex-col divide-y divide-stone/40 border-y border-stone/40 text-sm">
              <div className="py-4 flex items-center justify-between gap-4">
                <span className="eyebrow text-muted-foreground">{lang === 'ar' ? 'الموقع' : 'Location'}</span>
                <span className="font-medium text-charcoal">{displayLocation}, {displayCountry}</span>
              </div>
              <div className="py-4 flex items-center justify-between gap-4">
                <span className="eyebrow text-muted-foreground">{lang === 'ar' ? 'السنة' : 'Year'}</span>
                <span className="font-medium text-charcoal font-mono">{project.year}</span>
              </div>
              <div className="py-4 flex items-center justify-between gap-4">
                <span className="eyebrow text-muted-foreground">{lang === 'ar' ? 'نوع المشروع' : 'Typology'}</span>
                <span className="font-medium text-charcoal">{project.type}</span>
              </div>
              <div className="py-4 flex items-center justify-between gap-4">
                <span className="eyebrow text-muted-foreground">{lang === 'ar' ? 'مستوى النمذجة (BIM)' : 'BIM Level'}</span>
                <span className="font-mono text-xs text-gold font-semibold">LOD-400 VERIFIED</span>
              </div>
              <div className="py-4 flex items-start justify-between gap-4">
                <span className="eyebrow text-muted-foreground">{lang === 'ar' ? 'التخصصات' : 'Disciplines'}</span>
                <div className="flex flex-wrap gap-1.5 justify-end rtl:justify-start max-w-xs">
                  {project.disciplines.map((d) => (
                    <span key={d} className="border border-stone/60 px-2 py-0.5 text-xs text-charcoal font-mono">
                      {lang === 'ar' && disciplineTranslations[d] ? disciplineTranslations[d] : d}
                    </span>
                  ))}
                </div>
              </div>
              <div className="py-4 flex items-start justify-between gap-4">
                <span className="eyebrow text-muted-foreground">{lang === 'ar' ? 'مراحل العمل' : 'Scope of Work'}</span>
                <ul className="text-right rtl:text-left flex flex-col gap-1 text-xs text-charcoal">
                  {displayScope.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              {project.projectUrl && (
                <div className="py-4 flex items-center justify-between gap-4">
                  <span className="eyebrow text-muted-foreground flex items-center gap-1">
                    <ExternalLink className="size-3 text-gold" />
                    {lang === 'ar' ? 'رابط المشروع' : 'Project Link'}
                  </span>
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-gold hover:underline flex items-center gap-1.5"
                  >
                    <span>{lang === 'ar' ? 'زيارة الرابط / الجولة' : 'Visit / Live Link'}</span>
                    <ArrowUpRight className="size-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Interactive Project Site & Coordinates Map Card (Matching Image 1) */}
            <ProjectSiteMapCard
              locationName={`${displayLocation}, ${displayCountry}`}
              coordinates={project.coordinates}
              lat={project.lat}
              lng={project.lng}
              projectType={project.type}
              year={project.year}
            />

            <div className="p-6 border border-gold/40 bg-background flex flex-col gap-4 corner-ticks">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-gold text-xs">
                  {lang === 'ar' ? 'مهتم بتنفيذ مشروع مماثل؟' : 'Interested in a similar project?'}
                </p>
                <span className="font-mono text-[8.5px] text-stone-400">REF: VW-{project.year}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {lang === 'ar'
                  ? 'ناقش محددات موقعك ورؤيتك المعمارية والبرنامج الفراغي مع فريق VIWAN.'
                  : 'Discuss your site, vision and spatial program with our architectural team.'}
              </p>
              <div className="flex flex-col gap-2.5 pt-2">
                <ButtonLink href="/consultation" variant="gold">
                  {lang === 'ar' ? 'احجز استشارتك المجانية' : 'Book Consultation'}
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-3 px-4 border border-stone/50 hover:border-gold text-charcoal hover:text-gold text-xs tracking-wider uppercase eyebrow flex items-center justify-between transition-colors duration-300 cursor-pointer active:scale-98 rounded-xs"
                >
                  <span>{lang === 'ar' ? 'تصدير الكتيب المعماري (PDF)' : 'Download Monograph (PDF)'}</span>
                  <FileDown className="size-4 text-gold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional YouTube Video Feature */}
      {(project.youtubeUrl || project.youtubeId) && (
        <section className="section-gap surface-dark border-t border-stone-800">
          <div className="container-viwan flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-3 max-w-xl">
                <Eyebrow gold>{lang === 'ar' ? 'التوثيق السينمائي للمشروع' : 'ARCHITECTURAL FILM & VIDEO TOUR'}</Eyebrow>
                <Display as="h2" size="md" className="text-ivory">
                  {lang === 'ar' ? 'جولة الفيديو المعمارية عالية الدقة' : 'Cinematic Architectural Walkthrough'}
                </Display>
              </div>
              <span className="eyebrow text-xs text-gold font-mono border border-gold/40 px-3 py-1.5 bg-black/40">
                // 4K ARCHITECTURAL CINEMA
              </span>
            </div>

            <div className="relative aspect-video w-full max-w-5xl mx-auto overflow-hidden border border-white/15 bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId || (project.youtubeUrl ? extractYouTubeId(project.youtubeUrl) : '')}?rel=0&modestbranding=1`}
                title={displayName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </section>
      )}

      {/* Curated Gallery Section */}
      <section className="section-gap defer-render">
        <div className="container-viwan flex flex-col gap-16">
          <div className="flex flex-col gap-3">
            <SectionIndex n="03" label={lang === 'ar' ? 'معرض المشروع' : 'PROJECT GALLERY'} />
            <Display as="h2" size="lg">
              {lang === 'ar' ? 'التوثيق البصري للعمل' : 'Visual Documentation'}
            </Display>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {project.gallery.map((img: any, i) => {
              const imgSrc = typeof img === 'string' ? img : (img?.src || img?.url || '')
              if (!imgSrc) return null

              const isHeroGallery = i === 0 || i === 3
              const colSpan = isHeroGallery ? 'md:col-span-12' : i % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5'

              const imgCaption = typeof img === 'string'
                ? (isAr ? `${displayName} - لوحة توثيقية 0${i + 1}` : `${displayName} - Architectural Plate // 0${i + 1}`)
                : (img.caption || (isAr ? `${displayName} - لوحة توثيقية 0${i + 1}` : `${displayName} - Architectural Plate // 0${i + 1}`))

              const imgCategory = typeof img === 'string'
                ? (project.type || 'Architecture')
                : (img.category || project.type || 'Architecture')

              return (
                <Reveal
                  key={i}
                  as="figure"
                  className={`flex flex-col gap-3 ${colSpan}`}
                  delay={i * 80}
                >
                  <ArchitecturalFrame
                    label={`ARCHITECTURAL PLATE // 0${i + 1}`}
                    scale="1:100"
                    caption={imgCaption}
                  >
                    <div
                      className={`relative w-full overflow-hidden bg-secondary zoom-img ${
                        isHeroGallery ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[4/3]'
                      }`}
                    >
                      <Image
                        src={imgSrc}
                        alt={imgCaption}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className="object-cover"
                      />
                    </div>
                  </ArchitecturalFrame>
                  <figcaption className="flex items-center justify-between text-xs eyebrow text-muted-foreground pt-1">
                    <span>{imgCaption}</span>
                    <span className="text-gold font-mono text-[10px]">{imgCategory}</span>
                  </figcaption>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Project Navigation Footer (Next / Previous) */}
      <section className="border-t border-stone/40 bg-secondary/40 py-16 md:py-24">
        <div className="container-viwan flex flex-col sm:flex-row items-center justify-between gap-8">
          <Link
            href={`/projects/${prevProject.slug}`}
            className="group flex flex-col items-start gap-2"
          >
            <span className="eyebrow text-xs text-muted-foreground flex items-center gap-2 group-hover:text-gold transition-colors">
              <ArrowLeft className="size-3 rtl:rotate-180" /> {lang === 'ar' ? 'المشروع السابق' : 'Previous Project'}
            </span>
            <span className="display text-2xl md:text-3xl text-charcoal group-hover:text-gold transition-colors">
              {prevName}
            </span>
          </Link>

          <Link
            href="/projects"
            className="eyebrow text-xs border border-stone/60 px-6 py-3 hover:bg-charcoal hover:text-ivory transition-colors"
          >
            {lang === 'ar' ? 'جميع الأعمال' : 'All Works'}
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="group flex flex-col items-end gap-2 text-right rtl:text-left"
          >
            <span className="eyebrow text-xs text-muted-foreground flex items-center gap-2 group-hover:text-gold transition-colors">
              {lang === 'ar' ? 'المشروع التالي' : 'Next Project'} <ArrowRight className="size-3 rtl:rotate-180" />
            </span>
            <span className="display text-2xl md:text-3xl text-charcoal group-hover:text-gold transition-colors">
              {nextName}
            </span>
          </Link>
        </div>
      </section>

      <FinalCta />
    </main>
  )
}
