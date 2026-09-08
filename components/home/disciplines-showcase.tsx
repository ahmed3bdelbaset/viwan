'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface ShowcaseSlide {
  num: string
  code: string
  titleEn: string
  titleAr: string
  taglineEn: string
  taglineAr: string
  narrativeEn: string
  narrativeAr: string
  locationEn: string
  locationAr: string
  year: string
  image: string
  thumb: string
  href: string
}

const DEFAULT_SLIDES: ShowcaseSlide[] = [
  {
    num: '01',
    code: '01 - 07',
    titleEn: 'ARCHITECTURE',
    titleAr: 'الهندسة المعمارية',
    taglineEn: 'Revolutionising integrated design to create sustainable, timeless architectural masterworks.',
    taglineAr: 'صياغة معمارية متكاملة تدمج الاستدامة البيئية مع الهوية المعمارية الخالدة.',
    narrativeEn: 'Sculptural monolithic volumes, travertine stone cantilevered roofs, and full-height glass compositions seamlessly bridging interior and desert horizons.',
    narrativeAr: 'كتل معمارية متوازنة من الترافيرتين الطبيعي، وأسقف كابولية خرسانية، وواجهات زجاجية ممتدة بارتفاع كامل تطل على فناء مائي عاكس.',
    locationEn: 'New Cairo, Egypt',
    locationAr: 'القاهرة الجديدة، مصر',
    year: '2024',
    image: '/images/service-architecture.jpg',
    thumb: '/images/service-architecture.jpg',
    href: '/services#architecture',
  },
  {
    num: '02',
    code: '02 - 07',
    titleEn: 'INTERIOR DESIGN',
    titleAr: 'التصميم الداخلي',
    taglineEn: 'Bespoke spatial environments blending bookmatched Italian marble, cove lighting, and artisanal joinery.',
    taglineAr: 'فضاءات داخلية مخصصة تجمع بين الرخام الإيطالي والإضاءة المعمارية والأعمال الخشبية الحرفية.',
    narrativeEn: 'Ultra-luxury living spaces crafted with continuous spatial flow, curated bespoke furnishings, and layered ambient illumination.',
    narrativeAr: 'فضاءات معيشة استثنائية بتشطيبات رخامية وأعمال خشبية مصممة خصيصاً تمنح المكان فخامة وهدوءاً.',
    locationEn: 'Sheikh Zayed, Egypt',
    locationAr: 'الشيخ زايد، مصر',
    year: '2024',
    image: '/images/service-interior-design.jpg',
    thumb: '/images/service-interior-design.jpg',
    href: '/services#interior-design',
  },
  {
    num: '03',
    code: '03 - 07',
    titleEn: 'LANDSCAPE ARCHITECTURE',
    titleAr: 'عمارة البيئة واللاندسكيب',
    taglineEn: 'Seamless outdoor living sanctuaries celebrating indigenous flora, reflecting pools, and illuminated terraces.',
    taglineAr: 'ملاذات خارجية فاخرة تحتفي بالنباتات المحلية، والمسابح العاكسة، والتراسات المضاءة.',
    narrativeEn: 'Private botanical sanctuaries harmonizing travertine perimeter walkways, sculptural olive trees, and private infinity waters.',
    narrativeAr: 'حدائق سكنية خاصة تجمع بين النباتات المتوافقة بيئياً، وأروقة الترافيرتين، والمسابح المتماهية مع الأفق.',
    locationEn: 'Katameya Dunes, Egypt',
    locationAr: 'قطامية ديونز، مصر',
    year: '2024',
    image: '/images/service-landscape-design.jpg',
    thumb: '/images/service-landscape-design.jpg',
    href: '/services#landscape',
  },
  {
    num: '04',
    code: '04 - 07',
    titleEn: 'COMMERCIAL LANDMARKS',
    titleAr: 'المشاريع التجارية والأبراج',
    taglineEn: 'Corporate commercial landmarks featuring bioclimatic solar shading louvers and crystalline stone facades.',
    taglineAr: 'مقرات إدارية وصروح تجارية تتميز بكواسر شمسية ذكية وواجهات زجاجية كريستالية متطورة.',
    narrativeEn: 'Corporate headquarters and high-density commercial towers engineered for energy efficiency and commanding skyline presence.',
    narrativeAr: 'صروح تجارية وإدارية أيقونية تعزز حضور العلامات التجارية وتوفر بيئات عمل ذكية ومرنة.',
    locationEn: 'King Fahd Rd, Riyadh, KSA',
    locationAr: 'طريق الملك فهد، الرياض، السعودية',
    year: '2024',
    image: '/images/project-commercial-riyadh.png',
    thumb: '/images/project-commercial-riyadh.png',
    href: '/projects',
  },
  {
    num: '05',
    code: '05 - 07',
    titleEn: 'URBAN MASTERPLANNING',
    titleAr: 'التخطيط والتطوير العمراني',
    taglineEn: 'Holistic masterplans balancing pedestrian connectivity, green lungs, and forward-thinking infrastructures.',
    taglineAr: 'مخططات عمرانية شاملة توازن بين سهولة التنقل، والمساحات الخضراء، والبنى التحتية الذكية.',
    narrativeEn: 'Gated residential enclaves and mixed-use districts prioritizing walkability, microclimates, and sustainable community living.',
    narrativeAr: 'مجمعات سكنية ومناطق متعددة الاستخدامات تعزز الروابط المجتمعية وتلائم حركة المشاة وجودة الحياة.',
    locationEn: 'New Administrative Capital, Egypt',
    locationAr: 'العاصمة الإدارية الجديدة، مصر',
    year: '2024',
    image: '/images/service-urban-design.jpg',
    thumb: '/images/service-urban-design.jpg',
    href: '/services',
  },
  {
    num: '06',
    code: '06 - 07',
    titleEn: 'TURNKEY CONTRACTING',
    titleAr: 'المقاولات المتكاملة والمفتاح باليد',
    taglineEn: 'Flawless on-site construction fidelity, precision MEP integration, and bespoke turnkey handover.',
    taglineAr: 'تنفيذ إنشائي دقيق ومطابقة تامة للمخططات مع تسليم متكامل للمفتاح باليد بأعلى معايير الجودة.',
    narrativeEn: 'End-to-end execution bridging architectural blueprint precision with specialized Italian marble fit-out and site supervision.',
    narrativeAr: 'تنفيذ دقيق لتكسيات الرخام الإيطالي وأعمال التشطيب الشاملة والإشراف الهندسي الميداني المتكامل.',
    locationEn: 'Cairo & Giza Plateau',
    locationAr: 'القاهرة والجيزة',
    year: '2024',
    image: '/images/service-fitout-marble.jpg',
    thumb: '/images/service-fitout-marble.jpg',
    href: '/services',
  },
  {
    num: '07',
    code: '07 - 07',
    titleEn: 'HERITAGE RESTORATION',
    titleAr: 'الترميم وإحياء التراث',
    taglineEn: 'Meticulous preservation of historic stone masonry, ornamental mashrabiya, and timeless regional legacies.',
    taglineAr: 'إحياء أصيل للعمارة الحجرية التاريخية، والمشربيات الخشبية، وصون الإرث المعماري العريق.',
    narrativeEn: 'Adaptive reuse and structural consolidation of historic stone structures, restoring cultural vernacular for future generations.',
    narrativeAr: 'صيانة وترميم الواجهات التراثية والمباني التاريخية الأصيلة بدمشق القديمة والقاهرة التاريخية.',
    locationEn: 'Old Damascus & Historic Cairo',
    locationAr: 'دمشق القديمة والقاهرة التاريخية',
    year: '2024',
    image: '/images/service-project-management.jpg',
    thumb: '/images/service-project-management.jpg',
    href: '/services',
  },
]

