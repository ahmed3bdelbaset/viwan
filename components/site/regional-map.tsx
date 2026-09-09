'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ArrowUpRight, Compass, Navigation, Layers, ExternalLink, Globe, Sparkles, Satellite } from 'lucide-react'
import { SectionIndex, Display } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  LTR_MAP_PATHS,
  RTL_MAP_PATHS,
  LTR_PINS,
  RTL_PINS,
} from '@/lib/data/map-paths'
import { resolveTerritoryInfo, TerritoryInfo, VIWAN_HUBS } from '@/lib/data/country-metadata'

export interface CountryProjectData {
  id: 'egypt' | 'saudi' | 'syria'
  iso: string
  nameEn: string
  nameAr: string
  hubEn: string
  hubAr: string
  coordinates: string
  lat: number
  lng: number
  zoom: number
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
    coordinates: '30.0444° N, 31.2357° E',
    lat: 30.0444,
    lng: 31.2357,
    zoom: 6,
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
    coordinates: '24.7136° N, 46.6753° E',
    lat: 24.7136,
    lng: 46.6753,
    zoom: 5,
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
    coordinates: '33.5138° N, 36.2765° E',
    lat: 33.5138,
    lng: 36.2765,
    zoom: 7,
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
  const [selectedId, setSelectedId] = useState<'egypt' | 'saudi' | 'syria' | null>(null)
  const [hoveredCountry, setHoveredCountry] = useState<TerritoryInfo | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [mapViewMode, setMapViewMode] = useState<'cartography' | 'satellite'>('cartography')

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
  const mobileViewBox = lang === 'ar' ? '224 100 323 370' : '354 100 323 370'

  // Desktop regional viewBox: Zoomed into Middle East & North Africa region
  const desktopViewBox = lang === 'ar' ? '189 127 393 312' : '319 127 393 312'

