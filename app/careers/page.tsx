'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  Briefcase,
  MapPin,
  X,
  Layers,
  Users2,
  Sparkles,
  HeartHandshake,
  Send,
} from 'lucide-react'
import { Eyebrow } from '@/components/site/primitives'
import { useLanguage } from '@/lib/i18n'
import { JOBS, Job } from '@/lib/jobs'
import { PhoneInput } from '@/components/ui/phone-input'

export default function CareersPage() {
  const { t, lang } = useLanguage()
  const isAr = lang === 'ar'
  const [heroImgUrl, setHeroImgUrl] = useState('/images/careers-hero-viwan.jpg')
  const [jobsList, setJobsList] = useState<Job[]>(JOBS)

  // Load dynamic hero image from site settings & live jobs
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.siteImages && Array.isArray(data.siteImages)) {
          const img = data.siteImages.find((i: any) => i.id === 'careers-hero')
          if (img?.currentUrl) {
            setHeroImgUrl(img.currentUrl)
          }
        }
      })
      .catch(() => {})

    fetch('/api/jobs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobsList(data.jobs)
        }
      })
      .catch(() => {})
  }, [])

  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [modalRole, setModalRole] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    experience: '3–5 Years',
    note: '',
  })

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalRole(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleOpenModal = (roleTitle: string) => {
    setModalRole(roleTitle)
    setFormSuccess(false)
    setFormError(null)
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)

    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          portfolio: formData.portfolio,
          experience: formData.experience,
          note: formData.note,
          role: modalRole || 'Architectural Designer',
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'فشل إرسال الطلب، يرجى المحاولة لاحقاً.' : 'Failed to submit application.'))
      }

      setFormSuccess(true)
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          portfolio: '',
          experience: '3–5 Years',
          note: '',
        })
      }, 400)
    } catch (err: any) {
      setFormError(err.message || (isAr ? 'تعذر إرسال الطلب، يرجى التحقق من اتصالك والمحاولة لاحقاً.' : 'Error submitting application.'))
    } finally {
      setFormLoading(false)
    }
  }

  const pillarsData = [
    {
      num: '01',
      icon: Layers,
      title: isAr ? 'مشاريع ذات قيمة' : 'Meaningful Projects',
      desc: isAr
        ? 'العمل على مشاريع استثنائية ومتنوعة تترك أثراً حقيقياً.'
        : 'Work on diverse and impactful projects.',
    },
    {
      num: '02',
      icon: Users2,
      title: isAr ? 'ثقافة تشاركية' : 'Collaborative Culture',
      desc: isAr
        ? 'فريق داعم ومتكامل بروح واحدة.'
        : 'A supportive and inclusive team.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: isAr ? 'تطوير مستمر' : 'Continuous Learning',
      desc: isAr
        ? 'طوّر مهاراتك وانمُ معنا باستمرار.'
        : 'Develop your skills and grow with us.',
    },
    {
      num: '04',
      icon: HeartHandshake,
      title: isAr ? 'توازن وجودة حياة' : 'Balanced Life',
      desc: isAr
        ? 'نقدر رفاهيتك وجودة حياتك داخل الاستوديو وخارجه.'
        : 'We value well-being inside and outside work.',
    },
  ]

  const galleryItems = [
    {
      src: '/images/careers-gallery-1.jpg',
      alt: 'Architectural studio pin-up review wall with sketches and blueprints',
    },
    {
      src: '/images/careers-gallery-2.jpg',
      alt: 'Architect drafting notebook, compass, and rolled blueprints',
    },
    {
      src: '/images/careers-gallery-3.jpg',
      alt: 'Modern studio glass corridor with People Places Purpose',
    },
    {
      src: '/images/careers-gallery-4.jpg',
      alt: 'Courtyard olive tree casting natural shadows on warm plaster wall',
    },
  ]

  return (
    <main className="min-h-screen bg-background select-none">
      {/* =========================================================================
          HERO SECTION (Matches Reference Mockup: Studio interior with VIWAN wall)
         ========================================================================= */}
      <section className="relative min-h-[75vh] lg:min-h-[82vh] flex flex-col justify-end surface-dark overflow-hidden">
        {/* Cinematic Studio Photography */}
        <div className="absolute inset-0">
          <Image
            src={heroImgUrl}
            alt="VIWAN Architecture and Design Studio open-plan workspace with illuminated 3D wall branding"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Ambient Dark Gradients for Crisp Editorial Legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#11110F]/95 via-[#11110F]/45 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#11110F]/90 via-[#11110F]/50 to-transparent rtl:bg-gradient-to-l rtl:from-[#11110F]/90 rtl:via-[#11110F]/50 rtl:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Content Grid */}
        <div className="container-viwan relative z-10 w-full pt-36 md:pt-48 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-xl">
            <span className="eyebrow text-xs tracking-[0.25em] text-ivory/70 uppercase">
              {t.careersPage.eyebrow}
            </span>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ivory font-light leading-[1.05] tracking-tight">
              {isAr ? (
                <>
                  ابنِ <br />
                  ما يترك أثراً.
                </>
              ) : (
                <>
                  Build <br />
                  What Matters.
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-md">
              {t.careersPage.subtitle}
            </p>

            <div className="pt-2">
              <a
                href="#open-positions"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 border border-ivory/40 text-ivory eyebrow text-xs tracking-widest hover:bg-gold hover:border-gold hover:text-charcoal transition-all duration-300"
              >
                <span>{t.careersPage.joinOurTeamCta || 'JOIN OUR TEAM'}</span>
                <ArrowRight className="size-3.5 rtl:rotate-180" />
              </a>
            </div>
          </div>

          {/* Far Right Vertical Pillars from Reference */}
          <div className="hidden md:flex flex-col items-start gap-3 eyebrow text-[11px] tracking-[0.25em] text-ivory/60 uppercase">
            <span className="hover:text-gold transition-colors">{t.careersPage.brandPeople || 'PEOPLE'}</span>
            <span className="hover:text-gold transition-colors">{t.careersPage.brandIdeas || 'IDEAS'}</span>
            <span className="hover:text-gold transition-colors">{t.careersPage.brandGrowth || 'GROWTH'}</span>
            <span className="hover:text-gold transition-colors">{t.careersPage.brandImpact || 'IMPACT'}</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 01 / WHY VIWAN (Editorial Ivory Section with 4 Pillars)
         ========================================================================= */}
      <section id="why-viwan" className="bg-[#FAF9F5] border-b border-stone/30 py-16 md:py-24">
        <div className="container-viwan">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            {/* Left Header (Col 1-4) */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className="eyebrow text-xs text-charcoal/60 tracking-widest uppercase">
                {t.careersPage.whyEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-snug">
                {t.careersPage.whyHeading}
              </h2>
            </div>

            {/* Middle Paragraph (Col 5-7) */}
            <div className="lg:col-span-3">
              <p className="text-sm text-charcoal/75 leading-relaxed">
                {t.careersPage.whySubtitle}
              </p>
            </div>

            {/* Right 4 Pillars (Col 8-12) */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 divide-stone/20">
              {pillarsData.map((pillar) => {
                const IconComponent = pillar.icon
                return (
                  <div key={pillar.num} className="flex flex-col gap-3">
                    <div className="size-9 rounded-full bg-stone/20 flex items-center justify-center text-charcoal">
                      <IconComponent className="size-4 text-charcoal" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-sans text-xs font-semibold text-charcoal tracking-wide mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-[11px] text-charcoal/70 leading-normal">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 / OPEN POSITIONS (Dark Split Section: Quote Photo + Positions)
         ========================================================================= */}
      <section id="open-positions" className="bg-[#11110F] text-ivory py-16 md:py-24 border-b border-stone/30">
        <div className="container-viwan">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Image (5 cols): "GOOD DESIGN BUILDS BETTER LIVES." */}
            <div className="lg:col-span-5 relative aspect-[4/3] w-full overflow-hidden border border-white/10 group">
              <Image
                src="/images/careers-studio-workstation-hd.jpg"
                alt="VIWAN studio desk workstation with Good Design Builds Better Lives typography on concrete wall"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Right Positions Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Header with Title and "VIEW ALL POSITIONS →" */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <span className="eyebrow text-xs text-ivory/50 tracking-widest uppercase block mb-1">
                    {t.careersPage.openRolesLabel}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-light">
                    {t.careersPage.opportunitiesHeading}
                  </h2>
                </div>

                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 text-xs eyebrow text-ivory/70 hover:text-gold transition-colors tracking-widest self-start sm:self-auto"
                >
                  <span>{t.careersPage.viewAllPositions || 'VIEW ALL POSITIONS'}</span>
                  <ArrowRight className="size-3.5 rtl:rotate-180" />
                </Link>
              </div>

              {/* Positions Grid matching Reference layout (2 columns of positions) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobsList.map((job) => {
                  const isExpanded = expandedSlug === job.slug
                  const title = isAr ? job.titleAr.replace(/\(.*?\)/g, '').trim() : job.title
                  const loc = isAr ? 'دوام كامل | القاهرة' : 'Full Time | Cairo, Egypt'

                  return (
                    <div
                      key={job.slug}
                      className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedSlug(isExpanded ? null : job.slug)}
                        className="w-full p-5 text-start flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex flex-col gap-1">
                          <h3 className="font-serif text-lg text-ivory group-hover:text-gold transition-colors">
                            {title}
                          </h3>
                          <span className="font-mono text-[11px] text-ivory/50">
                            {loc}
                          </span>
                        </div>

                        <div className="size-7 rounded-full border border-white/20 flex items-center justify-center text-ivory/60 group-hover:border-gold group-hover:text-gold transition-colors shrink-0">
                          {isExpanded ? (
                            <Minus className="size-3.5" />
                          ) : (
                            <Plus className="size-3.5" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Details inside Card */}
                      {isExpanded && (
                        <div className="p-5 pt-0 border-t border-white/10 space-y-4 animate-fade-in">
                          <p className="text-xs text-ivory/75 leading-relaxed mt-3">
                            {isAr ? job.roleAr : job.role}
                          </p>

                          <div className="space-y-1.5">
                            <span className="eyebrow text-[10px] text-gold uppercase tracking-wider block">
                              {isAr ? 'المتطلبات الأساسية' : 'Key Requirements'}
                            </span>
                            <ul className="space-y-1 text-[11px] text-ivory/70">
                              {(isAr ? job.requirementsAr : job.requirements).slice(0, 3).map((req, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="size-1 rounded-full bg-gold mt-1.5 shrink-0" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(title)}
                              className="px-4 py-2 bg-gold text-charcoal eyebrow text-[11px] font-semibold hover:bg-ivory hover:text-charcoal transition-colors cursor-pointer"
                            >
                              {isAr ? 'تقديم طلب' : 'Apply Now'}
                            </button>
                            <Link
                              href="/jobs"
                              className="text-[11px] text-ivory/50 hover:text-ivory underline underline-offset-4"
                            >
                              {isAr ? 'تفاصيل كاملة' : 'Full Details'}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Spontaneous CV prompt */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 text-xs text-ivory/60">
                <span>
                  {isAr
                    ? 'لم تجد تخصصك الدقيق؟ نرحب دائماً بملفات أصحاب المواهب الاستثنائية.'
                    : "Don't see your specific role? We always welcome exceptional architectural portfolios."}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenModal(isAr ? 'طلب توظيف عام' : 'Spontaneous Application')}
                  className="text-gold hover:underline whitespace-nowrap cursor-pointer font-medium"
                >
                  {isAr ? 'أرسل محفظة أعمالك ←' : 'Send General Application →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 / LIFE AT VIWAN (Light 4-Photo Gallery Grid)
         ========================================================================= */}
      <section className="bg-[#FAF9F5] border-b border-stone/30 py-16 md:py-24">
        <div className="container-viwan">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="eyebrow text-xs text-charcoal/60 tracking-widest uppercase">
                {t.careersPage.lifeEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                {t.careersPage.lifeHeading}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-sm text-charcoal/75 leading-relaxed max-w-2xl">
                {t.careersPage.lifeSubtitle}
              </p>
            </div>
          </div>

          {/* 4 Photo Gallery Row matching reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] w-full overflow-hidden bg-stone/20 border border-stone/30 group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CTA BANNER (Ready to take the next step?)
         ========================================================================= */}
      <section className="bg-[#11110F] text-ivory py-16 md:py-20 border-t border-stone/30">
        <div className="container-viwan flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="eyebrow text-xs text-gold tracking-widest uppercase">
              {t.careersPage.readyEyebrow}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory font-light leading-tight">
              {t.careersPage.readyTitle}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenModal(isAr ? 'تقديم سيرة ذاتية' : 'CV Submission')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold text-charcoal eyebrow text-xs tracking-wider font-semibold hover:bg-ivory hover:text-charcoal transition-colors cursor-pointer"
            >
              <span>{t.careersPage.sendCvCta || 'SEND YOUR CV'}</span>
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-ivory/30 text-ivory eyebrow text-xs tracking-wider hover:bg-ivory/10 hover:border-ivory/60 transition-colors"
            >
              <span>{t.careersPage.contactUsCta || 'CONTACT US'}</span>
              <ArrowRight className="size-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          APPLICATION MODAL
         ========================================================================= */}
      {modalRole && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl bg-[#FAF9F5] border border-stone/30 shadow-2xl p-6 sm:p-8 animate-scale-in">
            <button
              type="button"
              onClick={() => setModalRole(null)}
              className="absolute top-4 end-4 size-8 flex items-center justify-center rounded-full bg-charcoal/10 hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="mb-6">
              <span className="eyebrow text-gold text-xs font-semibold block mb-1">
                VIWAN TALENT APPLICATION
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
                {modalRole}
              </h3>
            </div>

            {formSuccess ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="size-12 text-gold mx-auto" />
                <h4 className="font-serif text-2xl text-charcoal">
                  {t.careersPage.applyReceivedTitle}
                </h4>
                <p className="text-sm text-charcoal/70 max-w-sm mx-auto leading-relaxed">
                  {t.careersPage.applyReceivedMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setModalRole(null)}
                  className="px-6 py-2.5 bg-charcoal text-ivory eyebrow text-xs hover:bg-gold hover:text-charcoal transition-colors cursor-pointer"
                >
                  {t.careersPage.closeModal}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="eyebrow text-xs text-charcoal">
                      {t.careersPage.fullName} *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="eyebrow text-xs text-charcoal">
                      {t.careersPage.email} *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="eyebrow text-xs text-charcoal">
                      {t.careersPage.phone} *
                    </label>
                    <PhoneInput
                      required
                      placeholder="100 000 0000"
                      value={formData.phone}
                      onChange={(val) => setFormData({ ...formData, phone: val })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="eyebrow text-xs text-charcoal">
                      {t.careersPage.experienceLevel}
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                    >
                      <option value="1–3 Years">{isAr ? '1 إلى 3 سنوات' : '1–3 Years'}</option>
                      <option value="3–5 Years">{isAr ? '3 إلى 5 سنوات' : '3–5 Years'}</option>
                      <option value="5–8 Years">{isAr ? '5 إلى 8 سنوات' : '5–8 Years'}</option>
                      <option value="8+ Years">{isAr ? 'أكثر من 8 سنوات' : '8+ Years'}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="eyebrow text-xs text-charcoal">
                    {t.careersPage.portfolioLink} *
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://behance.net/... or Google Drive"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="eyebrow text-xs text-charcoal">
                    {t.careersPage.coverNote}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  disabled={formLoading}
                  type="submit"
                  className="w-full py-3.5 bg-gold text-charcoal eyebrow text-xs font-semibold hover:bg-charcoal hover:text-ivory transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? (
                    <span>{t.careersPage.sendingApplication}</span>
                  ) : (
                    <>
                      <span>{t.careersPage.sendApplication}</span>
                      <Send className="size-3.5 rtl:rotate-180" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
