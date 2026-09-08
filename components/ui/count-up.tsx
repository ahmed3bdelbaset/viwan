'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: string
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 1800, className = '' }: CountUpProps) {
  // Initialize with initial target value for SSR and SEO
  const [displayValue, setDisplayValue] = useState<string>(value)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimatedRef = useRef<boolean>(false)

  // Extract prefix, numeric value, and suffix
  // e.g. "45+" => prefix: "", num: 45, suffix: "+"
  // "140K+" => prefix: "", num: 140, suffix: "K+"
  // "4" => prefix: "", num: 4, suffix: ""
  const match = value.match(/^([^\d]*)(\d+)(.*)$/)
  const prefix = match ? match[1] : ''
  const targetNum = match ? parseInt(match[2], 10) : 0
  const suffix = match ? match[3] : ''

  useEffect(() => {
    const el = ref.current
    if (!el || targetNum === 0) return

    // If already animated in this session, keep final value
    if (hasAnimatedRef.current) {
      setDisplayValue(value)
      return
    }

    // Honor reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setDisplayValue(value)
      hasAnimatedRef.current = true
      return
    }

    let animFrame: number | null = null
    let startTime: number | null = null

    // Set initial display to 0 before animation begins
    setDisplayValue(`${prefix}0${suffix}`)

    // Adaptive duration: smaller numbers (like 3 or 4) need much less time so they don't stutter,
    // while larger numbers (like 50 or 140) have a brisk, smooth pace
    const effectiveDuration =
      targetNum <= 5
        ? Math.min(duration, 700)
        : targetNum <= 15
        ? Math.min(duration, 1000)
        : Math.min(duration, 1400)

    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      startTime = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / effectiveDuration, 1)

        // Quadratic ease-out curve ensures continuous motion without trailing lag
        const ease = 1 - Math.pow(1 - progress, 2)
        const current = Math.round(ease * targetNum)

        if (current >= targetNum || progress >= 1) {
          setDisplayValue(value)
          return
        }

        setDisplayValue(`${prefix}${current}${suffix}`)
        animFrame = requestAnimationFrame(step)
      }
      if (animFrame) cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            startAnimation()
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (animFrame) cancelAnimationFrame(animFrame)
    }
  }, [value, duration, prefix, targetNum, suffix])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayValue}
    </span>
  )
}
