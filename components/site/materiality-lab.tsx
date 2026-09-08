'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Display, Eyebrow, SectionIndex } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { useLanguage } from '@/lib/i18n'
import { Layers, Sparkles, ShieldCheck, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Marquee } from '@/components/ui/marquee'

interface Material {
  id: string
  nameEn: string
  nameAr: string
  taglineEn: string
  taglineAr: string
  originEn: string
  originAr: string
  applicationEn: string
  applicationAr: string
  texture: string
  thermalEn: string
  thermalAr: string
  acousticEn: string
  acousticAr: string
  finishEn: string
  finishAr: string
}

const MATERIALS: Material[] = [
  {
    id: 'travertine',
    nameEn: 'Honed Roman Travertine',
    nameAr: 'الترافرتين الروماني الكلاسيكي',
    taglineEn: 'Porous limestone with natural linear veins, aged by millennia.',
    taglineAr: 'حجر جيري طبيعي بتعريقات طولية ناعمة، يمنح الواجهات سكينة خالدة.',
    originEn: 'Tivoli & Rome, Italy',
    originAr: 'تيفولي وروما، إيطاليا',
    applicationEn: 'Monolithic facades, courtyard floors & infinity pool margins',
    applicationAr: 'الواجهات الحجرية المصمتة، أرضيات الأفنية، وحواف المسابح',
    texture: '/images/detail-courtyard.png',
    thermalEn: 'High thermal inertia (cool desert performance)',
    thermalAr: 'عزل حراري طبيعي ممتاز للمناخ الصحراوي',
    acousticEn: 'Sound absorption with micro-honed cavities',
    acousticAr: 'تشتيت طبيعي لترددات الصوت بفضل المسامات المحفورة',
    finishEn: 'Honed & cross-cut unfilled matt',
    finishAr: 'قص عكسي مطفي غير معالج كيميائياً',
  },
  {
    id: 'walnut',
    nameEn: 'Fluted American Walnut',
    nameAr: 'خشب الجوز الأمريكي المضلع',
    taglineEn: 'Warm, deep-grained timber sculpted into precise architectural fluting.',
    taglineAr: 'أخشاب دافئة مضلعة بدقة نجارين حرفيين لضبط الترددات الصوتية.',
    originEn: 'Appalachian Valleys, USA',
    originAr: 'غابات الأبالاش، الولايات المتحدة',
    applicationEn: 'Acoustic wall paneling, pivot doors & concealed storage',
    applicationAr: 'تجليدات الجدران الصوتية، الأبواب المحورية، والخزائن الخفية',
    texture: '/images/interior-living-fireplace.jpg',
    thermalEn: 'Low conductivity (tactile warmth to touch)',
    thermalAr: 'ملمس دافئ مانع لنقل البرودة',
    acousticEn: 'NRC 0.65 with integrated felt backing',
    acousticAr: 'عامل امتصاص صوتي 0.65 بتقنية التضليع',
    finishEn: 'Hand-rubbed natural zero-VOC matte wax',
    finishAr: 'شمع طبيعي نباتي خالي من الكيماويات',
  },
  {
    id: 'bronze',
    nameEn: 'Aged Architectural Bronze',
    nameAr: 'البرونز المعماري المعتق',
    taglineEn: 'Hand-patinated solid metal that deepens in character over decades.',
    taglineAr: 'معادن نبيلة تزداد عمقاً وجاذبية مع مرور العقود دون أن تفقد صلابتها.',
    originEn: 'Florence, Italy / Cairo Foundry',
    originAr: 'فلورنسا / مسابك القاهرة المعمارية',
    applicationEn: 'Monumental entrance framing, mashrabiya screens & hardware',
    applicationAr: 'بوابات المداخل الضخمة، المشربيات المعاصرة، وإكسسوارات الأبواب',
    texture: '/images/material-metal.png',
    thermalEn: 'Reflective surface minimizing solar heat gain',
    thermalAr: 'عاكس للإشعاع الشمسي المباشر',
    acousticEn: 'Solid mass damping unwanted vibration',
    acousticAr: 'كتلة صلبة تمتص الاهتزازات الميكانيكية',
    finishEn: 'Gunmetal liver-of-sulphur hand oxidization',
    finishAr: 'أكسدة كبريتية يدوية بتدرج دخاني فاحم',
  },
  {
    id: 'concrete',
    nameEn: 'Board-Formed Raw Concrete',
    nameAr: 'الخرسانة المكشوفة بألواح الخشب',
    taglineEn: 'Structural truth displaying the grain of timber formwork.',
    taglineAr: 'أصالة إنشائية مكشوفة تعكس تفاصيل خشب القوالب بكل صدق.',
    originEn: 'Specialized Local Mix (C40/50)',
    originAr: 'خلطة خرسانية خاصة عالية الإجهاد (C40/50)',
    applicationEn: 'Cantilevered slabs, retaining landscape walls & structural pylons',
    applicationAr: 'الأسقف الكابولية الطائرة، جدران اللاندسكيب الساندة، والأعمدة',
    texture: '/images/project-hillside-villa.png',
    thermalEn: 'Massive thermal ballast regulating diurnal cycles',
    thermalAr: 'كتلة تخزين حراري توازن حرارة الليل والنهار',
    acousticEn: 'Heavy mass blocking external airborne sound',
    acousticAr: 'عزل صوتي فائق ضد ضوضاء الشوارع المحيطة',
    finishEn: 'Hydrophobic silane invisible seal',
    finishAr: 'عزل سائل ميكروسكوبي طارد للأمطار والأتربة',
  },
]

