'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero, Display, Eyebrow, SectionIndex, ButtonLink } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { CountUp } from '@/components/ui/count-up'
import { RegionalMap } from '@/components/site/regional-map'
import { Marquee } from '@/components/ui/marquee'
import { FinalCta } from '@/components/site/final-cta'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

const CLIENT_PARTNERS = [
  'EMAAR MISR',
  'SODIC',
  'TALAAT MOUSTAFA GROUP',
  'PALM HILLS',
  'ORA DEVELOPERS',
  'ROSHN KSA',
  'DIRIYAH GATE',
  'NEW GIZA',
]

export default function StudioPage() {
  const { t, lang } = useLanguage()
  const impactSectionRef = useRef<HTMLElement>(null)
  const impactBgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animId: number | null = null
    const updateParallax = () => {
      if (!impactSectionRef.current || !impactBgRef.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        impactBgRef.current.style.transform = 'translate3d(0, 0, 0) scale(1.05)'
        return
      }
      const rect = impactSectionRef.current.getBoundingClientRect()
      const winHeight = window.innerHeight

      // If section is approaching or in viewport
      if (rect.bottom > -200 && rect.top < winHeight + 200) {
        const sectionCenter = rect.top + rect.height / 2
        const viewportCenter = winHeight / 2
        const diff = sectionCenter - viewportCenter
        // Prominent, unmistakable parallax shift
        const translateY = -diff * 0.38
        impactBgRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(1.25)`
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

  const materials = [
    {
      title: lang === 'ar' ? 'الأحجار الطبيعية' : 'Natural Stone',
      src: '/images/material-stone.png',
      desc: lang === 'ar' ? 'ترافرتين مجلي ورخام طبيعي' : 'Honed Travertine & Marbles',
    },
    {
      title: lang === 'ar' ? 'الأخشاب المعمارية' : 'Architectural Timber',
      src: '/images/material-wood.png',
      desc: lang === 'ar' ? 'أخشاب البلوط والجوز الأمريكي' : 'Oak & Fluted Walnut',
    },
    {
      title: lang === 'ar' ? 'المعادن المشغولة' : 'Crafted Metals',
      src: '/images/material-metal.png',
      desc: lang === 'ar' ? 'برونز معتق وحديد مطروق' : 'Aged Bronze & Gunmetal',
    },
    {
      title: lang === 'ar' ? 'الأقمشة الفاخرة' : 'Bespoke Fabrics',
      src: '/images/material-fabric.png',
      desc: lang === 'ar' ? 'كتان طبيعي وبوكليه وحرير' : 'Linens, Bouclé & Silks',
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* 1. CINEMATIC FIRM / STUDIO HERO SECTION */}
      <section className="relative min-h-[64vh] lg:min-h-[72vh] flex flex-col justify-end surface-dark overflow-hidden select-none">
        {/* Cinematic Studio Interior Photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/studio-firm-hero.jpg"
            alt="VIWAN Architecture & Design Studio — Integrated Engineering Consultancy Headquarters"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100"
          />
        </div>

        {/* Directional & Vertical Gradients for Crisp Contrast & Architectural Glow */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/65 to-charcoal/30 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/55 to-transparent rtl:bg-gradient-to-l rtl:from-charcoal/90 rtl:via-charcoal/55 rtl:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Content Container */}
        <div className="container-viwan relative z-10 w-full pt-40 md:pt-48 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Eyebrow gold className="animate-fade-up">
              {t.studioPage.eyebrow}
            </Eyebrow>

            <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.08] animate-fade-up [animation-delay:150ms] text-balance font-serif">
              {t.studioPage.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-ivory/85 leading-relaxed max-w-2xl animate-fade-up [animation-delay:300ms] text-pretty font-light">
              {t.studioPage.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-up [animation-delay:400ms]">
              <ButtonLink
                href="/how-we-work"
                variant="gold"
              >
                <span>{t.studioPage.exploreProcess}</span>
                <ArrowRight className="size-4 rtl:rotate-180 inline-block ms-1.5" />
              </ButtonLink>

              <ButtonLink
                href="/consultation"
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 hover:border-ivory/60"
              >
                <span>{t.nav?.consultation || (lang === 'ar' ? 'جلسة استشارية مجانية' : '30 Min Consultation')}</span>
                <ArrowRight className="size-4 rtl:rotate-180 inline-block ms-1.5" />
              </ButtonLink>
            </div>
          </div>

          {/* Right Brand Pillar Block with Vertical Divider */}
          <div className="hidden md:flex items-center gap-4 animate-fade-in [animation-delay:450ms]">
            <span className="h-16 w-px bg-ivory/30 inline-block" aria-hidden="true" />
            <div className="flex flex-col gap-1 eyebrow text-ivory/70 text-xs tracking-widest font-medium">
              <span>{lang === 'ar' ? 'القاهرة' : 'CAIRO'}</span>
              <span>{lang === 'ar' ? 'الرياض' : 'RIYADH'}</span>
              <span className="text-gold">{lang === 'ar' ? 'دبي' : 'DUBAI'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Narrative Section */}
      <section className="border-t border-stone/40">
        <div className="container-viwan section-gap grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal as="div" className="lg:col-span-7 flex flex-col gap-8">
            <SectionIndex n={t.studioPage.manifestoIndex} label={t.studioPage.manifestoLabel} />
            <Display as="h2" size="lg" className="text-charcoal leading-tight">
              {t.studioPage.manifestoHeading}
            </Display>
            <div className="flex flex-col gap-6 text-base md:text-lg leading-relaxed text-muted-foreground font-sans">
              <p>{t.studioPage.manifestoP1}</p>
              <p>{t.studioPage.manifestoP2}</p>
            </div>
            <div className="pt-2 flex items-center gap-6">
              <ButtonLink href="/how-we-work" variant="gold">
                {t.studioPage.exploreProcess}
              </ButtonLink>
              <ButtonLink href="/careers" variant="outline">
                {t.studioPage.joinTeam}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal as="div" className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary zoom-img border border-stone/40">
              <Image
                src="/images/studio-space.png"
                alt="VIWAN Engineering Consultancy"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 start-6 text-ivory eyebrow text-xs">
                {lang === 'ar' ? 'مكتب VIWAN للاستشارات الهندسية — القاهرة والرياض' : 'VIWAN ENGINEERING CONSULTANCY — CAIRO & RIYADH'}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Impact Statistics with Parallax Background & 60% Dark Overlay */}
      <section ref={impactSectionRef} className="relative section-gap surface-dark border-y border-border overflow-hidden">
        {/* Parallax Architecture Background with 60% Dark Overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
          <div
            ref={impactBgRef}
            className="absolute -top-[30%] start-0 w-full h-[160%] will-change-transform transition-transform duration-75 ease-out"
            style={{ transform: 'translate3d(0, 0px, 0) scale(1.25)' }}
          >
            <Image
              src="/images/project-private-residence.png"
              alt="Architectural impact background"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority={false}
            />
          </div>
          {/* Exact 60% Dark Tint breaking over the architecture */}
          <div className="absolute inset-0 bg-[#0e0e0c]/60 backdrop-brightness-[0.85]" />
          {/* Subtle radial architectural vignette */}
          <div className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_40%,_#0e0e0c_100%] opacity-60" />
        </div>

        <div className="relative z-10 container-viwan flex flex-col gap-16">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-xl">
              <SectionIndex n={t.studioPage.impactIndex} label={t.studioPage.impactLabel} dark />
              <Display as="h2" size="md" className="text-ivory">
                {t.studioPage.impactHeading}
              </Display>
            </div>
            <p className="text-xs eyebrow text-ivory/70 max-w-xs md:text-right rtl:md:text-left">
              {t.studioPage.impactSub}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.impact.metrics.map((metric, i) => (
              <Reveal
                key={i}
                delay={i * 90}
                className="group p-8 border border-stone/30 bg-[#161614]/75 backdrop-blur-md flex flex-col gap-3 hover:border-gold/60 transition-all duration-500 hover:-translate-y-1 shadow-2xl"
              >
                <CountUp value={metric.value} className="display text-5xl md:text-6xl text-gold font-light" />
                <span className="eyebrow text-sm text-ivory font-medium pt-2 group-hover:text-gold transition-colors duration-300">
                  {metric.label}
                </span>
                <span className="text-xs text-ivory/65 leading-relaxed">
                  {metric.sub}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Reach Interactive Map (Egypt, Saudi Arabia, Syria, etc.) */}
      <RegionalMap />

      {/* Partners & Clients Infinite Marquee */}
      <section className="py-16 md:py-24 bg-background overflow-hidden border-b border-stone/40">
        <div className="container-viwan mb-8 flex items-center justify-between">
          <p className="eyebrow text-gold text-xs">{t.studioPage.trustedBy}</p>
          <span className="eyebrow text-xs text-muted-foreground hidden md:inline">{t.studioPage.markets}</span>
        </div>

        <Marquee speed={25} className="py-4 border-y border-stone/30 bg-secondary/30">
          {CLIENT_PARTNERS.map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center gap-12 font-serif text-xl md:text-2xl tracking-widest text-charcoal/75 uppercase whitespace-nowrap px-4"
            >
              <span>{partner}</span>
              <span className="size-1.5 rounded-full bg-gold/70" />
            </div>
          ))}
        </Marquee>
      </section>

      {/* Materials & Tactility Grid */}
      <section className="section-gap">
        <div className="container-viwan flex flex-col gap-12">
          <div className="flex flex-col gap-3">
            <SectionIndex n={t.studioPage.craftIndex} label={t.studioPage.craftLabel} />
            <Display as="h2" size="lg">
              {t.studioPage.craftHeading}
            </Display>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              {t.studioPage.craftSub}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {materials.map((mat, i) => (
              <Reveal key={i} as="div" className="flex flex-col gap-3 group" delay={i * 70}>
                <div className="relative aspect-square w-full overflow-hidden bg-secondary zoom-img border border-stone/30">
                  <Image
                    src={mat.src}
                    alt={mat.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
                <h4 className="eyebrow text-xs text-charcoal font-medium group-hover:text-gold transition-colors">
                  {mat.title}
                </h4>
                <p className="text-xs text-muted-foreground">{mat.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </main>
  )
}
