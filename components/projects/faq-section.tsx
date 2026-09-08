'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Minus, ArrowRight, MessageSquareQuote } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { ButtonLink } from '@/components/site/primitives'

interface FaqItemProps {
  num: string
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}

function TypewriterAnswer({ text, isExpanded }: { text: string; isExpanded: boolean }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isExpanded) {
      setDisplayedText('')
      setIsTyping(false)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    // Check if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedText(text)
      setIsTyping(false)
      return
    }

    // Start streaming characters smoothly
    setDisplayedText('')
    setIsTyping(true)
    let index = 0
    // Stream 2 characters per tick for smooth fast reading (approx 12ms per char)
    timerRef.current = setInterval(() => {
      index += 2
      if (index >= text.length) {
        setDisplayedText(text)
        setIsTyping(false)
        if (timerRef.current) clearInterval(timerRef.current)
      } else {
        setDisplayedText(text.slice(0, index))
      }
    }, 24)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isExpanded, text])

  const handleSkip = () => {
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current)
      setDisplayedText(text)
      setIsTyping(false)
    }
  }

  return (
    <div
      onClick={handleSkip}
      className="cursor-pointer select-text text-sm sm:text-base text-ivory/85 leading-relaxed font-light pt-4 pb-6 ps-8 pe-4"
      title={isTyping ? 'Click to show full answer immediately' : undefined}
    >
      <span>{displayedText}</span>
      {isTyping && (
        <span className="inline-block w-1.5 h-4 ms-1 bg-gold animate-pulse align-middle" />
      )}
    </div>
  )
}

function FaqAccordionItem({ num, q, a, isOpen, onToggle }: FaqItemProps) {
  return (
    <div
      className={`border-b transition-colors duration-300 ${
        isOpen ? 'border-gold/60 bg-white/[0.02]' : 'border-stone/25 hover:border-stone/50'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full py-6 flex items-start justify-between gap-4 text-start transition-all group"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-4 sm:gap-6">
          <span className="eyebrow text-xs text-gold/80 pt-1 tracking-widest shrink-0 font-medium">
            {num}
          </span>
          <h3
            className={`font-serif text-lg sm:text-xl transition-colors duration-300 ${
              isOpen ? 'text-gold' : 'text-ivory group-hover:text-gold/90'
            }`}
          >
            {q}
          </h3>
        </div>
        <div
          className={`shrink-0 size-8 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 ${
            isOpen
              ? 'border-gold bg-gold/10 text-gold rotate-180'
              : 'border-stone/40 text-ivory/60 group-hover:border-gold/60 group-hover:text-gold'
          }`}
        >
          {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </div>
      </button>

      {isOpen && <TypewriterAnswer text={a} isExpanded={isOpen} />}
    </div>
  )
}

export function ProjectsFaqSection() {
  const { t, isAr } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = t.projectsPage.faqs || []

  return (
    <section id="projects-faq" className="surface-dark bg-[#0c0b0a] border-t border-stone/30 py-20 sm:py-28 md:py-36 relative overflow-hidden">
      {/* Subtle architectural ambient background glow */}
      <div className="pointer-events-none absolute top-0 start-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 end-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container-viwan relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Big Gold Title & Inquiries Intro (Sticky on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-32">
            <div className="flex flex-col gap-3">
              <span className="eyebrow text-gold text-xs tracking-[0.25em] font-medium uppercase">
                {t.projectsPage.faqEyebrow}
              </span>
              
              {/* Prominent Gold Heading */}
              <h2 className="display text-4xl sm:text-5xl lg:text-6xl text-gold font-light tracking-tight">
                {t.projectsPage.faqTitle}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-ivory/70 leading-relaxed max-w-md">
              {t.projectsPage.faqSubtitle}
            </p>

            {/* Architectural Prompt Card */}
            <div className="mt-4 p-6 border border-stone/30 bg-[#141311]/70 backdrop-blur-md flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gold">
                <MessageSquareQuote className="size-5 shrink-0" />
                <span className="eyebrow text-xs font-semibold text-ivory tracking-wider">
                  {isAr ? 'استفسار مخصص لمشروعك؟' : 'Have a Bespoke Inquiry?'}
                </span>
              </div>
              <p className="text-xs text-ivory/65 leading-relaxed">
                {isAr
                  ? 'فريقنا الهندسي في القاهرة والرياض متاح لمناقشة كراسة شروط مشروعك ودراسة الجدوى الفنية مجاناً.'
                  : 'Our design and engineering principals in Cairo and Riyadh are available to review your brief and site feasibility.'}
              </p>
              <ButtonLink href="/consultation" variant="gold" className="w-full text-center justify-center">
                <span>{isAr ? 'حجز جلسة استشارية معمارية' : 'Book Architectural Consultation'}</span>
                <ArrowRight className="size-3.5 rtl:rotate-180" />
              </ButtonLink>
            </div>
          </div>

          {/* Right Column: FAQ Accordion with Typewriter Answers */}
          <div className="lg:col-span-7 flex flex-col">
            {faqs.map((faq, idx) => (
              <FaqAccordionItem
                key={faq.num || idx}
                num={faq.num}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
