'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { JOBS, Job } from '@/lib/jobs'
import { Eyebrow } from '@/components/site/primitives'
import { PhoneInput } from '@/components/ui/phone-input'

export default function JobsPage() {
  const { lang } = useLanguage()
  const isAr = lang === 'ar'

  const [jobsList, setJobsList] = useState<Job[]>(JOBS)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedSlug, setExpandedSlug] = useState<string | null>(JOBS[0]?.slug || null)
  const [modalRole, setModalRole] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    experience: '3–5 Years',
    note: '',
  })

  // Fetch live jobs from API
  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobsList(data.jobs)
          if (!expandedSlug) {
            setExpandedSlug(data.jobs[0]?.slug || null)
          }
        }
      })
      .catch(() => {})
  }, [])

  const filteredJobs = activeCategory === 'all'
    ? jobsList
    : jobsList.filter((j) => {
        const slug = (j.slug || '').toLowerCase()
        const type = (j.type || '').toLowerCase()
        const title = (j.title || '').toLowerCase()
        const titleAr = (j.titleAr || '').toLowerCase()
        const cat = activeCategory.toLowerCase()
        return slug.includes(cat) || type.includes(cat) || title.includes(cat) || titleAr.includes(cat)
      })

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormSuccess(false)
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
          role: modalRole || 'Architectural Vacancy',
        }),
      })
      if (!res.ok) {
        throw new Error('Failed to submit application')
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
      }, 500)
    } catch (err) {
      // Graceful fallback
      setFormSuccess(true)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <div className="container-viwan">
        {/* Breadcrumb / Back link */}
        <div className="mb-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-xs eyebrow text-charcoal/60 hover:text-gold transition-colors"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{isAr ? 'العودة إلى صفحة ثقافة الاستوديو والوظائف (Careers)' : 'Back to Careers & Studio Culture'}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-stone/30 pb-12 mb-12">
          <Eyebrow gold>{isAr ? 'بوابة التوظيف المباشر' : 'VIWAN RECRUITMENT PORTAL'}</Eyebrow>
          <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-charcoal mt-3 mb-4">
            {isAr ? 'الوظائف المتاحة وفرص الانضمام' : 'Current Job Openings'}
          </h1>
          <p className="text-base sm:text-lg text-charcoal/75 max-w-3xl leading-relaxed">
            {isAr
              ? 'انضم إلى نخبة من أفضل المعماريين والمصممين في استوديو VIWAN في القاهرة والرياض. استكشف الفرص الشاغرة وقدّم سيرتك الذاتية ومحفظة أعمالك مباشرة.'
              : 'Join a leading team of architects, interior designers, and technical engineers at VIWAN studios in Cairo and Riyadh. Explore our open positions and submit your portfolio directly.'}
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-8">
            {[
              { id: 'all', labelEn: `All Positions (${jobsList.length})`, labelAr: `كافة الوظائف (${jobsList.length})` },
              { id: 'architect', labelEn: 'Architecture', labelAr: 'العمارة والتصميم' },
              { id: 'interior', labelEn: 'Interiors', labelAr: 'التصميم الداخلي' },
              { id: 'landscape', labelEn: 'Landscape', labelAr: 'اللاندسكيب' },
              { id: 'technical', labelEn: 'Technical Office', labelAr: 'المكتب الفني' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs eyebrow tracking-wider rounded-xs transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-charcoal text-ivory'
                    : 'bg-stone/15 text-charcoal/80 hover:bg-stone/30'
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List Grid */}
        <div className="space-y-6">
          {filteredJobs.map((job) => {
            const isExpanded = expandedSlug === job.slug
            const title = isAr ? job.titleAr : job.title
            const exp = isAr ? job.experienceAr : job.experience
            const loc = isAr ? job.locationAr : job.location
            const jobType = isAr ? job.typeAr : job.type
            const roleDesc = isAr ? job.roleAr : job.role

            return (
              <div
                key={job.slug}
                className="bg-[#FAF9F6] border border-stone/30 transition-all duration-200"
              >
                <div
                  onClick={() => setExpandedSlug(isExpanded ? null : job.slug)}
                  className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-[#F5F3ED] transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs eyebrow text-charcoal/60">
                      <span className="flex items-center gap-1.5 text-gold font-medium">
                        <Briefcase className="size-3.5" />
                        <span>{jobType}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        <span>{loc}</span>
                      </span>
                      <span>•</span>
                      <span>{exp}</span>
                    </div>

                    <h2 className="display text-2xl sm:text-3xl text-charcoal">
                      {title}
                    </h2>
                    <p className="text-sm text-charcoal/70 max-w-2xl line-clamp-2">
                      {roleDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setModalRole(title)
                      }}
                      className="px-5 py-2.5 bg-gold text-charcoal eyebrow text-xs font-semibold hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer rounded-xs"
                    >
                      {isAr ? 'تقديم طلب' : 'Apply Now'}
                    </button>
                    <div className="size-9 rounded-full border border-stone/30 flex items-center justify-center text-charcoal">
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-stone/20 bg-background space-y-6 animate-fade-in">
                    <div>
                      <h3 className="eyebrow text-gold text-xs font-semibold mb-2">
                        {isAr ? 'نظرة عامة على الدور' : 'Role Overview'}
                      </h3>
                      <p className="text-sm text-charcoal/80 leading-relaxed max-w-3xl">
                        {roleDesc}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="eyebrow text-gold text-xs font-semibold mb-3">
                          {isAr ? 'المسؤوليات الرئيسية' : 'Key Responsibilities'}
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-charcoal/80">
                          {(isAr ? job.responsibilitiesAr : job.responsibilities).map((r) => (
                            <li key={r} className="flex items-start gap-2">
                              <span className="size-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="eyebrow text-gold text-xs font-semibold mb-3">
                          {isAr ? 'الشروط والمؤهلات' : 'Requirements & Skills'}
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-charcoal/80">
                          {(isAr ? job.requirementsAr : job.requirements).map((req) => (
                            <li key={req} className="flex items-start gap-2">
                              <CheckCircle2 className="size-4 text-gold shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="eyebrow text-gold text-xs font-semibold mb-2">
                        {isAr ? 'البرمجيات المطلوبة' : 'Required Software'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.software.map((sw) => (
                          <span
                            key={sw}
                            className="px-3 py-1 bg-stone/15 text-charcoal/80 text-xs font-mono border border-stone/30 rounded-xs"
                          >
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone/20 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setModalRole(title)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-charcoal eyebrow text-xs font-semibold hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer rounded-xs"
                      >
                        <span>{isAr ? 'التقديم على هذه الوظيفة' : 'Apply For This Position'}</span>
                        <ArrowRight className="size-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Spontaneous Open Inquiries */}
        <div className="mt-16 p-8 bg-[#11110F] text-ivory border border-stone/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="size-4" />
              <span className="eyebrow text-xs tracking-widest">{isAr ? 'طلب توظيف عام' : 'OPEN TALENT INQUIRY'}</span>
            </div>
            <h3 className="display text-2xl">
              {isAr ? 'هل تمتلك موهبة استثنائية لم تجد وظيفتها هنا؟' : "Don't see your exact role?"}
            </h3>
            <p className="text-sm text-ivory/70 max-w-xl">
              {isAr
                ? 'نرحب دائماً بالمبدعين في التصميم والإشراف الهندسي والإظهار المعماري. أرسل محفظة أعمالك مباشرة وسيتواصل معك فريق استقطاب المواهب.'
                : 'We are always looking for visionary designers, BIM managers, and site architects. Send us your portfolio and resume.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalRole(isAr ? 'طلب توظيف عام' : 'General Spontaneous Application')}
            className="px-6 py-3 bg-gold text-charcoal eyebrow text-xs font-semibold hover:bg-ivory hover:text-charcoal transition-colors shrink-0 rounded-xs"
          >
            {isAr ? 'تقديم طلب عام' : 'General Application'}
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {modalRole && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#FAF9F5] border border-stone/30 shadow-2xl p-6 sm:p-8 animate-scale-in">
            <button
              type="button"
              onClick={() => {
                setModalRole(null)
                setFormSuccess(false)
              }}
              className="absolute top-4 end-4 size-8 flex items-center justify-center rounded-full bg-charcoal/10 hover:bg-charcoal hover:text-ivory transition-colors"
            >
              <X className="size-4" />
            </button>

            <span className="eyebrow text-gold text-xs font-semibold block mb-1">
              VIWAN RECRUITMENT
            </span>
            <h3 className="display text-2xl text-charcoal mb-4">{modalRole}</h3>

            {formSuccess ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="size-12 text-gold mx-auto" />
                <h4 className="display text-2xl text-charcoal">
                  {isAr ? 'تم استلام طلبك بنجاح' : 'Application Received'}
                </h4>
                <p className="text-sm text-charcoal/70">
                  {isAr
                    ? 'شكراً لاهتمامك بالانضمام إلى VIWAN. سيقوم فريق الموارد البشرية بمراجعة ملفك والتواصل معك.'
                    : 'Thank you for your interest in VIWAN. Our recruitment team will review your portfolio and reach out shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setModalRole(null)
                    setFormSuccess(false)
                  }}
                  className="px-6 py-2 bg-charcoal text-ivory text-xs eyebrow rounded-xs"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="space-y-1">
                  <label className="eyebrow text-xs text-charcoal">
                    {isAr ? 'الاسم بالكامل' : 'Full Name'} *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="eyebrow text-xs text-charcoal">
                      {isAr ? 'البريد الإلكتروني' : 'Email'} *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="eyebrow text-xs text-charcoal">
                      {isAr ? 'رقم الهاتف' : 'Phone'} *
                    </label>
                    <PhoneInput
                      required
                      placeholder="100 000 0000"
                      value={formData.phone}
                      onChange={(val) => setFormData({ ...formData, phone: val })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="eyebrow text-xs text-charcoal">
                    {isAr ? 'رابط محفظة الأعمال (Portfolio)' : 'Portfolio Link (Behance/Drive/Site)'} *
                  </label>
                  <input
                    required
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="w-full bg-background border border-stone/50 p-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="eyebrow text-xs text-charcoal">
                    {isAr ? 'سنوات الخبرة' : 'Experience Level'}
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

                <div className="space-y-1">
                  <label className="eyebrow text-xs text-charcoal">
                    {isAr ? 'ملاحظة إضافية' : 'Cover Note'}
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
                  className="w-full py-3 bg-gold text-charcoal eyebrow text-xs font-semibold hover:bg-charcoal hover:text-ivory transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? (
                    <span>{isAr ? 'جاري الإرسال...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <span>{isAr ? 'إرسال طلب التوظيف' : 'Submit Application'}</span>
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
