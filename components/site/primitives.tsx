import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonLinkProps = {
  href: string
  children: React.ReactNode
  variant?: 'gold' | 'outline' | 'solid' | 'text'
  className?: string
  arrow?: 'up' | 'right' | 'none'
}

export function ButtonLink({
  href,
  children,
  variant = 'outline',
  className,
  arrow = 'up',
}: ButtonLinkProps) {
  const Icon = arrow === 'up' ? ArrowUpRight : ArrowRight
  const base =
    'group inline-flex items-center gap-3 eyebrow transition-all duration-500 ease-out whitespace-nowrap active:scale-[0.975] active:duration-100 select-none cursor-pointer'
  const variants = {
    gold: 'border border-gold text-gold px-6 py-4 hover:bg-gold hover:text-charcoal',
    outline:
      'border border-current px-6 py-4 hover:bg-foreground hover:text-background hover:border-foreground',
    solid: 'bg-gold text-charcoal px-6 py-4 hover:bg-foreground hover:text-background',
    text: 'link-line text-current py-1',
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      <span>{children}</span>
      {arrow !== 'none' && (
        <Icon
          className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
          aria-hidden
        />
      )}
    </Link>
  )
}

export function Eyebrow({
  children,
  className,
  gold = false,
}: {
  children: React.ReactNode
  className?: string
  gold?: boolean
}) {
  return (
    <p className={cn('eyebrow', gold ? 'text-gold' : 'text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function SectionIndex({
  n,
  label,
  className,
  dark = false,
}: {
  n: string
  label: string
  className?: string
  dark?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-4 eyebrow', className)}>
      <span className="text-gold">{n}</span>
      <span className={dark ? 'text-stone/60' : 'text-stone'}>/</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}

export function GoldRule({ className }: { className?: string }) {
  return <span className={cn('block h-px w-12 bg-gold', className)} aria-hidden />
}

export function Display({
  children,
  className,
  as: Tag = 'h2',
  size = 'lg',
}: {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}) {
  const sizes = {
    sm: 'text-3xl md:text-4xl',
    md: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl lg:text-7xl',
    xl: 'text-6xl md:text-7xl lg:text-8xl',
    '2xl': 'text-6xl md:text-8xl lg:text-9xl',
  }
  return <Tag className={cn('display text-balance', sizes[size], className)}>{children}</Tag>
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  dark = false,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
  dark?: boolean
}) {
  return (
    <section className={cn('pt-40 pb-20 md:pt-52 md:pb-28', dark && 'surface-dark')}>
      <div className="container-viwan flex flex-col gap-8">
        {eyebrow && (
          <Eyebrow gold className="animate-fade-up">
            {eyebrow}
          </Eyebrow>
        )}
        <Display as="h1" size="xl" className="animate-fade-up [animation-delay:100ms] max-w-5xl">
          {title}
        </Display>
        {subtitle && (
          <p className="max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground animate-fade-up [animation-delay:200ms]">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
