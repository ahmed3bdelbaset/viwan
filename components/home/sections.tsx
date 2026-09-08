'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ButtonLink, Display, Eyebrow, SectionIndex } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { LogoMark } from '@/components/site/logo'
import { CountUp } from '@/components/ui/count-up'
import {
  EmaarLogo,
  SodicLogo,
  TmgLogo,
  AlMarasemLogo,
  HydeParkLogo,
  MisrItaliaLogo,
  RegionalMiniMap,
} from '@/components/site/client-logos'
import { DisciplinesShowcase } from '@/components/home/disciplines-showcase'
import { PROCESS, SERVICES } from '@/lib/site'
import { FEATURED_PROJECT, HOME_PROJECTS, type Project } from '@/lib/projects'
import { useLanguage } from '@/lib/i18n'
import {
  ArchitecturalFrame,
  ArchitecturalDivider,
  TechnicalStamp,
  DraftingRuler,
} from '@/components/site/architectural-frame'

/* 02 — WHO WE ARE */
export function WhoWeAre() {
  const { t } = useLanguage()

  return (
    <section className="section-gap relative">
      <div className="container-viwan mb-8">
        <ArchitecturalDivider axis="AXIS 02" label={t.whoWeAre.label} level="STUDIO MONOGRAPH" />
      </div>
      <div className="container-viwan grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <Reveal className="lg:col-span-5 flex flex-col gap-8">
          <SectionIndex n={t.whoWeAre.index} label={t.whoWeAre.label} axis="A-02" />
          <Display>
            {t.whoWeAre.heading}
          </Display>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            {t.whoWeAre.body}
          </p>
          <div className="flex items-center gap-6 pt-2">
            <ButtonLink href="/studio" variant="text" className="self-start">
              {t.whoWeAre.button}
            </ButtonLink>
            <DraftingRuler />
          </div>
        </Reveal>
        <Reveal delay={150} className="lg:col-span-7 relative">
          <ArchitecturalFrame
            label="DETAIL SPEC // COURTYARD"
            scale="1:50 DETAIL"
            coordinates="30.0617°N 31.2198°E"
            caption="TRAVERTINE COURTYARD & OLIVE ENCLAVE"
          >
            <div className="zoom-img relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden">
              <Image
                src="/images/detail-courtyard.png"
                alt="Travertine courtyard with an olive tree and vertical wood screen"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </ArchitecturalFrame>
          <div className="absolute -bottom-6 end-6 hidden md:flex flex-col gap-1 eyebrow text-muted-foreground bg-background px-5 py-4 shadow-sm border border-stone/35 font-mono text-[10px]">
            <span>{t.whoWeAre.badge1}</span>
            <span>{t.whoWeAre.badge2}</span>
            <span>{t.whoWeAre.badge3}</span>
            <span className="text-gold font-semibold">{t.whoWeAre.badge4}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* 03 — SELECTED PROJECTS */
function ProjectMeta({ project, light = false }: { project: any; light?: boolean }) {
  const { t, lang } = useLanguage()

  const disciplineTranslations: Record<string, string> = {
    Architecture: 'عمارة',
    'Interior Design': 'تصميم داخلي',
    Landscape: 'لاندسكيب',
    Engineering: 'هندسة متكاملة',
  }

  const pName = lang === 'ar' && (project.nameAr || project.titleAr) ? (project.nameAr || project.titleAr) : (project.name || project.title)
  const pLocation = lang === 'ar' && project.locationAr ? project.locationAr : project.location
  const pCountry = lang === 'ar' && project.countryAr ? project.countryAr : project.country
  const disciplinesList = Array.isArray(project.disciplines)
    ? project.disciplines
    : [project.discipline || project.category || 'Architecture']

  return (
    <div className="flex items-start justify-between gap-6 pt-5">
      <div className="flex flex-col gap-2.5 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono tracking-wider text-stone-500 uppercase">
          <span className="text-gold font-bold">+</span>
          <span className="font-semibold text-foreground font-mono">{(project.slug || '').toUpperCase()}</span>
          <span className="text-stone/40">|</span>
          <span>SCALE 1:100</span>
          <span className="text-stone/40">|</span>
          <span className="text-gold font-mono">LOD-400 BIM</span>
        </div>
        <h3 className="eyebrow text-[0.8rem] font-medium">{pName}</h3>
        <p className={`eyebrow ${light ? 'text-ivory/60' : 'text-muted-foreground'}`}>
          {pLocation}, {pCountry} <span className="mx-2 text-stone">|</span>{' '}
          {project.year}
        </p>
        <div className="flex flex-col gap-1 pt-1">
          <span className="eyebrow text-gold">{t.selectedProjects.scope}</span>
          <span className={`text-xs ${light ? 'text-ivory/70' : 'text-muted-foreground'}`}>
            {disciplinesList
              .map((d: string) => (lang === 'ar' && disciplineTranslations[d] ? disciplineTranslations[d] : d))
              .join(' · ')}
          </span>
        </div>
      </div>
      <span
        className="mt-1 inline-flex size-10 shrink-0 items-center justify-center border border-current transition-colors duration-500 group-hover:bg-gold group-hover:border-gold group-hover:text-charcoal rtl:rotate-180"
        aria-hidden
      >
        <ArrowRight className="size-4" strokeWidth={1.25} />
      </span>
    </div>
  )
}

export function SelectedProjects({ initialProjects }: { initialProjects?: any[] }) {
  const [projectsList, setProjectsList] = useState<any[]>(() => {
    if (initialProjects && Array.isArray(initialProjects) && initialProjects.length >= 3) {
      return initialProjects
    }
    return HOME_PROJECTS
  })
  const { t, lang } = useLanguage()

  useEffect(() => {
    fetch('/api/public/projects')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.projects && Array.isArray(d.projects) && d.projects.length >= 3) {
          setProjectsList(d.projects)
        }
      })
      .catch(() => {})
  }, [])

  const first = projectsList[0] || HOME_PROJECTS[0]
  const second = projectsList[1] || HOME_PROJECTS[1]
  const third = projectsList[2] || HOME_PROJECTS[2]

  const firstName = lang === 'ar' && (first.nameAr || first.titleAr) ? (first.nameAr || first.titleAr) : (first.name || first.title)
  const firstLoc = lang === 'ar' && first.locationAr ? first.locationAr : first.location

  const secondName = lang === 'ar' && (second.nameAr || second.titleAr) ? (second.nameAr || second.titleAr) : (second.name || second.title)
  const secondLoc = lang === 'ar' && second.locationAr ? second.locationAr : second.location

  const thirdName = lang === 'ar' && (third.nameAr || third.titleAr) ? (third.nameAr || third.titleAr) : (third.name || third.title)
  const thirdLoc = lang === 'ar' && third.locationAr ? third.locationAr : third.location

  return (
    <section className="section-gap relative">
      <div className="container-viwan mb-6">
        <ArchitecturalDivider axis="AXIS 03" label={t.selectedProjects.label} level="WORKS MONOGRAPH" />
      </div>
      <div className="container-viwan flex flex-col gap-14">
        <Reveal className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-6">
            <SectionIndex n={t.selectedProjects.index} label={t.selectedProjects.label} axis="A-03" />
            <Display>{t.selectedProjects.heading}</Display>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <DraftingRuler />
            <ButtonLink href="/projects" variant="text">
              {t.selectedProjects.viewAll}
            </ButtonLink>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-14">
          <Reveal as="article" className="lg:col-span-12">
            <Link href={`/projects/${first.slug}`} className="group block">
              <ArchitecturalFrame
                label={`PROJECT FOLIO // ${String(firstName).toUpperCase()}`}
                scale="1:100"
                coordinates={`${String(firstLoc).toUpperCase()} // ${first.year}`}
              >
                <div className="zoom-img relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
                  <Image
                    src={first.cover || first.coverImage || '/images/project-private-residence.png'}
                    alt={first.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </ArchitecturalFrame>
              <ProjectMeta project={first} />
            </Link>
          </Reveal>

          <Reveal as="article" className="lg:col-span-7">
            <Link href={`/projects/${second.slug}`} className="group block">
              <ArchitecturalFrame
                label={`ELEVATION REF // ${String(secondName).toUpperCase()}`}
                scale="1:100"
                coordinates={`${String(secondLoc).toUpperCase()} // ${second.year}`}
              >
                <div className="zoom-img relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={second.cover || second.coverImage || '/images/project-lake-house.png'}
                    alt={second.name}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </ArchitecturalFrame>
              <ProjectMeta project={second} />
            </Link>
          </Reveal>

          <Reveal as="article" delay={120} className="lg:col-span-5 lg:pt-24">
            <Link href={`/projects/${third.slug}`} className="group block">
              <ArchitecturalFrame
                label={`AXONOMETRIC // ${String(thirdName).toUpperCase()}`}
                scale="1:100"
                coordinates={`${String(thirdLoc).toUpperCase()} // ${third.year}`}
              >
                <div className="zoom-img relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={third.cover || third.coverImage || '/images/project-urban-retreat.png'}
                    alt={third.name}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </ArchitecturalFrame>
              <ProjectMeta project={third} />
            </Link>
          </Reveal>
        </div>

        <ButtonLink href="/projects" variant="text" className="self-start sm:hidden">
          {t.selectedProjects.viewAll}
        </ButtonLink>
      </div>
    </section>
  )
}

