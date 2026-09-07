'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PROCESS } from '@/lib/site'
import { Display, Eyebrow, SectionIndex, ButtonLink } from '@/components/site/primitives'
import { Reveal } from '@/components/site/reveal'
import { FinalCta } from '@/components/site/final-cta'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { Marquee } from '@/components/ui/marquee'

const ARABIC_PROCESS = [
  {
    n: '01',
    title: 'الاكتشاف والتقييم',
    heading: 'فهم أبعاد المشروع وسياقه المكاني.',
    short: 'فهم أبعاد المشروع بدقة.',
    items: ['المتطلبات والبرنامج الفراغي', 'دراسة الموقع والمحددات المناخية', 'احتياجات العميل وأسلوب الحياة', 'تحديد سقف الميزانية التقديرية', 'الرؤية واللغة المعمارية', 'الجدول الزمني المستهدف'],
  },
  {
    n: '02',
    title: 'تحديد المسار',
    heading: 'بلورة التوجه التصميمي وتأصيل الفكرة.',
    short: 'رسم الإطار التصميمي.',
    items: ['المخطط الوظيفي والعلاقات الفراغية', 'الموجز التصميمي المعتمد', 'لوحات الإلهام والمواد الأولية', 'أهداف المشروع الاستثمارية', 'الاشتراطات البلدية والإنشائية'],
  },
  {
    n: '03',
    title: 'التصميم الإبداعي',
    heading: 'تجسيد الرؤية في كتل وفراغات حية.',
    short: 'صياغة الكتل والجماليات.',
    items: ['المفاهيم التصميمية المبدئية', 'المساقط الأفقية والقطاعات', 'الكتل المعمارية والواجهات', 'لوحات المواد والإكساءات', 'اللقطات والمحاكاة ثلاثية الأبعاد'],
  },
  {
    n: '04',
    title: 'تطوير التفاصيل',
    heading: 'تحويل الأفكار إلى تفاصيل دقيقة قابلة للتنفيذ.',
    short: 'حسم التفاصيل والمواد.',
    items: ['التطوير المعماري التفصيلي', 'اختيار المواد والتشطيبات النهائية', 'القرارات والحلول الإنشائية', 'تفاصيل التكسيات والأعمال الخشبية'],
  },
  {
    n: '05',
    title: 'التنسيق وBIM',
    heading: 'دمج كافة التخصصات وتفادي التعارضات.',
    short: 'توافق كامل بين التخصصات.',
    items: ['المخططات المعمارية التنفيذية', 'الهيكل الإنشائي والخرسانات', 'شبكات التكييف والصحي والكهرباء MEP', 'فحص التعارضات عبر Revit BIM', 'التنسيق الشامل بين التخصصات'],
  },
  {
    n: '06',
    title: 'التسليم والتنفيذ',
    heading: 'من لوحات الرسم إلى واقع عمراني مبهر.',
    short: 'تحويل المخططات إلى واقع.',
    items: ['حزمة المخططات التنفيذية الكاملة', 'مستندات الطرح ومقايسات الكميات', 'مراجعة رسومات الورشة Shop Drawings', 'الإشراف الدوري وتوكيد الجودة بالموقع'],
  },
]

