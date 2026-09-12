import React from 'react'

interface LogoProps {
  className?: string
}

/**
 * 1. EMAAR Properties Logo (Official Vector Wordmark)
 */
export function EmaarLogo({ className = 'h-6 sm:h-7 md:h-8 lg:h-9 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 1617 321"
      fill="currentColor"
      className={`${className} max-w-[130px] sm:max-w-[155px] max-h-9 sm:max-h-11 w-auto transition-transform duration-300 select-none`}
      aria-label="EMAAR"
    >
      <path
        d="M234.9,288.4 L230.1,320.2 L0.5,320.2 C10,298.2 9.4,285.8 9.4,269.9 L9.4,51.3 C9.4,35.9 10,22.4 0.5,1 L69.3,1 L224.5,1 L224.9,33.4 C220.7,31.7 217.3,30.2 214.2,28.8 C205.9,25.7 195.4,22.8 184.5,22.9 C167.1,22.9 94.1,22.9 61.7,22.9 L61.7,147.9 L205.8,147.9 L198.7,172.5 L61.7,172.5 L61.7,297.6 C88.2,297.6 172.9,297.6 191.6,297.6 C213.5,298 235.3,285.6 235.3,285.6 L234.7,288.3 C234.7,288.4 234.8,288.4 234.9,288.4 Z M580.5,320.2 C583.6,304.5 583.6,282.3 581.1,264.2 L560.7,113.8 L449.3,320.1 L428.1,320.1 L314.9,104.5 L292.9,267.5 C290.5,286.3 289.8,310.1 291.8,320.2 L252,320.2 C259.7,303.9 261.6,296.8 265.2,270 L301.2,1 L319.5,1 L451.6,252 L583.6,1 L597.4,1 L634.6,269.4 C638.3,296.1 641.1,303.8 648.5,320.2 L580.5,320.2 Z M915.8,320.2 L862.8,203.3 L756.2,203.3 L703.9,320.2 L699.4,320.2 L662.5,320.2 L662.3,320.2 C675.5,303.8 680,296.2 689.3,275.8 L812.9,1 L826.8,1 L948.4,268.1 C961.4,294.2 967.5,302.3 986.1,320.2 L915.8,320.2 Z M1249.3,320.2 L1196.3,203.3 L1089.7,203.3 L1037.4,320.2 L1033,320.2 L996,320.2 L995.8,320.2 C1009,303.8 1013.5,296.2 1022.8,275.8 L1146.4,1 L1160.3,1 L1282,268.1 C1295,294.2 1301.1,302.3 1319.7,320.2 L1249.3,320.2 Z M1551.5,320.4 C1519.6,291.3 1478.3,252.7 1426.6,191.5 C1411.8,174.2 1401.4,172 1394.7,171.6 L1394.7,269.9 C1394.7,285.7 1394.7,298.2 1403.7,320.2 L1333.5,320.2 C1343,298.2 1342.4,285.8 1342.4,269.9 L1342.4,51.1 C1342.4,35.7 1343,22.2 1333.5,0.8 L1402.3,0.8 C1449.3,0.8 1560.4,-3.4 1560.4,88.4 C1560.4,136.9 1521.9,163 1476.7,169.6 L1463.3,170.9 C1463.3,170.9 1609.9,314.2 1616.2,320.4 L1551.5,320.4 Z M1468.4,151.3 L1468.3,151.4 C1497.9,140.2 1507.9,112.1 1506.9,88.3 C1505.8,65.4 1495.5,15.6 1394.8,19.6 L1394.8,155.7 C1394.8,155.7 1451.2,158.8 1467,151.9 C1467.9,151.5 1468.4,151.3 1468.4,151.3 Z M1099.9,181 L1186,181 L1142.6,85.7 L1099.9,181 Z M766.5,181 L852.6,181 L809.2,85.7 L766.5,181 Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  )
}

/**
 * 2. SODIC Logo (Isometric 3D Cube + Bold SODIC)
 */
export function SodicLogo({ className = 'h-8 sm:h-9 md:h-10 lg:h-11 w-auto' }: LogoProps) {
  return (
    <div dir="ltr" className="inline-flex items-center justify-center">
      <svg
        viewBox="0 0 170 42"
        fill="currentColor"
        className={`${className} max-w-[130px] sm:max-w-[155px] max-h-10 sm:max-h-12 w-auto transition-transform duration-300 select-none`}
        aria-label="SODIC"
        direction="ltr"
        style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
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
          textAnchor="start"
          direction="ltr"
          xmlSpace="preserve"
          style={{ direction: 'ltr', unicodeBidi: 'bidi-override', textAnchor: 'start' }}
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
          fontSize="24"
          fontWeight="900"
          letterSpacing="2.5"
        >
          SODIC
        </text>
      </svg>
    </div>
  )
}

/**
 * 3. TMG (Talaat Moustafa Group - Real Gold Foil Texture Logo)
 */
export function TmgLogo({ className = 'h-9 sm:h-11 md:h-12 lg:h-14 w-auto' }: LogoProps) {
  return (
    <div dir="ltr" className="inline-flex items-center justify-center">
      <img
        src="/images/clients/tmg.png"
        alt="TMG - طلعت مصطفى"
        className={`${className} max-w-[145px] sm:max-w-[170px] max-h-12 sm:max-h-14 w-auto object-contain transition-transform duration-300 select-none`}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

/**
 * 4. ALMARASEM Development Logo (Real Golden Crest + Bilingual Wordmark)
 */
export function AlMarasemLogo({ className = 'h-10 sm:h-12 md:h-13 lg:h-15 w-auto' }: LogoProps) {
  return (
    <div dir="ltr" className="inline-flex items-center justify-center">
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
    <div dir="ltr" className="inline-flex items-center justify-center">
      <img
        src="/images/clients/hydepark.png"
        alt="Hyde Park Developments"
        className={`${className} max-w-[150px] sm:max-w-[175px] max-h-11 sm:max-h-13 w-auto object-contain dark:invert transition-transform duration-300 select-none`}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

/**
 * 6. MISR ITALIA Properties (Square M Emblem + Name)
 */
export function MisrItaliaLogo({ className = 'h-8 sm:h-9 md:h-10 lg:h-11 w-auto' }: LogoProps) {
  return (
    <div dir="ltr" className="inline-flex items-center justify-center">
      <svg
        viewBox="0 0 185 40"
        fill="currentColor"
        className={`${className} max-w-[140px] sm:max-w-[160px] max-h-10 sm:max-h-12 w-auto transition-transform duration-300 select-none`}
        aria-label="MISR ITALIA"
        direction="ltr"
        style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}
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
          textAnchor="start"
          direction="ltr"
          xmlSpace="preserve"
          style={{ direction: 'ltr', unicodeBidi: 'bidi-override', textAnchor: 'start' }}
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
          textAnchor="start"
          direction="ltr"
          xmlSpace="preserve"
          style={{ direction: 'ltr', unicodeBidi: 'bidi-override', textAnchor: 'start' }}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="7"
          fontWeight="600"
          letterSpacing="3"
          opacity="0.75"
        >
          PROPERTIES
        </text>
      </svg>
    </div>
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
