"use client"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { ReactNode, CSSProperties } from "react"

type RevealVariant = "fade-up" | "fade-in" | "scale-in" | "clip-x" | "slide-right"

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  style?: CSSProperties
  as?: keyof JSX.IntrinsicElements
}

const variantClasses: Record<RevealVariant, string> = {
  "fade-up": "reveal",
  "fade-in": "reveal reveal-fade",
  "scale-in": "reveal reveal-scale",
  "clip-x": "reveal reveal-clip",
  "slide-right": "reveal reveal-left",
}

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration,
  threshold = 0.12,
  className,
  style,
  as: Tag = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold, once: true })

  return (
    <Tag
      ref={ref as any}
      className={cn(variantClasses[variant], inView && "is-visible", className)}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        transitionDuration: duration ? `${duration}ms` : undefined,
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

interface StaggerProps {
  children: ReactNode[]
  variant?: RevealVariant
  staggerMs?: number
  baseDelay?: number
  className?: string
  itemClassName?: string
  as?: keyof JSX.IntrinsicElements
  itemAs?: keyof JSX.IntrinsicElements
}

export function Stagger({
  children,
  variant = "fade-up",
  staggerMs = 80,
  baseDelay = 0,
  className,
  itemClassName,
  as: Tag = "div",
  itemAs = "div",
}: StaggerProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1, once: true })

  return (
    <Tag ref={ref as any} className={className}>
      {children.map((child, i) => (
        <Reveal
          key={i}
          as={itemAs as any}
          variant={variant}
          delay={baseDelay + i * staggerMs}
          className={itemClassName}
        >
          {inView ? child : child}
        </Reveal>
      ))}
    </Tag>
  )
}
