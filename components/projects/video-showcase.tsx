'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Play, X, ExternalLink, Film, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { DEFAULT_YOUTUBE_VIDEOS, YouTubeVideo, getYouTubeEmbedUrl } from '@/lib/youtube'

interface VideoItem {
  id: string
  titleEn: string
  titleAr: string
  youtubeUrl: string
  videoId: string
  categoryEn?: string
  categoryAr?: string
  thumbnailUrl?: string
  order?: number
}

export function ProjectsVideoShowcase({ initialVideos }: { initialVideos?: VideoItem[] }) {
  const { lang } = useLanguage()
  const isAr = lang === 'ar'

  const [videos, setVideos] = useState<VideoItem[]>(initialVideos || DEFAULT_YOUTUBE_VIDEOS)
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({})

  // Fetch updated videos from the API
  useEffect(() => {
    let isMounted = true
    async function fetchVideos() {
      try {
        const res = await fetch('/api/public/videos', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (isMounted && Array.isArray(data.videos) && data.videos.length > 0) {
            setVideos(data.videos)
          }
        }
      } catch (err) {
        console.error('Failed to load public videos:', err)
      }
    }
    fetchVideos()
    return () => {
      isMounted = false
    }
  }, [])

  // Handle ESC key to close modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveVideo(null)
    }
  }, [])

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeVideo, handleKeyDown])

  if (!videos || videos.length === 0) {
    return null
  }

  return (
    <section
      id="architectural-cinematography"
      className="relative bg-[#0D0C0A] text-ivory py-20 sm:py-28 border-t border-stone/20 overflow-hidden"
      aria-labelledby="video-showcase-heading"
    >
      {/* Subtle Background Lighting Accent */}
      <div
        className="absolute top-0 start-1/4 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 end-1/4 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2"
        aria-hidden="true"
      />

      <div className="container-viwan relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-xs mb-4">
            <Film className="size-3.5 text-gold" strokeWidth={1.75} />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gold">
              {isAr ? 'التوثيق السينمائي والجولات المرئية' : 'CINEMATOGRAPHY & MEDIA'}
            </span>
          </div>

          <h2
            id="video-showcase-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ivory tracking-tight leading-[1.15] mb-5"
          >
            {isAr
              ? 'أفلام المشاريع والجولات المعمارية'
              : 'Architectural Films & Spatial Walkthroughs'}
          </h2>

          <p className="text-sm sm:text-base text-ivory/70 leading-relaxed max-w-2xl font-light">
            {isAr
              ? 'انغمس في التجربة المكانية لمشاريعنا عبر جولات فيديو سينمائية توثق حركة الضوء الطبيعي، تفاصيل الخامات، ودقة التنفيذ على أرض الواقع.'
              : 'Immerse yourself in our spatial narratives through high-fidelity cinematic video tours showcasing natural illumination, material palettes, and built precision.'}
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map((video, idx) => {
            const title = isAr ? video.titleAr || video.titleEn : video.titleEn || video.titleAr
            const category = isAr
              ? video.categoryAr || video.categoryEn || 'جولة معمارية'
              : video.categoryEn || video.categoryAr || 'Architectural Tour'

            const hasError = imageErrorMap[video.id]
            const thumbSrc = hasError
              ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
              : video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`

            return (
              <article
                key={video.id}
                className="group relative flex flex-col bg-[#141311] border border-white/10 hover:border-gold/60 transition-all duration-500 rounded-xs overflow-hidden shadow-xl hover:-translate-y-1.5"
              >
                {/* Thumbnail Container with Play Trigger */}
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  aria-label={`${isAr ? 'تشغيل الفيديو' : 'Play video'}: ${title}`}
                  className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900 cursor-pointer text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Image
                    src={thumbSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={() => {
                      setImageErrorMap((prev) => ({ ...prev, [video.id]: true }))
                    }}
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 group-hover:via-black/20 transition-colors duration-500" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3.5 start-3.5 z-10">
                    <span className="inline-block px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/15 text-gold text-[10px] sm:text-[11px] font-mono uppercase tracking-wider rounded-xs">
                      {category}
                    </span>
                  </div>

                  {/* High Quality Tag */}
                  <div className="absolute top-3.5 end-3.5 z-10">
                    <span className="inline-block px-2 py-0.5 bg-gold/90 text-charcoal text-[9px] font-bold tracking-widest uppercase rounded-xs">
                      4K UHD
                    </span>
                  </div>

                  {/* Centered Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative size-14 sm:size-16 rounded-full bg-charcoal/80 border border-gold/70 text-gold flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-charcoal group-hover:border-gold">
                      {/* Outer subtle glow ring */}
                      <div className="absolute inset-0 rounded-full border border-gold/40 group-hover:animate-ping opacity-60 pointer-events-none" />
                      <Play className="size-6 sm:size-7 ms-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Bottom Play prompt indicator on thumbnail */}
                  <div className="absolute bottom-3 start-4 end-4 flex items-center justify-between text-xs text-ivory/80 pointer-events-none">
                    <span className="font-mono text-[10px] tracking-widest text-gold uppercase flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-gold animate-pulse" />
                      {isAr ? 'مشاهدة الجولة' : 'WATCH TOUR'}
                    </span>
                    <span className="text-[10px] font-mono text-ivory/60">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </button>

                {/* Card Information Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-[#141311]">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl text-ivory group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-snug mb-3">
                      {title}
                    </h3>
                  </div>

                  <div className="pt-4 mt-auto border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      className="text-xs font-semibold text-gold group-hover:text-ivory transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isAr ? 'فتح المشغل' : 'Play Showcase'}</span>
                      {isAr ? <ChevronLeft className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                    </button>

                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ivory/50 hover:text-gold transition-colors p-1"
                      title={isAr ? 'فتح على YouTube' : 'Open on YouTube'}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Interactive Lightbox Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#11110F] border border-stone-700 shadow-2xl rounded-xs overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#161513]">
              <div className="flex items-center gap-3 pe-4 min-w-0">
                <span className="size-2 rounded-full bg-gold animate-pulse shrink-0" />
                <h3
                  id="video-modal-title"
                  className="font-serif text-base sm:text-lg text-ivory truncate"
                >
                  {isAr
                    ? activeVideo.titleAr || activeVideo.titleEn
                    : activeVideo.titleEn || activeVideo.titleAr}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-ivory/80 hover:text-gold border border-white/15 hover:border-gold/60 rounded-xs transition-colors"
                >
                  <span>YouTube</span>
                  <ExternalLink className="size-3" />
                </a>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  aria-label={isAr ? 'إغلاق الفيديو' : 'Close video'}
                  className="size-9 flex items-center justify-center rounded-xs bg-white/5 hover:bg-gold text-ivory hover:text-charcoal transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Embedded Responsive YouTube Player */}
            <div className="relative aspect-[16/9] w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.videoId, true)}
                title={isAr ? activeVideo.titleAr : activeVideo.titleEn}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Modal Footer / Description Bar */}
            <div className="px-5 py-3.5 bg-[#161513] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-ivory/70">
              <div className="flex items-center gap-3">
                <span className="text-gold font-mono text-[11px] uppercase tracking-wider">
                  {isAr
                    ? activeVideo.categoryAr || activeVideo.categoryEn || 'توثيق معماري'
                    : activeVideo.categoryEn || activeVideo.categoryAr || 'Architectural Film'}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-ivory/60">VIWAN ARCHITECTURAL ARCHIVE</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="text-ivory/80 hover:text-gold transition-colors font-medium cursor-pointer"
              >
                {isAr ? 'إغلاق المشغل' : 'Close Player'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
