import { cn } from '@/lib/utils'

export interface LogoProps {
  className?: string
  markClassName?: string
  subtitle?: boolean
  layout?: 'horizontal' | 'stacked'
  monochrome?: boolean
  showSubtitleOnMobile?: boolean
}

export function Logo({
  className,
  markClassName,
  subtitle = true,
  layout = 'horizontal',
  monochrome = false,
  showSubtitleOnMobile = false,
}: LogoProps) {
  if (layout === 'stacked') {
    return (
      <span dir="ltr" className={cn('inline-flex flex-col items-center text-center select-none', className)}>
        <LogoMark
          monochrome={monochrome}
          className={cn('h-14 md:h-16 w-auto aspect-[312/204] mb-3 shrink-0', markClassName)}
        />
        <span dir="ltr" className="flex flex-col items-center leading-none">
          <span className="font-serif text-2xl md:text-3xl font-normal tracking-[0.34em] ps-1 leading-none">
            VIWAN
          </span>
          {subtitle && (
            <span className="mt-2.5 text-[8.5px] md:text-[9.5px] tracking-[0.28em] uppercase text-gold font-medium leading-none whitespace-nowrap">
              ARCHITECTURE &amp; DESIGN STUDIO
            </span>
          )}
        </span>
      </span>
    )
  }

  return (
    <span dir="ltr" className={cn('inline-flex items-center gap-2.5 sm:gap-3 select-none', className)}>
      <LogoMark
        monochrome={monochrome}
        className={cn('h-6 sm:h-7 w-auto aspect-[312/204] shrink-0', markClassName)}
      />
      <span dir="ltr" className="flex flex-col leading-none">
        <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.32em] ps-0.5 leading-none">
          VIWAN
        </span>
        {subtitle && (
          <span
            className={cn(
              'mt-1.5 text-[7px] sm:text-[8px] tracking-[0.26em] uppercase text-gold font-medium leading-none whitespace-nowrap',
              showSubtitleOnMobile ? 'inline-block' : 'hidden md:inline-block',
            )}
          >
            ARCHITECTURE &amp; DESIGN STUDIO
          </span>
        )}
      </span>
    </span>
  )
}

export function LogoMark({
  className,
  monochrome = false,
}: {
  className?: string
  monochrome?: boolean
}) {
  return (
    <svg
      viewBox="0 0 312 204"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('aspect-[312/204] shrink-0', className)}
      aria-hidden="true"
    >
      {/* 1. Left bold diagonal slash */}
      <path
        d="M0 0 L42 0 L145 202 L109 202 Z"
        fill="currentColor"
      />
      {/* 2. Inner thin diagonal slash */}
      <path
        d="M222 0 L230 0 L156 141 L148 141 Z"
        fill="currentColor"
      />
      {/* 3. Outer right warm gold diagonal slash */}
      <path
        d="M294 0 L311 0 L203 202 L188 202 Z"
        fill={monochrome ? 'currentColor' : 'var(--gold, #af7e49)'}
      />
    </svg>
  )
}
