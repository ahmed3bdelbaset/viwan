"use client"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/**
 * PageTransition — Curtain wipe using View Transitions API
 * يُضاف مرة واحدة في app/layout.tsx
 */
export function PageTransition() {
  const pathname = usePathname()
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current === pathname) return
    prevPath.current = pathname

    if (!document.startViewTransition) return

    document.startViewTransition(() => {
      // Browser handles the transition using ::view-transition CSS
    })
  }, [pathname])

  return null
}

/**
 * TransitionLink — رابط يُشغّل page transition
 * استخدامه بدلاً من <Link> عند الحاجة لـ custom transition
 */
import Link from "next/link"
import type { ComponentProps } from "react"

export function TransitionLink({ href, children, ...props }: ComponentProps<typeof Link>) {
  const handleClick = () => {
    if (!document.startViewTransition) return
    document.startViewTransition(() => {
      window.history.pushState({}, "", href as string)
    })
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
