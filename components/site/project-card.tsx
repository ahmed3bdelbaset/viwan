"use client"
import { useRef, useState, useCallback } from "react"
import Link from "next/link"
import { mapRange, clamp } from "@/lib/utils"

interface ProjectCardProps {
  title: string
  category: string
  year: string
  location?: string
  imageSrc: string
  href: string
  index?: number
  featured?: boolean
}

export function ProjectCard({
  title,
  category,
  year,
  location,
  imageSrc,
  href,
  index = 0,
  featured = false,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5  // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({
        x: clamp(x * 12, -6, 6),   // max ±6deg
        y: clamp(-y * 12, -6, 6),
      })
    })
  }, [])

  const resetTilt = () => {
    cancelAnimationFrame(rafRef.current)
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  return (
    <Link href={href} className="block group">
      <div
        ref={cardRef}
        className={`relative overflow-hidden bg-[#111] cursor-none ${
          featured ? "aspect-[4/3]" : "aspect-[3/4]"
        }`}
        onMouseMove={prefersReduced ? undefined : handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={resetTilt}
        style={{
          transform: prefersReduced
            ? "none"
            : `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          transition: hovered
            ? "transform 0.1s linear"
            : "transform 0.6s cubic-bezier(0.33,1,0.68,1)",
          willChange: "transform",
        }}
      >
        {/* Image — clip-path reveal on hover */}
        <div
          className="absolute inset-0 transition-all"
          style={{
            clipPath: hovered ? "inset(0 0 0 0)" : "inset(0 0 0 0)",
          }}
        >
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: hovered ? "scale(1.08)" : "scale(1.0)",
            }}
          />
        </div>

        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500"
          style={{ opacity: hovered ? 0.95 : 0.6 }}
        />

        {/* Index number */}
        <div className="absolute top-5 right-5 text-white/20 font-mono text-xs tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <p className="text-[var(--gold)] text-[10px] tracking-[0.35em] uppercase mb-2 transition-all duration-300 group-hover:tracking-[0.45em]">
            {category} · {year}
          </p>
          <h3
            className="text-white font-light text-xl md:text-2xl leading-tight mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h3>
          {location && (
            <p className="text-white/40 text-xs tracking-wide">{location}</p>
          )}

          {/* View arrow — slides in on hover */}
          <div
            className="flex items-center gap-2 mt-4 transition-all duration-400"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateX(0)" : "translateX(-8px)",
            }}
          >
            <span className="text-[var(--gold)] text-[10px] tracking-widest uppercase">View Project</span>
            <svg className="w-4 h-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Below-card info */}
      <div className="pt-4 px-1">
        <h4 className="text-white/80 text-sm group-hover:text-white transition-colors duration-200">{title}</h4>
        <p className="text-white/30 text-[11px] tracking-wide mt-0.5">{category}</p>
      </div>
    </Link>
  )
}
