import React from 'react'

interface LogoProps {
  className?: string
}

/**
 * 1. EMAAR Properties Logo
 */
export function EmaarLogo({ className = 'h-8 sm:h-9 md:h-10 lg:h-11 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={`${className} max-w-[130px] sm:max-w-[155px] max-h-10 sm:max-h-12 w-auto transition-transform duration-300 select-none`}
      aria-label="EMAAR"
    >
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontFamily="'Times New Roman', Times, 'Cormorant Garamond', Georgia, serif"
        fontSize="28"
        fontWeight="800"
        letterSpacing="8"
      >
        EMAAR
      </text>
    </svg>
  )
}

/**
 * 2. SODIC Logo (Isometric 3D Cube + Bold SODIC)
 */
export function SodicLogo({ className = 'h-8 sm:h-9 md:h-10 lg:h-11 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 170 42"
      fill="currentColor"
      className={`${className} max-w-[130px] sm:max-w-[155px] max-h-10 sm:max-h-12 w-auto transition-transform duration-300 select-none`}
      aria-label="SODIC"
    >
      {/* 3D Isometric Cube Symbol */}
      <g transform="translate(4, 5)">
        <polygon points="17,3 31,11 17,19 3,11" opacity="0.95" />
        <polygon points="3,13 16,21 16,35 3,27" opacity="0.65" />
        <polygon points="18,21 31,13 31,27 18,35" opacity="0.8" />
      </g>
      {/* SODIC Wordmark */}
      <text
        x="45"
        y="28"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="24"
        fontWeight="900"
        letterSpacing="2.5"
      >
        SODIC
      </text>
    </svg>
  )
}

/**
 * 3. TMG (Talaat Moustafa Group - Real Gold Foil Texture Logo)
 */
export function TmgLogo({ className = 'h-9 sm:h-11 md:h-12 lg:h-14 w-auto' }: LogoProps) {
  return (
    <img
      src="/images/clients/tmg.png"
      alt="TMG - طلعت مصطفى"
      className={`${className} max-w-[145px] sm:max-w-[170px] max-h-12 sm:max-h-14 w-auto object-contain transition-transform duration-300 select-none`}
      loading="eager"
      decoding="async"
    />
  )
}

/**
 * 4. ALMARASEM Development Logo (Real Golden Crest + Bilingual Wordmark)
 */
