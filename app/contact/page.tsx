'use client'

import React, { useState } from 'react'
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

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, lang } = useLanguage()

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectLocation: '',
    projectType: '',
    projectSize: '',
    budget: '',
    stage: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        projectType: '',
        projectSize: '',
        budget: '',
        stage: '',
        message: '',
      })
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Location Dropdown Options
  const locationOptions =
    lang === 'ar'
      ? [
          { value: '', label: 'اختر موقع المشروع' },
          { value: 'Cairo / New Cairo, Egypt', label: 'القاهرة / القاهرة الجديدة، مصر' },
          { value: 'Sheikh Zayed / 6th October, Egypt', label: 'الشيخ زايد / 6 أكتوبر، مصر' },
          { value: 'North Coast / Sahel, Egypt', label: 'الساحل الشمالي، مصر' },
          { value: 'Riyadh, Saudi Arabia', label: 'الرياض، المملكة العربية السعودية' },
          { value: 'Jeddah / Red Sea, Saudi Arabia', label: 'جدة / البحر الأحمر، السعودية' },
          { value: 'Damascus, Syria', label: 'دمشق، سوريا' },
          { value: 'International / Other', label: 'دولي / موقع آخر' },
        ]
      : [
          { value: '', label: 'Select location' },
          { value: 'Cairo / New Cairo, Egypt', label: 'Cairo / New Cairo, Egypt' },
          { value: 'Sheikh Zayed / 6th October, Egypt', label: 'Sheikh Zayed / 6th October, Egypt' },
          { value: 'North Coast / Sahel, Egypt', label: 'North Coast / Sahel, Egypt' },
          { value: 'Riyadh, Saudi Arabia', label: 'Riyadh, Saudi Arabia' },
          { value: 'Jeddah / Red Sea, Saudi Arabia', label: 'Jeddah / Red Sea, Saudi Arabia' },
          { value: 'Damascus, Syria', label: 'Damascus, Syria' },
          { value: 'International / Other', label: 'International / Other' },
        ]

  // Type Dropdown Options
  const typeOptions =
    lang === 'ar'
      ? [
          { value: '', label: 'اختر نوع المشروع' },
          { value: 'Private Residence / Luxury Villa', label: 'فيلا سكنية خاصة فاخرة' },
          { value: 'Palace / Private Estate', label: 'قصر / ملكية خاصة' },
          { value: 'Commercial & Office HQ', label: 'مقر إداري وتجاري' },
          { value: 'Hospitality & Boutique Resort', label: 'منتجع وضيافة سياحية' },
          { value: 'Landscape Masterplanning', label: 'مخطط عام ولاندسكيب' },
          { value: 'Interior Design & Fit-Out', label: 'تصميم داخلي وتشطيب فاخر' },
        ]
      : [
          { value: '', label: 'Select project type' },
          { value: 'Private Residence / Luxury Villa', label: 'Private Residence / Luxury Villa' },
          { value: 'Palace / Private Estate', label: 'Palace / Private Estate' },
          { value: 'Commercial & Office HQ', label: 'Commercial & Office HQ' },
          { value: 'Hospitality & Boutique Resort', label: 'Hospitality & Boutique Resort' },
          { value: 'Landscape Masterplanning', label: 'Landscape Masterplanning' },
          { value: 'Interior Design & Fit-Out', label: 'Interior Design & Fit-Out' },
        ]

  // Size Dropdown Options
  const sizeOptions =
    lang === 'ar'
      ? [
          { value: '', label: 'اختر مساحة المشروع' },
          { value: 'Under 500 m²', label: 'أقل من 500 م²' },
          { value: '500 – 1,500 m²', label: '500 – 1,500 م²' },
          { value: '1,500 – 3,500 m²', label: '1,500 – 3,500 م²' },
          { value: '3,500 – 10,000 m²', label: '3,500 – 10,000 م²' },
          { value: 'Over 10,000 m² / Masterplan', label: 'أكثر من 10,000 م² / مخطط رئيسي' },
        ]
      : [
          { value: '', label: 'Select project size' },
          { value: 'Under 500 m²', label: 'Under 500 m²' },
          { value: '500 – 1,500 m²', label: '500 – 1,500 m²' },
          { value: '1,500 – 3,500 m²', label: '1,500 – 3,500 m²' },
          { value: '3,500 – 10,000 m²', label: '3,500 – 10,000 m²' },
          { value: 'Over 10,000 m² / Masterplan', label: 'Over 10,000 m² / Masterplan' },
        ]

  // Budget Dropdown Options
  const budgetOptions =
    lang === 'ar'
      ? [
          { value: '', label: 'اختر الميزانية التقديرية' },
          { value: '$150,000 – $300,000', label: '150,000$ – 300,000$' },
          { value: '$300,000 – $600,000', label: '300,000$ – 600,000$' },
          { value: '$600,000 – $1,500,000', label: '600,000$ – 1,500,000$' },
          { value: '$1,500,000 – $3,000,000', label: '1,500,000$ – 3,000,000$' },
          { value: '$3,000,000+', label: 'أكثر من 3,000,000$' },
        ]
      : [
          { value: '', label: 'Select estimated budget' },
          { value: '$150,000 – $300,000', label: '$150,000 – $300,000' },
          { value: '$300,000 – $600,000', label: '$300,000 – $600,000' },
          { value: '$600,000 – $1,500,000', label: '$600,000 – $1,500,000' },
          { value: '$1,500,000 – $3,000,000', label: '$1,500,000 – $3,000,000' },
          { value: '$3,000,000+', label: '$3,000,000+' },
        ]

  // Stage Dropdown Options
  const stageOptions =
    lang === 'ar'
      ? [
          { value: '', label: 'اختر مرحلة المشروع' },
          { value: 'Concept & Feasibility', label: 'الفكرة والجدوى الأولية' },
          { value: 'Land Acquired / Early Planning', label: 'تم شراء الأرض / التخطيط الأولي' },
          { value: 'Architectural Development', label: 'التطوير المعماري والتفاصيل' },
          { value: 'Ready for BIM & Construction', label: 'جاهز للتنفيذ والـ BIM' },
          { value: 'Renovation & Adaptive Reuse', label: 'ترميم وتطوير فراغات قائمة' },
        ]
      : [
          { value: '', label: 'Select project stage' },
          { value: 'Concept & Feasibility', label: 'Concept & Feasibility' },
          { value: 'Land Acquired / Early Planning', label: 'Land Acquired / Early Planning' },
          { value: 'Architectural Development', label: 'Architectural Development' },
          { value: 'Ready for BIM & Construction', label: 'Ready for BIM & Construction' },
          { value: 'Renovation & Adaptive Reuse', label: 'Renovation & Adaptive Reuse' },
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
        className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#12110F] text-charcoal dark:text-ivory border-b border-stone/30 transition-colors duration-500"
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
                      {t.contactPage.phone}
                    </label>
                    <input
                      id="inquiry-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      spellCheck={false}
                      placeholder={t.contactPage.phonePlaceholder}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white dark:bg-[#181614] border border-stone/40 p-3.5 text-sm text-charcoal dark:text-ivory placeholder:text-stone/70 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row 3: Project Location & Project Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-location" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.location}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-location"
                        name="projectLocation"
                        value={form.projectLocation}
                        onChange={(e) => setForm({ ...form, projectLocation: e.target.value })}
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
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-type" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.type}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-type"
                        name="projectType"
                        value={form.projectType}
                        onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                        className="w-full appearance-none bg-white dark:bg-[#181614] border border-stone/40 p-3.5 pe-10 text-sm text-charcoal dark:text-ivory focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs cursor-pointer shadow-2xs"
                      >
                        {typeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-white dark:bg-charcoal text-charcoal dark:text-ivory">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 size-4 text-stone/80 pointer-events-none" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Row 4: Project Size & Estimated Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-size" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.size}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-size"
                        name="projectSize"
                        value={form.projectSize}
                        onChange={(e) => setForm({ ...form, projectSize: e.target.value })}
                        className="w-full appearance-none bg-white dark:bg-[#181614] border border-stone/40 p-3.5 pe-10 text-sm text-charcoal dark:text-ivory focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs cursor-pointer shadow-2xs"
                      >
                        {sizeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-white dark:bg-charcoal text-charcoal dark:text-ivory">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 size-4 text-stone/80 pointer-events-none" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="inquiry-budget" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                      {t.contactPage.budget}
                    </label>
                    <div className="relative">
                      <select
                        id="inquiry-budget"
                        name="budget"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full appearance-none bg-white dark:bg-[#181614] border border-stone/40 p-3.5 pe-10 text-sm text-charcoal dark:text-ivory focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs cursor-pointer shadow-2xs"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-white dark:bg-charcoal text-charcoal dark:text-ivory">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 size-4 text-stone/80 pointer-events-none" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Row 5: Project Stage (Full Width) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-stage" className="text-xs font-medium text-charcoal dark:text-ivory/90 cursor-pointer">
                    {t.contactPage.stage}
                  </label>
                  <div className="relative">
                    <select
                      id="inquiry-stage"
                      name="stage"
                      value={form.stage}
                      onChange={(e) => setForm({ ...form, stage: e.target.value })}
                      className="w-full appearance-none bg-white dark:bg-[#181614] border border-stone/40 p-3.5 pe-10 text-sm text-charcoal dark:text-ivory focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors rounded-xs cursor-pointer shadow-2xs"
                    >
                      {stageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white dark:bg-charcoal text-charcoal dark:text-ivory">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 size-4 text-stone/80 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Row 6: Message (Full Width) */}
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
                  href={`mailto:${t.contactPage.studioEmail}`}
                  className="text-xs sm:text-sm hover:text-gold transition-colors"
                >
                  {t.contactPage.studioEmail}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3.5">
                <Phone className="size-4 text-charcoal dark:text-ivory shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${t.contactPage.studioPhone.replace(/\s/g, '')}`}
                  className="text-xs sm:text-sm hover:text-gold transition-colors tabular-nums"
                >
                  {t.contactPage.studioPhone}
                </a>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-3.5">
                <LinkedinIcon className="size-4 text-charcoal dark:text-ivory shrink-0" />
                <a
                  href={CONTACT.linkedin}
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
                  href={CONTACT.instagram}
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