/* 03b — MONA HUSSEIN STYLE DISCIPLINES SHOWCASE (REPLACED COMPARISON SLIDER) */
export function RenderRealityShowcase() {
  return <DisciplinesShowcase />
}
export { DisciplinesShowcase }

/* 04 — SERVICES PREVIEW */
export function ServicesPreview() {
  const { t } = useLanguage()

  return (
    <section className="surface-dark section-gap">
      <div className="container-viwan flex flex-col gap-16">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="flex flex-col gap-6">
            <SectionIndex n={t.servicesPreview.index} label={t.servicesPreview.label} dark />
            <Display>
              {t.servicesPreview.heading}
            </Display>
          </div>
          <ButtonLink href="/services" variant="gold" className="self-start">
            {t.servicesPreview.explore}
          </ButtonLink>
        </Reveal>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {SERVICES.map((s, i) => {
            const itemT = t.servicesPreview.items[i] || s

            return (
              <Reveal key={s.slug} as="li" delay={i * 100} className="bg-charcoal">
                <Link
                  href={`/services#${s.slug}`}
                  className="group flex flex-col gap-8 p-8 h-full transition-colors duration-500 hover:bg-secondary"
                >
                  <span className="font-serif text-4xl text-gold">{itemT.n}</span>
                  <div className="flex flex-col gap-4">
                    <h3 className="eyebrow text-[0.8rem] font-medium">{itemT.title}</h3>
                    <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                      {itemT.preview.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="zoom-img relative aspect-[4/3] overflow-hidden mt-auto">
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* 05 — FEATURED PROJECT */
export function FeaturedProject({ initialProject }: { initialProject?: any }) {
  const [p, setP] = useState<any>(initialProject || FEATURED_PROJECT)
  const { t, lang } = useLanguage()

  useEffect(() => {
    fetch('/api/public/projects')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.projects && Array.isArray(d.projects)) {
          const feat = d.projects.find((item: any) => item.featured || item.is_featured) || d.projects[0]
          if (feat) setP(feat)
        }
      })
      .catch(() => {})
  }, [])

  const disciplineTranslations: Record<string, string> = {
    Architecture: 'عمارة',
    'Interior Design': 'تصميم داخلي',
    Landscape: 'لاندسكيب',
    Engineering: 'هندسة متكاملة',
  }

  const pName = lang === 'ar' && (p.nameAr || p.titleAr) ? (p.nameAr || p.titleAr) : (p.name || p.title)
  const pLocation = lang === 'ar' && p.locationAr ? p.locationAr : p.location
  const pCountry = lang === 'ar' && p.countryAr ? p.countryAr : p.country
  const pDisciplines = Array.isArray(p.disciplines)
    ? p.disciplines.map((d: string) => (lang === 'ar' && disciplineTranslations[d] ? disciplineTranslations[d] : d)).join(' · ')
    : (p.type || 'Architecture')

  return (
    <section className="relative surface-dark min-h-[70svh] lg:min-h-[85svh] flex items-end overflow-hidden corner-ticks">
      <Image
        src={p.cinematic || p.cover || p.coverImage || '/images/hero-villa.png'}
        alt={pName}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/20" aria-hidden />

      {/* Top Architectural Datum Bar */}
      <div className="absolute top-8 start-8 end-8 hidden sm:flex items-center justify-between z-10 text-[9px] font-mono uppercase tracking-widest text-ivory/60 select-none">
        <div className="flex items-center gap-2">
          <span className="text-gold font-bold">+</span>
          <span>FEATURED MONOGRAPH // {p.index || '01'}</span>
        </div>
        <TechnicalStamp
          code={p.code || `VW-${p.year || '2026'}`}
          scale="SCALE 1:200"
          location={`${String(pLocation).toUpperCase()}${pCountry ? `, ${String(pCountry).toUpperCase()}` : ''}`}
          bim="LOD-400 VERIFIED"
          dark
        />
      </div>

      <div className="relative container-viwan py-16 md:py-24 flex flex-col lg:flex-row lg:items-end justify-between gap-10 w-full z-10">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow gold>{t.featuredProject.label}</Eyebrow>
          <Display size="lg" className="uppercase tracking-tight">
            {pName}
            <br />
            {pLocation}{pCountry ? `, ${pCountry}` : ''}
          </Display>
          <p className="eyebrow text-ivory/70">{pDisciplines}</p>
          <ButtonLink href={`/projects/${p.slug}`} variant="outline" className="self-start mt-2">
            {t.featuredProject.view}
          </ButtonLink>
        </Reveal>
        <Reveal delay={200} className="hidden lg:flex flex-col items-end rtl:items-start gap-1 eyebrow text-ivory/60 font-mono text-[10px]">
          <span>DATUM: ELEV +18.40m</span>
          <span>LAT: {p.lat ? `${p.lat}° N` : '24.7677° N'}</span>
          <span className="text-gold">TIMELESS BY DESIGN</span>
          <span className="mt-3 h-12 w-px bg-gold/40" aria-hidden />
        </Reveal>
      </div>
    </section>
  )
}

/* 06 — PHILOSOPHY */
export function Philosophy() {
  const { t, lang } = useLanguage()

  return (
    <section className="relative section-gap overflow-hidden drafting-grid border-y border-stone/20">
      <LogoMark
        monochrome
        className="pointer-events-none absolute -end-16 top-1/2 -translate-y-1/2 w-[28rem] lg:w-[38rem] h-auto text-stone/15 select-none"
      />
      <div className="relative container-viwan grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <Reveal className="lg:col-span-9">
          <div className="text-[10px] font-mono text-gold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span>+</span>
            <span>AXIS 06 // ARCHITECTURAL CREED</span>
          </div>
          <Display size="xl" as="p" className="leading-tight">
            {t.philosophy.quote}
          </Display>
        </Reveal>
        <Reveal delay={150} className="lg:col-span-3 flex flex-col gap-3 eyebrow text-muted-foreground lg:items-end lg:text-right rtl:lg:items-start rtl:lg:text-left border-l rtl:border-r rtl:border-l-0 border-stone/25 ps-6 rtl:pe-6 rtl:ps-0 font-mono text-[11px]">
          <span>{lang === 'ar' ? 'العمارة هي الإطار والهيكل.' : 'Architecture is the framework.'}</span>
          <span className="text-gold font-semibold">{lang === 'ar' ? 'والتجربة الفراغية هي الأثر الباقي.' : 'Experience is the outcome.'}</span>
          <span className="text-[9px] text-stone-400 tracking-widest pt-2">// VIWAN DESIGN ETHOS</span>
        </Reveal>
      </div>
    </section>
  )
}

/* 07 — HOW WE WORK PREVIEW */
export function ProcessPreview() {
  const { t } = useLanguage()

  return (
    <section className="section-gap border-t border-border">
      <div className="container-viwan flex flex-col gap-14">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-6">
            <SectionIndex n={t.processPreview.index} label={t.processPreview.label} />
            <Display>
              {t.processPreview.heading}
            </Display>
          </div>
          <ButtonLink href="/how-we-work" variant="text" className="self-start">
            {t.processPreview.button}
          </ButtonLink>
        </Reveal>

        <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10">
          {PROCESS.map((step, i) => {
            const stepT = t.processPreview.steps[i] || step

            return (
              <Reveal key={step.n} as="li" delay={i * 80} className="relative flex flex-col gap-4 pe-6">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl text-gold">{stepT.n}</span>
                  <span className="h-px flex-1 bg-border" aria-hidden />
                  {i < PROCESS.length - 1 && (
                    <ArrowRight className="size-3.5 text-stone rtl:rotate-180" strokeWidth={1.25} aria-hidden />
                  )}
                </div>
                <h3 className="eyebrow text-[0.8rem] font-medium">{stepT.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{stepT.short}</p>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* 07b — FULL SCREEN IMAGE */
export function CinematicBreak() {
  const { t } = useLanguage()

  return (
    <section className="relative h-[60svh] lg:h-[80svh] surface-dark overflow-hidden">
      <Image
        src="/images/interior-living-fireplace.jpg"
        alt="Living room in travertine and walnut with a linear fireplace at dusk"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" aria-hidden />
      <div className="relative container-viwan h-full flex items-end justify-between pb-10 eyebrow text-ivory/70">
        <span>
          {t.cinematicBreak.brand}
        </span>
        <span className="text-right rtl:text-left">
          {t.cinematicBreak.tagline}
        </span>
      </div>
    </section>
  )
}

/* 01b — ARCHITECTURAL PRESENCE MARQUEE */
export function ArchitecturalMarquee() {
  const { t } = useLanguage()
  const items = t.marquee

  return (
    <div className="border-y border-stone/30 bg-secondary/30 py-4 overflow-hidden select-none">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-xs eyebrow text-charcoal/80">
        {items.concat(items).map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="tracking-widest">{item}</span>
            <span className="size-1 rounded-full bg-gold" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* 06–09 — HOME IMPACT, WHERE WE WORK, SELECTED CLIENTS & FEEDBACK */
export function HomeImpactSection() {
  const { t, lang, isRtl } = useLanguage()

  const metrics = t.impact?.metrics || [
    { value: '50+', label: lang === 'ar' ? 'مشروعاً منجزاً' : 'Projects' },
    { value: '1M+ m²', label: lang === 'ar' ? 'تم تصميمه' : 'Designed' },
    { value: '4', label: lang === 'ar' ? 'تخصصات متكاملة' : 'Disciplines' },
    { value: '3', label: lang === 'ar' ? 'أسواق إقليمية' : 'Markets' },
  ]

  return (
    <section id="impact" className="relative py-12 sm:py-16 md:py-20 bg-[#FAF8F5] dark:bg-[#12110F] border-t border-stone/30">
      <div className="container-viwan">
        {/* Main Architectural Unified Grid Box */}
        <div className="border border-[#E7E2D8] dark:border-stone-800 bg-white dark:bg-[#161513] shadow-xs">
          
          {/* ========================================================================= */}
          {/* ROW 1: 06 / OUR IMPACT (Left) | 07 / WHERE WE WORK (Right) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch border-b border-[#E7E2D8] dark:border-stone-800">
            {/* Left ~64%: 06 OUR IMPACT */}
            <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-6">
              {/* Tag / Eyebrow */}
              <div className="text-[11px] font-mono tracking-widest uppercase text-stone-500 flex items-center gap-2">
                <span className="text-gold font-bold">06</span>
                <span className="text-stone-300 dark:text-stone-700">/</span>
                <span className="font-semibold text-charcoal dark:text-ivory">{t.impact?.label || (isRtl ? 'أثرنا وإنجازنا' : 'OUR IMPACT')}</span>
              </div>

              {/* 4 Metric Columns with vertical dividers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-[#E7E2D8] dark:divide-stone-800 pt-2">
                {metrics.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="py-3 sm:py-0 px-3 sm:px-6 first:ps-0 last:pe-0 flex flex-col justify-center"
                  >
                    <div className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal dark:text-ivory tracking-tight leading-none mb-2">
                      <CountUp value={m.value} />
                    </div>
                    <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium tracking-wide">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right ~36%: 07 WHERE WE WORK */}
            <div className="lg:col-span-4 p-6 sm:p-8 md:p-10 border-t lg:border-t-0 lg:border-s border-[#E7E2D8] dark:border-stone-800 flex flex-col justify-between gap-5 bg-[#FAF8F5]/50 dark:bg-[#141311]/50">
              <div className="text-[11px] font-mono tracking-widest uppercase text-stone-500 flex items-center gap-2">
                <span className="text-gold font-bold">07</span>
                <span className="text-stone-300 dark:text-stone-700">/</span>
                <span className="font-semibold text-charcoal dark:text-ivory">
                  {t.impact?.whereWeWork?.label || (isRtl ? 'أين نعمل' : 'WHERE WE WORK')}
                </span>
              </div>

              <div className="flex items-center gap-5 sm:gap-6">
                {/* Minimalist Regional Map */}
                <RegionalMiniMap className="w-28 h-20 sm:w-32 sm:h-22" />

                {/* Locations Text */}
                <div className="space-y-1.5 flex-1">
                  <p className="font-serif text-sm sm:text-base text-charcoal dark:text-ivory leading-snug">
                    {isRtl ? (
                      <>
                        مقرنا في القاهرة،<br />
                        ونعمل عبر مصر<br />
                        وكافة أنحاء المنطقة.
                      </>
                    ) : (
                      <>
                        Based in Cairo,<br />
                        Working across Egypt<br />
                        and the region.
                      </>
                    )}
                  </p>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-stone-500 pt-1 border-t border-[#E7E2D8]/60 dark:border-stone-800/60">
                    {isRtl ? 'مصر / السعودية / الشرق الأوسط' : 'EGYPT / KSA / MIDDLE EAST'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2: 08 SELECTED CLIENTS (Left) | 09 CLIENT FEEDBACK (Right) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left ~64%: 08 SELECTED CLIENTS */}
            <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-6">
              {/* Tag / Eyebrow */}
              <div className="text-[11px] font-mono tracking-widest uppercase text-stone-500 flex items-center gap-2">
                <span className="text-gold font-bold">08</span>
                <span className="text-stone-300 dark:text-stone-700">/</span>
                <span className="font-semibold text-charcoal dark:text-ivory">
                  {t.impact?.selectedClients?.label || (isRtl ? 'عملاؤنا المختارون' : 'SELECTED CLIENTS')}
                </span>
              </div>

              {/* 6 Client Logos in horizontal row with thin vertical dividers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-[#E7E2D8] dark:divide-stone-800 items-center">
                {/* 1. EMAAR */}
                <div className="py-4 sm:py-2 px-3 flex items-center justify-center min-h-[64px] text-charcoal/80 dark:text-ivory/80 hover:text-gold dark:hover:text-gold transition-colors">
                  <EmaarLogo className="h-5 sm:h-6 w-auto max-w-[110px]" />
                </div>
                {/* 2. SODIC */}
                <div className="py-4 sm:py-2 px-3 flex items-center justify-center min-h-[64px] text-charcoal/80 dark:text-ivory/80 hover:text-gold dark:hover:text-gold transition-colors">
                  <SodicLogo className="h-5 sm:h-6 w-auto max-w-[110px]" />
                </div>
                {/* 3. TMG */}
                <div className="py-4 sm:py-2 px-3 flex items-center justify-center min-h-[64px] text-charcoal/80 dark:text-ivory/80 hover:text-gold dark:hover:text-gold transition-colors">
                  <TmgLogo className="h-5 sm:h-6 w-auto max-w-[100px]" />
                </div>
                {/* 4. ALMARASEM */}
                <div className="py-4 sm:py-2 px-3 flex items-center justify-center min-h-[64px] text-charcoal/80 dark:text-ivory/80 hover:text-gold dark:hover:text-gold transition-colors">
                  <AlMarasemLogo className="h-7 sm:h-8 w-auto max-w-[115px]" />
                </div>
                {/* 5. HYDE PARK */}
                <div className="py-4 sm:py-2 px-3 flex items-center justify-center min-h-[64px] text-charcoal/80 dark:text-ivory/80 hover:text-gold dark:hover:text-gold transition-colors">
                  <HydeParkLogo className="h-5 sm:h-6 w-auto max-w-[115px]" />
                </div>
                {/* 6. MISR ITALIA */}
                <div className="py-4 sm:py-2 px-3 flex items-center justify-center min-h-[64px] text-charcoal/80 dark:text-ivory/80 hover:text-gold dark:hover:text-gold transition-colors">
                  <MisrItaliaLogo className="h-5 sm:h-6 w-auto max-w-[120px]" />
                </div>
              </div>
            </div>

            {/* Right ~36%: 09 CLIENT FEEDBACK */}
            <div className="lg:col-span-4 p-6 sm:p-8 md:p-10 border-t lg:border-t-0 lg:border-s border-[#E7E2D8] dark:border-stone-800 flex flex-col justify-between gap-4 bg-[#FAF8F5]/50 dark:bg-[#141311]/50">
              <div className="text-[11px] font-mono tracking-widest uppercase text-stone-500 flex items-center gap-2">
                <span className="text-gold font-bold">09</span>
                <span className="text-stone-300 dark:text-stone-700">/</span>
                <span className="font-semibold text-charcoal dark:text-ivory">
                  {t.impact?.clientFeedback?.label || (isRtl ? 'آراء العملاء' : 'CLIENT FEEDBACK')}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl sm:text-3xl text-gold font-serif leading-none shrink-0 select-none">“</span>
                <p className="font-serif text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light italic">
                  {isRtl
                    ? '“فهمت VIWAN المشروع كتجربة معمارية متكاملة، وليس مجرد مجموعة من القرارات التصميمية المنفصلة.”'
                    : '“VIWAN understood the project as a complete experience, not a collection of separate design decisions.”'}
                </p>
              </div>

              <div className="text-[11px] text-stone-500 font-mono tracking-wider pt-2 border-t border-[#E7E2D8]/60 dark:border-stone-800/60">
                {isRtl ? '— عميل إقامة خاصة' : '— Private Residence Client'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export { ArrowUpRight }


