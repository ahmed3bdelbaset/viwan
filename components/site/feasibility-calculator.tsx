'use client'

import { useState } from 'react'
import { Display, Eyebrow, SectionIndex } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { useLanguage } from '@/lib/i18n'
import { ArrowRight, Calculator, Calendar, Clock, FileCheck, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TypologyOption {
  id: string
  titleEn: string
  titleAr: string
  baseWeeks: number
  baseMonthsExec: number
  deliverablesCount: number
}

const TYPOLOGIES: TypologyOption[] = [
  {
    id: 'villa',
    titleEn: 'Private Luxury Villa / Residence',
    titleAr: 'فيلا سكنية فاخرة أو قصر خاص',
    baseWeeks: 10,
    baseMonthsExec: 14,
    deliverablesCount: 120,
  },
  {
    id: 'commercial',
    titleEn: 'Commercial & Corporate HQ',
    titleAr: 'مقر شركات ومكاتب إدارية',
    baseWeeks: 14,
    baseMonthsExec: 18,
    deliverablesCount: 220,
  },
  {
    id: 'hospitality',
    titleEn: 'Hospitality & Boutique Retreat',
    titleAr: 'فندق بوتيك أو منتجع ساحلي',
    baseWeeks: 18,
    baseMonthsExec: 24,
    deliverablesCount: 340,
  },
  {
    id: 'landscape',
    titleEn: 'Landscape & Masterplan',
    titleAr: 'تخطيط وتصميم اللاندسكيب الشامل',
    baseWeeks: 8,
    baseMonthsExec: 10,
    deliverablesCount: 95,
  },
]

export function FeasibilityCalculator({ onSelectParameters }: { onSelectParameters?: (summary: string) => void }) {
  const { lang } = useLanguage()
  const [typology, setTypology] = useState<string>('villa')
  const [area, setArea] = useState<number>(850)
  const [scopes, setScopes] = useState<string[]>(['arch', 'interior', 'bim'])

  const activeTypo = TYPOLOGIES.find((t) => t.id === typology) || TYPOLOGIES[0]

  const toggleScope = (s: string) => {
    setScopes((prev) => (prev.includes(s) ? (prev.length > 1 ? prev.filter((x) => x !== s) : prev) : [...prev, s]))
  }

  // Dynamic calculations based on area and scopes
  const areaMultiplier = Math.max(0.8, Math.min(2.5, area / 700))
  const scopeMultiplier = scopes.length * 0.35 + 0.3
  const designWeeks = Math.round(activeTypo.baseWeeks * areaMultiplier * scopeMultiplier)
  const execMonths = Math.round(activeTypo.baseMonthsExec * Math.pow(areaMultiplier, 0.6))
  const drawingsCount = Math.round(activeTypo.deliverablesCount * (area / 600) * (scopes.length / 2))

  const handleApply = () => {
    const summary = `${activeTypo.titleEn} (${area} m²) - Scopes: ${scopes.join(', ')}`
    if (onSelectParameters) {
      onSelectParameters(summary)
    }
    const target = document.getElementById('consultation-form')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="p-6 sm:p-10 lg:p-12 border border-gold/30 bg-[#141412] relative overflow-hidden">
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-gold text-xs tracking-widest uppercase flex items-center gap-2">
              <Calculator className="size-3.5" />
              <span>{lang === 'ar' ? 'أداة تقدير الجدوى والجدول الزمني' : 'ARCHITECTURAL FEASIBILITY ESTIMATOR'}</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
              {lang === 'ar' ? 'حدد معطيات مشروعك واستكشف مراحله الهندسية' : 'Configure Project Parameters & Timeline'}
            </h3>
          </div>
          <p className="text-xs text-ivory/60 max-w-xs sm:text-right rtl:sm:text-left">
            {lang === 'ar' ? 'خوارزمية حسابية دقيقة مبنية على معايير تسليم المشاريع في VIWAN' : 'Algorithmic estimation aligned with VIWAN delivery standards'}
          </p>
        </div>

        {/* Step 1: Typology */}
        <div className="flex flex-col gap-3">
          <label className="eyebrow text-xs text-ivory/70 tracking-wider">
            {lang === 'ar' ? '1. اختر نوع المشروع' : '1. SELECT TYPOLOGY'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TYPOLOGIES.map((t) => {
              const active = t.id === typology
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTypology(t.id)}
                  className={cn(
                    'p-4 text-start rtl:text-right border transition-all duration-300 flex flex-col gap-1 cursor-pointer rounded-xs',
                    active
                      ? 'border-gold bg-gold/10 text-ivory shadow-lg shadow-gold/5'
                      : 'border-white/10 bg-white/[0.02] text-ivory/60 hover:text-ivory hover:border-white/25'
                  )}
                >
                  <span className="text-xs font-serif font-medium">{lang === 'ar' ? t.titleAr : t.titleEn}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Area Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="eyebrow text-xs text-ivory/70 tracking-wider">
              {lang === 'ar' ? '2. المساحة المبنية الإجمالية (م²)' : '2. TOTAL BUILT-UP AREA (SQM)'}
            </label>
            <span className="font-serif text-2xl text-gold font-light">
              {area.toLocaleString()} <span className="text-xs uppercase font-sans text-ivory/60">m²</span>
            </span>
          </div>
          <input
            type="range"
            min={250}
            max={4000}
            step={50}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full accent-gold bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-ivory/40">
            <span>250 m²</span>
            <span>1,000 m²</span>
            <span>2,000 m²</span>
            <span>4,000+ m²</span>
          </div>
        </div>

        {/* Step 3: Scope of Work */}
        <div className="flex flex-col gap-3">
          <label className="eyebrow text-xs text-ivory/70 tracking-wider">
            {lang === 'ar' ? '3. نطاق الخدمات الهندسية المطلوبة' : '3. REQUIRED ENGINEERING DISCIPLINES'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'arch', en: 'Architecture Design', ar: 'التصميم المعماري' },
              { id: 'interior', en: 'Interior & Joinery', ar: 'التصميم الداخلي والأثاث' },
              { id: 'bim', en: 'BIM & MEP Engineering', ar: 'الهندسة المتكاملة وBIM' },
              { id: 'supervision', en: 'Site Supervision', ar: 'الإشراف الهندسي المباشر' },
            ].map((s) => {
              const checked = scopes.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleScope(s.id)}
                  className={cn(
                    'p-3 text-xs border rounded-xs transition-all duration-300 flex items-center justify-between cursor-pointer',
                    checked
                      ? 'border-gold/60 bg-gold/10 text-gold font-medium'
                      : 'border-white/10 text-ivory/50 hover:border-white/20 hover:text-ivory'
                  )}
                >
                  <span>{lang === 'ar' ? s.ar : s.en}</span>
                  <span className={cn('size-2 rounded-full', checked ? 'bg-gold' : 'bg-white/20')} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Real-time Calculation Result Bar */}
        <div className="p-6 bg-[#0e0e0c] border border-gold/40 rounded-xs grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-e border-white/10 pb-4 sm:pb-0 sm:pe-4">
            <span className="eyebrow text-ivory/50 text-[11px] flex items-center gap-1.5">
              <Clock className="size-3 text-gold" />
              {lang === 'ar' ? 'مدة التصميم والاعتمادات' : 'Design & BIM Duration'}
            </span>
            <span className="font-serif text-3xl text-gold">
              ~{designWeeks} <span className="text-xs uppercase font-sans text-ivory/70">{lang === 'ar' ? 'أسبوعاً' : 'Weeks'}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-e border-white/10 pb-4 sm:pb-0 sm:pe-4">
            <span className="eyebrow text-ivory/50 text-[11px] flex items-center gap-1.5">
              <Calendar className="size-3 text-gold" />
              {lang === 'ar' ? 'مدة التنفيذ المقدرة' : 'Estimated Construction'}
            </span>
            <span className="font-serif text-3xl text-ivory">
              ~{execMonths} <span className="text-xs uppercase font-sans text-ivory/70">{lang === 'ar' ? 'شهراً' : 'Months'}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="eyebrow text-ivory/50 text-[11px] flex items-center gap-1.5">
              <FileCheck className="size-3 text-gold" />
              {lang === 'ar' ? 'المخططات التنفيذية والوثائق' : 'Executive Documentation'}
            </span>
            <span className="font-serif text-3xl text-ivory">
              {drawingsCount}+ <span className="text-xs uppercase font-sans text-ivory/70">{lang === 'ar' ? 'مخطط BIM' : 'BIM Sheets'}</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-4 bg-gold hover:bg-gold-light text-charcoal font-medium text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl active:scale-99"
        >
          <span>{lang === 'ar' ? 'تطبيق هذه المعطيات وحجز استشارة معمارية' : 'APPLY PARAMETERS & BOOK ADVISORY SESSION'}</span>
          <ArrowRight className="size-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  )
}
