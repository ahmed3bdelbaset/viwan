'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, X, CheckCircle2 } from 'lucide-react'
import { Eyebrow, ButtonLink } from '@/components/site/primitives'
import { Marquee } from '@/components/ui/marquee'
import { useLanguage } from '@/lib/i18n'

const DISCIPLINES_AR = [
  'الهندسة المعمارية',
  'هندسة الديكور',
  'تنسيق المواقع',
  'التصميم الهندسي',
  'التصميم ثلاثي الأبعاد',
  'إدارة المشروعات',
  'الرسوم المتحركة',
  'التصميم البصري',
]

const DISCIPLINES_EN = [
  'Architecture',
  'Interior Design',
  'Landscape Architecture',
  'Engineering Design',
  '3D Visualization',
  'Project Management',
  'Architectural Animation',
  'Visual Design',
]

interface ServiceDetail {
  num: string
  slug: string
  titleEn: string
  titleAr: string
  image: string
  alt: string
  scopeEn: string[]
  scopeAr: string[]
  descEn: string
  descAr: string
}

const SERVICES_DATA: ServiceDetail[] = [
  {
    num: '01',
    slug: 'architecture',
    titleEn: 'Architecture',
    titleAr: 'الهندسة المعمارية',
    image: '/images/service-architecture.jpg',
    alt: 'Contemporary luxury travertine stone and glass villa at twilight',
    scopeEn: [
      'Concept Design',
      'Schematic Design',
      'Design Development',
      'Architectural Documentation',
      'Façade Design',
      'BIM Coordination',
    ],
    scopeAr: [
      'التصميم المبدئي وتطوير الفكرة',
      'المخططات المعمارية الأولية',
      'تطوير التصميم والنسب الفراغية',
      'الوثائق المعمارية ورخص البناء',
      'تصميم الواجهات والإكساء الخارجي',
      'التنسيق المعماري عبر نماذج BIM',
    ],
    descEn:
      'We craft contextually grounded architectural forms that unite spatial function, authentic proportion, and enduring materiality across residential, commercial, and mixed-use typology.',
    descAr:
      'نبتكر حلولاً معمارية متجذرة في سياقها المكاني، تجمع بين وظيفة الفراغ وأصالة النسب ودقة الإضاءة لتدوم للأجيال القادمة في المشاريع السكنية والتجارية.',
  },
  {
    num: '02',
    slug: 'interior-design',
    titleEn: 'Interior Design',
    titleAr: 'التصميم الداخلي',
    image: '/images/service-interior-design.jpg',
    alt: 'Ultra-luxury modern interior living room with bespoke furniture and cove lighting',
    scopeEn: [
      'Space Planning',
      'Interior Concept',
      'Materials & Finishes',
      'FF&E',
      'Lighting Design',
      'Custom Furniture',
      'Styling & Art Direction',
    ],
    scopeAr: [
      'التخطيط الفراغي وتوزيع الحركة',
      'المفهوم الجمالي الداخلي',
      'انتقاء الخامات والأحجار الطبيعية',
      'جداول الأثاث والتجهيزات FF&E',
      'تصميم الإضاءة المعمارية المتخصصة',
      'تصميم قطع الأثاث المخصصة',
      'التنسيق الفني واختيار التحف الفنية',
    ],
    descEn:
      'Approaching interior design as a sensory spatial choreography — balancing circulation flow, tactile warmth, tailored joinery, and bespoke decorative elements.',
    descAr:
      'نتعامل مع التصميم الداخلي كتجربة فراغية حسية متكاملة — نوازن بين تدفق الحركة، ودفء المواد الطبيعية، وتصميم الإضاءة التخصصية، والقطع الحصرية.',
  },
  {
    num: '03',
    slug: 'landscape-design',
    titleEn: 'Landscape Design',
    titleAr: 'تصميم اللاندسكيب',
    image: '/images/service-landscape-design.jpg',
    alt: 'Luxury private villa landscape garden at sunset with pool and pergola',
    scopeEn: [
      'Landscape Concept',
      'Masterplanning',
      'Hardscape Design',
      'Softscape Design',
      'Outdoor Living',
      'Public Realm',
      'Irrigation & Sustainability',
    ],
    scopeAr: [
      'المفهوم البيئي للحدائق',
      'المخطط العام للموقع والمسارات',
      'تصميم العناصر الصلبة والمظلات',
      'اختيار وتنسيق النباتات المتوافقة مناخياً',
      'مناطق الجلوس والمعيشة الخارجية',
      'الفضاءات المفتوحة والساحات',
      'شبكات الري الذكية والاستدامة',
    ],
    descEn:
      'Harmonizing botanical architecture, natural stone paths, reflecting water bodies, and bioclimatic microclimates to seamlessly extend living space into the outdoors.',
    descAr:
      'تصميم متناغم يدمج البيئات النباتية والمائية والمسارات الحجرية والمظلات الخارجية لتعزيز الاتصال الفطري بين المساحات الداخلية والمحيط الطبيعي.',
  },
  {
    num: '04',
    slug: 'urban-design',
    titleEn: 'Urban Design',
    titleAr: 'التصميم والتخطيط العمراني',
    image: '/images/service-urban-design.jpg',
    alt: 'Aerial architectural drone view of contemporary masterplanned community',
    scopeEn: [
      'Urban Planning',
      'Mixed-Use Developments',
      'Public Spaces',
      'Mobility & Connectivity',
      'Sustainability Strategies',
      'Urban Guidelines',
      '3D Visualization',
    ],
    scopeAr: [
      'التخطيط الحضري وتوزيع الكتل',
      'تطوير المجمعات متعددة الاستخدامات',
      'تصميم الساحات والفضاءات العامة',
      'شبكات الحركة والتنقل والمشاة',
      'استراتيجيات الاستدامة العمرانية',
      'صياغة الأدلة والمعايير العمرانية',
      'الإظهار والمحاكاة ثلاثية الأبعاد',
    ],
    descEn:
      'Strategic spatial planning for forward-thinking urban communities, mixed-use destinations, and pedestrian-first public infrastructure.',
    descAr:
      'تخطيط مكاني استراتيجي للمجتمعات الحضرية الرائدة، والوجهات متعددة الاستخدامات، والبنى التحتية الصديقة للمشاة والمناخ.',
  },
  {
    num: '05',
    slug: 'engineering',
    titleEn: 'Engineering',
    titleAr: 'التنسيق الهندسي الشامل',
    image: '/images/service-engineering.jpg',
    alt: 'Contemporary architectural engineering office building with precise structural grid',
    scopeEn: [
      'Structural Coordination',
      'MEP Coordination',
      'BIM',
      'Technical Documentation',
      'Shop Drawing Review',
      'Construction Support',
      'Value Engineering',
    ],
    scopeAr: [
      'التنسيق والتدقيق الإنشائي',
      'تنسيق الأنظمة الكهروميكانيكية MEP',
      'نمذجة BIM الموحدة وكشف التعارضات',
      'إعداد المخططات الفنية المتكاملة',
      'مراجعة واعتماد رسومات الورشة التنفيذية',
      'الدعم الفني المباشر للموقع',
      'الهندسة القيمية وترشيد الميزانيات',
    ],
    descEn:
      'Rigorous multidisciplinary engineering coordination ensuring structural integrity, MEP optimization, clash-free BIM integration, and strict buildability.',
    descAr:
      'تنسيق هندسي متعدد التخصصات يجمع بين السلامة الإنشائية والأنظمة الكهروميكانيكية ونمذجة BIM لضمان تنفيذ دقيق وخالٍ تماماً من أخطاء الموقع.',
  },
  {
    num: '06',
    slug: 'project-management',
    titleEn: 'Project Management',
    titleAr: 'إدارة المشاريع',
    image: '/images/service-project-management.jpg',
    alt: 'Architectural project management desk setup with white hardhat and blueprints',
    scopeEn: [
      'Project Planning',
      'Cost Management',
      'Time Management',
      'Contract Administration',
      'Consultant Coordination',
      'Progress Monitoring',
      'Quality Control',
    ],
    scopeAr: [
      'إعداد المخططات الزمنية للمشروع',
      'إدارة التكاليف وضبط الميزانيات',
      'إدارة الوقت ومسار الأعمال الحرج',
      'إدارة العقود ومستحقات المقاولين',
      'التنسيق بين كافة الاستشاريين والموردين',
      'التقارير الدورية لمعدلات الإنجاز',
      'معايير وضوابط مراقبة الجودة',
    ],
    descEn:
      'End-to-end management ensuring project delivery on schedule, within approved budget limits, and in complete fidelity to the architectural specification.',
    descAr:
      'إدارة شاملة لجميع مراحل المشروع تضمن التسليم في الموعد المحدد وضمن الميزانية المعتمدة مع الالتزام التام بالمواصفات المعمارية القياسية.',
  },
  {
    num: '07',
    slug: 'finishing-fit-out',
    titleEn: 'Finishing & Fit-Out',
    titleAr: 'التشطيبات والتجهيز الداخلي',
    image: '/images/service-fitout-marble.jpg',
    alt: 'Architectural bookmatched marble wall adjacent to fluted wood paneling',
    scopeEn: [
      'Interior & Exterior Finishing',
      'Material Selection',
      'Technical Detailing',
      'Custom Joinery',
      'Fit-Out Execution',
      'Quality Assurance',
      'Handover Support',
    ],
    scopeAr: [
      'تنفيذ التشطيبات الداخلية والخارجية',
      'انتقاء وتوريد الرخام والأخشاب الفاخرة',
      'التفاصيل الفنية الدقيقة للتركيبات',
      'أعمال النجارة والتجاليد الحصرية',
      'التنفيذ الميداني بأعلى دقة حرفية',
      'توكيد الجودة ومطابقة عينات المواد',
      'الدعم الفني وإجراءات التسليم النهائي',
    ],
    descEn:
      'Meticulous execution of bespoke architectural joinery, stone cladding, metal trims, and artisan fit-outs to realize the intended design vision flawlessly.',
    descAr:
      'تنفيذ دقيق للتجاليد المعمارية، وتكسيات الرخام الطبيعي، والقواطع المعدنية، والأعمال الخشبية الحرفية لتحويل الرؤية التصميمية إلى واقع ملموس.',
  },
  {
    num: '08',
    slug: 'construction-supervision',
    titleEn: 'Construction Supervision',
    titleAr: 'الإشراف على التنفيذ',
    image: '/images/service-construction-supervision.jpg',
    alt: 'Site engineer in hardhat and safety vest inspecting building under construction',
    scopeEn: [
      'Site Supervision',
      'Quality Control',
      'Compliance with Specifications',
      'Progress Reporting',
      'Consultant & Contractor Coordination',
      'On-Site Problem Solving',
      'Final Inspection & Handover',
    ],
    scopeAr: [
      'الإشراف الميداني اليومي بالموقع',
      'فحص ومطابقة جودة الأعمال المنفذة',
      'الالتزام الصارم بالمواصفات وكود البناء',
      'إعداد التقارير الفنية المصورة للمالك',
      'تنسيق المهام بين المقاولين والاستشاري',
      'إيجاد حلول فورية للتحديات الهندسية الميدانية',
      'الفحص الهندسي النهائي والاستلام',
    ],
    descEn:
      'On-site architectural representation, continuous quality enforcement, progress audits, and technical direction from ground-breaking through turnkey handover.',
    descAr:
      'تواجد هندسي مستمر بالموقع، ومراقبة صارمة للجودة، ومراجعة معدلات الإنجاز، وتوجيه فني مباشر من وضع الأساسات حتى التسليم على المفتاح.',
  },
]

