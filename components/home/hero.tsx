'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import { ButtonLink, Eyebrow } from '@/components/site/primitives'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings } from '@/hooks/use-site-settings'

export function Hero() {
  const { t, lang } = useLanguage()
  const { getSiteImage } = useSiteSettings()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      src: getSiteImage('home-hero-villa', '/images/hero-villa.png'),
      alt: 'Contemporary villa in stone, glass and wood overlooking an infinity pool at dusk',
    },
    {
      src: getSiteImage('hero-villa-2', '/images/hero-villa-2.jpg'),
      alt: 'Modern desert villa with cantilevered glass volumes and reflective pool at twilight',
    },
    {
      src: getSiteImage('hero-villa-3', '/images/hero-villa-3.jpg'),
      alt: 'Limestone private villa estate with illuminated pool terrace at sunset',
    },
    {
      src: getSiteImage('project-private-residence', '/images/project-private-residence.png'),
      alt: 'Private luxury residence with travertine volumes and integrated landscaping',
    },
    {
      src: getSiteImage('project-hillside-villa', '/images/project-hillside-villa.png'),
      alt: 'Hillside contemporary villa with floating cantilevered terraces',
    },
  ]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [currentSlide, slides.length])

  return (
    <section id="top" className="relative min-h-[100svh] surface-dark overflow-hidden flex flex-col justify-end">
      {/* 5-Slide Auto-Transitioning Background Slideshow */}
      <div className="absolute inset-0 select-none overflow-hidden">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide

          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          )
        })}
      </div>


      {/* Subtle cinematic gradient that keeps the architecture illuminated in both languages */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/35 to-charcoal/10 rtl:bg-gradient-to-l rtl:from-charcoal/75 rtl:via-charcoal/35 rtl:to-charcoal/10 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-charcoal/80 to-transparent pointer-events-none"
        aria-hidden
      />

      {/* Main Hero Content: pt-28 md:pt-36 ensures plenty of breathing room below fixed navbar (88px) */}
      <div className="relative container-viwan w-full h-full flex flex-col justify-end pt-28 md:pt-36 pb-20 md:pb-24">
        <div className="flex flex-col gap-5 sm:gap-6 max-w-3xl">
          <Eyebrow gold className="animate-fade-up">
            {t.hero.eyebrow}
          </Eyebrow>

          <h1
            className={`display text-[clamp(2.35rem,5.2vw,5.2rem)] animate-fade-up [animation-delay:150ms] ${
              lang === 'ar' ? 'leading-[1.15]' : 'leading-[1.02]'
            }`}
          >
            {t.hero.title1}
            {t.hero.title2 && (
              <>
                <br />
                {t.hero.title2}
              </>
            )}
            {t.hero.title3 && (
              <>
                <br />
                {t.hero.title3}
              </>
            )}
          </h1>

          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-ivory/85 animate-fade-up [animation-delay:300ms]">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-2 animate-fade-up [animation-delay:450ms]">
            <ButtonLink href="/projects" variant="solid">
              {t.hero.explore}
            </ButtonLink>
            <ButtonLink href="/consultation" variant="text" className="text-ivory/90 hover:text-gold transition-colors">
              {t.hero.consultation}
            </ButtonLink>
          </div>
        </div>

        {/* Scroll Indicator using logical start property (LTR: left, RTL: right) */}
        <div className="absolute bottom-8 start-[clamp(1.25rem,5vw,5rem)] flex items-center gap-3 eyebrow text-ivory/60 animate-fade-in [animation-delay:900ms]">
          <span className="h-8 w-px bg-ivory/40" aria-hidden />
          <span>{t.hero.scroll}</span>
          <ArrowDown className="size-3 animate-bounce" strokeWidth={1.5} aria-hidden />
        </div>

        {/* Carousel Slide Indicators (Accessible with 44px touch targets) */}
        <div 
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10"
          role="tablist"
          aria-label="Hero slides"
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide
            return (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setCurrentSlide(idx)}
                className="h-11 px-1.5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full group"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-500 ${
                    isActive
                      ? 'w-8 bg-gold'
                      : 'w-2 bg-ivory/30 group-hover:bg-ivory/60 group-hover:w-4'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Brand pillars using logical end property (LTR: right, RTL: left) */}
        <div className="absolute bottom-8 end-[clamp(1.25rem,5vw,5rem)] hidden md:flex flex-col items-end rtl:items-start gap-1 eyebrow text-ivory/60 animate-fade-in [animation-delay:900ms]">
          <span>{t.hero.people}</span>
          <span>{t.hero.places}</span>
          <span className="text-gold">{t.hero.purpose}</span>
        </div>
      </div>
    </section>
  )
}
