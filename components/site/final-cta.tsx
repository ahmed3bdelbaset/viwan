'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { ButtonLink, Display, Eyebrow } from './primitives'
import { Reveal } from './reveal'
import { useLanguage } from '@/lib/i18n'

export function FinalCta({
  eyebrow,
  title,
  primary,
  secondary,
  imageSrc = '/images/material-stone.png',
  parallax = true,
}: {
  eyebrow?: string
  title?: React.ReactNode
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string } | null
  imageSrc?: string
  parallax?: boolean
}) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  const finalEyebrow = eyebrow ?? t.finalCta.eyebrow
  const finalTitle = title ?? t.finalCta.title
  const finalPrimary = primary ?? { label: t.finalCta.consultation, href: '/consultation' }
  const finalSecondary =
    secondary === undefined ? { label: t.finalCta.startProject, href: '/contact' } : secondary

  useEffect(() => {
    if (!parallax) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let animId: number

    const updateParallax = () => {
      if (!sectionRef.current || !bgRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const winHeight = window.innerHeight

      // If section is approaching or in viewport
      if (rect.bottom > -150 && rect.top < winHeight + 150) {
        const sectionCenter = rect.top + rect.height / 2
        const viewportCenter = winHeight / 2
        const diff = sectionCenter - viewportCenter
        // Fluid, tangible parallax motion (moves as user scrolls up/down)
        const translateY = -diff * 0.35
        bgRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(1.25)`
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
  }, [parallax])

  return (
    <section ref={sectionRef} className="relative surface-dark overflow-hidden select-none">
      {/* Parallax Stone Texture Background Container */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
        <div
          ref={bgRef}
          className="absolute -top-[25%] start-0 w-full h-[150%] will-change-transform transition-transform duration-75 ease-out"
          style={{ transform: 'translate3d(0, 0px, 0) scale(1.25)' }}
        >
          <Image
            src={imageSrc}
            alt="Architectural Stone Texture"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-25 mix-blend-luminosity brightness-95 contrast-125"
            aria-hidden
            priority={false}
          />
        </div>
        {/* Luxury Vignette & Dark Tint for perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0B0A]/85 via-[#0C0B0A]/50 to-[#0C0B0A]/90 pointer-events-none" />
        {/* Architectural Ultra-Fine Drafting Grid Overlay */}
        <div className="pointer-events-none absolute inset-0 architectural-hairline-grid-dark opacity-45 z-[1]" />
      </div>

      <div className="relative z-10 container-viwan section-gap flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <Reveal className="flex flex-col gap-6">
          <Eyebrow gold>{finalEyebrow}</Eyebrow>
          <Display size="lg" className="text-ivory font-serif font-light">{finalTitle}</Display>
        </Reveal>
        <Reveal delay={150} className="flex flex-col sm:flex-row gap-4">
          <ButtonLink href={finalPrimary.href} variant="solid">
            {finalPrimary.label}
          </ButtonLink>
          {finalSecondary && (
            <ButtonLink href={finalSecondary.href} variant="outline">
              {finalSecondary.label}
            </ButtonLink>
          )}
        </Reveal>
      </div>
    </section>
  )
}


