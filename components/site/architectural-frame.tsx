'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ArchitecturalFrameProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  label?: string
  scale?: string
  coordinates?: string
  showTicks?: boolean
  showGrid?: boolean
  dark?: boolean
  caption?: string
}

/**
 * ArchitecturalFrame
 * Wraps content in a Swiss-inspired architectural drafting frame with
 * precision corner ticks (┌ ┐ └ ┘), datum crosshairs (+), and technical metadata.
 */
export function ArchitecturalFrame({
  children,
  className,
  innerClassName,
  label,
  scale,
  coordinates,
  showTicks = true,
  showGrid = false,
  dark = false,
  caption,
}: ArchitecturalFrameProps) {
  return (
    <div
      className={cn(
        'relative group',
        showGrid && 'drafting-grid',
        dark && 'surface-dark',
        className
      )}
    >
      {/* Corner Ticks (┌ ┐ └ ┘) */}
      {showTicks && (
        <>
          <span
            className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-gold/70 group-hover:border-gold transition-colors duration-300 pointer-events-none z-20"
            aria-hidden
          />
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-gold/70 group-hover:border-gold transition-colors duration-300 pointer-events-none z-20"
            aria-hidden
          />
          <span
            className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-gold/70 group-hover:border-gold transition-colors duration-300 pointer-events-none z-20"
            aria-hidden
          />
          <span
            className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-gold/70 group-hover:border-gold transition-colors duration-300 pointer-events-none z-20"
            aria-hidden
          />
        </>
      )}

      {/* Technical Header Metadata Bar (Optional) */}
      {(label || scale || coordinates) && (
        <div
          className={cn(
            'flex items-center justify-between gap-4 pb-2 text-[9px] font-mono tracking-wider uppercase select-none',
            dark ? 'text-stone/60' : 'text-stone-500'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold">+</span>
            {label && <span>{label}</span>}
          </div>
          <div className="flex items-center gap-3">
            {coordinates && <span className="hidden sm:inline">{coordinates}</span>}
            {scale && (
              <span className="border border-current px-1.5 py-0.2 text-[8.5px] text-gold border-gold/40">
                {scale}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Framed Content */}
      <div className={cn('relative overflow-hidden', innerClassName)}>
        {children}
      </div>

      {/* Technical Footer Caption (Optional) */}
      {caption && (
        <div
          className={cn(
            'flex items-center justify-between gap-2 pt-2 text-[9px] font-mono tracking-widest uppercase select-none',
            dark ? 'text-stone/50' : 'text-stone-400'
          )}
        >
          <span>{caption}</span>
          <span className="text-gold/60 font-mono">VIWAN // DRAFTING REF</span>
        </div>
      )}
    </div>
  )
}

/**
 * ArchitecturalDivider
 * A hairline horizontal axis line with center datum crosshair (+) and structural level index.
 */
export function ArchitecturalDivider({
  axis,
  label,
  level,
  dark = false,
  className,
}: {
  axis?: string
  label?: string
  level?: string
  dark?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-full py-4 select-none relative flex items-center',
        dark && 'surface-dark',
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          'flex-1 h-px',
          dark ? 'bg-white/10' : 'bg-stone/30'
        )}
      />

      <div
        className={cn(
          'px-4 flex items-center gap-3 text-[9px] font-mono tracking-widest uppercase',
          dark ? 'text-stone/60' : 'text-stone-500'
        )}
      >
        <span className="text-gold font-bold text-xs">+</span>
        {axis && <span className="font-semibold text-foreground">{axis}</span>}
        {label && (
          <>
            <span className="opacity-40">/</span>
            <span>{label}</span>
          </>
        )}
        {level && (
          <span className="hidden md:inline text-stone-400 font-mono">
            [{level}]
          </span>
        )}
        <span className="text-gold font-bold text-xs">+</span>
      </div>

      <div
        className={cn(
          'flex-1 h-px',
          dark ? 'bg-white/10' : 'bg-stone/30'
        )}
      />
    </div>
  )
}

/**
 * TechnicalStamp
 * Architectural drawing stamp with scale, BIM level, and geographic datum.
 */
export function TechnicalStamp({
  code,
  scale = 'SCALE 1:100',
  location,
  bim = 'LOD-400 BIM',
  dark = false,
  className,
}: {
  code?: string
  scale?: string
  location?: string
  bim?: string
  dark?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 border select-none',
        dark
          ? 'bg-black/60 border-white/15 text-stone-300'
          : 'bg-white/80 border-stone/35 text-stone-600',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
      {code && <span className="font-semibold text-foreground">{code}</span>}
      <span className="text-stone/40">|</span>
      <span>{scale}</span>
      {location && (
        <>
          <span className="text-stone/40">|</span>
          <span className="hidden sm:inline">{location}</span>
        </>
      )}
      <span className="text-stone/40">|</span>
      <span className="text-gold">{bim}</span>
    </div>
  )
}

/**
 * DraftingRuler
 * Subtle drafting scale ruler bar.
 */
export function DraftingRuler({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'hidden sm:flex items-center gap-1 font-mono text-[8px] text-stone-400 select-none',
        className
      )}
      aria-hidden
    >
      <span>0m</span>
      <div className="flex items-center h-2 px-1 border-x border-stone-300/80">
        <span className="h-px w-6 bg-stone-300" />
        <span className="h-1.5 w-px bg-stone-300" />
        <span className="h-px w-6 bg-stone-300" />
        <span className="h-1.5 w-px bg-stone-300" />
        <span className="h-px w-6 bg-stone-300" />
      </div>
      <span>15m</span>
      <span className="text-gold/80 ml-1">1:200</span>
    </div>
  )
}
