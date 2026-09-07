'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { SectionIndex, Display } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { useLanguage } from '@/lib/i18n'
import {
  LTR_MAP_PATHS,
  RTL_MAP_PATHS,
  LTR_PINS,
  RTL_PINS,
} from '@/lib/data/map-paths'

export interface CountryProjectData {
  id: 'egypt' | 'saudi' | 'syria'
  iso: string
  nameEn: string
  nameAr: string
  hubEn: string
  hubAr: string
  projectsCount: number
  descriptionEn: string
  descriptionAr: string
  disciplines: { en: string; ar: string }[]
}

export const COUNTRIES_DATA: CountryProjectData[] = [
  {
    id: 'egypt',
    iso: '818',
    nameEn: 'Egypt',
    nameAr: 'مصر',
    hubEn: 'Cairo & New Cairo · Main Headquarters',
    hubAr: 'القاهرة والقاهرة الجديدة · المقر الرئيسي',
    projectsCount: 28,
    descriptionEn:
      'Main headquarters delivering 28+ luxury residences, commercial headquarters, and integrated masterplans across New Cairo, Katameya, and the Red Sea.',
    descriptionAr:
      'المقر الرئيسي للاستشارات الهندسية وتصميم الفيلات الفاخرة والمشاريع المتكاملة، أنجزنا أكثر من 28 مشروعاً مميزاً بالقاهرة الجديدة والقطامية والعين السخنة.',
    disciplines: [
      { en: 'Integrated Architecture', ar: 'عمارة متكاملة' },
      { en: 'Bespoke Interiors', ar: 'تصميم داخلي فاخر' },
      { en: 'Landscape Masterplans', ar: 'تنسيق مواقع ولاندسكيب' },
      { en: 'Full BIM Coordination', ar: 'إدارة وتنسيق الـ BIM' },
    ],
  },
  {
    id: 'saudi',
    iso: '682',
    nameEn: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    hubEn: 'Riyadh & Diriyah · Regional Office',
    hubAr: 'الرياض والدرعية · المكتب الإقليمي',
    projectsCount: 14,
    descriptionEn:
      'Regional office delivering 14+ bespoke private palaces, villa compounds, and contemporary Najdi landscape masterplans across Riyadh.',
    descriptionAr:
      'المكتب الإقليمي بالمملكة لإنجاز 14+ قصراً خاصاً ومجمعاً سكنياً يجمع بين أصالة الهوية النجدية وأحدث مفاهيم المعمار المعاصر.',
    disciplines: [
      { en: 'Palace Architecture', ar: 'عمارة القصور والفيلات' },
      { en: 'Luxury Fit-Out', ar: 'تشطيب وتصميم داخلي' },
      { en: 'Arid Landscapes', ar: 'لاندسكيب بيئي معاصر' },
      { en: 'Site Supervision', ar: 'إشراف هندسي وتنسيق' },
    ],
  },
  {
    id: 'syria',
    iso: '760',
    nameEn: 'Syria',
    nameAr: 'سوريا',
    hubEn: 'Damascus & Latakia · Architectural Heritage',
    hubAr: 'دمشق واللاذقية · عمارة وتراث',
    projectsCount: 6,
    descriptionEn:
      'Delivering 6 landmark private estates, courtyard heritage restorations, and coastal luxury villas celebrating stone craftsmanship.',
    descriptionAr:
      'إنجاز 6 مشاريع خاصة متميزة تشمل فيلات سكنية فاخرة، وترميم وتطوير الأفنية المعمارية التراثية وحرفية الحجر الطبيعي.',
    disciplines: [
      { en: 'Heritage Stone Craft', ar: 'عمارة الحجر والتراث' },
      { en: 'Courtyard Estates', ar: 'تصميم الأفنية والقصور' },
      { en: 'Private Villas', ar: 'فيلات سكنية خاصة' },
      { en: 'Structural Detailing', ar: 'دراسات إنشائية وتفاصيل' },
    ],
  },
]

