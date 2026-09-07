'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ButtonLink, Display, Eyebrow, SectionIndex } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { LogoMark } from '@/components/site/logo'
import { CountUp } from '@/components/ui/count-up'
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
function ProjectMeta({ project, light = false }: { project: Project; light?: boolean }) {
  const { t, lang } = useLanguage()

  const disciplineTranslations: Record<string, string> = {
    Architecture: 'عمارة',
    'Interior Design': 'تصميم داخلي',
    Landscape: 'لاندسكيب',
    Engineering: 'هندسة متكاملة',
  }

  return (
    <div className="flex items-start justify-between gap-6 pt-5">
      <div className="flex flex-col gap-2.5 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono tracking-wider text-stone-500 uppercase">
          <span className="text-gold font-bold">+</span>
          <span className="font-semibold text-foreground font-mono">{project.slug.toUpperCase()}</span>
          <span className="text-stone/40">|</span>
          <span>SCALE 1:100</span>
          <span className="text-stone/40">|</span>
          <span className="text-gold font-mono">LOD-400 BIM</span>
        </div>
        <h3 className="eyebrow text-[0.8rem] font-medium">{project.name}</h3>
        <p className={`eyebrow ${light ? 'text-ivory/60' : 'text-muted-foreground'}`}>
          {project.location}, {project.country} <span className="mx-2 text-stone">|</span>{' '}
          {project.year}
        </p>
        <div className="flex flex-col gap-1 pt-1">
          <span className="eyebrow text-gold">{t.selectedProjects.scope}</span>
          <span className={`text-xs ${light ? 'text-ivory/70' : 'text-muted-foreground'}`}>
            {project.disciplines
              .map((d) => (lang === 'ar' && disciplineTranslations[d] ? disciplineTranslations[d] : d))
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

export function SelectedProjects() {
  const [first, second, third] = HOME_PROJECTS
  const { t } = useLanguage()

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
                label={`PROJECT FOLIO // ${first.name.toUpperCase()}`}
                scale="1:100"
                coordinates={`${first.location.toUpperCase()} // ${first.year}`}
              >
                <div className="zoom-img relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
                  <Image
                    src={first.cover}
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
                label={`ELEVATION REF // ${second.name.toUpperCase()}`}
                scale="1:100"
                coordinates={`${second.location.toUpperCase()} // ${second.year}`}
              >
                <div className="zoom-img relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={second.cover}
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
                label={`AXONOMETRIC // ${third.name.toUpperCase()}`}
                scale="1:100"
                coordinates={`${third.location.toUpperCase()} // ${third.year}`}
              >
                <div className="zoom-img relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={third.cover}
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
export function FeaturedProject() {
  const p = FEATURED_PROJECT
  const { t } = useLanguage()

  return (
    <section className="relative surface-dark min-h-[70svh] lg:min-h-[85svh] flex items-end overflow-hidden corner-ticks">
      <Image
        src={p.cinematic}
        alt={p.name}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/20" aria-hidden />

      {/* Top Architectural Datum Bar */}
      <div className="absolute top-8 start-8 end-8 hidden sm:flex items-center justify-between z-10 text-[9px] font-mono uppercase tracking-widest text-ivory/60 select-none">
        <div className="flex items-center gap-2">
          <span className="text-gold font-bold">+</span>
          <span>FEATURED MONOGRAPH // 01</span>
        </div>
        <TechnicalStamp
          code="PRJ-2024-KAFD"
          scale="SCALE 1:200"
          location="RIYADH, KSA"
          bim="LOD-400 VERIFIED"
          dark
        />
      </div>

      <div className="relative container-viwan py-16 md:py-24 flex flex-col lg:flex-row lg:items-end justify-between gap-10 w-full z-10">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow gold>{t.featuredProject.label}</Eyebrow>
          <Display size="lg" className="uppercase tracking-tight">
            {t.featuredProject.name}
            <br />
            {t.featuredProject.location}
          </Display>
          <p className="eyebrow text-ivory/70">{t.featuredProject.disciplines}</p>
          <ButtonLink href={`/projects/${p.slug}`} variant="outline" className="self-start mt-2">
            {t.featuredProject.view}
          </ButtonLink>
        </Reveal>
        <Reveal delay={200} className="hidden lg:flex flex-col items-end rtl:items-start gap-1 eyebrow text-ivory/60 font-mono text-[10px]">
          <span>DATUM: ELEV +18.40m</span>
          <span>LAT: 24.7677° N</span>
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

/* 08 — HOME IMPACT & PARTNERS */
export function HomeImpactSection() {
  const { t } = useLanguage()
  const partners = ['EMAAR', 'SODIC', 'TALAAT MOUSTAFA', 'PALM HILLS', 'ROSHN KSA', 'DIRIYAH GATE']
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animId: number | null = null
    const updateParallax = () => {
      if (!sectionRef.current || !bgRef.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        bgRef.current.style.transform = 'none'
        return
      }
      const rect = sectionRef.current.getBoundingClientRect()
      const winHeight = window.innerHeight

      // If section is approaching or in viewport
      if (rect.bottom > -150 && rect.top < winHeight + 150) {
        const sectionCenter = rect.top + rect.height / 2
        const viewportCenter = winHeight / 2
        const diff = sectionCenter - viewportCenter
        // Smooth, visible parallax shift that feels dynamic while keeping plane visible
        const translateY = Math.max(-55, Math.min(55, -diff * 0.12))
        bgRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`
      }
    }

    const onScroll = () => {
      if (animId) cancelAnimationFrame(animId)
      animId = requestAnimationFrame(updateParallax)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updateParallax()

    return () => {
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="impact" ref={sectionRef} className="relative pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 md:pb-24 surface-dark border-t border-border overflow-hidden">
      {/* Parallax Architecture Background with Responsive Images */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
        <div
          ref={bgRef}
          className="absolute -top-[8%] start-0 w-full h-[116%] will-change-transform transition-transform duration-75 ease-out"
          style={{ transform: 'translate3d(0, 0px, 0)' }}
        >
          {/* Desktop & Tablet: 16:9 Landscape Wide Shot */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src="/images/airplane-banner-viwan.jpg"
              alt="VIWAN Aircraft Towing Brand Banner Over Sunny Mediterranean Coastline"
              fill
              sizes="100vw"
              className="object-cover object-[center_36%]"
              priority={false}
            />
          </div>

          {/* Mobile: 9:16 Portrait Optimized Shot */}
          <div className="block sm:hidden absolute inset-0">
            <Image
              src="/images/airplane-banner-viwan-mobile.jpg"
              alt="VIWAN Aircraft Towing Brand Banner Over Sunny Mediterranean Coastline"
              fill
              sizes="100vw"
              className="object-cover object-[68%_32%]"
              priority={false}
            />
          </div>
        </div>
        {/* Balanced luxury marine tint: crystal-clear sky to showcase plane & banner, dark sea vignette below */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08121a]/25 via-transparent to-[#050c13]/85" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_45%,_#050c13_95%] opacity-40" />
      </div>

      <div className="relative z-10 container-viwan flex flex-col justify-between min-h-[720px] md:min-h-[820px] pt-4 sm:pt-0">
        {/* Top: Section Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-xl">
            <SectionIndex n={t.impact.index} label={t.impact.label} dark />
            <Display as="h2" size="md" className="text-ivory drop-shadow-md">
              {t.impact.heading}
            </Display>
          </div>
          <p className="text-xs eyebrow text-ivory/85 max-w-xs md:text-right rtl:md:text-left drop-shadow">
            {t.impact.sub}
          </p>
        </Reveal>

        {/* Middle: Open Sky Flight Corridor — Airplane and banner soar clearly without any boxes covering them */}
        <div className="h-36 sm:h-48 md:h-64 lg:h-72 w-full pointer-events-none" aria-hidden="true" />

        {/* Bottom Area: Metric Cards & Partners */}
        <div className="flex flex-col gap-10 md:gap-14">
          {/* Luxury Deep Ocean Frosted Glass Metric Cards harmonizing with the marine landscape */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {t.impact.metrics.map((m, i) => (
              <Reveal
                key={i}
                delay={i * 80}
                className="group p-5 sm:p-7 md:p-8 border border-white/15 bg-[#07131e]/65 dark:bg-[#030910]/75 backdrop-blur-md flex flex-col gap-1.5 sm:gap-2 shadow-2xl hover:border-gold/70 hover:bg-[#07131e]/85 transition-all duration-500 hover:-translate-y-1 rounded-sm"
              >
                <CountUp value={m.value} className="display text-3xl sm:text-4xl md:text-5xl text-gold font-light tracking-tight" />
                <span className="eyebrow text-[0.7rem] sm:text-xs text-ivory font-bold pt-1 sm:pt-2 tracking-wider group-hover:text-gold transition-colors duration-300">{m.label}</span>
                <span className="text-[0.7rem] sm:text-xs text-ivory/80 leading-relaxed">{m.sub}</span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="pt-6 sm:pt-8 border-t border-white/15 flex flex-col gap-6">
            <p className="eyebrow text-gold text-xs">{t.impact.partnersLabel}</p>
            <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 text-ivory/90 font-serif text-base sm:text-lg tracking-wider">
              {partners.map((p, idx) => (
                <span key={idx} className="hover:text-gold transition-colors duration-300 drop-shadow-sm">{p}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export { ArrowUpRight }


