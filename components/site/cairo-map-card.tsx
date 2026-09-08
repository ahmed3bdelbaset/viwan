'use client'

import React, { useEffect, useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface CairoMapCardProps {
  initialLat?: number
  initialLng?: number
  initialZoom?: number
  initialLocationName?: string
}

export function CairoMapCard({
  initialLat = 30.0131,
  initialLng = 31.4989,
  initialZoom = 14,
  initialLocationName = 'New Cairo, Cairo, Egypt',
}: CairoMapCardProps) {
  const { t, lang } = useLanguage()
  const [coords, setCoords] = useState({
    lat: initialLat,
    lng: initialLng,
    zoom: initialZoom,
    locationName: initialLocationName,
  })

  // Fetch real-time settings if changed from admin
  useEffect(() => {
    let isMounted = true
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.settings) return
        const s = data.settings
        setCoords({
          lat: typeof s.mapLatitude === 'number' ? s.mapLatitude : initialLat,
          lng: typeof s.mapLongitude === 'number' ? s.mapLongitude : initialLng,
          zoom: typeof s.mapZoom === 'number' ? s.mapZoom : initialZoom,
          locationName: s.mapLocationName || initialLocationName,
        })
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [initialLat, initialLng, initialZoom, initialLocationName])

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
  const embedUrl = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=${lang}&z=${coords.zoom}&output=embed`

  return (
    <div className="border border-stone/30 bg-[#FAF7F2] dark:bg-[#161513] overflow-hidden flex flex-col sm:flex-row items-stretch transition-colors duration-500 rounded-xs shadow-sm">
      {/* Real Interactive Map Section */}
      <div className="relative w-full sm:w-[58%] min-h-[220px] sm:min-h-[240px] bg-[#EFE9DF] dark:bg-[#1C1A17] overflow-hidden select-none">
        {/* Real Map Embed */}
        <iframe
          title={coords.locationName || 'Studio Map'}
          src={embedUrl}
          className="w-full h-full min-h-[220px] sm:min-h-[240px] border-0 block contrast-[1.04] saturate-[0.9]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Floating Live GPS Pill */}
        <div className="absolute top-2.5 start-2.5 z-10 flex items-center gap-1.5 bg-[#11110F]/90 backdrop-blur-md text-ivory text-[10px] px-2.5 py-1 rounded-2xs border border-gold/40 shadow-md">
          <span className="size-1.5 rounded-full bg-gold animate-pulse" aria-hidden="true" />
          <span className="font-mono tabular-nums tracking-wide">
            {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
          </span>
        </div>

        {/* "Open in Maps" Quick Action */}
        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2.5 end-2.5 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-charcoal/90 hover:bg-gold hover:text-charcoal dark:hover:bg-gold dark:hover:text-charcoal text-charcoal dark:text-ivory text-[10px] eyebrow px-2.5 py-1 rounded-2xs border border-stone/30 shadow-md transition-colors active:scale-95 duration-100"
          title={lang === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
        >
          <span>{lang === 'ar' ? 'خرائط Google' : 'Google Maps'}</span>
          <ExternalLink className="size-2.5" aria-hidden="true" />
        </a>
      </div>

      {/* Narrative & Location Information Section */}
      <div className="w-full sm:w-[42%] p-5 sm:p-6 flex flex-col justify-center gap-3 border-t sm:border-t-0 sm:border-s border-stone/30">
        <div className="flex items-center gap-2 text-gold">
          <MapPin className="size-3.5" aria-hidden="true" />
          <span className="eyebrow text-[10px] tracking-wider uppercase font-semibold">
            {coords.locationName}
          </span>
        </div>

        <p className="font-serif text-charcoal dark:text-ivory text-sm sm:text-base leading-snug">
          {t.contactPage.mapCaption}
        </p>

        <span className="block h-px w-10 bg-gold" aria-hidden="true" />

        <p className="eyebrow text-[9px] tracking-widest text-muted-foreground uppercase leading-relaxed">
          {t.contactPage.mapTagline}
        </p>
      </div>
    </div>
  )
}