export function RegionalMap() {
  const { lang } = useLanguage()
  const [selectedId, setSelectedId] = useState<'egypt' | 'saudi' | 'syria'>('egypt')

  const active = COUNTRIES_DATA.find((c) => c.id === selectedId) || COUNTRIES_DATA[0]

  // Live Typewriter Effect for dynamic architectural specification drafting
  const [typedDescription, setTypedDescription] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const targetDescription = lang === 'ar' ? active.descriptionAr : active.descriptionEn

  useEffect(() => {
    setTypedDescription('')
    setIsTyping(true)
    let charIdx = 0
    const timer = setInterval(() => {
      charIdx++
      setTypedDescription(targetDescription.slice(0, charIdx))
      if (charIdx >= targetDescription.length) {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 18)

    return () => clearInterval(timer)
  }, [targetDescription, selectedId, lang])

  // Select LTR or RTL projected world map paths
  const countryPaths = lang === 'ar' ? RTL_MAP_PATHS : LTR_MAP_PATHS
  const pins = lang === 'ar' ? RTL_PINS : LTR_PINS

  const pinMarkers = useMemo(() => {
    return COUNTRIES_DATA.map((c) => {
      const coords = pins[c.id]
      return {
        ...c,
        x: coords.x,
        y: coords.y,
      }
    })
  }, [pins])

  // Mobile focused viewBox: Close-up zoom on Egypt, Saudi Arabia, and Syria (MENA core)
  const mobileViewBox = lang === 'ar' ? '315 205 140 160' : '445 205 140 160'

  // Common SVG Map Renderer with Refined Architectural Micro-Beacons
  const renderMapSvg = (isMobile: boolean) => (
    <svg
      viewBox={isMobile ? mobileViewBox : '0 0 800 600'}
      className="w-full h-full select-none pointer-events-auto block"
      style={{ shapeRendering: 'geometricPrecision' }}
    >
      <defs>
        <filter id={`gold-glow-${isMobile ? 'm' : 'd'}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy={isMobile ? 1.5 : 5}
            stdDeviation={isMobile ? 1.8 : 5}
            floodColor="#C5A880"
            floodOpacity="0.4"
          />
        </filter>
        <filter id={`pin-shadow-${isMobile ? 'm' : 'd'}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy={isMobile ? 0.8 : 2}
            stdDeviation={isMobile ? 1 : 3}
            floodColor="#181715"
            floodOpacity="0.25"
          />
        </filter>
      </defs>

      {/* All Countries Polygons */}
      <g className="rsm-geographies">
        {countryPaths.map((country, idx) => {
          const matched = COUNTRIES_DATA.find((c) => c.iso === country.id)
          const isSelected = matched?.id === selectedId
          const isWorkedCountry = Boolean(matched)

          let fill = '#E7DEC9'
          let stroke = '#D7CCA8'
          let strokeWidth = isMobile ? 0.25 : 0.45
          let cursor = 'default'
          let filter = 'none'

          if (isSelected) {
            fill = '#C5A880'
            stroke = '#181715'
            strokeWidth = isMobile ? 0.65 : 1.2
            cursor = 'pointer'
            filter = `url(#gold-glow-${isMobile ? 'm' : 'd'})`
          } else if (isWorkedCountry) {
            fill = '#DFD3BF'
            stroke = '#C5A88090'
            strokeWidth = isMobile ? 0.45 : 0.8
            cursor = 'pointer'
          }

          return (
            <path
              key={`${country.id}-${idx}`}
              d={country.d}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              filter={filter}
              onClick={() => {
                if (matched) {
                  setSelectedId(matched.id)
                }
              }}
              style={{
                outline: 'none',
                cursor,
                transition:
                  'fill 400ms cubic-bezier(0.16,1,0.3,1), stroke 400ms ease, transform 300ms ease',
              }}
              className={`transition-all duration-400 ${
                isWorkedCountry ? 'hover:opacity-95 hover:brightness-105 active:scale-[0.995]' : ''
              }`}
            >
              <title>{country.name}</title>
            </path>
          )
        })}
      </g>

      {/* Refined Architectural Coordinate Beacons (Proportioned to Viewport) */}
      <g className="rsm-markers pointer-events-auto">
        {pinMarkers.map((pin) => {
          const isSelected = pin.id === selectedId

          return (
            <g key={pin.id} className="transition-all duration-500">
              {isSelected ? (
                // Active Coordinate Beacon: Delicate Dual-Ring Glow + Micro-Badge
                <g
                  transform={`translate(${pin.x}, ${pin.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedId(pin.id)}
                >
                  {/* Subtle, slow outer radar pulse */}
                  <circle
                    r={isMobile ? 5 : 11}
                    fill="#C5A880"
                    opacity="0.3"
                    className="animate-ping"
                    style={{ animationDuration: '2.8s' }}
                  />
                  <circle
                    r={isMobile ? 3.5 : 7}
                    fill="#C5A880"
                    opacity="0.22"
                  />

                  {/* Sleek precision coordinate core */}
                  <circle
                    r={isMobile ? 2.2 : 4.25}
                    fill="#181715"
                    stroke="#C5A880"
                    strokeWidth={isMobile ? 0.8 : 1.5}
                    filter={`url(#pin-shadow-${isMobile ? 'm' : 'd'})`}
                  />
                  <circle
                    r={isMobile ? 0.9 : 1.8}
                    fill="#C5A880"
                  />

                  {/* Micro-badge pill: Compact, slender, and elegant */}
                  <g
                    transform={`translate(0, ${isMobile ? -8 : -15})`}
                    className="pointer-events-none"
                  >
                    <rect
                      x={lang === 'ar' ? (isMobile ? -18 : -34) : (isMobile ? -22 : -40)}
                      y={isMobile ? -4.5 : -8}
                      width={lang === 'ar' ? (isMobile ? 36 : 68) : (isMobile ? 44 : 80)}
                      height={isMobile ? 9 : 16}
                      rx={isMobile ? 4.5 : 8}
                      fill="#181715"
                      stroke="#C5A880"
                      strokeWidth={isMobile ? 0.5 : 0.75}
                      opacity="0.95"
                      filter={`url(#pin-shadow-${isMobile ? 'm' : 'd'})`}
                    />
                    <text
                      x="0"
                      y={isMobile ? 2 : 3.5}
                      fill="#FAF8F5"
                      fontSize={isMobile ? 4.2 : 8.5}
                      fontFamily="var(--font-serif), serif"
                      fontWeight="500"
                      letterSpacing="0.04em"
                      textAnchor="middle"
                    >
                      {lang === 'ar' ? pin.nameAr : pin.nameEn} · {pin.projectsCount}+
                    </text>
                  </g>
                </g>
              ) : (
                // Inactive Coordinate Dot: Clean, elegant blueprint marker
                <g
                  transform={`translate(${pin.x}, ${pin.y})`}
                  onClick={() => setSelectedId(pin.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isMobile ? 2.2 : 4.25}
                    fill="#FAF8F5"
                    stroke="#C5A880"
                    strokeWidth={isMobile ? 0.75 : 1.25}
                    className="group-hover:scale-125 transition-transform duration-300"
                    filter={`url(#pin-shadow-${isMobile ? 'm' : 'd'})`}
                  />
                  <circle
                    r={isMobile ? 0.9 : 1.8}
                    fill="#8C7355"
                    className="group-hover:fill-gold transition-colors duration-300"
                  />
                </g>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )

  return (
    <section className="relative bg-[#FAF8F5] dark:bg-[#12110F] text-charcoal dark:text-ivory overflow-hidden border-b border-stone/30 transition-colors duration-500">
      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< md) with Harmonious Spacing & Sleek Micro-Beacons         */}
      {/* ========================================================================= */}
      <div className="md:hidden flex flex-col w-full">
        {/* Top Header & Title */}
        <div className="container-viwan pt-14 pb-3 flex flex-col gap-2.5">
          <SectionIndex
            n="03"
            label={lang === 'ar' ? 'التواجد الإقليمي' : 'REGIONAL REACH'}
          />
          <Display
            as="h2"
            size="lg"
            className="text-charcoal dark:text-ivory leading-tight font-serif text-[clamp(1.75rem,5.5vw,2.2rem)] text-balance"
          >
            {lang === 'ar'
              ? 'عمارة واستشارات هندسية تمتد عبر أبرز أسواق المنطقة'
              : 'Throughout our journey, we have delivered landmark spaces across key regional territories'}
          </Display>
          <p className="text-xs text-charcoal/70 dark:text-ivory/70 leading-relaxed text-pretty">
            {lang === 'ar'
              ? 'اختر الدولة لاستعراض نطاق المشاريع ومقار الاستشارات الهندسية المنجزة.'
              : 'Select a territory to review our delivered architectural scope.'}
          </p>
        </div>

        {/* Unified Segmented Selector */}
        <div className="w-full px-4 sm:px-6 py-2">
          <div
            className="flex items-center p-1 bg-[#ECE5D7] dark:bg-[#1D1B18] border border-stone/30 rounded-xs w-full gap-1"
            role="tablist"
            aria-label="Select Country"
          >
            {COUNTRIES_DATA.map((country) => {
              const isSelected = country.id === selectedId
              const name = lang === 'ar' ? country.nameAr : country.nameEn

              return (
                <button
                  key={country.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(country.id)}
                  className={`flex-1 min-h-[38px] flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer rounded-2xs select-none focus-visible:ring-1 focus-visible:ring-gold ${
                    isSelected
                      ? 'bg-charcoal text-ivory border border-gold/40 shadow-xs'
                      : 'text-charcoal/75 dark:text-ivory/75 hover:text-charcoal dark:hover:text-ivory'
                  }`}
                >
                  <span className="font-serif truncate">{name}</span>
                  <span className="text-[10px] text-gold font-mono">
                    {country.projectsCount}+
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Interactive Map */}
        <div className="relative w-full h-[54vh] min-h-[380px] max-h-[480px] my-2 overflow-hidden bg-[#F4EFE6] dark:bg-[#181613]">
          {/* Soft ambient fades */}
          <div className="pointer-events-none absolute top-0 inset-x-0 z-[2] h-10 bg-gradient-to-b from-[#FAF8F5] dark:from-[#12110F] to-transparent" />
          <div className="pointer-events-none absolute bottom-0 inset-x-0 z-[2] h-10 bg-gradient-to-t from-[#FAF8F5] dark:from-[#12110F] to-transparent" />
          
          {/* Subtle blueprint grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#181715_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* SVG Map */}
          {renderMapSvg(true)}

          {/* Floating Mobile Tap Hint */}
          <div className="absolute bottom-2.5 start-3.5 z-10 flex items-center gap-2 text-[10px] eyebrow text-charcoal/70 dark:text-ivory/70 bg-white/85 dark:bg-charcoal/85 px-2.5 py-1 rounded-2xs border border-stone/30 backdrop-blur-xs">
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            <span>{lang === 'ar' ? 'المس الدولة للاستكشاف' : 'Tap territory to explore'}</span>
          </div>
        </div>

        {/* Active Country Detail Card with Rich Obsidian Styling & Live Typewriter Effect */}
        <div className="container-viwan pt-1 pb-12">
          <div className="p-5 bg-[#161513] text-ivory border border-gold/30 shadow-[0_16px_40px_rgba(0,0,0,0.35)] flex flex-col gap-3.5 relative overflow-hidden rounded-xs animate-fade-in">
            <div className="absolute -top-10 -end-10 size-24 bg-gold/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-gold/15 border border-gold/35 flex items-center justify-center shrink-0">
                  <MapPin className="size-3.5 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-white tracking-tight leading-tight">
                    {lang === 'ar' ? active.nameAr : active.nameEn}
                  </h4>
                  <p className="text-[10px] eyebrow text-gold/90 uppercase tracking-wider mt-0.5">
                    {lang === 'ar' ? active.hubAr : active.hubEn}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-2xl font-serif text-gold font-light tabular-nums leading-none">
                  {active.projectsCount}+
                </span>
                <span className="text-[9px] eyebrow text-ivory/60 mt-1 uppercase tracking-widest">
                  {lang === 'ar' ? 'مشروع منجز' : 'Delivered'}
                </span>
              </div>
            </div>

            {/* Live Typewriter Animated Description */}
            <div className="min-h-[52px] flex items-start">
              <p className="text-xs leading-relaxed text-ivory/90 font-sans font-light">
                {typedDescription}
                {isTyping && (
                  <span
                    className="inline-block w-[2px] h-[12px] ms-1 bg-gold animate-pulse align-middle"
                    aria-hidden="true"
                  />
                )}
              </p>
            </div>

            {/* Fluid Discipline Pills (No truncation or ellipsis) */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {active.disciplines.map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.05] border border-white/10 rounded-2xs text-[10.5px] eyebrow text-ivory/85"
                >
                  <span className="size-1 rounded-full bg-gold shrink-0" />
                  <span className="whitespace-normal leading-tight">{lang === 'ar' ? d.ar : d.en}</span>
                </div>
              ))}
            </div>

            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] eyebrow text-ivory/50 uppercase tracking-wider">
                {lang === 'ar' ? 'سجل الأعمال' : 'PORTFOLIO'}
              </span>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-white transition-colors eyebrow group font-medium"
              >
                <span>{lang === 'ar' ? 'عرض المشاريع' : 'View Projects'}</span>
                <ArrowUpRight className="size-3.5 rtl:rotate-[-90deg] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (md+) with Balanced Proportions & Color Harmony            */}
      {/* ========================================================================= */}
      <div className="hidden md:flex relative w-full items-center min-h-[660px] lg:min-h-[720px] xl:min-h-[760px] pt-28 lg:pt-32 pb-16 lg:pb-20">
        {/* Top & Bottom ambient gradient fades */}
        <div
          className="pointer-events-none absolute top-0 inset-x-0 z-[2] h-32 lg:h-44 bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent dark:from-[#12110F] dark:via-[#12110F]/85 dark:to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 z-[2] h-32 lg:h-44 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent dark:from-[#12110F] dark:via-[#12110F]/85 dark:to-transparent"
          aria-hidden="true"
        />

        {/* Subtle architectural coordinate grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] pointer-events-none bg-[radial-gradient(#181715_1px,transparent_1px)] dark:bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:28px_28px]"
          aria-hidden="true"
        />

        {/* Full-bleed background map container */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          {renderMapSvg(false)}
        </div>

        {/* Floating Architectural Content Panel with Harmonious Space Allocation */}
        <div className="relative z-10 container-viwan w-full flex items-center justify-start rtl:justify-end pointer-events-none">
          <div className="pointer-events-auto md:w-[44%] lg:w-[38%] xl:w-[34%] max-w-[440px] flex flex-col gap-4">
            <Reveal className="flex flex-col gap-2.5">
              <SectionIndex
                n="03"
                label={lang === 'ar' ? 'التواجد الإقليمي' : 'REGIONAL REACH'}
              />
              <Display
                as="h2"
                size="lg"
                className="text-charcoal dark:text-ivory leading-tight font-serif text-[clamp(1.7rem,2.4vw,2.25rem)] text-balance"
              >
                {lang === 'ar'
                  ? 'عمارة واستشارات هندسية تمتد عبر أبرز أسواق المنطقة'
                  : 'Throughout our journey, we have delivered landmark spaces across key regional territories'}
              </Display>
              <p className="text-xs text-charcoal/70 dark:text-ivory/70 leading-relaxed text-pretty">
                {lang === 'ar'
                  ? 'اختر الدولة لتحديد المكاتب ونطاق المشاريع المنجزة في مصر والمملكة العربية السعودية وسوريا.'
                  : 'Select a territory from the controls or directly on the map to review our delivered architectural scope.'}
              </p>
            </Reveal>

            {/* Apple-Style Unified Segmented Control */}
            <div
              className="flex items-center p-1 bg-[#ECE5D7] dark:bg-[#1D1B18] border border-stone/30 rounded-xs w-full gap-1 shadow-2xs"
              role="tablist"
              aria-label="Select Country"
            >
              {COUNTRIES_DATA.map((country) => {
                const isSelected = country.id === selectedId
                const name = lang === 'ar' ? country.nameAr : country.nameEn

                return (
                  <button
                    key={country.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedId(country.id)}
                    className={`flex-1 min-h-[38px] flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer rounded-2xs select-none focus-visible:ring-1 focus-visible:ring-gold ${
                      isSelected
                        ? 'bg-charcoal text-ivory border border-gold/40 shadow-xs'
                        : 'text-charcoal/75 dark:text-ivory/75 hover:text-charcoal dark:hover:text-ivory hover:bg-white/40'
                    }`}
                  >
                    <span className="font-serif truncate">{name}</span>
                    <span className="text-[10px] text-gold font-mono">
                      {country.projectsCount}+
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Compact, Luxury Architectural Detail Card (Rich Obsidian & Typewriter Effect) */}
            <div className="p-5 sm:p-6 bg-[#161513] text-ivory border border-gold/30 shadow-[0_16px_48px_rgba(0,0,0,0.35)] flex flex-col gap-3.5 animate-fade-in relative overflow-hidden rounded-xs">
              <div className="absolute -top-10 -end-10 size-28 bg-gold/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-gold/15 border border-gold/35 flex items-center justify-center shrink-0">
                    <MapPin className="size-3.5 text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight leading-tight">
                      {lang === 'ar' ? active.nameAr : active.nameEn}
                    </h4>
                    <p className="text-[10px] eyebrow text-gold/90 uppercase tracking-wider mt-0.5 font-medium">
                      {lang === 'ar' ? active.hubAr : active.hubEn}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-2xl sm:text-3xl font-serif text-gold font-light tabular-nums leading-none">
                    {active.projectsCount}+
                  </span>
                  <span className="text-[9px] eyebrow text-ivory/60 mt-1 uppercase tracking-widest font-sans">
                    {lang === 'ar' ? 'مشروع منجز' : 'Delivered'}
                  </span>
                </div>
              </div>

              {/* Live Typewriter Animated Description */}
              <div className="min-h-[52px] flex items-start">
                <p className="text-xs sm:text-[13px] leading-relaxed text-ivory/90 font-sans font-light">
                  {typedDescription}
                  {isTyping && (
                    <span
                      className="inline-block w-[2px] h-[13px] ms-1 bg-gold animate-pulse align-middle"
                      aria-hidden="true"
                    />
                  )}
                </p>
              </div>

              {/* Fluid Discipline Pills (No truncation or ellipsis) */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {active.disciplines.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xs text-[11px] eyebrow text-ivory/85 transition-colors"
                  >
                    <span className="size-1 rounded-full bg-gold shrink-0" />
                    <span className="whitespace-normal leading-tight">{lang === 'ar' ? d.ar : d.en}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] eyebrow text-ivory/50 uppercase tracking-wider">
                  {lang === 'ar' ? 'سجل الأعمال' : 'PORTFOLIO'}
                </span>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-white transition-colors eyebrow active:scale-95 duration-100 group focus-visible:ring-1 focus-visible:ring-gold font-medium"
                >
                  <span>{lang === 'ar' ? 'استعراض المشاريع' : 'View Projects'}</span>
                  <ArrowUpRight className="size-3.5 rtl:rotate-[-90deg] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Minimalist Legend Indicator */}
            <div className="flex items-center gap-4 text-[10px] eyebrow text-charcoal/65 dark:text-ivory/65 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-gold" />
                <span>{lang === 'ar' ? 'الدولة المحددة' : 'Active Territory'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#DFD3BF] border border-gold/40" />
                <span>{lang === 'ar' ? 'مشاريع واستشارات' : 'Consultancy Reach'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
