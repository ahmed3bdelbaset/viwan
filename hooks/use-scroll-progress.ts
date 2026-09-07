"use client"
import { useEffect, useState, useRef } from "react"

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      setProgress(maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0)
      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return progress
}

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down" | null>(null)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setDirection(y > lastY.current ? "down" : "up")
      lastY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return direction
}

export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return scrollY
}