export default function HowWeWorkPage() {
  const { t, lang } = useLanguage()

  const stages = lang === 'ar' ? ARABIC_PROCESS : PROCESS

  return (
    <main className="min-h-screen bg-background">
      {/* 1. CINEMATIC PROCESS HERO SECTION (Architectural Methodology & Blueprint Desk) */}
      <section className="relative min-h-[58vh] lg:min-h-[64vh] flex flex-col justify-end surface-dark overflow-hidden select-none">
        {/* Real Architectural Blueprint & Process Desk Photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/how-we-work-hero.jpg"
            alt="Architectural drafting desk with technical drawings, scale rulers, and project coordination schedules"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100"
          />
        </div>

        {/* Directional & Vertical Gradients for Crisp Contrast & Architectural Glow */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/65 to-charcoal/30 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/50 to-transparent rtl:bg-gradient-to-l rtl:from-charcoal/90 rtl:via-charcoal/50 rtl:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Content Container */}
        <div className="container-viwan relative z-10 w-full pt-36 md:pt-44 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Eyebrow gold className="animate-fade-up">
              {t.howWeWorkPage.heroEyebrow}
            </Eyebrow>

            <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.08] animate-fade-up [animation-delay:150ms] text-balance font-serif">
              {t.howWeWorkPage.heroTitle1}
              <br />
              {t.howWeWorkPage.heroTitle2}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-ivory/85 leading-relaxed max-w-2xl animate-fade-up [animation-delay:300ms] text-pretty">
              {t.howWeWorkPage.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-up [animation-delay:400ms]">
              <a
                href="#process-phases"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gold text-charcoal font-medium eyebrow text-xs tracking-wider hover:bg-ivory hover:text-charcoal transition-colors duration-200 rounded-xs"
              >
                <span>{t.howWeWorkPage.explorePhasesCta}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </a>

              <ButtonLink
                href="/consultation"
                variant="outline"
                className="border-ivory/30 text-ivory hover:bg-ivory/10 hover:border-ivory/60"
              >
                <span>{t.howWeWorkPage.bookConsultationCta}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </ButtonLink>
            </div>
          </div>

          {/* Right Brand Pillar Block with Vertical Divider */}
          <div className="hidden md:flex items-center gap-4 animate-fade-in [animation-delay:450ms]">
            <span className="h-16 w-px bg-ivory/30 inline-block" aria-hidden="true" />
            <div className="flex flex-col gap-1 eyebrow text-ivory/70 text-xs tracking-widest font-medium">
              <span>{t.howWeWorkPage.brandPeople}</span>
              <span>{t.howWeWorkPage.brandPlaces}</span>
              <span className="text-gold">{t.howWeWorkPage.brandPurpose}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process Horizontal Bar / Overview */}
      <section id="process-phases" className="border-y border-stone/40 bg-secondary/30 py-6 md:py-8 scroll-mt-20 overflow-hidden">
        {/* Desktop View: Static balanced row */}
        <div className="container-viwan hidden md:flex items-center justify-between gap-4 text-xs eyebrow">
          {stages.map((stage, idx) => (
            <a
              key={stage.n}
              href={`#stage-${stage.n}`}
              className="group/item flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-gold font-bold transition-transform group-hover/item:scale-110">{stage.n}</span>
              <span className="text-charcoal font-medium">{stage.title}</span>
              {idx < stages.length - 1 && (
                <ArrowRight className="size-3.5 text-stone shrink-0 rtl:rotate-180" />
              )}
            </a>
          ))}
        </div>

        {/* Mobile View: Dynamic moving ticker/marquee */}
        <div className="md:hidden relative w-full overflow-hidden select-none py-1" dir="ltr">
          {/* Subtle edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-[#ece7de] via-[#ece7de]/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-[#ece7de] via-[#ece7de]/70 to-transparent" />

          <Marquee speed={22} pauseOnHover={true} className="p-0 gap-6 [--gap:1.5rem]">
            {stages.map((stage) => (
              <a
                key={stage.n}
                href={`#stage-${stage.n}`}
                className="flex items-center gap-3 shrink-0 text-xs eyebrow px-2 hover:opacity-80 active:opacity-60 transition-opacity cursor-pointer"
              >
                <span className="text-gold font-bold">{stage.n}</span>
                <span className="text-charcoal font-medium whitespace-nowrap">{stage.title}</span>
                <ArrowRight className="size-3 text-stone/70 shrink-0" />
              </a>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Detailed Stages Steps */}
      <section className="section-gap">
        <div className="container-viwan flex flex-col gap-24 md:gap-32">
          {stages.map((stage, i) => {
            const isEven = i % 2 === 1
            return (
              <div key={stage.n} id={`stage-${stage.n}`} className="scroll-mt-24 md:scroll-mt-28">
                <Reveal
                  as="div"
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-stone/30 pb-20 md:pb-28"
                >
                {/* Stage Header & Narrative */}
                <div className={`lg:col-span-6 flex flex-col gap-6 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl md:text-5xl font-serif text-gold font-light">
                      {stage.n}
                    </span>
                    <span className="h-px w-10 bg-gold" />
                    <span className="eyebrow text-xs text-muted-foreground">{stage.title}</span>
                  </div>

                  <Display as="h2" size="md" className="text-charcoal leading-tight">
                    {stage.heading}
                  </Display>

                  <p className="text-base text-muted-foreground leading-relaxed">
                    {lang === 'ar'
                      ? `خلال مرحلة ${stage.title}، يتعاون فريقنا الهندسي المتكامل بشكل وثيق مع العميل لضبط المعايير الفنية، وضمان الاستغلال الأمثل للمساحات ومطابقة التطلعات مع الميزانيات المعتمدة.`
                      : `During the ${stage.title.toLowerCase()} phase, our multidisciplinary team collaborates closely with the client to resolve technical parameters, ensure spatial optimization, and align design aspirations with execution timelines.`}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="flex flex-col gap-3 pt-2">
                    <p className="eyebrow text-gold text-xs">{t.howWeWorkPage.milestones}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {stage.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-charcoal">
                          <CheckCircle2 className="size-4 text-gold shrink-0" strokeWidth={1.5} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Imagery / Visual representation */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : ''}`}>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary zoom-img border border-stone/30">
                    <Image
                      src={
                        i === 0
                          ? '/images/detail-courtyard.png'
                          : i === 1
                          ? '/images/interior-dining.png'
                          : i === 2
                          ? '/images/hero-villa.png'
                          : i === 3
                          ? '/images/interior-bedroom.png'
                          : i === 4
                          ? '/images/project-executive-office.png'
                          : '/images/project-private-residence.png'
                      }
                      alt={stage.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-ivory eyebrow text-xs">
                      <span>{lang === 'ar' ? 'المرحلة' : 'PHASE'} {stage.n}</span>
                      <span className="text-gold">{stage.title.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
              </div>
            )
          })}
        </div>
      </section>

      {/* Collaboration Callout */}
      <section className="section-gap surface-dark border-b border-border">
        <div className="container-viwan flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
          <Eyebrow gold className="tracking-[0.2em]">{t.howWeWorkPage.calloutEyebrow}</Eyebrow>
          <Display as="h2" size="lg" className="text-ivory whitespace-pre-line font-serif font-light">
            {t.howWeWorkPage.calloutHeading}
          </Display>
          <p className="text-base md:text-lg text-ivory/80 leading-relaxed max-w-2xl mx-auto font-light">
            {t.howWeWorkPage.calloutSub}
          </p>
          <ButtonLink href="/consultation" variant="solid" className="mt-4">
            {t.howWeWorkPage.scheduleAdvisory}
          </ButtonLink>
        </div>
      </section>

      <FinalCta />
    </main>
  )
}