export function MaterialityLab() {
  const { lang } = useLanguage()
  const [selectedId, setSelectedId] = useState('travertine')
  const [isPaused, setIsPaused] = useState(false)
  const active = MATERIALS.find((m) => m.id === selectedId) || MATERIALS[0]

  // Auto-cycle through materials every 6 seconds unless user pauses/hovers
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setSelectedId((current) => {
        const currentIndex = MATERIALS.findIndex((m) => m.id === current)
        const nextIndex = (currentIndex + 1) % MATERIALS.length
        return MATERIALS[nextIndex].id
      })
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused])

  // Duplicated list for completely seamless infinite loop without gaps on wide screens
  const tickerMaterials = [...MATERIALS, ...MATERIALS]

  return (
    <section className="section-gap surface-dark border-t border-border overflow-hidden">
      <div className="container-viwan flex flex-col gap-14">
        {/* Section Header */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <SectionIndex n="04" label={lang === 'ar' ? 'معمل الخامات والمادّية' : 'MATERIALITY LAB'} dark />
            <Display as="h2" size="lg" className="text-ivory">
              {lang === 'ar' ? 'فلسفة المادة والملمس المعماري' : 'Honesty of Material & Tactile Sensation'}
            </Display>
          </div>
          <p className="max-w-md text-xs eyebrow text-ivory/60 leading-relaxed">
            {lang === 'ar'
              ? 'نختار خاماتنا من مقالعها الأصلية لتتحمل الزمن وتكتسب جمالاً متجدداً مع كل عام يمر على المبنى.'
              : 'Materials selected directly from source quarries to age gracefully, reflecting timeless character and geographical authenticity.'}
          </p>
        </Reveal>

        {/* Continuous Dynamic Marquee Strip (Loops infinitely and pauses on hover) */}
        <div
          className="relative w-full overflow-hidden border-b border-white/10 pb-2 select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Edge gradient fade masks */}
          <div className="pointer-events-none absolute inset-y-0 start-0 w-12 sm:w-24 z-10 bg-gradient-to-r rtl:bg-gradient-to-l from-[#0E0E0C] via-[#0E0E0C]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 end-0 w-12 sm:w-24 z-10 bg-gradient-to-l rtl:bg-gradient-to-r from-[#0E0E0C] via-[#0E0E0C]/80 to-transparent" />

          <Marquee
            speed={28}
            pauseOnHover={true}
            direction={lang === 'ar' ? 'right' : 'left'}
            className="p-0 gap-6 [--gap:1.5rem]"
          >
            {tickerMaterials.map((m, idx) => {
              const isSelected = m.id === selectedId
              return (
                <button
                  key={`${m.id}-${idx}`}
                  type="button"
                  onClick={() => {
                    setSelectedId(m.id)
                    setIsPaused(true)
                  }}
                  className={cn(
                    'px-4 sm:px-5 py-3 text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-300 border-b-2 -mb-px flex items-center gap-2.5 cursor-pointer shrink-0 rounded-xs',
                    isSelected
                      ? 'border-gold text-gold font-medium bg-white/[0.04] shadow-[0_0_20px_rgba(197,168,128,0.1)]'
                      : 'border-transparent text-ivory/50 hover:text-ivory hover:border-white/20 hover:bg-white/[0.02]'
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full transition-all duration-300',
                      isSelected ? 'bg-gold shadow-[0_0_8px_var(--gold)] scale-125' : 'bg-white/20'
                    )}
                  />
                  <span>{lang === 'ar' ? m.nameAr : m.nameEn}</span>
                </button>
              )
            })}
          </Marquee>
        </div>

        {/* Active Material Interactive Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#141412] border border-white/10 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 end-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Texture Preview */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 group">
              <Image
                src={active.texture}
                alt={active.nameEn}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between eyebrow text-[11px] text-ivory/80">
                <span className="flex items-center gap-1.5 text-gold">
                  <Sparkles className="size-3.5" />
                  <span>{lang === 'ar' ? 'فحص الملمس المجهري' : 'Tactile Specimen'}</span>
                </span>
                <span>{lang === 'ar' ? active.originAr : active.originEn}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Specifications */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="eyebrow text-gold text-xs tracking-widest uppercase">
                {lang === 'ar' ? 'المواصفات التقنية والمصنعية' : 'ENGINEERING SPECIFICATIONS'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
                {lang === 'ar' ? active.nameAr : active.nameEn}
              </h3>
              <p className="text-sm text-ivory/70 leading-relaxed pt-1">
                {lang === 'ar' ? active.taglineAr : active.taglineEn}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex flex-col gap-1 p-3 bg-white/[0.02] border border-white/5">
                <span className="eyebrow text-ivory/50 flex items-center gap-1.5">
                  <Compass className="size-3 text-gold" />
                  {lang === 'ar' ? 'التطبيق المعماري' : 'Application'}
                </span>
                <span className="text-ivory font-medium pt-1">
                  {lang === 'ar' ? active.applicationAr : active.applicationEn}
                </span>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-white/[0.02] border border-white/5">
                <span className="eyebrow text-ivory/50 flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-gold" />
                  {lang === 'ar' ? 'الإنهاء السطحي' : 'Surface Finish'}
                </span>
                <span className="text-ivory font-medium pt-1">
                  {lang === 'ar' ? active.finishAr : active.finishEn}
                </span>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-white/[0.02] border border-white/5">
                <span className="eyebrow text-ivory/50 flex items-center gap-1.5">
                  <Layers className="size-3 text-gold" />
                  {lang === 'ar' ? 'الأداء الحراري' : 'Thermal Behavior'}
                </span>
                <span className="text-ivory/80 pt-1">
                  {lang === 'ar' ? active.thermalAr : active.thermalEn}
                </span>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-white/[0.02] border border-white/5">
                <span className="eyebrow text-ivory/50 flex items-center gap-1.5">
                  <Sparkles className="size-3 text-gold" />
                  {lang === 'ar' ? 'المعامل الصوتي' : 'Acoustic Performance'}
                </span>
                <span className="text-ivory/80 pt-1">
                  {lang === 'ar' ? active.acousticAr : active.acousticEn}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