const SLIDE_DURATION = 5000 // Exactly 5 seconds per slide as requested

export function DisciplinesShowcase() {
  const { lang } = useLanguage()
  const isAr = lang === 'ar'

  const [slides, setSlides] = useState<ShowcaseSlide[]>(DEFAULT_SLIDES)
  const [activeIndex, setActiveIndex] = useState(0) // Start from 01. ARCHITECTURE
  const [progress, setProgress] = useState(0)
  const touchStartX = useRef<number | null>(null)

  // Fetch updated dynamic images from public settings if customized
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.siteImages && Array.isArray(data.siteImages)) {
          const map = new Map<string, string>()
          data.siteImages.forEach((img: any) => {
            if (img.id && img.currentUrl) map.set(img.id, img.currentUrl)
          })

          setSlides((prev) =>
            prev.map((s, idx) => {
              const keys = [
                'service-architecture',
                'service-interior',
                'service-landscape',
                'project-commercial-riyadh',
                'service-urban',
                'service-fitout',
                'service-management',
              ]
              const customUrl = map.get(keys[idx])
              if (customUrl) {
                return { ...s, image: customUrl, thumb: customUrl }
              }
              return s
            })
          )
        }
      })
      .catch(() => {})
  }, [])

  // Auto-advance every 5 seconds without skipping any slides
  useEffect(() => {
    let start = Date.now()
    setProgress(0)

    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100)
      setProgress(pct)

      if (elapsed >= SLIDE_DURATION) {
        clearInterval(timer)
        setActiveIndex((current) => (current + 1) % slides.length)
      }
    }, 40)

    return () => clearInterval(timer)
  }, [activeIndex, slides.length])

  // Select slide on user click
  const selectSlide = (index: number) => {
    setActiveIndex(index)
    setProgress(0)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        selectSlide((activeIndex + 1) % slides.length)
      } else if (e.key === 'ArrowLeft') {
        selectSlide((activeIndex - 1 + slides.length) % slides.length)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, slides.length])

  const currentSlide = slides[activeIndex] || slides[0]

  return (
    <section
      className="relative min-h-[750px] lg:min-h-[850px] w-full surface-dark overflow-hidden flex flex-col justify-between py-12 lg:py-16 select-none"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const touchEndX = e.changedTouches[0].clientX
        const diff = touchStartX.current - touchEndX
        if (diff > 50) {
          selectSlide((activeIndex + 1) % slides.length)
        } else if (diff < -50) {
          selectSlide((activeIndex - 1 + slides.length) % slides.length)
        }
        touchStartX.current = null
      }}
    >
      {/* Background Slides with Cinematic Crossfade */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, idx) => {
          const isActive = idx === activeIndex
          return (
            <div
              key={s.num}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <Image
                src={s.image}
                alt={s.titleEn}
                fill
                priority={idx === 0 || idx === 1}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          )
        })}

        {/* Ambient Dark Gradients matching Mona Hussein Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/35 to-[#0C0B0A]/70" />
        <div className="absolute inset-0 bg-[#0C0B0A]/25 backdrop-brightness-90" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 container-viwan flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full">
        {/* Giant Architectural Headline */}
        <div className="transition-all duration-700 ease-out">
          <h2 className="display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.06em] text-white font-serif font-light uppercase leading-[1.05] drop-shadow-lg">
            {isAr ? currentSlide.titleAr : currentSlide.titleEn}
          </h2>
        </div>

        {/* Thin Divider Line with Sub-Header and Slide Counter (Matching Mona Hussein Image) */}
        <div className="flex items-center justify-between border-b border-white/30 py-3 sm:py-4 my-4 sm:my-6">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-light tracking-[0.25em] text-white/90 uppercase font-mono">
            <span className="flex flex-col gap-0.5 shrink-0" aria-hidden="true">
              <span className="w-3.5 h-[1.5px] bg-white/90" />
              <span className="w-3.5 h-[1.5px] bg-white/90" />
              <span className="w-3.5 h-[1.5px] bg-white/90" />
            </span>
            <span>{isAr ? 'تخصصات وخدمات استوديو إيوان' : 'Our Services'}</span>
          </div>

          <div className="font-mono text-xs sm:text-sm tracking-widest text-white/90 font-medium">
            {currentSlide.code}
          </div>
        </div>

        {/* Left Narrative / Details */}
        <div className="space-y-3 max-w-xl transition-all duration-700">
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-light leading-relaxed drop-shadow-md">
            {isAr ? currentSlide.taglineAr : currentSlide.taglineEn}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-gold text-xs font-mono">
            <span className="tracking-wider">{isAr ? currentSlide.locationAr : currentSlide.locationEn}</span>
            <span>·</span>
            <span>{currentSlide.year}</span>
            <Link
              href={currentSlide.href}
              className="ms-2 inline-flex items-center gap-1 text-white hover:text-gold transition-colors text-xs font-mono tracking-wider underline underline-offset-4"
            >
              <span>{isAr ? 'استكشف التخصص' : 'Explore Discipline'}</span>
              <ArrowUpRight className="size-3 rtl:-rotate-90" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── BOTTOM THUMBNAIL CAROUSEL WITH LOADING PROGRESS BAR ──────────── */}
      <div className="relative z-10 container-viwan max-w-7xl mx-auto w-full pt-8">
        <div className="flex items-end gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {slides.map((slide, idx) => {
            const isCurrent = idx === activeIndex

            return (
              <button
                key={slide.num}
                type="button"
                onClick={() => selectSlide(idx)}
                className="group flex-shrink-0 flex flex-col text-start cursor-pointer focus:outline-none transition-all"
                aria-label={`Go to slide ${slide.num}: ${slide.titleEn}`}
              >
                {/* Number above thumbnail (01., 02., etc.) */}
                <span
                  className={`font-mono text-[11px] sm:text-xs tracking-wider block mb-1.5 transition-colors ${
                    isCurrent ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white/80'
                  }`}
                >
                  {slide.num}.
                </span>

                {/* Thumbnail Image Box */}
                <div
                  className={`relative aspect-[16/10] w-20 sm:w-24 md:w-28 lg:w-32 overflow-hidden rounded-2xs border transition-all duration-300 ${
                    isCurrent
                      ? 'border-white ring-1 ring-white/60 shadow-lg shadow-black/60 scale-[1.03]'
                      : 'border-white/20 opacity-60 group-hover:opacity-90 group-hover:border-white/50'
                  }`}
                >
                  <img
                    src={slide.thumb}
                    alt={slide.titleEn}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isCurrent ? 'bg-transparent' : 'bg-black/30 group-hover:bg-transparent'
                    }`}
                  />
                </div>

                {/* Loading Progress Bar (Exactly like Mona Hussein reference image) */}
                <div className="h-[2.5px] w-full bg-white/15 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-white transition-[width] duration-75 ease-linear rounded-full"
                    style={{ width: isCurrent ? `${progress}%` : '0%' }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
