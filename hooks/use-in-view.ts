"use client"
import { useEffect, useRef, useState } from "react"

export interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  delay?: number
}

export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
  once = true,
  delay = 0,
}: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false

    if (prefersReduced) {
      setInView(true)
      setHasAnimated(true)
      return
    }

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            setHasAnimated(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setInView(false)
          }
        },
        { threshold, rootMargin }
      )
      observer.observe(el)
      return () => observer.disconnect()
    }, delay)

    return () => clearTimeout(timer)
  }, [threshold, rootMargin, once, delay])

  return { ref, inView, hasAnimated }
}
