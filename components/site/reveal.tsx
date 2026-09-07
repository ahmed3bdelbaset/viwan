'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function RevealProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => el.classList.add('is-visible'))
      return
    }

    let lastScrollY = window.scrollY
    const handleScrollDir = () => {
      const currentScrollY = window.scrollY
      if (Math.abs(currentScrollY - lastScrollY) > 4) {
        const dir = currentScrollY > lastScrollY ? 'down' : 'up'
        document.documentElement.setAttribute('data-scroll-dir', dir)
        lastScrollY = currentScrollY
      }
    }
    window.addEventListener('scroll', handleScrollDir, { passive: true })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
          } else {
            // Re-triggerable: When an element leaves viewport (either scrolled above or below),
            // remove .is-visible so that scrolling back towards it reveals it again smoothly in both directions!
            e.target.classList.remove('is-visible')
          }
        })
      },
      { rootMargin: '-20px 0px -20px 0px', threshold: 0.05 },
    )

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        io.observe(el)
      })
    }

    // Initial observation
    observeAll()

    // MutationObserver to automatically detect dynamically mounted elements on client navigation
    const mo = new MutationObserver(() => {
      observeAll()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('scroll', handleScrollDir)
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return <>{children}</>
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article' | 'li' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'figure'
}) {
  return (
    <Tag className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}