export function AlMarasemLogo({ className = 'h-10 sm:h-12 md:h-13 lg:h-15 w-auto' }: LogoProps) {
  return (
    <div className="flex items-center justify-center">
      <img
        src="/images/clients/almarasem-charcoal.png"
        alt="Al Marasem Development"
        className={`${className} max-w-[140px] sm:max-w-[160px] max-h-12 sm:max-h-14 w-auto object-contain block dark:hidden transition-transform duration-300 select-none`}
        loading="eager"
        decoding="async"
      />
      <img
        src="/images/clients/almarasem.png"
        alt="Al Marasem Development"
        className={`${className} max-w-[140px] sm:max-w-[160px] max-h-12 sm:max-h-14 w-auto object-contain hidden dark:block transition-transform duration-300 select-none`}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

/**
 * 5. HYDE PARK Developments (Real Official Hyde Park Logo)
 */
export function HydeParkLogo({ className = 'h-8 sm:h-10 md:h-11 lg:h-13 w-auto' }: LogoProps) {
  return (
    <img
      src="/images/clients/hydepark.png"
      alt="Hyde Park Developments"
      className={`${className} max-w-[150px] sm:max-w-[175px] max-h-11 sm:max-h-13 w-auto object-contain dark:invert transition-transform duration-300 select-none`}
      loading="eager"
      decoding="async"
    />
  )
}

/**
 * 6. MISR ITALIA Properties (Square M Emblem + Name)
 */
export function MisrItaliaLogo({ className = 'h-8 sm:h-9 md:h-10 lg:h-11 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 185 40"
      fill="currentColor"
      className={`${className} max-w-[140px] sm:max-w-[160px] max-h-10 sm:max-h-12 w-auto transition-transform duration-300 select-none`}
      aria-label="MISR ITALIA"
    >
      {/* Square M Icon */}
      <g transform="translate(4, 5)">
        <rect x="0" y="0" width="28" height="28" rx="2" fill="currentColor" />
        <polygon
          points="5.5,22.5 5.5,6.5 9.5,6.5 14,15 18.5,6.5 22.5,6.5 22.5,22.5 19,22.5 19,11 15,18.5 13,18.5 9,11 9,22.5"
          fill="#FAF8F5"
        />
      </g>
      {/* Text */}
      <text
        x="40"
        y="21"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="15"
        fontWeight="800"
        letterSpacing="1"
      >
        MISR ITALIA
      </text>
      <text
        x="41"
        y="31"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="7"
        fontWeight="600"
        letterSpacing="3"
        opacity="0.75"
      >
        PROPERTIES
      </text>
    </svg>
  )
}

/**
 * 7. Regional Mini Map (Middle East, Egypt, KSA, Viewfinder)
 */
export function RegionalMiniMap({ className = 'w-28 h-20 sm:w-36 sm:h-24' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden border border-[#E7E2D8] dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#1C1B18] p-1.5 flex items-center justify-center shrink-0 shadow-xs ${className}`}>
      <svg
        viewBox="0 0 160 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-stone-400 dark:text-stone-600"
      >
        {/* Coordinate grid lines */}
        <line x1="0" y1="35" x2="160" y2="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
        <line x1="0" y1="75" x2="160" y2="75" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
        <line x1="55" y1="0" x2="55" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
        <line x1="105" y1="0" x2="105" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />

        {/* Europe / Greece / Turkey outline */}
        <path
          d="M10,14 Q30,10 48,16 T75,20 T95,14 T120,20"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        {/* North Africa / Egypt Mediterranean Coastline */}
        <path
          d="M15,55 Q35,52 50,54 Q62,56 70,51 Q78,54 85,50"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.85"
        />
        {/* Nile Delta & River line */}
        <path
          d="M66,53 L68,62 L67,78 L65,95"
          stroke="#C5A880"
          strokeWidth="1"
          strokeDasharray="1.5 1.5"
          fill="none"
          opacity="0.75"
        />
        {/* Sinai & Red Sea */}
        <path
          d="M78,52 L82,60 L80,72 L88,95 L95,108"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.85"
        />
        {/* Arabian Peninsula & Gulf Coast */}
        <path
          d="M85,50 Q105,48 120,55 Q135,62 142,75 Q145,95 130,105 Q110,108 95,108"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.85"
        />

        {/* Viewfinder Box centered on Egypt & Saudi Arabia */}
        <rect x="58" y="44" width="62" height="52" fill="none" stroke="#C5A880" strokeWidth="1" opacity="0.8" />
        <circle cx="58" cy="44" r="1.5" fill="#C5A880" />
        <circle cx="120" cy="44" r="1.5" fill="#C5A880" />
        <circle cx="58" cy="96" r="1.5" fill="#C5A880" />
        <circle cx="120" cy="96" r="1.5" fill="#C5A880" />

        {/* Cairo Pin (30°N 31°E) */}
        <circle cx="68" cy="58" r="2.5" fill="#C5A880" />
        <circle cx="68" cy="58" r="5.5" stroke="#C5A880" strokeWidth="0.75" opacity="0.5" />

        {/* Riyadh Pin (24°N 46°E) */}
        <circle cx="112" cy="74" r="2" fill="#C5A880" />
        <circle cx="112" cy="74" r="5" stroke="#C5A880" strokeWidth="0.75" opacity="0.5" />

        {/* Axis line connecting Cairo & Riyadh */}
        <line x1="68" y1="58" x2="112" y2="74" stroke="#C5A880" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.8" />
      </svg>
    </div>
  )
}
