"use client"
import { useState, useMemo } from "react"
import { ProjectCard } from "@/components/site/project-card"

export interface Project {
  id: string
  title: string
  category: string
  year: string
  location?: string
  imageSrc: string
  slug: string
  featured?: boolean
  tags?: string[]
}

interface ProjectsSectionProps {
  projects: Project[]
  title?: string
  showFilters?: boolean
}

const ALL = "All"

export function ProjectsSection({
  projects,
  title = "Selected Work",
  showFilters = true,
}: ProjectsSectionProps) {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map(p => p.category)))
    return [ALL, ...cats]
  }, [projects])

  const [active, setActive]   = useState(ALL)
  const [layout, setLayout]   = useState<"grid" | "list">("grid")
  const [visible, setVisible] = useState(8)

  const filtered = useMemo(
    () => active === ALL ? projects : projects.filter(p => p.category === active),
    [active, projects]
  )

  return (
    <section className="viwan-section bg-[var(--black-soft)]">
      <div className="viwan-container">

        {/* ── HEADER ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[var(--gold)] text-[10px] tracking-[0.4em] uppercase mb-3 reveal">Portfolio</p>
            <h2 className="text-fluid-3xl font-light text-white reveal stagger-1" style={{fontFamily:"var(--font-heading)"}}>
              {title}
            </h2>
          </div>
          {/* Layout toggle */}
          <div className="flex items-center gap-2 reveal stagger-2">
            <button onClick={() => setLayout("grid")}
              className={`p-2 transition-colors ${layout==="grid" ? "text-[var(--gold)]" : "text-white/20 hover:text-white/50"}`}
              aria-label="Grid view">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button onClick={() => setLayout("list")}
              className={`p-2 transition-colors ${layout==="list" ? "text-[var(--gold)]" : "text-white/20 hover:text-white/50"}`}
              aria-label="List view">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── FILTERS ─────────────────────────────────── */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-10 reveal">
            {categories.map((cat, i) => (
              <button key={cat} onClick={() => { setActive(cat); setVisible(8) }}
                className={`text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-200 ${
                  active === cat
                    ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5"
                    : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── GRID ────────────────────────────────────── */}
        {layout === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.slice(0, visible).map((p, i) => (
              <div key={p.id} className="reveal" style={{transitionDelay: `${i * 60}ms`}}>
                <ProjectCard
                  title={p.title}
                  category={p.category}
                  year={p.year}
                  location={p.location}
                  imageSrc={p.imageSrc}
                  href={`/projects/${p.slug}`}
                  index={i}
                  featured={i === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="divide-y divide-white/5">
            {filtered.slice(0, visible).map((p, i) => (
              <a key={p.id} href={`/projects/${p.slug}`}
                className="group flex items-center gap-6 py-5 hover:bg-white/2 transition-colors px-2 -mx-2 reveal"
                style={{transitionDelay: `${i * 40}ms`}}>
                {/* Thumbnail */}
                <div className="w-16 h-16 overflow-hidden flex-shrink-0 bg-[var(--surface)]">
                  <img src={p.imageSrc} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-base font-light truncate group-hover:text-[var(--gold)] transition-colors" style={{fontFamily:"var(--font-heading)"}}>  {p.title}</h3>
                  <p className="text-white/40 text-[11px] tracking-wide mt-0.5">{p.category} · {p.location}</p>
                </div>
                {/* Year */}
                <span className="text-white/20 font-mono text-sm flex-shrink-0">{p.year}</span>
                {/* Arrow */}
                <svg className="w-4 h-4 text-white/20 group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* ── LOAD MORE ───────────────────────────────── */}
        {visible < filtered.length && (
          <div className="mt-12 flex justify-center">
            <button onClick={() => setVisible(v => v + 6)}
              className="border border-white/20 text-white/50 text-[11px] tracking-[0.25em] uppercase px-8 py-4 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300">
              Load More ({filtered.length - visible} remaining)
            </button>
          </div>
        )}

        {/* ── EMPTY STATE ─────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-white/20 text-sm">No projects in this category yet.</p>
          </div>
        )}

      </div>
    </section>
  )
}