export default function ServicesPage() {
  const { t, lang } = useLanguage()
  const isAr = lang === 'ar'
  const [servicesList, setServicesList] = useState<ServiceDetail[]>(SERVICES_DATA)
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null)
  const [heroImgUrl, setHeroImgUrl] = useState('/images/services-hero-colonnade.jpg')

  // Load dynamic services from backend and keep synced
  const mapServices = (rawList: any[]): ServiceDetail[] => {
    const activeServices = rawList.filter((s: any) => s.status !== 'Inactive');
    activeServices.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
    return activeServices.map((s: any, idx: number) => ({
      num: s.num || String(s.display_order || idx + 1).padStart(2, '0'),
      slug: s.slug || (s.title_en ? s.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `service-${idx + 1}`),
      titleEn: s.title_en || s.titleEn || '',
      titleAr: s.title_ar || s.titleAr || s.title_en || '',
      image: s.image || '/images/service-architecture.jpg',
      alt: s.alt || s.title_en || 'Viwan Architectural Service',
      scopeEn: (s.scope_en && s.scope_en.length > 0) ? s.scope_en : (s.desc_en ? [s.desc_en] : ['Architectural Consultation', 'Concept Design', 'Technical Documentation', 'Project Coordination']),
      scopeAr: (s.scope_ar && s.scope_ar.length > 0) ? s.scope_ar : (s.desc_ar ? [s.desc_ar] : ['الاستشارات المعمارية', 'التصميم المبدئي', 'المخططات التنفيذية', 'التنسيق الهندسي']),
      descEn: s.desc_en || s.descEn || '',
      descAr: s.desc_ar || s.descAr || '',
    }));
  };

  useEffect(() => {
    const fetchServices = () => {
      fetch('/api/services')
        .then((res) => res.json())
        .then((data) => {
          const list = data?.data || data?.services;
          if (Array.isArray(list) && list.length > 0) {
            const mapped = mapServices(list);
            if (mapped.length > 0) setServicesList(mapped);
          }
        })
        .catch(() => {});
    };

    fetchServices();

    const handleServicesUpdated = (e: any) => {
      if (Array.isArray(e?.detail)) {
        const mapped = mapServices(e.detail);
        if (mapped.length > 0) setServicesList(mapped);
      } else {
        fetchServices();
      }
    };

    window.addEventListener('viwan_services_updated', handleServicesUpdated);
    window.addEventListener('storage', handleServicesUpdated);
    return () => {
      window.removeEventListener('viwan_services_updated', handleServicesUpdated);
      window.removeEventListener('storage', handleServicesUpdated);
    };
  }, []);

  // Load dynamic hero image from site settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.siteImages && Array.isArray(data.siteImages)) {
          const img = data.siteImages.find((i: any) => i.id === 'services-hero')
          if (img?.currentUrl) {
            setHeroImgUrl(img.currentUrl)
          }
        }
      })
      .catch(() => {})
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* 1. CINEMATIC HERO SECTION (Matching Reference Image) */}
      <section className="relative min-h-[58vh] lg:min-h-[64vh] flex flex-col justify-end surface-dark overflow-hidden select-none">
        {/* Full-width Cinematic Travertine Colonnade Photo */}
        <div className="absolute inset-0">
          <Image
            src={heroImgUrl}
            alt="Monolithic travertine and limestone colonnade overlooking reflective pool at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100"
          />
        </div>

        {/* Directional & Vertical Gradients for Text Contrast & Architectural Illumination */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/60 to-charcoal/25 pointer-events-none"
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
              {t.servicesPage.heroEyebrow}
            </Eyebrow>

            <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.08] animate-fade-up [animation-delay:150ms] text-balance">
              {t.servicesPage.heroTitle}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-ivory/85 leading-relaxed max-w-2xl animate-fade-up [animation-delay:300ms] text-pretty">
              {t.servicesPage.heroSubtitle}
            </p>
          </div>

          {/* Right Brand Pillar Block with Vertical Divider */}
          <div className="hidden md:flex items-center gap-4 animate-fade-in [animation-delay:450ms]">
            <span className="h-16 w-px bg-ivory/30 inline-block" aria-hidden="true" />
            <div className="flex flex-col gap-1 eyebrow text-ivory/70 text-xs tracking-widest font-medium">
              <span>{t.servicesPage.brandPeople}</span>
              <span>{t.servicesPage.brandPlaces}</span>
              <span className="text-gold">{t.servicesPage.brandPurpose}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED MARQUEE TICKER (Directly Below Cinematic Hero Image) */}
      <section
        className="relative border-y border-stone/20 bg-[#11110F] text-ivory/90 overflow-hidden select-none z-20 py-3.5 sm:py-4"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
        }}
        aria-label={isAr ? 'مجالات العمل والتخصصات' : 'Disciplines & Specializations'}
      >
        <Marquee speed={28} pauseOnHover className="p-0 [--gap:2.5rem] sm:[--gap:3.5rem]">
          {(isAr ? DISCIPLINES_AR : DISCIPLINES_EN).map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-5 sm:gap-7 eyebrow text-xs sm:text-sm tracking-[0.16em] uppercase font-medium text-ivory/90 shrink-0"
            >
              <span>{item}</span>
              <span className="text-gold text-xs sm:text-sm" aria-hidden="true">
                •
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* 2. SERVICES OVERVIEW SUB-HEADER BAR */}
      <section className="bg-[#F6F5F2] border-y border-stone/30 py-10 md:py-14">
        <div className="container-viwan grid grid-cols-1 lg:grid-cols-12 gap-8 items-center reveal">
          {/* Left: Overview Eyebrow & Title */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <span className="eyebrow text-gold text-xs font-semibold tracking-widest uppercase">
              {t.servicesPage.overviewEyebrow}
            </span>
            <h2 className="display text-2xl sm:text-3xl lg:text-[2rem] text-charcoal leading-tight">
              {t.servicesPage.overviewTitle}
            </h2>
          </div>

          {/* Center: Integrated Narrative */}
          <div className="lg:col-span-6 lg:border-s lg:border-stone/30 lg:ps-8 rtl:lg:border-s-0 rtl:lg:border-e rtl:lg:pe-8 rtl:lg:ps-0">
            <p className="text-sm sm:text-base text-charcoal/75 leading-relaxed">
              {t.servicesPage.overviewSubtitle}
            </p>
          </div>

          {/* Right: CTA Link */}
          <div className="lg:col-span-3 flex lg:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 eyebrow text-xs tracking-widest font-semibold text-charcoal hover:text-gold transition-colors group p-2 -m-2"
            >
              <span>{t.servicesPage.overviewCta}</span>
              <ArrowRight className="size-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. THE 8 SERVICES GRID (Matching Reference 4-Column Layout) */}
      <section className="bg-[#FAF9F5] border-b border-stone/30">
        <div className="container-viwan py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-s border-stone/30">
            {servicesList.map((service, idx) => {
              const title = isAr ? service.titleAr : service.titleEn
              const scope = isAr ? service.scopeAr : service.scopeEn

              return (
                <article
                  key={service.slug}
                  style={{ transitionDelay: `${(idx % 4) * 90}ms` }}
                  className="reveal flex flex-col justify-between p-6 sm:p-7 bg-background hover:bg-[#F9F8F4] transition-colors duration-300 border-e border-b border-stone/30 group"
                >
                  <div>
                    {/* Number + Title Header */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-mono text-sm tracking-wider text-gold font-medium">
                        {service.num}
                      </span>
                      <h3 className="display text-xl sm:text-2xl text-charcoal tracking-tight group-hover:text-gold transition-colors line-clamp-1">
                        {title}
                      </h3>
                    </div>

                    {/* Service Image */}
                    <div
                      onClick={() => setSelectedService(service)}
                      className="relative aspect-[16/10] w-full overflow-hidden mb-5 bg-stone/10 border border-stone/20 cursor-pointer"
                    >
                      <Image
                        src={service.image}
                        alt={service.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Scope Bullet Points */}
                    <ul className="flex flex-col gap-2 text-xs sm:text-[13px] text-charcoal/80 mb-6">
                      {scope.map((item) => (
                        <li key={item} className="flex items-start gap-2 leading-snug">
                          <span
                            className="size-1 rounded-full bg-charcoal/60 mt-1.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-4 border-t border-stone/20 mt-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="inline-flex items-center gap-2 eyebrow text-[11px] font-semibold tracking-widest text-charcoal group-hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded py-1"
                    >
                      <span>{t.servicesPage.learnMore}</span>
                      <ArrowRight className="size-3 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SERVICE DETAIL MODAL (APPLE-GRADE ACCESSIBILITY) */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-dialog-title"
        >
          <div
            className="relative w-full max-w-2xl bg-[#FBFBFA] border border-stone/30 shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              aria-label="Close details"
              className="absolute top-4 end-4 z-20 size-10 flex items-center justify-center rounded-full bg-charcoal/70 hover:bg-charcoal text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <X className="size-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/9] w-full bg-secondary">
              <Image
                src={selectedService.image}
                alt={selectedService.alt}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-6 end-6 flex items-baseline justify-between text-ivory">
                <span className="font-mono text-gold text-base tracking-widest font-semibold">
                  {selectedService.num}
                </span>
                <span className="eyebrow text-ivory/70 text-xs tracking-wider">
                  VIWAN CONSULTANCY
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <h3
                  id="service-dialog-title"
                  className="display text-2xl sm:text-3xl text-charcoal mb-2"
                >
                  {isAr ? selectedService.titleAr : selectedService.titleEn}
                </h3>
                <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed">
                  {isAr ? selectedService.descAr : selectedService.descEn}
                </p>
              </div>

              <div>
                <h4 className="eyebrow text-gold text-xs font-semibold mb-3">
                  {t.servicesPage.deliverablesTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(isAr ? selectedService.scopeAr : selectedService.scopeEn).map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/85">
                      <CheckCircle2 className="size-4 text-gold shrink-0" strokeWidth={1.5} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-stone/20">
                <ButtonLink
                  href={`/consultation?service=${selectedService.slug}`}
                  variant="solid"
                  className="w-full sm:w-auto text-center"
                >
                  {isAr ? 'حجز استشارة لهذا التخصص' : 'Schedule Consultation for this Discipline'}
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto px-5 py-2.5 eyebrow text-xs text-charcoal/70 hover:text-charcoal transition-colors text-center"
                >
                  {isAr ? 'إغلاق النافذة' : 'Dismiss'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. READY TO START? BOTTOM CALL-TO-ACTION (Matching Reference Image) */}
      <section className="surface-dark bg-[#11110F] border-t border-stone/30 py-16 md:py-24 relative overflow-hidden reveal">
        <div className="container-viwan flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          {/* Left: Eyebrow & Headline */}
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="eyebrow text-gold text-xs tracking-widest font-medium uppercase">
              {t.servicesPage.readyEyebrow}
            </span>
            <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight text-balance">
              {t.servicesPage.readyTitle}
            </h2>
          </div>

          {/* Right: Two CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <ButtonLink href="/consultation" variant="gold">
              <span>{t.servicesPage.freeConsultationCta}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </ButtonLink>

            <ButtonLink
              href="/contact"
              variant="outline"
              className="border-ivory/30 text-ivory hover:bg-ivory/10 hover:border-ivory/60"
            >
              <span>{t.servicesPage.contactUsCta}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  )
}

