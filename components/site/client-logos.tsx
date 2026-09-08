import React from 'react'

interface LogoProps {
  className?: string
}

/**
 * 1. EMAAR Properties Logo
 */
export function EmaarLogo({ className = 'h-5 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      aria-label="EMAAR"
    >
      <text
        x="50%"
        y="68%"
        textAnchor="middle"
        fontFamily="'Times New Roman', Times, 'Cormorant Garamond', Georgia, serif"
        fontSize="25"
        fontWeight="700"
        letterSpacing="6"
      >
        EMAAR
      </text>
    </svg>
  )
}

/**
 * 2. SODIC Logo (Isometric 3D Cube + Bold SODIC)
 */
export function SodicLogo({ className = 'h-6 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 165 38"
      fill="currentColor"
      className={className}
      aria-label="SODIC"
    >
      {/* 3D Isometric Cube Symbol */}
      <g transform="translate(4, 3)">
        {/* Top Face */}
        <polygon points="16,3 29,10 16,17 3,10" opacity="0.95" />
        {/* Left Face */}
        <polygon points="3,12 15,19 15,33 3,26" opacity="0.65" />
        {/* Right Face */}
        <polygon points="17,19 29,12 29,26 17,33" opacity="0.8" />
      </g>
      {/* SODIC Wordmark */}
      <text
        x="42"
        y="26"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="21"
        fontWeight="900"
        letterSpacing="1.5"
      >
        SODIC
      </text>
    </svg>
  )
}

/**
 * 3. TMG (Talaat Moustafa Group - Stepped Pyramid Triangle + TMG)
 */
export function TmgLogo({ className = 'h-6 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 155 38"
      fill="currentColor"
      className={className}
      aria-label="TMG"
    >
      {/* Stepped Triangular Pyramid Icon */}
      <g transform="translate(4, 5)">
        {/* Peak */}
        <polygon points="15,2 10,10 20,10" />
        {/* Middle Tier */}
        <polygon points="9,13 4,20 26,20 21,13" opacity="0.85" />
        {/* Base Tier */}
        <polygon points="3,23 0,28 30,28 27,23" opacity="0.7" />
      </g>
      {/* TMG Text */}
      <text
        x="42"
        y="26"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="2"
      >
        TMG
      </text>
    </svg>
  )
}

/**
 * 4. ALMARASEM Development Logo (Heraldic Crown Crest + Name)
 */
export function AlMarasemLogo({ className = 'h-8 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="currentColor"
      className={className}
      aria-label="ALMARASEM DEVELOPMENT"
    >
      {/* Royal Crest / Shield */}
      <g transform="translate(68, 2)">
        <path
          d="M12,0 L16,4 L20,0 L22,6 L2,6 L4,0 L8,4 Z"
          opacity="0.9"
        />
        <path
          d="M2,8 L22,8 L20,18 C19,23 12,26 12,26 C12,26 5,23 4,18 Z"
          opacity="0.75"
        />
        <line x1="12" y1="9" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" />
      </g>
      {/* Name */}
      <text
        x="50%"
        y="36"
        textAnchor="middle"
        fontFamily="'Times New Roman', Times, 'Cormorant Garamond', Georgia, serif"
        fontSize="13"
        fontWeight="700"
        letterSpacing="2.5"
      >
        ALMARASEM
      </text>
      <text
        x="50%"
        y="45"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="6.5"
        fontWeight="600"
        letterSpacing="3"
        opacity="0.8"
      >
        DEVELOPMENT
      </text>
    </svg>
  )
}

/**
 * 5. HYDE PARK Developments (Geometric Grid Cross + Name)
 */
export function HydeParkLogo({ className = 'h-6 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 170 38"
      fill="currentColor"
      className={className}
      aria-label="HYDE PARK"
    >
      {/* Geometric Grid Cross Symbol */}
      <g transform="translate(6, 6)">
        <rect x="0" y="0" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>
      {/* Text */}
      <text
        x="38"
        y="20"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="14"
        fontWeight="700"
        letterSpacing="2"
      >
        HYDE PARK
      </text>
      <text
        x="39"
        y="30"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="6.5"
        fontWeight="500"
        letterSpacing="2.5"
        opacity="0.75"
      >
        DEVELOPMENTS
      </text>
    </svg>
  )
}

/**
 * 6. MISR ITALIA Properties (Square M Emblem + Name)
 */
export function MisrItaliaLogo({ className = 'h-6 w-auto' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 175 38"
      fill="currentColor"
      className={className}
      aria-label="MISR ITALIA"
    >
      {/* Square M Icon */}
      <g transform="translate(4, 5)">
        <rect x="0" y="0" width="26" height="26" rx="2" fill="currentColor" />
        {/* Cutout Stylized M */}
        <polygon
          points="5,21 5,6 9,6 13,14 17,6 21,6 21,21 17.5,21 17.5,10 14,17 12,17 8.5,10 8.5,21"
          fill="#FAF8F5"
        />
      </g>
      {/* Text */}
      <text
        x="37"
        y="20"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="14.5"
        fontWeight="800"
        letterSpacing="1"
      >
        MISR ITALIA
      </text>
      <text
        x="38"
        y="30"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="6.5"
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
