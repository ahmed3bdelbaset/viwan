'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { Logo } from './logo'
import { useLanguage } from '@/lib/i18n'
import { useSiteSettings, formatPhoneTel } from '@/hooks/use-site-settings'
import { SocialLinks } from './social-icons'

export function SiteFooter() {
  const pathname = usePathname()
  const { t, lang } = useLanguage()
  const { contact, companyInfo } = useSiteSettings()

  if (
    pathname?.startsWith('/studio-gateway-vw') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/portal-vault')
  ) {
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

  const footerSummary =
    lang === 'ar'
      ? companyInfo?.footer_summary_ar || contact.footerSummaryAr || t.footer.tagline
      : companyInfo?.footer_summary_en || contact.footerSummaryEn || t.footer.tagline

  return (
    <footer className="surface-dark">
      <div className="container-viwan py-16 md:py-20 flex flex-col gap-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Col 1: Brand & Connect with studio and social media */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <Logo showSubtitleOnMobile />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {footerSummary}
            </p>
            {/* Merged Connect with studio & social media icons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <span className="eyebrow text-[10.5px] tracking-widest text-muted-foreground/80 uppercase">
                {lang === 'ar' ? 'تواصل مع الاستوديو وقنوات التواصل' : 'Connect with studio and social media'}
              </span>
              <SocialLinks size="md" />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <nav aria-label="Footer" className="md:col-span-2 flex flex-col gap-3">
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

          {/* Col 3: OUR STUDIOS (Dynamic Cairo, Riyadh, and any added studios) */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <span className="eyebrow text-xs text-foreground/90 font-medium mb-1 tracking-wider uppercase">
              {lang === 'ar' ? 'مقرات الاستوديو' : 'Our Studios'}
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(contact.studios && contact.studios.length > 0 ? contact.studios : [
                {
                  id: 'cairo',
                  title_ar: 'استوديو القاهرة',
                  title_en: 'Cairo Studio',
                  address_ar: contact.addressCairoAr,
                  address_en: contact.addressCairoEn,
                  phone: contact.phoneCairo,
                  email: contact.email,
                },
                {
                  id: 'riyadh',
                  title_ar: 'استوديو الرياض',
                  title_en: 'Riyadh Studio',
                  address_ar: contact.addressRiyadhAr,
                  address_en: contact.addressRiyadhEn,
                  phone: contact.phoneRiyadh,
                  email: contact.email,
                }
              ]).map((studio, idx) => (
                <div key={studio.id || idx} className="flex flex-col gap-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-gold/30 transition-colors">
                  <h4 className="font-cinzel text-xs font-semibold tracking-wider text-foreground/95 uppercase">
                    {lang === 'ar' ? (studio.title_ar || 'مقر الاستوديو') : (studio.title_en || 'Studio Location')}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === 'ar' ? studio.address_ar : studio.address_en}
                  </p>

                  <div className="flex flex-col gap-1 pt-1.5 border-t border-white/[0.04]">
                    {studio.phone && (
                      <a
                        href={`tel:${formatPhoneTel(studio.phone)}`}
                        className="hover:text-gold transition-colors text-xs font-mono text-foreground/90 flex items-center gap-1.5 w-fit"
                        dir="ltr"
                      >
                        <span className="text-[10px] text-muted-foreground uppercase">{lang === 'ar' ? 'هاتف:' : 'Tel:'}</span>
                        <span>{studio.phone}</span>
                      </a>
                    )}

                    {studio.email && (
                      <a
                        href={`mailto:${studio.email}`}
                        className="hover:text-gold transition-colors text-xs font-mono text-muted-foreground/80 hover:underline w-fit"
                      >
                        {studio.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
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
