'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { CONTACT } from '@/lib/site'
import { Logo } from './logo'
import { useLanguage } from '@/lib/i18n'
import {
  SocialLinks,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  YouTubeIcon,
} from './social-icons'

export function SiteFooter() {
  const pathname = usePathname()
  const { t, lang } = useLanguage()

  if (pathname?.startsWith('/studio-gateway-vw') || pathname?.startsWith('/admin')) {
    return null
  }

  const navItems = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.projects, href: '/projects' },
    { label: t.nav.services, href: '/services' },
    { label: t.nav.studio, href: '/studio' },
    { label: t.nav.howWeWork, href: '/how-we-work' },
    { label: t.nav.careers, href: '/careers' },
    { label: t.nav.contact, href: '/contact' },
  ]

  return (
    <footer className="surface-dark border-t border-white/10 architectural-hairline-grid-dark relative overflow-hidden">
      <div className="container-viwan py-16 md:py-20 flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-4 flex flex-col gap-5">
            <Logo showSubtitleOnMobile />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            {/* Quick-access Social Icon Buttons (Desktop only here) */}
            <div className="hidden md:flex flex-col gap-2.5 pt-2">
              <span className="eyebrow text-[10.5px] tracking-widest text-muted-foreground/70 uppercase">
                {lang === 'ar' ? 'تابعنا على المنصات' : 'Connect With Studio'}
              </span>
              <SocialLinks size="md" />
            </div>
          </div>

          {/* Navigation & Social Media side-by-side on mobile to save vertical space */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            <nav aria-label="Footer" className="md:col-span-3 flex flex-col gap-3">
              <span className="eyebrow text-xs text-foreground/90 font-medium mb-1 tracking-wider uppercase">
                {lang === 'ar' ? 'التنقل الرئيسي' : 'Navigation'}
              </span>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Social Platforms with Icons & Labels */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="eyebrow text-xs text-foreground/90 font-medium mb-1 tracking-wider uppercase">
                {lang === 'ar' ? 'منصات التواصل' : 'Social Media'}
              </span>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="group flex items-center gap-2.5 eyebrow text-muted-foreground hover:text-gold transition-colors text-xs py-0.5"
              >
                <WhatsAppIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-gold transition-colors" />
                <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
              </a>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="group flex items-center gap-2.5 eyebrow text-muted-foreground hover:text-gold transition-colors text-xs py-0.5"
              >
                <InstagramIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-gold transition-colors" />
                <span>{lang === 'ar' ? 'إنستغرام' : 'Instagram'}</span>
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="group flex items-center gap-2.5 eyebrow text-muted-foreground hover:text-gold transition-colors text-xs py-0.5"
              >
                <FacebookIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-gold transition-colors" />
                <span>{lang === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="group flex items-center gap-2.5 eyebrow text-muted-foreground hover:text-gold transition-colors text-xs py-0.5"
              >
                <LinkedInIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-gold transition-colors" />
                <span>{lang === 'ar' ? 'لينكد إن' : 'LinkedIn'}</span>
              </a>
              <a
                href={CONTACT.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="group flex items-center gap-2.5 eyebrow text-muted-foreground hover:text-gold transition-colors text-xs py-0.5"
              >
                <YouTubeIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-gold transition-colors" />
                <span>{lang === 'ar' ? 'يوتيوب' : 'YouTube'}</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-6">
            <address className="not-italic flex flex-col gap-3 text-sm text-muted-foreground">
              <span>{lang === 'ar' ? 'القاهرة · الرياض' : CONTACT.city}</span>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-foreground transition-colors">
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="hover:text-foreground transition-colors">
                {CONTACT.phone}
              </a>
            </address>

            {/* Connect With Studio at the end on mobile */}
            <div className="flex md:hidden flex-col gap-2.5 pt-4 border-t border-border/40">
              <span className="eyebrow text-[10.5px] tracking-widest text-muted-foreground/70 uppercase">
                {lang === 'ar' ? 'تابعنا على المنصات' : 'Connect With Studio'}
              </span>
              <SocialLinks size="md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border pt-8 eyebrow text-muted-foreground">
          <span>VIWAN © 2026 — {t.footer.allRights}</span>
          <span className="font-serif normal-case tracking-normal text-base italic text-foreground/80">
            {lang === 'ar' ? 'نصنع مساحات لغد أفضل.' : 'Design a better tomorrow.'}
          </span>
          <a href="#top" className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
            {t.footer.backToTop} <ArrowUp className="size-3" strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
