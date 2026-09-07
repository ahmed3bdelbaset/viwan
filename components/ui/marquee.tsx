'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: React.ReactNode
  direction?: 'left' | 'right'
  speed?: number
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  direction = 'left',
  speed = 35,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2 select-none [--gap:2rem] [gap:var(--gap)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex shrink-0 justify-around [gap:var(--gap)] min-w-full animate-marquee',
          pauseOnHover && 'group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]',
          direction === 'right' && '[animation-direction:reverse]',
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'flex shrink-0 justify-around [gap:var(--gap)] min-w-full animate-marquee',
          pauseOnHover && 'group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]',
          direction === 'right' && '[animation-direction:reverse]',
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
    </div>
  )
}
