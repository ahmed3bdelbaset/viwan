'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PageHero, Display, Eyebrow, SectionIndex } from '@/components/site/primitives'
import { CheckCircle2, Clock, Calendar, ShieldCheck, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { PhoneInput } from '@/components/ui/phone-input'

export default function ConsultationPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, lang } = useLanguage()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Private Residence / Villa',
    location: '',
    preferredDate: '',
    preferredTime: 'Morning (10:00 – 12:00)',
    notes: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [formLoadedAt] = useState(() => Date.now())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          _gotcha_project_scope: honeypot,
          _formLoadedAt: formLoadedAt,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule consultation.')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Cinematic Hero Section with Architects & Engineers Reviewing Plans */}
      <section className="relative min-h-[52vh] lg:min-h-[58vh] flex flex-col justify-end surface-dark overflow-hidden select-none">
        {/* Background Photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/consultation-architects.jpg"
            alt="Architects and engineers reviewing building plans and scale models at twilight"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center animate-scale-in"
          />
        </div>

        {/* Cinematic Gradient Overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#11110F] via-[#11110F]/65 to-[#11110F]/30 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#11110F]/85 via-[#11110F]/45 to-transparent rtl:bg-gradient-to-l rtl:from-[#11110F]/85 rtl:via-[#11110F]/45 rtl:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="container-viwan relative z-10 w-full pt-32 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Eyebrow gold className="animate-fade-up">
              {t.consultationPage.eyebrow}
            </Eyebrow>

            <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.08] animate-fade-up [animation-delay:150ms] text-balance">
              {t.consultationPage.title}
            </h1>

            <p className="text-sm sm:text-base text-ivory/85 leading-relaxed max-w-2xl animate-fade-up [animation-delay:300ms] text-pretty">
              {t.consultationPage.subtitle}
            </p>
          </div>

          {/* Right Brand Pillar Block */}
          <div className="hidden md:flex flex-col items-end rtl:items-start gap-1 eyebrow text-ivory/60 text-xs tracking-widest animate-fade-in [animation-delay:450ms]">
            <span>{lang === 'ar' ? 'استشارة مباشرة' : 'DIRECT ADVISORY'}</span>
            <span>{lang === 'ar' ? 'تقييم الموقع' : 'SITE FEASIBILITY'}</span>
            <span className="text-gold flex items-center gap-2">
              <span>{lang === 'ar' ? 'تدقيق تقني وهندسي' : 'TECHNICAL RIGOR'}</span>
              <span className="h-px w-6 bg-gold inline-block" aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>

      {/* 01 — Consultation Booking Form & Architecture Session */}
      <section id="booking-form" className="section-gap border-t border-stone/40 bg-[#FAF7F2] dark:bg-[#12110F] architectural-hairline-grid">
        <div className="container-viwan grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left Column: What to expect in 30 mins */}
          <div className="lg:col-span-5 flex flex-col gap-10 reveal">
            <div className="flex flex-col gap-4">
              <SectionIndex n={t.consultationPage.agendaIndex} label={t.consultationPage.agendaLabel} />
              <Display as="h2" size="sm">
                {t.consultationPage.agendaHeading}
              </Display>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t.consultationPage.agendaSub}
              </p>
            </div>

            <div className="flex flex-col gap-6 divide-y divide-stone/40 border-y border-stone/40 py-2">
              <div className="pt-4 flex items-start gap-4">
                <Clock className="size-5 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="eyebrow text-xs text-charcoal font-bold mb-1">{t.consultationPage.item1Title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.consultationPage.item1Desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-4">
                <Calendar className="size-5 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="eyebrow text-xs text-charcoal font-bold mb-1">{t.consultationPage.item2Title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.consultationPage.item2Desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-4">
                <ShieldCheck className="size-5 text-gold shrink-0 mt-1" />
                <div>
                  <h3 className="eyebrow text-xs text-charcoal font-bold mb-1">{t.consultationPage.item3Title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.consultationPage.item3Desc}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-secondary/50 border border-stone/40 flex flex-col gap-2">
              <p className="eyebrow text-gold text-xs">{t.consultationPage.locationNoteTitle}</p>
              <p className="text-xs text-muted-foreground">
                {t.consultationPage.locationNoteDesc}
              </p>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div id="consultation-form" className="lg:col-span-7 p-8 md:p-12 border border-stone/40 bg-secondary/20 flex flex-col gap-8 reveal">
            <div className="flex flex-col gap-2">
              <SectionIndex n={t.consultationPage.reservationIndex} label={t.consultationPage.reservationLabel} />
              <Display as="h2" size="sm">
                {t.consultationPage.reservationHeading}
              </Display>
              <p className="text-xs text-muted-foreground">
                {t.consultationPage.reservationSub}
              </p>
            </div>

            {success ? (
              <div className="p-10 bg-background border border-gold flex flex-col gap-4 items-center text-center">
                <CheckCircle2 className="size-12 text-gold" strokeWidth={1.5} />
                <h3 className="display text-3xl text-charcoal">{t.consultationPage.sessionRequestedTitle}</h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                  {lang === 'ar' ? (
                    <>شكراً لك، <span className="font-semibold text-charcoal">{form.name}</span>. {t.consultationPage.sessionRequestedMsg}</>
                  ) : (
                    <>Thank you, <span className="font-semibold text-charcoal">{form.name}</span>. {t.consultationPage.sessionRequestedMsg}</>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 eyebrow text-xs text-gold underline cursor-pointer"
                >
                  {t.consultationPage.bookAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Invisible Honeypot Trap for Bot Detection */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} aria-hidden="true">
                  <label htmlFor="consult-scope-hp">Do not fill this</label>
                  <input
                    id="consult-scope-hp"
                    type="text"
                    name="_gotcha_project_scope"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {error && (
                  <div role="alert" aria-live="polite" className="p-4 bg-red-950/10 border border-red-500/30 text-red-600 text-xs eyebrow">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="consult-name" className="eyebrow text-xs text-charcoal cursor-pointer">
                      {lang === 'ar' ? 'الاسم بالكامل' : 'Your Full Name'} <span className="text-gold">*</span>
                    </label>
                    <input
                      id="consult-name"
                      name="name"
                      required
                      type="text"
                      autoComplete="name"
                      placeholder={lang === 'ar' ? 'د. عمر طه' : 'e.g. Dr. Omar Taha'}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-background border border-stone/60 p-3.5 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="consult-email" className="eyebrow text-xs text-charcoal cursor-pointer">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-gold">*</span>
                    </label>
                    <input
                      id="consult-email"
                      name="email"
                      required
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="omar@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-background border border-stone/60 p-3.5 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="consult-phone" className="eyebrow text-xs text-charcoal cursor-pointer">
                      {lang === 'ar' ? 'رقم الهاتف / الواتساب' : 'WhatsApp / Phone'} <span className="text-gold">*</span>
                    </label>
                    <PhoneInput
                      id="consult-phone"
                      name="phone"
                      required
                      placeholder="100 000 0000"
                      value={form.phone}
                      onChange={(val) => setForm({ ...form, phone: val })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="consult-type" className="eyebrow text-xs text-charcoal cursor-pointer">{lang === 'ar' ? 'نوع المشروع' : 'Project Typology'}</label>
                    <select
                      id="consult-type"
                      name="projectType"
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                      className="bg-background border border-stone/60 p-3.5 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none cursor-pointer transition-colors"
                    >
                      <option value="Private Residence / Villa">{lang === 'ar' ? 'فيلا سكنية خاصة' : 'Private Residence / Villa'}</option>
                      <option value="Commercial & Office Fit-Out">{lang === 'ar' ? 'مكاتب ومقرات إدارية' : 'Commercial & Office Fit-Out'}</option>
                      <option value="Hospitality & Coastal House">{lang === 'ar' ? 'شاليهات وضيافة ساحلية' : 'Hospitality & Coastal House'}</option>
                      <option value="Landscape Masterplanning">{lang === 'ar' ? 'مخطط لاندسكيب عام' : 'Landscape Masterplanning'}</option>
                      <option value="BIM & Technical Audit">{lang === 'ar' ? 'تدقيق تقني وهندسي BIM' : 'BIM & Technical Audit'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="consult-date" className="eyebrow text-xs text-charcoal cursor-pointer">{t.consultationPage.preferredDate}</label>
                    <input
                      id="consult-date"
                      name="preferredDate"
                      type="date"
                      value={form.preferredDate}
                      onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                      className="bg-background border border-stone/60 p-3.5 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="consult-time" className="eyebrow text-xs text-charcoal cursor-pointer">{t.consultationPage.preferredTime}</label>
                    <select
                      id="consult-time"
                      name="preferredTime"
                      value={form.preferredTime}
                      onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                      className="bg-background border border-stone/60 p-3.5 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none cursor-pointer transition-colors"
                    >
                      <option value="Morning (10:00 – 12:00)">{lang === 'ar' ? 'صباحاً (10:00 – 12:00)' : 'Morning (10:00 – 12:00)'}</option>
                      <option value="Afternoon (13:00 – 15:00)">{lang === 'ar' ? 'ظهراً (13:00 – 15:00)' : 'Afternoon (13:00 – 15:00)'}</option>
                      <option value="Late Afternoon (16:00 – 18:00)">{lang === 'ar' ? 'عصراً (16:00 – 18:00)' : 'Late Afternoon (16:00 – 18:00)'}</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="consult-notes" className="eyebrow text-xs text-charcoal cursor-pointer">{t.consultationPage.notesLabel}</label>
                  <textarea
                    id="consult-notes"
                    name="notes"
                    rows={3}
                    placeholder={lang === 'ar' ? 'أين يقع المشروع؟ وما هي أهم الأهداف أو الاستفسارات التي تود مناقشتها في هذه الجلسة؟' : 'Where is the project located? What are the key goals or questions for this consultation?'}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="bg-background border border-stone/60 p-3.5 text-sm focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none transition-colors"
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-gold text-charcoal py-4 eyebrow text-xs hover:bg-charcoal hover:text-ivory transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 active:scale-[0.98] duration-100 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-3.5 border-2 border-charcoal border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                      <span>{t.consultationPage.securingBtn}</span>
                    </span>
                  ) : (
                    <>
                      <span>{t.consultationPage.confirmBtn}</span>
                      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
