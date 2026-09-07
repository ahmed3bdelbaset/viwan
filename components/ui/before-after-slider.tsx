'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { MoveHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  aspectRatio?: string
  className?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Concept / Before',
  afterLabel = 'Realized / After',
  aspectRatio = 'aspect-[16/9]',
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percent)
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    handleMove(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleMove(e.clientX)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setIsDragging(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setSliderPosition((p) => Math.max(0, p - 5))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setSliderPosition((p) => Math.min(100, p + 5))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSliderPosition(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSliderPosition(100)
    }
  }

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative overflow-hidden select-none cursor-ew-resize touch-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none',
        aspectRatio,
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* After Image (Full background) */}
      <Image
        src={afterImage}
        alt="Realized outcome"
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover"
      />
      <div className="absolute top-4 right-4 z-10 bg-charcoal/80 backdrop-blur-sm text-ivory eyebrow px-3 py-1 text-[10px]">
        {afterLabel}
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt="Initial state or concept"
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="absolute top-4 left-4 z-10 bg-charcoal/80 backdrop-blur-sm text-gold eyebrow px-3 py-1 text-[10px]">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gold z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-9 rounded-full bg-charcoal border border-gold text-gold flex items-center justify-center shadow-2xl transition-transform duration-150',
            isDragging ? 'scale-115 ring-4 ring-gold/30' : 'scale-100',
          )}
        >
          <MoveHorizontal className="size-4" />
        </div>
      </div>
    </div>
  )
}
