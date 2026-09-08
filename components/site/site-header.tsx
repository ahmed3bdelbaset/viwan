'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, ArrowRight, ArrowLeft, Menu, X, Mail, Phone, MapPin } from 'lucide-react'
import { NAV, CONTACT } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { useLanguage } from '@/lib/i18n'
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  BehanceIcon,
} from '@/components/site/social-icons'

const isDarkHeroRoute = (path: string) => {
  if (!path) return false
  if (path === '/') return true
  if (path === '/projects' || path.startsWith('/projects/')) return true
  if (path === '/services' || path.startsWith('/services/')) return true
  if (path === '/careers' || path.startsWith('/careers/')) return true
  if (path === '/consultation' || path.startsWith('/consultation/')) return true
  if (path === '/how-we-work' || path.startsWith('/how-we-work/')) return true
  if (path === '/studio' || path.startsWith('/studio/')) return true
  if (path === '/contact' || path.startsWith('/contact/')) return true
  return false
}

export function SiteHeader() {
  const pathname = usePathname()
  const { lang, toggleLang, setLang, t } = useLanguage()
  const isAr = lang === 'ar'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const isGateway = pathname?.startsWith('/studio-gateway-vw')
  const overDarkHero = !scrolled && isDarkHeroRoute(pathname || '')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Reset drawer scroll to top whenever it opens
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.scrollTop = 0
    }
  }, [open])

  // Lock background scrolling when the burger menu is open (without killing touch scrolling on the drawer)
  useEffect(() => {
    if (!open) return

    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior
    const originalBodyOverflow = document.body.style.overflow
    const originalBodyOverscroll = document.body.style.overscrollBehavior
    const originalPaddingRight = document.body.style.paddingRight

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll
      document.body.style.overflow = originalBodyOverflow
      document.body.style.overscrollBehavior = originalBodyOverscroll
      document.body.style.paddingRight = originalPaddingRight
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  const getLabel = (itemHref: string, defaultLabel: string) => {
    if (itemHref === '/') return t.nav.home
    if (itemHref === '/projects') return t.nav.projects
    if (itemHref === '/services') return t.nav.services
    if (itemHref === '/studio') return t.nav.studio
    if (itemHref === '/how-we-work') return t.nav.howWeWork
    if (itemHref === '/careers') return t.nav.careers
    if (itemHref === '/contact') return t.nav.contact
    return defaultLabel
  }

  const getSubLabel = (href: string) => {
    if (href === '/') return isAr ? 'استوديو العمارة والتصميم' : 'Architecture & Design Studio'
    if (href === '/projects') return isAr ? 'الأعمال المختارة 2018–2026' : 'Selected Works 2018–2026'
    if (href === '/services') return isAr ? 'العمارة والتصميم الداخلي والهندسة' : 'Architecture, Interiors & Engineering'
    if (href === '/studio') return isAr ? 'الفلسفة والقيادة وثقافة العمل' : 'Philosophy, Leadership & Culture'
    if (href === '/how-we-work') return isAr ? 'منهجية العمل المتكاملة من 6 مراحل' : 'Integrated 6-Stage Process'
    if (href === '/careers') return isAr ? 'انضم إلى فريقنا في القاهرة والرياض' : 'Join Our Multidisciplinary Team'
    if (href === '/contact') return isAr ? 'ابدأ حواراً معمارياً لمشروعك' : 'Start a Project Consultation'
    return ''
  }

  const isAdminOrGateway =
    pathname?.startsWith('/studio-gateway-vw') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/portal-vault')

  if (isAdminOrGateway) return null

  return (
    <>
      {/* =========================================================================
          MONA HUSSEIN LUXURY ARCHITECTURAL NAVBAR (Zero Blur Top + 2% to 10% Scroll Gradient)
         ========================================================================= */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 w-full text-ivory select-none border-none shadow-none',
          scrolled ? 'bg-transparent' : 'bg-transparent',
        )}
        style={{
          background: scrolled
            ? 'linear-gradient(to top, rgba(14, 14, 12, 0) 0%, rgba(14, 14, 12, 0.15) 15%, rgba(14, 14, 12, 0.45) 35%, rgba(14, 14, 12, 0.78) 65%, rgba(14, 14, 12, 0.96) 100%)'
            : 'transparent',
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative flex h-20 md:h-[88px] items-center justify-between">
          {/* Start / Left Group: 3-Line Chic Burger Menu Button + Language Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3 z-30">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={isAr ? 'فتح القائمة' : 'Open menu'}
              aria-expanded={open}
              className="group flex items-center justify-center gap-2.5 p-2 md:px-3 md:py-2 rounded-xs border-0 md:border md:border-white/20 md:hover:border-gold transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none select-none text-ivory bg-transparent active:scale-95"
            >
              {/* 3 Chic Architectural Lines (No background box) */}
              <div className="flex flex-col gap-1 w-5 items-start justify-center">
                <span className="h-[1.5px] w-5 bg-current rounded-full transition-all duration-300 group-hover:w-3.5 group-hover:bg-gold" />
                <span className="h-[1.5px] w-3.5 bg-current rounded-full transition-all duration-300 group-hover:w-5 group-hover:bg-gold" />
                <span className="h-[1.5px] w-4.5 bg-current rounded-full transition-all duration-300 group-hover:w-3 group-hover:bg-gold" />
              </div>
              {/* Text hidden on mobile, visible only on desktop/tablet */}
              <span className="hidden md:inline-block eyebrow text-xs tracking-[0.2em] font-medium group-hover:text-gold transition-colors">
                {isAr ? 'القائمة' : 'MENU'}
              </span>
            </button>

            {/* Language Switcher in Navbar: Visible only at top of page, disappears into burger menu on scroll */}
            {!scrolled && (
              <button
                type="button"
                onClick={toggleLang}
                aria-label={lang === 'en' ? 'التبديل إلى اللغة العربية' : 'Switch to English'}
                className="hidden sm:inline-flex items-center eyebrow text-xs px-2.5 py-1.5 rounded-xs border border-white/20 text-ivory hover:border-gold hover:text-gold transition-all duration-300 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none animate-fade-in"
              >
                <span>{lang === 'en' ? 'العربية' : 'English'}</span>
              </button>
            )}
          </div>

          {/* Centered Logo (Strict Mona Hussein Layout Symmetry + High Contrast Shadow) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
            <Link
              href="/"
              aria-label="VIWAN home"
              className={cn(
                'block active:scale-98 transition-all duration-300',
                scrolled && 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
              )}
            >
              <Logo />
            </Link>
          </div>

          {/* End / Right Group: Free Consultation CTA (Matching Arabic Button Style) */}
          <div className="flex items-center gap-2.5 sm:gap-3 z-30">
            <Link
              href="/consultation"
              className="hidden md:inline-flex items-center gap-2 eyebrow text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xs border border-white/20 text-ivory hover:border-gold hover:text-gold transition-all duration-300 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none group tracking-wider font-medium"
            >
              <span>{isAr ? 'استشارة مجانية' : '30 MINS CONSULTATION'}</span>
              <ArrowUpRight className="size-3.5 rtl:-rotate-90 text-ivory/70 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          PROFESSIONAL ARCHITECTURAL BURGER MENU OVERLAY
          - Numbered links: 01, 02, 03...
          - Rich mouse hover interactions (dimming, slide, glow, arrow reveal)
          - Professional editorial typography (Cormorant Garamond serif)
          - Social media icons (Instagram, LinkedIn, WhatsApp, Facebook, Behance)
         ========================================================================= */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-0 z-[100] w-full h-full bg-[#0E0E0C]/98 backdrop-blur-3xl text-ivory flex flex-col justify-between overflow-x-hidden overflow-y-auto overscroll-contain transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none',
          open
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-[1.02]',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {/* Architectural Ambient Glow (Clipped to prevent horizontal spill) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 start-1/4 size-[600px] bg-gold/5 rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 end-1/4 size-[600px] bg-gold/5 rounded-full blur-[140px]" />
        </div>

        {/* Drawer Header: Always lock Logo on left and controls on right */}
        <div
          dir="ltr"
          className="container-viwan w-full max-w-full flex h-20 md:h-[88px] items-center justify-between shrink-0 border-b border-white/10 relative z-10"
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="VIWAN home"
            className="active:scale-98 transition-transform shrink-0"
          >
            <Logo />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Bilingual Switcher Inside Drawer */}
            <div className="flex items-center border border-white/15 rounded-xs p-0.5 bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={cn(
                  'px-3 py-1 text-xs eyebrow font-medium transition-colors rounded-xs cursor-pointer',
                  lang === 'en'
                    ? 'bg-gold text-charcoal font-semibold'
                    : 'text-ivory/60 hover:text-ivory',
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={cn(
                  'px-3 py-1 text-xs eyebrow font-medium transition-colors rounded-xs cursor-pointer',
                  lang === 'ar'
                    ? 'bg-gold text-charcoal font-semibold'
                    : 'text-ivory/60 hover:text-ivory',
                )}
              >
                العربية
              </button>
            </div>

            {/* Architectural Close Button with Hover Rotation */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
              className="size-11 sm:size-12 rounded-full border border-white/15 hover:border-gold hover:text-gold hover:rotate-90 active:scale-90 transition-all duration-300 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              <X className="size-5 sm:size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Drawer Main Content */}
        <div className="container-viwan w-full max-w-full overflow-x-hidden flex-1 py-4 sm:py-6 lg:py-8 relative z-10 flex flex-col justify-start">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
            {/* Left 7-8 Cols: Numbered Links with Interactive Hover */}
            <div className="w-full lg:col-span-8">
              <span className="eyebrow text-xs text-gold/70 tracking-[0.25em] uppercase block mb-3 sm:mb-4">
                {isAr ? 'خريطة الاستوديو والأقسام' : 'NAVIGATION & DISCIPLINES'}
              </span>

              {/* Group/navlist: Hovering any item softly dims others */}
              <nav aria-label="Menu Links" className="group/navlist flex flex-col divide-y divide-white/[0.06]">
                {NAV.map((item, idx) => {
                  const num = `0${idx + 1}`
                  const active = isActive(item.href)
                  const label = getLabel(item.href, item.label)
                  const subLabel = getSubLabel(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'group/item relative flex items-baseline justify-between py-2 sm:py-2.5 lg:py-3 transition-all duration-300 cursor-pointer overflow-hidden max-w-full',
                        'group-hover/navlist:opacity-35 hover:!opacity-100',
                        'ltr:hover:translate-x-3 rtl:hover:-translate-x-3',
                      )}
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        {/* Number (01, 02...) */}
                        <span className="font-mono text-xs sm:text-sm text-gold/60 group-hover/item:text-gold font-semibold tracking-widest shrink-0 transition-colors">
                          {num}
                        </span>

                        {/* Title in Professional Cormorant Serif Font */}
                        <span
                          className={cn(
                            'font-serif text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight transition-all duration-300',
                            active
                              ? 'text-gold'
                              : 'text-ivory group-hover/item:text-gold group-hover/item:italic',
                          )}
                        >
                          {label}
                        </span>
                      </div>

                      {/* Right Detail: Sub-label + Interactive Arrow */}
                      <div className="flex items-center gap-3 shrink-0 ms-4">
                        <span className="hidden md:inline-block font-sans text-xs tracking-wider text-ivory/40 uppercase group-hover/item:text-ivory/80 transition-colors">
                          {subLabel}
                        </span>

                        <div className="size-8 rounded-full border border-transparent group-hover/item:border-gold/40 flex items-center justify-center text-gold transition-all duration-300">
                          {isAr ? (
                            <ArrowLeft className="size-4 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all duration-300" />
                          ) : (
                            <ArrowRight className="size-4 opacity-0 group-hover/item:opacity-100 translate-x-2 group-hover/item:translate-x-0 transition-all duration-300" />
                          )}
                        </div>
                      </div>

                      {/* Hairline expanding hover accent */}
                      <span
                        className="absolute bottom-0 start-0 h-px w-0 bg-gradient-to-r from-gold via-gold/60 to-transparent group-hover/item:w-full transition-all duration-500 ease-out"
                        aria-hidden="true"
                      />
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Social Media Icons directly under Contact */}
              <div className="lg:hidden pt-6 pb-2 border-t border-white/[0.08] mt-4">
                <span className="eyebrow text-[11px] text-gold/80 tracking-[0.2em] uppercase block mb-3 font-semibold">
                  {isAr ? 'تواصل معنا' : 'CONNECT WITH US'}
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                    className="size-9 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center text-ivory/80 hover:text-gold hover:border-gold hover:bg-gold/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="size-4" />
                  </a>
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="size-9 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center text-ivory/80 hover:text-gold hover:border-gold hover:bg-gold/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <InstagramIcon className="size-4" />
                  </a>
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="size-9 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center text-ivory/80 hover:text-gold hover:border-gold hover:bg-gold/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <LinkedInIcon className="size-4" />
                  </a>
                  <a
                    href={CONTACT.behance}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Behance"
                    title="Behance"
                    className="size-9 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center text-ivory/80 hover:text-gold hover:border-gold hover:bg-gold/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <BehanceIcon className="size-4" />
                  </a>
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="size-9 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center text-ivory/80 hover:text-gold hover:border-gold hover:bg-gold/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <FacebookIcon className="size-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right 4-5 Cols: Studio Identity & Direct Contact (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 lg:border-s lg:border-white/10 lg:ps-10">
              {/* Studio Locations */}
              <div className="space-y-4">
                <span className="eyebrow text-xs text-gold/70 tracking-[0.25em] uppercase block">
                  {isAr ? 'المقرات والاستوديوهات' : 'OUR STUDIOS'}
                </span>

                <div className="space-y-3 text-xs text-ivory/70 leading-relaxed">
                  <div>
                    <strong className="text-ivory block font-medium">
                      {isAr ? 'استوديو القاهرة' : 'Cairo Studio'}
                    </strong>
                    <span>El Tessen St, New Cairo, Egypt</span>
                  </div>
                  <div>
                    <strong className="text-ivory block font-medium">
                      {isAr ? 'استوديو الرياض' : 'Riyadh Studio'}
                    </strong>
                    <span>King Fahd Rd, Al Olaya, Riyadh, KSA</span>
                  </div>
                </div>
              </div>

              {/* Inquiries */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-ivory/75">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Mail className="size-3.5 text-gold shrink-0" />
                  <span>{CONTACT.email}</span>
                </a>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Phone className="size-3.5 text-gold shrink-0" />
                  <span dir="ltr">{CONTACT.phone}</span>
                </a>

                {/* Social Media Icons directly under Phone Number */}
                <div className="pt-2 flex items-center gap-2.5">
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                    className="size-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-ivory/75 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <WhatsAppIcon className="size-3.5" />
                  </a>
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="size-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-ivory/75 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <InstagramIcon className="size-3.5" />
                  </a>
                  <a
                    href={CONTACT.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    className="size-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-ivory/75 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <LinkedInIcon className="size-3.5" />
                  </a>
                  <a
                    href={CONTACT.behance}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Behance"
                    title="Behance"
                    className="size-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-ivory/75 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <BehanceIcon className="size-3.5" />
                  </a>
                  <a
                    href={CONTACT.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="size-8 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-ivory/75 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <FacebookIcon className="size-3.5" />
                  </a>
                </div>
              </div>

              {/* Quick Consultation Highlight Card */}
              <div className="p-5 bg-white/[0.03] border border-gold/40 rounded-xs space-y-3">
                <span className="eyebrow text-[10px] text-gold tracking-widest block uppercase">
                  {isAr ? 'استشارة معمارية مجانية' : 'COMPLIMENTARY CONSULTATION'}
                </span>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  {isAr
                    ? 'جلسة حوارية مدتها 30 دقيقة لمناقشة فكرة مشروعك، جدواه الهندسية، والميزانية المتوقعة.'
                    : 'A 30-minute private session with our partners to discuss your brief, feasibility, and design direction.'}
                </p>
                <Link
                  href="/consultation"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 text-xs eyebrow text-gold hover:text-ivory transition-colors font-medium"
                >
                  <span>{isAr ? 'حجز جلسة استشارة الآن' : 'Book a Session Now'}</span>
                  <ArrowUpRight className="size-3.5 rtl:-rotate-90" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer: Social Media Icons + Copyright */}
        <div className="container-viwan w-full max-w-full overflow-hidden py-6 border-t border-white/10 shrink-0 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          {/* Social Media Icons Section */}
          <div className="flex items-center gap-3">
            <span className="eyebrow text-[11px] text-ivory/50 uppercase tracking-widest me-1 hidden sm:inline-block">
              {isAr ? 'تابعنا:' : 'FOLLOW US:'}
            </span>

            {/* WhatsApp */}
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
              className="size-10 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-ivory/70 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <WhatsAppIcon className="size-4" />
            </a>

            {/* Instagram */}
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="size-10 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-ivory/70 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <InstagramIcon className="size-4" />
            </a>

            {/* LinkedIn */}
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="size-10 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-ivory/70 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <LinkedInIcon className="size-4" />
            </a>

            {/* Behance */}
            <a
              href={CONTACT.behance}
              target="_blank"
              rel="noreferrer"
              aria-label="Behance"
              title="Behance"
              className="size-10 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-ivory/70 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <BehanceIcon className="size-4" />
            </a>

            {/* Facebook */}
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="size-10 rounded-full border border-white/15 bg-white/[0.02] flex items-center justify-center text-ivory/70 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <FacebookIcon className="size-4" />
            </a>
          </div>

          {/* Copyright & Coordinates */}
          <div className="eyebrow text-[11px] text-ivory/50 tracking-wider text-center sm:text-end">
            <span>© 2026 VIWAN ARCHITECTURE & DESIGN STUDIO</span>
            <span className="hidden md:inline mx-2">•</span>
            <span className="hidden md:inline text-gold/70">CAIRO & RIYADH</span>
          </div>
        </div>
      </div>
    </>
  )
}