  // Common SVG Map Renderer with Refined Architectural Micro-Beacons
  const renderMapSvg = (isMobile: boolean) => (
    <svg
      viewBox={isMobile ? mobileViewBox : desktopViewBox}
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
            floodOpacity="0.45"
          />
        </filter>
        <filter id={`hover-glow-${isMobile ? 'm' : 'd'}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy={isMobile ? 1 : 3}
            stdDeviation={isMobile ? 1.2 : 3}
            floodColor="#181715"
            floodOpacity="0.25"
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
        <linearGradient id={`ocean-gradient-${isMobile ? 'm' : 'd'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B8CCD8" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#A3B8C8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#95AABA" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Deep Ocean Water Background */}
      <rect x="0" y="0" width="800" height="600" fill={`url(#ocean-gradient-${isMobile ? 'm' : 'd'})`} />

      {/* Cartographic Coordinate Reference Lat/Long Lines */}
      <g className="cartographic-reference opacity-20 pointer-events-none">
        <line x1="0" y1="255" x2="800" y2="255" stroke="#7A8A96" strokeWidth="0.3" strokeDasharray="2 3" />
        <line x1="0" y1="290" x2="800" y2="290" stroke="#7A8A96" strokeWidth="0.3" strokeDasharray="2 3" />
        <line x1="0" y1="330" x2="800" y2="330" stroke="#7A8A96" strokeWidth="0.3" strokeDasharray="2 3" />
        <line x1={lang === 'ar' ? '340' : '470'} y1="0" x2={lang === 'ar' ? '340' : '470'} y2="600" stroke="#7A8A96" strokeWidth="0.3" strokeDasharray="2 3" />
        <line x1={lang === 'ar' ? '380' : '510'} y1="0" x2={lang === 'ar' ? '380' : '510'} y2="600" stroke="#7A8A96" strokeWidth="0.3" strokeDasharray="2 3" />
        <line x1={lang === 'ar' ? '420' : '550'} y1="0" x2={lang === 'ar' ? '420' : '550'} y2="600" stroke="#7A8A96" strokeWidth="0.3" strokeDasharray="2 3" />
      </g>

      {/* Cartographic Water Body Labels */}
      {!isMobile && (
        <g className="pointer-events-none">
          <text
            x={lang === 'ar' ? '355' : '485'}
            y="310"
            fill="#6B7B8A"
            fontSize="3.5"
            fontFamily="var(--font-serif), serif"
            fontStyle="italic"
            letterSpacing="0.15em"
            textAnchor="middle"
            opacity="0.7"
            transform={`rotate(-25, ${lang === 'ar' ? '355' : '485'}, 310)`}
          >
            {lang === 'ar' ? 'البحر الأحمر' : 'RED SEA'}
          </text>
          <text
            x={lang === 'ar' ? '340' : '470'}
            y="238"
            fill="#6B7B8A"
            fontSize="3"
            fontFamily="var(--font-serif), serif"
            fontStyle="italic"
            letterSpacing="0.12em"
            textAnchor="middle"
            opacity="0.6"
          >
            {lang === 'ar' ? 'البحر الأبيض المتوسط' : 'MEDITERRANEAN SEA'}
          </text>
          <text
            x={lang === 'ar' ? '415' : '545'}
            y="280"
            fill="#6B7B8A"
            fontSize="2.8"
            fontFamily="var(--font-serif), serif"
            fontStyle="italic"
            letterSpacing="0.12em"
            textAnchor="middle"
            opacity="0.6"
            transform={`rotate(-60, ${lang === 'ar' ? '415' : '545'}, 280)`}
          >
            {lang === 'ar' ? 'الخليج العربي' : 'ARABIAN GULF'}
          </text>
        </g>
      )}

      {/* All Countries Polygons */}
      <g className="rsm-geographies">
        {countryPaths.map((country, idx) => {
          const info = resolveTerritoryInfo(country)
          const matched = COUNTRIES_DATA.find((c) => c.iso === country.id || c.id === info.id)
          const isSelected = matched?.id === selectedId
          const isWorkedCountry = Boolean(matched)
          const isHovered =
            (hoveredCountry?.iso && hoveredCountry.iso === country.id) ||
            (hoveredCountry?.nameEn && hoveredCountry.nameEn === country.name)

          let fill = '#D6CCB9'
          let stroke = '#C4B9A3'
          let strokeWidth = isMobile ? 0.25 : 0.4
          let cursor = 'pointer'
          let filter = 'none'

          if (isSelected) {
            fill = '#1A1916'
            stroke = '#C5A880'
            strokeWidth = isMobile ? 0.8 : 1.2
            cursor = 'pointer'
            filter = `url(#gold-glow-${isMobile ? 'm' : 'd'})`
          } else if (isWorkedCountry) {
            // By default (no selection), clean parchment with distinct gold border; when another country is selected, subtle 10% stone tint
            fill = isHovered ? '#CCC2B0' : (selectedId ? '#CCC2B0' : '#D6CCB9')
            stroke = '#C5A880'
            strokeWidth = isMobile ? 0.5 : 0.75
            cursor = 'pointer'
            filter = 'none'
          } else if (isHovered) {
            fill = '#C9BDA6'
            stroke = '#8C7355'
            strokeWidth = isMobile ? 0.4 : 0.6
            cursor = 'pointer'
            filter = 'none'
          }

          return (
            <path
              key={`${country.id}-${idx}`}
              d={country.d}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              filter={filter}
              onMouseEnter={(e) => {
                setHoveredCountry(info)
                setMousePos({ x: e.clientX, y: e.clientY })
              }}
              onMouseMove={(e) => {
                setMousePos({ x: e.clientX, y: e.clientY })
              }}
              onMouseLeave={() => {
                setHoveredCountry((prev) => (prev?.nameEn === info.nameEn ? null : prev))
              }}
              onClick={() => {
                if (matched) {
                  setSelectedId(matched.id)
                }
              }}
              style={{
                outline: 'none',
                cursor,
                transition: 'fill 300ms ease, stroke 300ms ease',
              }}
              className="transition-all duration-300"
            >
              <title>{`${info.nameAr} (${info.nameEn}) - ${info.coordinates}`}</title>
            </path>
          )
        })}
      </g>

      {/* Minimal Elegant Location Pins (15% Smaller & Delicate) */}
      <g className="rsm-markers pointer-events-auto">
        {pinMarkers.map((pin) => {
          const isSelected = pin.id === selectedId

          return (
            <g key={pin.id} className="transition-all duration-500">
              <g
                transform={`translate(${pin.x}, ${pin.y})`}
                className="cursor-pointer group"
                onClick={() => setSelectedId(pin.id)}
              >
                {/* Subtle pulse ring for selected */}
                {isSelected && (
                  <circle
                    r={isMobile ? 2.1 : 3.2}
                    fill="none"
                    stroke="#C5A880"
                    strokeWidth={isMobile ? 0.2 : 0.3}
                    opacity="0.5"
                    className="animate-ping"
                    style={{ animationDuration: '3s' }}
                  />
                )}

                {/* Minimal Location Pin-drop shape (15% further reduction) */}
                <path
                  d={isMobile
                    ? 'M0,-2.5 C1.1,-2.5 2,-1.6 2,-0.5 C2,0.6 0,2.5 0,2.5 C0,2.5 -2,0.6 -2,-0.5 C-2,-1.6 -1.1,-2.5 0,-2.5Z'
                    : 'M0,-3.6 C1.6,-3.6 2.9,-2.3 2.9,-0.7 C2.9,0.85 0,3.6 0,3.6 C0,3.6 -2.9,0.85 -2.9,-0.7 C-2.9,-2.3 -1.6,-3.6 0,-3.6Z'
                  }
                  fill={isSelected ? '#C5A880' : '#8C7355'}
                  stroke={isSelected ? '#FAF8F5' : '#C5A880'}
                  strokeWidth={isMobile ? 0.22 : 0.3}
                  className="group-hover:fill-gold transition-colors duration-300"
                  filter={`url(#pin-shadow-${isMobile ? 'm' : 'd'})`}
                />

                {/* Inner dot */}
                <circle
                  r={isMobile ? 0.6 : 0.85}
                  cy={isMobile ? -0.5 : -0.7}
                  fill={isSelected ? '#181715' : '#FAF8F5'}
                />

                {/* Tiny discreet label - only on desktop for selected */}
                {isSelected && !isMobile && (
                  <text
                    x="0"
                    y={-5.5}
                    fill="#C5A880"
                    fontSize="2.2"
                    fontFamily="var(--font-serif), serif"
                    fontWeight="500"
                    letterSpacing="0.05em"
                    textAnchor="middle"
                    opacity="0.9"
                  >
                    {lang === 'ar' ? pin.nameAr : pin.nameEn}
                  </text>
                )}
              </g>
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
                  <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-gold/80 mt-1">
                    <Navigation className="size-2.5 text-gold" />
                    <span>{active.coordinates}</span>
                  </div>
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
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
          {mapViewMode === 'cartography' ? (
            renderMapSvg(false)
          ) : (
            <div className="w-full h-full relative">
              <iframe
                src={`https://www.google.com/maps?q=${active.lat},${active.lng}&hl=${lang}&z=${active.zoom}&t=h&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Satellite View"
              />
              <a
                href={`https://www.google.com/maps?q=${active.lat},${active.lng}&hl=${lang}&z=${active.zoom}&t=h`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 end-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161513]/90 text-gold border border-gold/40 rounded-xs text-[11px] font-medium backdrop-blur-sm hover:bg-gold hover:text-charcoal transition-all duration-200"
              >
                <ExternalLink className="size-3" />
                {lang === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
              </a>
            </div>
          )}
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

            {/* Map View Mode Switcher */}
            <div className="flex items-center p-0.5 bg-[#ECE5D7]/80 dark:bg-[#1D1B18]/80 border border-stone/20 rounded-xs w-full gap-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setMapViewMode('cartography')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium transition-all duration-200 cursor-pointer rounded-2xs select-none',
                  mapViewMode === 'cartography'
                    ? 'bg-charcoal text-ivory border border-gold/40 shadow-xs'
                    : 'text-charcoal/70 dark:text-ivory/70 hover:text-charcoal dark:hover:text-ivory'
                )}
              >
                <Globe className="size-3" />
                <span>{lang === 'ar' ? 'الخريطة المعمارية' : 'Architectural Map'}</span>
              </button>
              <button
                type="button"
                onClick={() => setMapViewMode('satellite')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium transition-all duration-200 cursor-pointer rounded-2xs select-none',
                  mapViewMode === 'satellite'
                    ? 'bg-charcoal text-ivory border border-gold/40 shadow-xs'
                    : 'text-charcoal/70 dark:text-ivory/70 hover:text-charcoal dark:hover:text-ivory'
                )}
              >
                <Satellite className="size-3" />
                <span>{lang === 'ar' ? 'أقمار صناعية' : 'Satellite View'}</span>
              </button>
            </div>

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
                    <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-gold/80 mt-1">
                      <Navigation className="size-2.5 text-gold" />
                      <span>{active.coordinates}</span>
                    </div>
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
                <span className="size-2 rounded-full bg-[#1A1916] border border-gold" />
                <span>{lang === 'ar' ? 'الدولة المحددة' : 'Selected'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#C0B7A5] border border-gold/50" />
                <span>{lang === 'ar' ? 'تواجد VIWAN' : 'VIWAN Presence'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE FLOATING CARTOGRAPHIC TOOLTIP (Follows cursor over any region) */}
      {/* ========================================================================= */}
      {hoveredCountry && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(mousePos.x + 14, typeof window !== 'undefined' ? window.innerWidth - 270 : mousePos.x),
            top: Math.min(mousePos.y + 14, typeof window !== 'undefined' ? window.innerHeight - 150 : mousePos.y),
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="bg-[#12110F]/95 text-ivory border border-gold/50 px-3.5 py-2.5 rounded-xs shadow-[0_16px_36px_rgba(0,0,0,0.5)] backdrop-blur-md animate-fade-in flex flex-col gap-1 min-w-[210px] max-w-[290px] select-none"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="size-3 text-gold shrink-0" />
              <span className="font-serif text-xs font-semibold text-white truncate">
                {lang === 'ar' ? hoveredCountry.nameAr : hoveredCountry.nameEn}
              </span>
            </div>
            {hoveredCountry.isViwanHub ? (
              <span className="text-[9px] font-mono font-bold text-charcoal bg-gold px-1.5 py-0.5 rounded-2xs shrink-0">
                {hoveredCountry.projectsCount}+ {lang === 'ar' ? 'مشروع' : 'Projects'}
              </span>
            ) : (
              <span className="text-[8.5px] font-mono text-ivory/60 bg-white/10 px-1.5 py-0.5 rounded-2xs shrink-0">
                TERRITORY
              </span>
            )}
          </div>

          {hoveredCountry.nameAr !== hoveredCountry.nameEn && (
            <span className="text-[10.5px] text-ivory/70 font-light truncate">
              {lang === 'ar' ? hoveredCountry.nameEn : hoveredCountry.nameAr}
            </span>
          )}

          <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-gold/90 mt-0.5">
            <span className="size-1 rounded-full bg-gold" />
            <span>{hoveredCountry.coordinates}</span>
          </div>

          {hoveredCountry.isViwanHub ? (
            <div className="mt-1 pt-1 border-t border-white/10 text-[9.5px] text-emerald-400 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {hoveredCountry.id === 'egypt'
                    ? (lang === 'ar' ? 'المقر الرئيسي · القاهرة' : 'Main HQ · Cairo')
                    : hoveredCountry.id === 'saudi'
                    ? (lang === 'ar' ? 'المكتب الإقليمي · الرياض' : 'Regional Office · Riyadh')
                    : (lang === 'ar' ? 'مشاريع التراث والقصور · دمشق' : 'Heritage & Craft · Damascus')}
                </span>
              </span>
              <span className="text-[8.5px] text-gold/80 font-mono">
                {lang === 'ar' ? 'انقر للتحديد' : 'Click to select'}
              </span>
            </div>
          ) : (
            <div className="mt-1 pt-1 border-t border-white/10 text-[9px] text-ivory/50 flex items-center justify-between">
              <span>{lang === 'ar' ? 'نطاق التغطية والاستشارات' : 'Regional Reach'}</span>
              <span className="text-[8px] font-mono text-ivory/40">VIWAN</span>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
