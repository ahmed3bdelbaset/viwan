"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useScrollProgress } from "@/hooks/use-scroll-progress"
import { cn } from "@/lib/utils"

interface HeroProps {
  headline?: string
  subline?: string
  eyebrow?: string
  imageSrc?: string
  videoSrc?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  stat1?: { value: string; label: string }
  stat2?: { value: string; label: string }
  stat3?: { value: string; label: string }
}

export function Hero({
  headline = "Architecture Redefined",
  subline = "We design spaces that endure — where precision meets vision, and every line carries meaning.",
  eyebrow = "Est. 2015 — Cairo, Egypt",
  imageSrc = "/images/hero.jpg",
  videoSrc,
  ctaPrimary = { label: "Explore Work", href: "/projects" },
  ctaSecondary = { label: "Our Studio", href: "/about" },
  stat1 = { value: "120+", label: "Projects Delivered" },
  stat2 = { value: "15", label: "Years Experience" },
  stat3 = { value: "8", label: "Countries" },
}: HeroProps) {
  const progress = useScrollProgress()
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  const [entered, setEntered] = useState(false)
  const [clipDone, setClipDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setEntered(true)
      setTimeout(() => setClipDone(true), prefersReduced ? 0 : 1200)
    }, prefersReduced ? 0 : 300)
    return () => clearTimeout(t)
  }, [])

  // Parallax: image shifts up on scroll
  const parallaxY = prefersReduced ? 0 : progress * 120

  return (
    <section className="relative h-screen min-h-[600px] max-h-[1100px] overflow-hidden flex items-end">
      {/* Background Media — clip-path reveal */}
      <div
        className="absolute inset-0 transition-all"
        style={{
          clipPath: entered
            ? "inset(0 0 0 0)"
            : "inset(0 0 100% 0)",
          transitionDuration: prefersReduced ? "0ms" : "1200ms",
          transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)",
          transitionProperty: "clip-path",
        }}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${parallaxY}px) scale(1.08)` }}
          />
        ) : (
          <img
            src={imageSrc}
            alt="VIWAN Architecture Hero"
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${parallaxY}px) scale(1.08)`, transition: "transform 0.1s linear" }}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Eyebrow line — horizontal rule + text */}
      <div
        className={cn(
          "absolute top-[88px] left-0 right-0 flex items-center gap-4 viwan-container transition-all duration-700",
          entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
        style={{ transitionDelay: prefersReduced ? "0ms" : "800ms" }}
      >
        <span className="flex-1 max-w-[60px] h-px bg-[var(--gold)]/40" />
        <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-mono">
          {eyebrow}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 viwan-container pb-16 md:pb-24">
        <div className="max-w-[780px]">
          {/* Headline — kinetic clip-path reveal per line */}
          <h1
            className="font-light text-white mb-6 overflow-hidden"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.8rem, 7vw, 7rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {headline.split("\n").map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <span
                  className="block transition-transform"
                  style={{
                    transform: entered ? "translateY(0)" : "translateY(110%)",
                    transitionDuration: prefersReduced ? "0ms" : "900ms",
                    transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)",
                    transitionDelay: prefersReduced ? "0ms" : `${600 + i * 120}ms`,
                  }}
                >
                  {i === 1 ? (
                    <em className="not-italic text-[var(--gold)]">{line}</em>
                  ) : line}
                </span>
              </span>
            ))}
          </h1>

          {/* Subline */}
          <p
            className="text-white/60 mb-10 max-w-[520px] leading-relaxed transition-all duration-700"
            style={{
              fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(12px)",
              transitionDelay: prefersReduced ? "0ms" : "950ms",
            }}
          >
            {subline}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 transition-all duration-700"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(12px)",
              transitionDelay: prefersReduced ? "0ms" : "1050ms",
            }}
          >
            <Link
              href={ctaPrimary.href}
              className="group inline-flex items-center gap-3 bg-[var(--gold)] text-black px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-white transition-colors duration-300"
            >
              {ctaPrimary.label}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={ctaSecondary.href}
              className="inline-flex items-center gap-3 border border-white/30 text-white/70 px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-white/60 hover:text-white transition-all duration-300"
            >
              {ctaSecondary.label}
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="mt-16 pt-8 border-t border-white/10 grid grid-cols-3 gap-8 max-w-[480px] transition-all duration-700"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "translateY(16px)",
            transitionDelay: prefersReduced ? "0ms" : "1150ms",
          }}
        >
          {[stat1, stat2, stat3].map(({ value, label }) => (
            <div key={label}>
              <p className="text-[var(--gold)] text-2xl font-light" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2 transition-all duration-700"
        style={{ opacity: entered && !progress ? 1 : 0 }}
        aria-hidden
      >
        <span className="text-white/30 text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <span className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-[scrollPulse_2s_ease-in-out_infinite]" />
      </div>
    </section>
  )
}
