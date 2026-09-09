'use client'

import React, { useMemo } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface ProjectSiteMapCardProps {
  locationName: string
  coordinates?: string
  lat?: number
  lng?: number
  projectType?: string
  year?: string | number
  className?: string
}

/**
 * Robust coordinate parser: handles numbers, formatted strings like
 * "30.0444° N, 31.2357° E", "30.0131, 31.4989", or regional city fallbacks.
 */
function parseProjectCoordinates(
  coordStr?: string,
  numLat?: number,
  numLng?: number,
  locationName?: string
): { lat: number; lng: number; formatted: string } {
  // 1. Direct numbers
  if (
    typeof numLat === 'number' &&
    typeof numLng === 'number' &&
    !isNaN(numLat) &&
    !isNaN(numLng) &&
    numLat !== 0 &&
    numLng !== 0
  ) {
    const latDir = numLat >= 0 ? 'N' : 'S'
    const lngDir = numLng >= 0 ? 'E' : 'W'
    return {
      lat: numLat,
      lng: numLng,
      formatted: `${Math.abs(numLat).toFixed(4)}° ${latDir}, ${Math.abs(numLng).toFixed(4)}° ${lngDir}`,
    }
  }

  // 2. Parse string if available
  if (coordStr && typeof coordStr === 'string') {
    const matches = coordStr.match(/([-+]?\d+(?:\.\d+)?)/g)
    if (matches && matches.length >= 2) {
      const pLat = parseFloat(matches[0])
      const pLng = parseFloat(matches[1])
      if (!isNaN(pLat) && !isNaN(pLng)) {
        const latDir = pLat >= 0 ? 'N' : 'S'
        const lngDir = pLng >= 0 ? 'E' : 'W'
        return {
          lat: pLat,
          lng: pLng,
          formatted: `${Math.abs(pLat).toFixed(4)}° ${latDir}, ${Math.abs(pLng).toFixed(4)}° ${lngDir}`,
        }
      }
    }
  }

  // 3. Fallbacks by regional location
  const loc = (locationName || '').toLowerCase()
  if (loc.includes('riyadh') || loc.includes('الرياض') || loc.includes('ksa') || loc.includes('saudi')) {
    return { lat: 24.7136, lng: 46.6753, formatted: '24.7136° N, 46.6753° E' }
  }
  if (loc.includes('sokhna') || loc.includes('السخنة') || loc.includes('عين سخنة')) {
    return { lat: 29.6015, lng: 32.3168, formatted: '29.6015° N, 32.3168° E' }
  }
  if (loc.includes('damascus') || loc.includes('دمشق') || loc.includes('syria') || loc.includes('سوريا')) {
    return { lat: 33.5138, lng: 36.2765, formatted: '33.5138° N, 36.2765° E' }
  }
  if (loc.includes('zayed') || loc.includes('زايد') || loc.includes('giza') || loc.includes('جيزة')) {
    return { lat: 30.0531, lng: 30.9708, formatted: '30.0531° N, 30.9708° E' }
  }

  // Default Cairo / New Cairo
  return { lat: 30.0131, lng: 31.4989, formatted: '30.0131° N, 31.4989° E' }
}

export function ProjectSiteMapCard({
  locationName,
  coordinates,
  lat,
  lng,
  projectType = 'Architecture',
  year = '2026',
  className = '',
}: ProjectSiteMapCardProps) {
  const { lang } = useLanguage()
  const isAr = lang === 'ar'

  const coords = useMemo(() => {
    return parseProjectCoordinates(coordinates, lat, lng, locationName)
  }, [coordinates, lat, lng, locationName])

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
  const embedUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=${lang}&z=14&output=embed`

  return (
    <div
      className={`@container border border-stone/30 bg-[#FAF7F2] dark:bg-[#161513] overflow-hidden flex flex-col @sm:flex-row items-stretch transition-colors duration-500 rounded-xs shadow-sm ${className}`}
    >
      {/* Real Interactive Map Section */}
      <div className="relative w-full @sm:w-[58%] min-h-[220px] @sm:min-h-[230px] bg-[#EFE9DF] dark:bg-[#1C1A17] overflow-hidden select-none">
        {/* Real Map Embed */}
        <iframe
          title={`${locationName} - Site Map`}
          src={embedUrl}
          className="w-full h-full min-h-[220px] @sm:min-h-[230px] border-0 block contrast-[1.04] saturate-[0.9]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Live GPS Pill */}
        <div className="absolute top-2.5 start-2.5 z-10 flex items-center gap-1.5 bg-[#11110F]/90 backdrop-blur-md text-ivory text-[10px] px-2.5 py-1 rounded-2xs border border-gold/40 shadow-md">
          <span className="size-1.5 rounded-full bg-gold animate-pulse" aria-hidden="true" />
          <span className="font-mono tabular-nums tracking-wide">
            {coords.formatted}
          </span>
        </div>

        {/* "Open in Maps" Quick Action Button */}
        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2.5 end-2.5 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-charcoal/90 hover:bg-gold hover:text-charcoal dark:hover:bg-gold dark:hover:text-charcoal text-charcoal dark:text-ivory text-[10px] eyebrow px-2.5 py-1 rounded-2xs border border-stone/30 shadow-md transition-colors active:scale-95 duration-100"
          title={isAr ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
        >
          <span>{isAr ? 'خرائط Google' : 'Google Maps'}</span>
          <ExternalLink className="size-2.5" aria-hidden="true" />
        </a>
      </div>

      {/* Narrative & Location Information Section */}
      <div className="w-full @sm:w-[42%] p-5 flex flex-col justify-center gap-3 border-t @sm:border-t-0 @sm:border-s border-stone/30">
        <div className="flex items-center gap-2 text-gold">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="eyebrow text-[10px] tracking-wider uppercase font-semibold line-clamp-1">
            {locationName}
          </span>
        </div>

        <p className="font-serif text-charcoal dark:text-ivory text-sm leading-snug">
          {isAr
            ? 'موقع ومحددات المشروع الجغرافية مع دراسة الطبوغرافيا والتوجه الشمسي ومسارات الحركة المحيطة.'
            : 'Project site geographic coordinates, topography, solar orientation and contextual access routes.'}
        </p>

        <span className="block h-px w-10 bg-gold" aria-hidden="true" />

        <p className="eyebrow text-[9px] tracking-widest text-muted-foreground uppercase leading-relaxed font-mono">
          {projectType} · {year} · LOD-400
        </p>
      </div>
    </div>
  )
}
