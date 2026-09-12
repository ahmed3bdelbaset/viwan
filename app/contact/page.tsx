'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Users,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { Display, Eyebrow } from '@/components/site/primitives'
import { CairoMapCard } from '@/components/site/cairo-map-card'
import { CONTACT } from '@/lib/site'
import { useLanguage } from '@/lib/i18n'
import { PhoneInput } from '@/components/ui/phone-input'
import { useSiteSettings, formatPhoneTel } from '@/hooks/use-site-settings'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
    </svg>
  )
}

export default function ContactPage() {
  const { t, lang } = useLanguage()
  const { contact, visitorCountry } = useSiteSettings()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectLocation: '',
    message: '',
  })
  const [isCustomLocation, setIsCustomLocation] = useState(false)
  const [customLocationText, setCustomLocationText] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [formLoadedAt] = useState(() => Date.now())

  // Auto-detect project location based on visitor's country
  useEffect(() => {
    if (!form.projectLocation && visitorCountry) {
      if (visitorCountry === 'QA') {
        setForm((f) => ({ ...f, projectLocation: lang === 'ar' ? 'قطر' : 'Qatar' }))
      } else if (visitorCountry === 'SA') {
        setForm((f) => ({ ...f, projectLocation: lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia' }))
      } else if (visitorCountry === 'EG') {
        setForm((f) => ({ ...f, projectLocation: lang === 'ar' ? 'مصر' : 'Egypt' }))
      } else if (visitorCountry === 'AE') {
        setForm((f) => ({ ...f, projectLocation: lang === 'ar' ? 'الإمارات العربية المتحدة' : 'United Arab Emirates' }))
      } else if (visitorCountry === 'KW') {
        setForm((f) => ({ ...f, projectLocation: lang === 'ar' ? 'الكويت' : 'Kuwait' }))
      }
    }
  }, [visitorCountry, lang])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const finalLocation =
      form.projectLocation === 'custom'
        ? customLocationText.trim() || (lang === 'ar' ? 'موقع مخصص' : 'Custom Location')
        : form.projectLocation

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          projectLocation: finalLocation,
          _gotcha_company_title: honeypot,
          _formLoadedAt: formLoadedAt,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit.')
      }

      setSuccess(true)
      setForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        projectLocation: '',
        message: '',
      })
      setIsCustomLocation(false)
      setCustomLocationText('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Location Options: Egypt, Saudi Arabia, Qatar, UAE, Kuwait, Syria, Middle East, or Custom
  const locationOptions =
    lang === 'ar'
      ? [
          { value: '', label: 'اختر موقع المشروع' },
          { value: 'مصر', label: 'مصر' },
          { value: 'المملكة العربية السعودية', label: 'المملكة العربية السعودية' },
          { value: 'قطر', label: 'قطر' },
          { value: 'الإمارات العربية المتحدة', label: 'الإمارات العربية المتحدة' },
          { value: 'الكويت', label: 'الكويت' },
          { value: 'سوريا', label: 'سوريا' },
          { value: 'الشرق الأوسط', label: 'الشرق الأوسط' },
          { value: 'custom', label: 'مخصص / دولة أخرى (اكتب موقعك)' },
        ]
      : [
          { value: '', label: 'Select project location' },
          { value: 'Egypt', label: 'Egypt' },
          { value: 'Saudi Arabia', label: 'Saudi Arabia' },
          { value: 'Qatar', label: 'Qatar' },
          { value: 'United Arab Emirates', label: 'United Arab Emirates' },
          { value: 'Kuwait', label: 'Kuwait' },
          { value: 'Syria', label: 'Syria' },
          { value: 'Middle East', label: 'Middle East' },
          { value: 'custom', label: 'Custom / Other location (Specify)' },
        ]

  return (
    <main className="min-h-screen">
      {/* ========================================================================= */}
      {/* 01. CINEMATIC HERO SECTION                                                */}
      {/* ========================================================================= */}
      <section className="relative min-h-[52vh] lg:min-h-[58vh] flex flex-col justify-end surface-dark overflow-hidden select-none">
        {/* Architectural Photography Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-villa.png"
            alt="Contemporary villa terrace overlooking infinity pool at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center animate-scale-in"
          />
        </div>

        {/* Cinematic Multi-Layer Gradient Overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-[#11110F]/55 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#11110F]/75 via-[#11110F]/35 to-transparent rtl:bg-gradient-to-l rtl:from-[#11110F]/75 rtl:via-[#11110F]/35 rtl:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Content Container */}
        <div className="container-viwan relative z-10 w-full pt-32 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <Eyebrow gold className="animate-fade-up">
              {t.contactPage.heroEyebrow}
            </Eyebrow>

            <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.08] animate-fade-up [animation-delay:150ms] text-balance">
              {t.contactPage.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-xl animate-fade-up [animation-delay:300ms] text-pretty">
              {t.contactPage.heroSubtitle}
            </p>
          </div>

          {/* Brand Pillars Block (Right-aligned in LTR, Left in RTL) */}
          <div className="hidden md:flex flex-col items-end rtl:items-start gap-1 eyebrow text-ivory/60 text-xs tracking-widest animate-fade-in [animation-delay:450ms]">
            <span>{t.contactPage.brandPeople}</span>
            <span>{t.contactPage.brandPlaces}</span>
            <span className="text-gold flex items-center gap-2">
              <span>{t.contactPage.brandPurpose}</span>
              <span className="h-px w-6 bg-gold inline-block" aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. MAIN TWO-COLUMN SECTION (Project Inquiry + Contact Information)        */}
      {/* ========================================================================= */}
      <section
        id="inquiry"
        className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#12110F] text-charcoal dark:text-ivory border-b border-stone/30 transition-colors duration-500 architectural-hairline-grid"
      >
        <div className="container-viwan grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* --------------------------------------------------------------------- */}
          {/* Left Column: Project Inquiry Form                                     */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-8 reveal">
            <div className="flex flex-col gap-2">
              <Eyebrow className="text-gold">{t.contactPage.inquiryEyebrow}</Eyebrow>
              <Display as="h2" size="md" className="font-serif text-charcoal dark:text-ivory">
                {t.contactPage.inquiryTitle}
              </Display>
            </div>

            {success ? (
              <div
                role="status"
                aria-live="polite"
                className="p-10 border border-gold bg-[#F5EFE6]/70 dark:bg-[#1A1815] flex flex-col gap-4 items-center text-center rounded-xs shadow-md animate-fade-in"
              >
                <CheckCircle2 className="size-12 text-gold" strokeWidth={1.5} />
                <h3 className="display text-2xl sm:text-3xl text-charcoal dark:text-ivory">
                  {t.contactPage.inquiryReceivedTitle}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  {t.contactPage.inquiryReceivedMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 eyebrow text-xs text-gold underline cursor-pointer hover:text-charcoal dark:hover:text-ivory transition-colors min-h-[44px] px-4"
                >
                  {t.contactPage.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Invisible Honeypot Trap for Bot Detection */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} aria-hidden="true">
                  <label htmlFor="inquiry-company-title-hp">Do not fill this</label>
                  <input
                    id="inquiry-company-title-hp"
                    type="text"
                    name="_gotcha_company_title"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="p-4 bg-red-950/10 border border-red-500/30 text-red-600 text-xs eyebrow"
                  >
                    {error}
                  </div>
                )}

                {/* Row 1: Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-name" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.fullName} <span className="text-gold">*</span>
                    </label>
                    <input
                      id="inquiry-name"
                      name="name"
                      required
                      type="text"
                      autoComplete="name"
                      placeholder={t.contactPage.fullNamePlaceholder}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white dark:bg-[#181614] border border-stone/40 p-3.5 text-sm text-charcoal dark:text-ivory placeholder:text-stone/70 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs shadow-2xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-company" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.company}
                    </label>
                    <input
                      id="inquiry-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder={t.contactPage.companyPlaceholder}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-white dark:bg-[#181614] border border-stone/40 p-3.5 text-sm text-charcoal dark:text-ivory placeholder:text-stone/70 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-email" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.email} <span className="text-gold">*</span>
                    </label>
                    <input
                      id="inquiry-email"
                      name="email"
                      required
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder={t.contactPage.emailPlaceholder}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white dark:bg-[#181614] border border-stone/40 p-3.5 text-sm text-charcoal dark:text-ivory placeholder:text-stone/70 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs shadow-2xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-phone" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.phone} <span className="text-gold">*</span>
                    </label>
                    <PhoneInput
                      id="inquiry-phone"
                      name="phone"
                      required
                      placeholder="100 000 0000"
                      value={form.phone}
                      onChange={(val) => setForm({ ...form, phone: val })}
                    />
                  </div>
                </div>

                {/* Row 3: Project Location (Egypt, Saudi Arabia, Syria, Middle East, or Custom) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-location" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                    {t.contactPage.location}
                  </label>
                  <div className="relative">
                    <select
                      id="inquiry-location"
                      name="projectLocation"
                      value={form.projectLocation}
                      onChange={(e) => {
                        const val = e.target.value
                        setForm({ ...form, projectLocation: val })
                        if (val === 'custom') {
                          setIsCustomLocation(true)
                        } else {
                          setIsCustomLocation(false)
                        }
                      }}
                      className="w-full appearance-none bg-white dark:bg-[#181614] border border-stone/40 p-3.5 pe-10 text-sm text-charcoal dark:text-ivory focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs cursor-pointer shadow-2xs"
                    >
                      {locationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white dark:bg-charcoal text-charcoal dark:text-ivory">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 size-4 text-stone/80 pointer-events-none" aria-hidden="true" />
                  </div>

                  {/* Custom Location Input (Revealed when "custom" is selected) */}
                  {isCustomLocation && (
                    <div className="mt-2 flex flex-col gap-1.5 animate-fade-in">
                      <label htmlFor="custom-location-text" className="text-xs font-medium text-gold">
                        {lang === 'ar' ? 'حدد موقع المشروع المخصص بالتفصيل' : 'Specify Custom Project Location'} <span className="text-gold">*</span>
                      </label>
                      <input
                        id="custom-location-text"
                        type="text"
                        required={isCustomLocation}
                        placeholder={lang === 'ar' ? 'مثال: دبي، الشارقة، بيروت، لندن...' : 'e.g. Dubai, Sharjah, Beirut, London...'}
                        value={customLocationText}
                        onChange={(e) => setCustomLocationText(e.target.value)}
                        className="w-full bg-white dark:bg-[#181614] border border-gold/60 p-3.5 text-sm text-charcoal dark:text-ivory placeholder:text-stone/70 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs shadow-2xs"
                      />
                    </div>
                  )}
                </div>

                {/* Row 4: Message (Full Width) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-message" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                    {t.contactPage.message} <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t.contactPage.messagePlaceholder}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white dark:bg-[#181614] border border-stone/40 p-3.5 text-sm text-charcoal dark:text-ivory placeholder:text-stone/70 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs shadow-2xs leading-relaxed"
                  />
                </div>

                {/* Submit Button (Solid Charcoal matching reference) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full sm:w-fit px-8 py-4 bg-[#11110F] text-ivory dark:bg-ivory dark:text-charcoal eyebrow text-xs tracking-wider flex items-center justify-center gap-3 transition-[background-color,color,transform] duration-200 hover:bg-gold hover:text-charcoal dark:hover:bg-gold dark:hover:text-charcoal active:scale-[0.98] active:duration-100 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none disabled:opacity-50 min-h-[48px] rounded-xs"
                >
                  <span>{loading ? t.contactPage.submittingBtn : t.contactPage.submitBtn}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* Right Column: Contact Information & Cards                             */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-8 reveal" style={{ transitionDelay: '120ms' }}>
            <div className="flex flex-col gap-2">
              <Eyebrow className="text-gold">{t.contactPage.studioEyebrow}</Eyebrow>
              <Display as="h2" size="md" className="font-serif text-charcoal dark:text-ivory">
                {t.contactPage.studioTitle}
              </Display>
            </div>

            {/* Studio Details List */}
            <div className="flex flex-col gap-4 text-sm text-charcoal/85 dark:text-ivory/85">
              {/* Studio HQ Address */}
              <div className="flex items-start gap-3.5">
                <MapPin className="size-4 text-charcoal dark:text-ivory shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="font-semibold text-charcoal dark:text-ivory tracking-wide">{t.contactPage.studioName}</span>
                  <span className="text-xs text-muted-foreground">{t.contactPage.studioRole}</span>
                  <span className="text-xs text-muted-foreground">{t.contactPage.studioCity}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5">
                <Mail className="size-4 text-charcoal dark:text-ivory shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-xs sm:text-sm hover:text-gold transition-colors font-mono"
                >
                  {contact.email}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3.5">
                <Phone className="size-4 text-charcoal dark:text-ivory shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${formatPhoneTel(contact.phone)}`}
                  className="text-xs sm:text-sm hover:text-gold transition-colors tabular-nums font-mono"
                  dir="ltr"
                >
                  {contact.phone}
                </a>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-3.5">
                <LinkedinIcon className="size-4 text-charcoal dark:text-ivory shrink-0" />
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm hover:text-gold transition-colors"
                >
                  {t.contactPage.studioLinkedin}
                </a>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3.5">
                <InstagramIcon className="size-4 text-charcoal dark:text-ivory shrink-0" />
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm hover:text-gold transition-colors"
                >
                  {t.contactPage.studioInstagram}
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center gap-3.5">
                <Globe className="size-4 text-charcoal dark:text-ivory shrink-0" aria-hidden="true" />
                <a
                  href="https://viwan.studio"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm hover:text-gold transition-colors"
                >
                  {t.contactPage.studioWebsite}
                </a>
              </div>
            </div>

            {/* Cairo Vector Map Card */}
            <CairoMapCard />

            {/* Prefer to speak first? Callout Card */}
            <div className="p-5 sm:p-6 bg-[#FAF7F2] dark:bg-[#161513] border border-stone/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors duration-500 rounded-xs">
              <div className="flex items-center gap-4">
                <div className="size-11 min-h-[44px] min-w-[44px] rounded-full bg-[#EFE7D8] dark:bg-[#2A2621] text-charcoal dark:text-gold flex items-center justify-center shrink-0">
                  <Phone className="size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-serif text-base sm:text-lg text-charcoal dark:text-ivory font-medium">
                    {t.contactPage.calloutTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.contactPage.calloutSubtitle}
                  </p>
                </div>
              </div>

              <Link
                href="/consultation"
                className="eyebrow text-[11px] whitespace-nowrap border border-charcoal/80 dark:border-ivory/80 px-4 py-2.5 hover:bg-gold hover:border-gold hover:text-charcoal dark:hover:bg-gold dark:hover:text-charcoal transition-colors active:scale-95 duration-100 shrink-0 text-center min-h-[44px] flex items-center justify-center rounded-xs"
              >
                <span>{t.contactPage.calloutButton}</span>
                <ArrowRight className="size-3.5 rtl:rotate-180 inline-block ms-2" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. THREE-COLUMN INQUIRIES BAR                                            */}
      {/* ========================================================================= */}
      <section className="border-b border-stone/30 bg-[#FAF7F2] dark:bg-[#12110F] py-14 sm:py-16 transition-colors duration-500">
        <div className="container-viwan grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-stone/30 gap-8 md:gap-0">
          {/* Channel 1: General Inquiries */}
          <div className="reveal flex flex-col gap-3.5 md:px-8 first:md:ps-0 last:md:pe-0 pt-6 md:pt-0">
            <Mail className="size-7 text-charcoal dark:text-ivory stroke-[1.25]" aria-hidden="true" />
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal dark:text-ivory">
              {t.contactPage.channels.general.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.contactPage.channels.general.desc}
            </p>
            <a
              href={`mailto:${t.contactPage.channels.general.email}`}
              className="eyebrow text-xs text-charcoal dark:text-ivory hover:text-gold transition-colors inline-flex items-center gap-2 pt-2 underline underline-offset-4"
            >
              <span>{t.contactPage.channels.general.email}</span>
              <ArrowRight className="size-3 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>

          {/* Channel 2: New Projects */}
          <div className="reveal flex flex-col gap-3.5 md:px-8 first:md:ps-0 last:md:pe-0 pt-6 md:pt-0" style={{ transitionDelay: '100ms' }}>
            <Building2 className="size-7 text-charcoal dark:text-ivory stroke-[1.25]" aria-hidden="true" />
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal dark:text-ivory">
              {t.contactPage.channels.projects.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.contactPage.channels.projects.desc}
            </p>
            <a
              href={`mailto:${t.contactPage.channels.projects.email}`}
              className="eyebrow text-xs text-charcoal dark:text-ivory hover:text-gold transition-colors inline-flex items-center gap-2 pt-2 underline underline-offset-4"
            >
              <span>{t.contactPage.channels.projects.email}</span>
              <ArrowRight className="size-3 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>

          {/* Channel 3: Careers */}
          <div className="reveal flex flex-col gap-3.5 md:px-8 first:md:ps-0 last:md:pe-0 pt-6 md:pt-0" style={{ transitionDelay: '200ms' }}>
            <Users className="size-7 text-charcoal dark:text-ivory stroke-[1.25]" aria-hidden="true" />
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal dark:text-ivory">
              {t.contactPage.channels.careers.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.contactPage.channels.careers.desc}
            </p>
            <Link
              href="/careers"
              className="eyebrow text-xs text-charcoal dark:text-ivory hover:text-gold transition-colors inline-flex items-center gap-2 pt-2 underline underline-offset-4"
            >
              <span>{t.contactPage.channels.careers.linkText}</span>
              <ArrowRight className="size-3 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. BOTTOM CINEMATIC CTA BANNER                                           */}
      {/* ========================================================================= */}
      <section className="reveal relative min-h-[460px] lg:min-h-[500px] flex flex-col justify-end surface-dark overflow-hidden py-16 sm:py-20 select-none">
        {/* Background Architecture Photography */}
        <div className="absolute inset-0">
          <Image
            src="/images/interior-living-fireplace.jpg"
            alt="Warm architectural living space at twilight"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-90"
          />
        </div>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-[#11110F]/65 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* CTA Content Container */}
        <div className="container-viwan relative z-10 w-full flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <Eyebrow gold className="animate-fade-up">
                {t.contactPage.bottomCta.eyebrow}
              </Eyebrow>

              <h2 className="display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.08] animate-fade-up [animation-delay:150ms] text-balance">
                {t.contactPage.bottomCta.title}
              </h2>
            </div>

            {/* Right Brand Pillars */}
            <div className="hidden md:flex flex-col items-end rtl:items-start gap-1 eyebrow text-ivory/60 text-xs tracking-widest">
              <span>{t.contactPage.bottomCta.brandPeople}</span>
              <span>{t.contactPage.bottomCta.brandPlaces}</span>
              <span className="text-gold flex items-center gap-2">
                <span>{t.contactPage.bottomCta.brandPossibilities}</span>
                <span className="h-px w-6 bg-gold inline-block" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/consultation"
              className="eyebrow text-xs whitespace-nowrap bg-[#B88C62] text-charcoal px-6 py-4 hover:bg-ivory transition-colors active:scale-95 duration-100 text-center min-h-[48px] flex items-center justify-center gap-2.5 font-medium rounded-xs"
            >
              <span>{t.contactPage.bottomCta.consultationBtn}</span>
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>

            <a
              href="#inquiry"
              className="eyebrow text-xs whitespace-nowrap border border-ivory/70 text-ivory px-6 py-4 hover:border-gold hover:text-gold transition-colors active:scale-95 duration-100 text-center min-h-[48px] flex items-center justify-center gap-2.5 rounded-xs"
            >
              <span>{t.contactPage.bottomCta.startProjectBtn}</span>
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
