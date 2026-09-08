'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { Eyebrow, ButtonLink } from '@/components/site/primitives'
import { useLanguage } from '@/lib/i18n'
import { ProjectsFaqSection } from '@/components/projects/faq-section'

interface ProjectItem {
  id: string
  titleEn: string
  titleAr: string
  locationEn: string
  locationAr: string
  year: string
  scopeEn: string
  scopeAr: string
  image: string
  alt: string
  descEn?: string
  descAr?: string
  scopeListEn?: string[]
  scopeListAr?: string[]
  slug?: string
}

interface DisciplineCategory {
  id: string
  num: string
  titleEn: string
  titleAr: string
  taglineEn: string
  taglineAr: string
  featured: ProjectItem
  subProjects: ProjectItem[]
}

const DISCIPLINES_DATA: DisciplineCategory[] = [
  {
    id: 'architecture',
    num: '01',
    titleEn: 'Architecture',
    titleAr: 'الهندسة المعمارية',
    taglineEn: 'Iconic buildings that balance beauty, function and enduring value.',
    taglineAr: 'مبانٍ أيقونية توازن بين الجمال والوظيفة والقيمة الخالدة.',
    featured: {
      id: 'arch-featured',
      titleEn: 'THE COASTAL RESIDENCE',
      titleAr: 'الإقامة الساحلية الفاخرة',
      locationEn: 'Al Mouj, Muscat',
      locationAr: 'الموج، مسقط',
      year: '2023',
      scopeEn: 'Scope of Work: Architecture + Interior Design',
      scopeAr: 'نطاق العمل: عمارة + تصميم داخلي',
      image: '/images/service-architecture.jpg',
      alt: 'The Coastal Residence modern architectural villa at twilight with pool',
      descEn:
        'A monolithic seaside residential composition balancing natural travertine stone volumes, cantilevered roofs, and full-height glass walls opening directly to a reflective infinity pool.',
      descAr:
        'تكوين سكني ساحلي متوازن من كتل حجر الترافيرتين الطبيعي، وأسقف كابولية خرسانية، وواجهات زجاجية ممتدة تطل مباشرة على مسبح إنفينيتي عاكس.',
      scopeListEn: ['Concept Architecture', 'Schematic Design', 'BIM Modeling', 'Façade Detailing'],
      scopeListAr: ['الفكرة المعمارية', 'المخططات التصميمية', 'نمذجة الـ BIM', 'تفاصيل الواجهات'],
      slug: 'private-residence-01',
    },
    subProjects: [
      {
        id: 'arch-sub-1',
        titleEn: 'DESERT VILLA',
        titleAr: 'فيلا العلا الصحراوية',
        locationEn: 'AlUla, Saudi Arabia',
        locationAr: 'العلا، المملكة العربية السعودية',
        year: '2022',
        scopeEn: 'Scope of Work: Architecture',
        scopeAr: 'نطاق العمل: عمارة',
        image: '/images/project-private-residence.png',
        alt: 'Desert Villa integrated within AlUla canyon landscape',
        descEn:
          'Private sanctuary embedded into dramatic rock formations, celebrating local limestone textures and bioclimatic natural ventilation corridors.',
        descAr:
          'ملاذ سكني خاص منحوت في تضاريس العلا الصخرية، يحتفي بجماليات الحجر المحلي وتيارات التهوية الطبيعية المناخية.',
        slug: 'hillside-villa',
      },
      {
        id: 'arch-sub-2',
        titleEn: 'CULTURAL CENTER',
        titleAr: 'المركز الثقافي',
        locationEn: 'Doha, Qatar',
        locationAr: 'الدوحة، قطر',
        year: '2021',
        scopeEn: 'Scope of Work: Architecture',
        scopeAr: 'نطاق العمل: عمارة',
        image: '/images/hero-villa-3.jpg',
        alt: 'Cultural Center geometric facade and reflecting water pool',
        descEn:
          'A civic landmark combining contemporary parametric lattice screens with grand limestone colonnades around a central public water court.',
        descAr:
          'صرح ثقافي ومدني يجمع بين الشاشات الهندسية المعاصرة والأروقة الحجرية المحيطة بفناء مائي عام.',
        slug: 'commercial-project-03',
      },
    ],
  },
  {
    id: 'interior-design',
    num: '02',
    titleEn: 'Interior Design',
    titleAr: 'التصميم الداخلي',
    taglineEn: 'Refined interiors that elevate everyday living.',
    taglineAr: 'تصاميم داخلية راقية ترتقي بتفاصيل الحياة اليومية.',
    featured: {
      id: 'interior-featured',
      titleEn: 'SERENITY APARTMENT',
      titleAr: 'شقة سكنية هادئة',
      locationEn: 'Dubai, UAE',
      locationAr: 'دبي، الإمارات العربية المتحدة',
      year: '2024',
      scopeEn: 'Scope of Work: Interior Design + FF&E',
      scopeAr: 'نطاق العمل: تصميم داخلي + تأثيث وتجهيز',
      image: '/images/service-interior-design.jpg',
      alt: 'Serenity Apartment warm minimalist interior with bespoke sofa and ocean view',
      descEn:
        'A warm minimalist penthouse interior where custom fluted walnut timber, backlit Calacatta marble fireplaces, and bespoke linen sectionals harmonize seamlessly.',
      descAr:
        'تصميم داخلي مينيمالي دافئ لبنتهاوس يجمع بين أخشاب الجوز المضلعة، ومواقد رخام الكلكتا بإضاءة خفية، وأثاث كتاني مصمم خصيصاً للمكان.',
      scopeListEn: ['Space Planning', 'Custom Millwork', 'Architectural Lighting', 'FF&E Procurement'],
      scopeListAr: ['تخطيط الفراغات', 'النجارة الحصرية', 'الإضاءة المعمارية', 'توريد وتنسيق الأثاث'],
      slug: 'the-urban-retreat',
    },
    subProjects: [
      {
        id: 'interior-sub-1',
        titleEn: 'THE RIVIERA HOTEL',
        titleAr: 'فندق الريفييرا',
        locationEn: 'Doha, Qatar',
        locationAr: 'الدوحة، قطر',
        year: '2023',
        scopeEn: 'Scope of Work: Interior Design',
        scopeAr: 'نطاق العمل: تصميم داخلي',
        image: '/images/interior-dining.png',
        alt: 'The Riviera Hotel luxury interior lounge and dining hall',
        descEn:
          'Boutique coastal hospitality interiors celebrating natural raw materials, soft acoustic textures, and ambient golden cove lighting.',
        descAr:
          'تصميم داخلي لفندق ساحلي بوتيك يحتفي بالمواد الطبيعية الخام والمعالجات الصوتية والأجواء الدافئة.',
        slug: 'private-majlis',
      },
      {
        id: 'interior-sub-2',
        titleEn: 'OLIVE RESTAURANT',
        titleAr: 'مطعم أوليف الفاخر',
        locationEn: 'Riyadh, Saudi Arabia',
        locationAr: 'الرياض، المملكة العربية السعودية',
        year: '2022',
        scopeEn: 'Scope of Work: Interior Design',
        scopeAr: 'نطاق العمل: تصميم داخلي',
        image: '/images/interior-bedroom.png',
        alt: 'Olive Restaurant arched vaulted dining room with bronze fixtures',
        descEn:
          'Fine dining restaurant featuring majestic stone arches, hand-plastered walls, and bespoke brass architectural luminaires.',
        descAr:
          'مطعم فاخر يتميز بأقواس حجرية مهيبة وجدران مكسوة يدوياً بإتقان ووحدات إضاءة نحاسية حصرية.',
        slug: 'the-urban-retreat',
      },
    ],
  },
  {
    id: 'landscape',
    num: '03',
    titleEn: 'Landscape',
    titleAr: 'اللاندسكيب وتنسيق المواقع',
    taglineEn: 'Living landscapes that connect people with nature and place.',
    taglineAr: 'مناظر طبيعية حية تربط الإنسان بالطبيعة والمكان.',
    featured: {
      id: 'landscape-featured',
      titleEn: 'THE GARDEN PAVILION',
      titleAr: 'جناح الحديقة المائي',
      locationEn: 'Abu Dhabi, UAE',
      locationAr: 'أبوظبي، الإمارات العربية المتحدة',
      year: '2024',
      scopeEn: 'Scope of Work: Landscape Design',
      scopeAr: 'نطاق العمل: تصميم لاندسكيب',
      image: '/images/service-landscape-design.jpg',
      alt: 'The Garden Pavilion reflecting infinity pool and manicured botanical grounds',
      descEn:
        'A lush botanical sanctuary integrating shaded timber pergolas, floating granite stepping stones, climate-resilient olive trees, and reflective water basins.',
      descAr:
        'ملاذ نباتي فاخر يدمج البرجولات الخشبية المظللة والمسارات الجرانيتية العائمة وأشجار الزيتون المعمرة والمسطحات المائية العاكسة.',
      scopeListEn: ['Master Landscape Plan', 'Hardscape & Decks', 'Planting Palette', 'Smart Irrigation'],
      scopeListAr: ['المخطط العام للحديقة', 'العناصر الصلبة والمظلات', 'انتقاء النباتات', 'شبكات الري الذكية'],
      slug: 'lake-house',
    },
    subProjects: [
      {
        id: 'landscape-sub-1',
        titleEn: 'OASIS GARDENS',
        titleAr: 'حدائق الواحة',
        locationEn: 'Riyadh, Saudi Arabia',
        locationAr: 'الرياض، المملكة العربية السعودية',
        year: '2023',
        scopeEn: 'Scope of Work: Landscape Design',
        scopeAr: 'نطاق العمل: تصميم لاندسكيب',
        image: '/images/detail-courtyard.png',
        alt: 'Oasis Gardens courtyard with palm grove and tranquil water channel',
        descEn:
          'An urban oasis courtyard designed with endemic palms, stone fountains, and gentle evaporative water channels providing microclimate cooling.',
        descAr:
          'فناء واحة حضري مصمم بأشجار النخيل الأصيلة ونوافير حجرية وقنوات مائية تلطف درجات الحرارة طبيعياً.',
        slug: 'hillside-villa',
      },
      {
        id: 'landscape-sub-2',
        titleEn: 'WADI RETREAT',
        titleAr: 'منتجع الوادي الصحراوي',
        locationEn: 'AlUla, Saudi Arabia',
        locationAr: 'العلا، المملكة العربية السعودية',
        year: '2021',
        scopeEn: 'Scope of Work: Landscape Design',
        scopeAr: 'نطاق العمل: تصميم لاندسكيب',
        image: '/images/hero-villa-2.jpg',
        alt: 'Wadi Retreat desert landscape with xeriscape planting and sand trails',
        descEn:
          'Ecological xeriscape landscape respecting the natural desert topography, using native stone boulders and arid-adapted desert flora.',
        descAr:
          'لاندسكيب بيئي يحترم طبيعة الوادي الصحراوي، معتمداً على الصخور الطبيعية والنباتات الصحراوية المتوافقة مع شح المياه.',
        slug: 'lake-house',
      },
    ],
  },
  {
    id: 'urban-design',
    num: '04',
    titleEn: 'Urban Design',
    titleAr: 'التصميم والتخطيط العمراني',
    taglineEn: 'People-centric districts that shape vibrant and resilient cities.',
    taglineAr: 'أحياء تركز على الإنسان وتصنع مدناً نابضة بالحياة ومرنة.',
    featured: {
      id: 'urban-featured',
      titleEn: 'MARINA DISTRICT',
      titleAr: 'حي المارينا والواجهة البحرية',
      locationEn: 'Jeddah, Saudi Arabia',
      locationAr: 'جدة، المملكة العربية السعودية',
      year: '2024',
      scopeEn: 'Scope of Work: Urban Design + Masterplanning',
      scopeAr: 'نطاق العمل: تصميم عمراني + تخطيط عام',
      image: '/images/service-urban-design.jpg',
      alt: 'Marina District masterplanned coastal waterfront with towers and promenade',
      descEn:
        'A comprehensive mixed-use waterfront masterplan featuring pedestrian promenades, shaded public plazas, residential towers, and civic cultural anchors.',
      descAr:
        'مخطط عام متكامل للواجهة البحرية يضم ممشى للمشاة، وساحات عامة مظللة، وأبراجاً سكنية، ومراكز ثقافية واجتماعية رائدة.',
      scopeListEn: ['Masterplanning', 'Urban Density Strategy', 'Walkability & Mobility', 'Public Realm'],
      scopeListAr: ['المخطط العام', 'استراتيجية الكثافة العمرانية', 'مسارات المشاة والتنقل', 'الفضاءات العامة'],
      slug: 'commercial-project-03',
    },
    subProjects: [
      {
        id: 'urban-sub-1',
        titleEn: 'THE HORIZON MASTERPLAN',
        titleAr: 'مخطط الأفق العمراني',
        locationEn: 'Ras Al Khaimah, UAE',
        locationAr: 'رأس الخيمة، الإمارات',
        year: '2023',
        scopeEn: 'Scope of Work: Urban Design + Infrastructure',
        scopeAr: 'نطاق العمل: تصميم عمراني + بنية تحتية',
        image: '/images/project-commercial-riyadh.png',
        alt: 'The Horizon Masterplan aerial coastal district layout',
        descEn:
          'Sustainable coastal district masterplan balancing ecological mangrove conservation with vibrant mixed-use residential quarters.',
        descAr:
          'مخطط حضري ساحلي مستدام يوازن بين حماية أشجار القرم البيئية وتطوير أحياء سكنية متعددة الاستخدام.',
        slug: 'hillside-villa',
      },
      {
        id: 'urban-sub-2',
        titleEn: 'CITY CENTRAL',
        titleAr: 'سنترال سيتي المتكامل',
        locationEn: 'Muscat, Oman',
        locationAr: 'مسقط، سلطنة عُمان',
        year: '2021',
        scopeEn: 'Scope of Work: Urban Design',
        scopeAr: 'نطاق العمل: تصميم عمراني',
        image: '/images/project-hillside-villa.png',
        alt: 'City Central walkable mixed-use streetscape with colonnades',
        descEn:
          'Human-scale urban infill quarter designed with traditional shaded alleyways (sikkas), active ground-floor retail, and green pocket parks.',
        descAr:
          'حي عمراني إنساني النطاق مصمم بأزقة مظللة (سكك) وواجهات تجارية حيوية وحدائق جيب خضراء.',
        slug: 'commercial-project-03',
      },
    ],
  },
  {
    id: 'engineering',
    num: '05',
    titleEn: 'Engineering',
    titleAr: 'الهندسة المتكاملة',
    taglineEn: 'Integrated engineering for smarter, more resilient futures.',
    taglineAr: 'هندسة متكاملة لمستقبل أكثر ذكاءً واستدامة.',
    featured: {
      id: 'eng-featured',
      titleEn: 'INTERNATIONAL TERMINAL',
      titleAr: 'المحطة الدولية للمسافرين',
      locationEn: 'Muscat, Oman',
      locationAr: 'مسقط، سلطنة عُمان',
      year: '2024',
      scopeEn: 'Scope of Work: Structural + MEP Engineering + Façade Design',
      scopeAr: 'نطاق العمل: إنشائي + كهروميكانيكي + هندسة واجهات',
      image: '/images/service-engineering.jpg',
      alt: 'International Terminal canopy engineering structure with sculptural columns',
      descEn:
        'A cutting-edge airport terminal featuring long-span sculptural steel tree-columns, aerodynamic roof canopies, and high-efficiency smart MEP systems.',
      descAr:
        'صالة ركاب دولية متطورة تتميز بأعمدة فولاذية شجرية واسعة البحور وأسقف إيروديناميكية وأنظمة كهروميكانيكية فائقة الكفاءة.',
      scopeListEn: ['Long-Span Structural Engineering', 'MEP Infrastructure', 'BIM Clash Detection', 'Façade Engineering'],
      scopeListAr: ['الهندسة الإنشائية واسعة البحور', 'البنية التحتية الكهروميكانيكية', 'فحص التعارضات عبر BIM', 'هندسة الواجهات'],
      slug: 'commercial-project-03',
    },
    subProjects: [
      {
        id: 'eng-sub-1',
        titleEn: 'INNOVATION CENTER',
        titleAr: 'مركز الابتكار والتكنولوجيا',
        locationEn: 'King Abdullah Economic City, KSA',
        locationAr: 'مدينة الملك عبد الله الاقتصادية، السعودية',
        year: '2023',
        scopeEn: 'Scope of Work: MEP + Structural Engineering',
        scopeAr: 'نطاق العمل: هندسة إنشائية وكهروميكانيكية',
        image: '/images/service-construction-supervision.jpg',
        alt: 'Innovation Center cubic glass and concrete engineered facade',
        descEn:
          'High-performance R&D engineering complex integrating seismic-resistant concrete frames and intelligent solar roof arrays.',
        descAr:
          'مجمع أبحاث هندسي متطور يدمج الهياكل الخرسانية المقاومة للزلازل مع ألواح طاقة شمسية ذكية.',
        slug: 'hillside-villa',
      },
      {
        id: 'eng-sub-2',
        titleEn: 'COASTAL BRIDGE',
        titleAr: 'الجسر الساحلي المعلق',
        locationEn: 'Abu Dhabi, UAE',
        locationAr: 'أبوظبي، الإمارات العربية المتحدة',
        year: '2021',
        scopeEn: 'Scope of Work: Civil + Structural Engineering',
        scopeAr: 'نطاق العمل: هندسة مدنية وإنشائية',
        image: '/images/project-executive-office.png',
        alt: 'Coastal Bridge suspension cables spanning across bay waters at sunset',
        descEn:
          'A landmark civil infrastructure bridge engineered for coastal marine durability, harmonic wind resistance, and sculptural illumination.',
        descAr:
          'جسر بنية تحتية أيقوني مصمم لمقاومة البيئة البحرية والتوافقيات الهوائية مع إضاءة معمارية منحوتة.',
        slug: 'lake-house',
      },
    ],
  },
]

const TAB_FILTERS = [
  { id: 'all', labelEn: 'ALL', labelAr: 'الكل' },
  { id: 'architecture', labelEn: 'ARCHITECTURE', labelAr: 'الهندسة المعمارية' },
  { id: 'interior-design', labelEn: 'INTERIOR DESIGN', labelAr: 'التصميم الداخلي' },
  { id: 'landscape', labelEn: 'LANDSCAPE', labelAr: 'اللاندسكيب' },
  { id: 'urban-design', labelEn: 'URBAN DESIGN', labelAr: 'التخطيط العمراني' },
  { id: 'engineering', labelEn: 'ENGINEERING', labelAr: 'الهندسة المتكاملة' },
]

export default function ProjectsPage() {
  const { t, lang } = useLanguage()
  const isAr = lang === 'ar'
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState<'latest' | 'egypt' | 'ksa'>('latest')
  const [selectedProject, setSelectedProject] = useState<{
    title: string
    category: string
    location: string
    year?: string
    image: string
    alt: string
    desc: string
    scopeText?: string
    scope?: string[]
    slug?: string
  } | null>(null)

  const [dbProjects, setDbProjects] = useState<any[]>([])
  const [heroImage, setHeroImage] = useState<string>('/images/projects-hero-villa.jpg')

  // Fetch dynamic projects from API
  useEffect(() => {
    let isMounted = true
    fetch('/api/public/projects')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (isMounted && d?.projects && Array.isArray(d.projects)) {
          setDbProjects(d.projects)
        }
      })
      .catch(() => {})

    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (isMounted && d?.siteImages && Array.isArray(d.siteImages)) {
          const foundHero = d.siteImages.find((img: any) => img.id === 'projects-hero')
          if (foundHero?.url) setHeroImage(foundHero.url)
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter and sort disciplines, merging any dynamic DB project additions
  const displayedDisciplines = useMemo(() => {
    let list = DISCIPLINES_DATA.map((cat) => {
      // Check if dbProjects has items for this category
      const matched = dbProjects.filter((p) => {
        const catNorm = cat.id.toLowerCase().replace(/[^a-z0-9]/g, '')
        const titleNorm = cat.titleEn.toLowerCase().replace(/[^a-z0-9]/g, '')
        const titleArNorm = cat.titleAr.replace(/[\s\(\)\u064B-\u065F]/g, '')

        const candidateStrings: string[] = []
        if (p.discipline && typeof p.discipline === 'string') candidateStrings.push(p.discipline)
        if (p.category && typeof p.category === 'string') candidateStrings.push(p.category)
        if (p.type && typeof p.type === 'string') candidateStrings.push(p.type)
        if (p.sector_en && typeof p.sector_en === 'string') candidateStrings.push(p.sector_en)
        if (p.sector_ar && typeof p.sector_ar === 'string') candidateStrings.push(p.sector_ar)
        if (Array.isArray(p.disciplines)) {
          p.disciplines.forEach((d: any) => {
            if (typeof d === 'string') candidateStrings.push(d)
          })
        }

        return candidateStrings.some((str) => {
          if (!str) return false
          const norm = str.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, '')
          // English checks
          if (norm === catNorm || norm === titleNorm || norm.includes(catNorm) || catNorm.includes(norm)) return true
          if (norm.includes(titleNorm) || titleNorm.includes(norm)) return true
          // Arabic checks
          const arNorm = str.replace(/[\s\(\)\u064B-\u065F]/g, '')
          if (arNorm.includes(titleArNorm) || titleArNorm.includes(arNorm)) return true
          // Specific keyword mappings
          if (cat.id === 'architecture' && (norm.includes('architect') || arNorm.includes('معمار') || arNorm.includes('عمارة'))) return true
          if (cat.id === 'interior-design' && (norm.includes('interior') || arNorm.includes('داخلي') || arNorm.includes('ديكور'))) return true
          if (cat.id === 'landscape' && (norm.includes('landscape') || arNorm.includes('لاندسكيب') || arNorm.includes('مواقع'))) return true
          if (cat.id === 'urban-design' && (norm.includes('urban') || arNorm.includes('عمران') || arNorm.includes('تخطيط'))) return true
          if (cat.id === 'engineering' && (norm.includes('engineer') || arNorm.includes('هندسة') || arNorm.includes('متكامل'))) return true
          return false
        })
      })

      if (!matched.length) return cat

      // Only override featured if explicitly marked as featured
      const feat = matched.find((p) => Boolean(p.featured || p.is_featured))
      const rest = feat
        ? matched.filter((p) => p.id !== feat.id && p.slug !== feat.slug)
        : matched

      const updatedFeatured: ProjectItem = feat
        ? {
            id: feat.id || cat.featured.id,
            titleEn: feat.title_en || feat.name || feat.title || cat.featured.titleEn,
            titleAr: feat.title_ar || feat.nameAr || feat.titleAr || cat.featured.titleAr,
            locationEn: feat.location_en || feat.location || cat.featured.locationEn,
            locationAr: feat.location_ar || feat.locationAr || cat.featured.locationAr,
            year: String(feat.year || cat.featured.year),
            scopeEn: feat.scope ? `Scope of Work: ${Array.isArray(feat.scope) ? feat.scope.join(' + ') : feat.scope}` : cat.featured.scopeEn,
            scopeAr: feat.scopeAr ? `نطاق العمل: ${Array.isArray(feat.scopeAr) ? feat.scopeAr.join(' + ') : feat.scopeAr}` : cat.featured.scopeAr,
            image: feat.cover || feat.coverImage || feat.cover_image || cat.featured.image,
            alt: feat.title_en || feat.name || feat.title || cat.featured.alt,
            descEn: feat.description || feat.details_en || cat.featured.descEn,
            descAr: feat.descriptionAr || feat.details_ar || cat.featured.descAr,
            scopeListEn: Array.isArray(feat.scope) && feat.scope.length ? feat.scope : cat.featured.scopeListEn,
            scopeListAr: Array.isArray(feat.scopeAr) && feat.scopeAr.length ? feat.scopeAr : cat.featured.scopeListAr,
            slug: feat.slug || cat.featured.slug,
          }
        : cat.featured

      const dynamicSub: ProjectItem[] = rest.map((p, rIdx) => ({
        id: p.id || `sub-${p.slug || rIdx}`,
        titleEn: p.title_en || p.name || p.title || 'Architectural Project',
        titleAr: p.title_ar || p.nameAr || p.titleAr || p.name || 'مشروع معماري',
        locationEn: p.location_en || p.location || 'Cairo, Egypt',
        locationAr: p.location_ar || p.locationAr || 'القاهرة، مصر',
        year: String(p.year || '2026'),
        scopeEn: p.scope ? `Scope of Work: ${Array.isArray(p.scope) ? p.scope.join(' + ') : p.scope}` : 'Scope of Work: Architecture',
        scopeAr: p.scopeAr ? `نطاق العمل: ${Array.isArray(p.scopeAr) ? p.scopeAr.join(' + ') : p.scopeAr}` : 'نطاق العمل: عمارة',
        image: p.cover || p.coverImage || p.cover_image || '/images/project-private-residence.png',
        alt: p.title_en || p.name || p.title || 'Project Detail',
        descEn: p.description || p.details_en || '',
        descAr: p.descriptionAr || p.details_ar || '',
        scopeListEn: Array.isArray(p.scope) ? p.scope : [],
        scopeListAr: Array.isArray(p.scopeAr) ? p.scopeAr : [],
        slug: p.slug,
      }))

      // Combine dynamic projects with existing subProjects so initial projects are preserved
      const filteredExistingSub = cat.subProjects.filter(
        (sp) => !rest.some((rp) => rp.slug === sp.slug || rp.id === sp.id)
      )

      return {
        ...cat,
        featured: updatedFeatured,
        subProjects: [...dynamicSub, ...filteredExistingSub],
      }
    })

    if (activeTab !== 'all') {
      list = list.filter((cat) => cat.id === activeTab)
    }

    if (sortBy === 'egypt') {
      list = list.map((cat) => ({
        ...cat,
        subProjects: [...cat.subProjects].sort((a) =>
          a.locationEn.includes('Egypt') ? -1 : 1
        ),
      }))
    } else if (sortBy === 'ksa') {
      list = list.map((cat) => ({
        ...cat,
        subProjects: [...cat.subProjects].sort((a) =>
          a.locationEn.includes('Saudi') || a.locationEn.includes('Riyadh') || a.locationEn.includes('AlUla') ? -1 : 1
        ),
      }))
    }

    return list
  }, [activeTab, sortBy, dbProjects])

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-charcoal selection:bg-gold selection:text-charcoal">
      {/* =========================================================================
          1. FULL-WIDTH CINEMATIC HERO SECTION
          - Full-bleed cinematic architectural background covering the entire header
          - Ambient dark directional gradients for crisp text readability
          - Left: OUR WORK / Selected Projects / Subtitle / Accent Line
          - Right: Vertical Editorial Typography (PEOPLE / PLACES / PURPOSE / ALWAYS)
         ========================================================================= */}
      <section className="relative min-h-[64vh] lg:min-h-[74vh] flex flex-col justify-end surface-dark overflow-hidden select-none">
        {/* Full-bleed Architectural Image Background */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Selected Projects architectural villa with pool overlooking horizon"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100"
          />
        </div>

        {/* Ambient Dark Directional Gradients for Crisp Legibility & Architectural Glow */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/60 to-charcoal/30 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/65 to-transparent rtl:bg-gradient-to-l rtl:from-charcoal/95 rtl:via-charcoal/65 rtl:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Content Container */}
        <div className="container-viwan relative z-10 w-full pt-36 md:pt-44 pb-16 md:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            {/* Left Text Block */}
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="eyebrow text-xs sm:text-sm text-gold tracking-[0.25em] font-semibold uppercase animate-fade-up">
                {isAr ? 'أعمالنا المختارة' : 'OUR WORK'}
              </span>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ivory font-light tracking-tight leading-[1.05] animate-fade-up [animation-delay:120ms]">
                {isAr ? (
                  <>
                    مشاريع
                    <br />
                    منتقاة
                  </>
                ) : (
                  <>
                    Selected
                    <br />
                    Projects
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-ivory/85 leading-relaxed max-w-xl animate-fade-up [animation-delay:240ms]">
                {isAr
                  ? 'ملف أعمال منتقى عبر العمارة، التصميم الداخلي، اللاندسكيب، التخطيط العمراني، والهندسة المتكاملة — نوحد الإنسان والمكان والغاية.'
                  : 'A curated portfolio across Architecture, Interior Design, Landscape, Urban Design, and Engineering — unifying people, places and purpose.'}
              </p>

              {/* Accent Line & Motto */}
              <div className="flex items-center gap-3 text-xs eyebrow text-gold/90 font-medium tracking-widest pt-2 animate-fade-up [animation-delay:360ms]">
                <span className="w-10 h-px bg-gold inline-block" aria-hidden="true" />
                <span>
                  {isAr ? 'مساحات لغدٍ أكثر إشراقاً' : 'SPACES FOR A BRIGHTER TOMORROW'}
                </span>
              </div>
            </div>

            {/* Right Brand Pillars (PEOPLE / PLACES / PURPOSE / ALWAYS) */}
            <div
              dir="ltr"
              className="flex items-center gap-4 animate-fade-in [animation-delay:400ms] self-start lg:self-end"
            >
              <span className="h-16 w-px bg-gold/40 hidden sm:inline-block" aria-hidden="true" />
              <div className="flex flex-col gap-1.5 eyebrow text-ivory/80 text-xs tracking-[0.25em] font-medium uppercase">
                <span className="hover:text-gold transition-colors">PEOPLE</span>
                <span className="hover:text-gold transition-colors">PLACES</span>
                <span className="hover:text-gold transition-colors">PURPOSE</span>
                <span className="text-gold font-bold">ALWAYS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FILTER & SORT NAVIGATION BAR (Sticky Sub-Header)
          - Tabs: ALL | ARCHITECTURE | INTERIOR DESIGN | LANDSCAPE | URBAN DESIGN | ENGINEERING
         ========================================================================= */}
      <section className="bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone/30 sticky top-20 md:top-[88px] z-30 shadow-xs">
        <div className="container-viwan py-3.5 flex items-center justify-between gap-6">
          {/* Scrollable Tab List */}
          <div
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1"
            role="tablist"
            aria-label="Filter projects by discipline"
          >
            {TAB_FILTERS.map((tab) => {
              const isActive = activeTab === tab.id
              const label = isAr ? tab.labelAr : tab.labelEn
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`eyebrow text-xs tracking-wider px-3.5 py-1.5 whitespace-nowrap transition-all duration-200 cursor-pointer rounded-xs ${
                    isActive
                      ? 'text-charcoal font-semibold border-b-2 border-charcoal bg-stone/20'
                      : 'text-charcoal/60 hover:text-charcoal hover:bg-stone/10'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Right Sort Dropdown */}
          <div className="hidden md:flex items-center gap-2 shrink-0 ps-4 border-s border-stone/30">
            <span className="eyebrow text-[11px] text-charcoal/60 tracking-wider">
              {t.projectsPage.sortBy}
            </span>
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort projects"
                className="eyebrow text-xs font-semibold text-charcoal bg-transparent hover:text-gold cursor-pointer pe-6 py-1 appearance-none focus:outline-none focus:ring-1 focus:ring-gold rounded"
              >
                <option value="latest">{t.projectsPage.sortLatest}</option>
                <option value="egypt">{t.projectsPage.sortEgypt}</option>
                <option value="ksa">{t.projectsPage.sortKsa}</option>
              </select>
              <ChevronDown className="size-3 text-charcoal absolute end-1 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. THE 5 DISCIPLINES EDITORIAL LAYOUT (Exact Order 01 to 05 from Reference)
          01 Architecture
          02 Interior Design
          03 Landscape
          04 Urban Design
          05 Engineering
          Each discipline row:
          - Left: Index + Title + Description + VIEW ALL ->
          - Center: Big Featured Card with Title, Location, Year, Scope below
          - Right: 2 Stacked Horizontal Cards with thumbnail, title, location, scope, and circular arrow button ->
         ========================================================================= */}
      <section className="bg-[#FAF9F6] drafting-grid relative">
        <div className="container-viwan divide-y divide-stone/30">
          {displayedDisciplines.map((cat) => {
            const catTitle = isAr ? cat.titleAr : cat.titleEn
            const catTagline = isAr ? cat.taglineAr : cat.taglineEn
            const feat = cat.featured
            const fTitle = isAr ? feat.titleAr : feat.titleEn
            const fLoc = isAr ? feat.locationAr : feat.locationEn
            const fScope = isAr ? feat.scopeAr : feat.scopeEn

            return (
              <div
                key={cat.id}
                id={`discipline-${cat.id}`}
                className="py-14 sm:py-20 lg:py-24 first:pt-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  {/* Left Column (25%): 01 + Title + Tagline + VIEW ALL -> */}
                  <div className="lg:col-span-3 flex flex-col justify-between h-full">
                    <div>
                      {/* Number Index */}
                      <span className="font-mono text-sm sm:text-base text-gold/90 font-semibold tracking-widest block mb-2">
                        {cat.num}
                      </span>

                      {/* Discipline Title */}
                      <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-tight leading-tight mb-4">
                        {catTitle}
                      </h2>

                      {/* Brief Discipline Statement */}
                      <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed max-w-xs mb-6">
                        {catTagline}
                      </p>
                    </div>

                    {/* View All Button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveTab(cat.id)}
                        className="inline-flex items-center gap-2 eyebrow text-xs font-semibold text-charcoal/80 hover:text-gold transition-colors py-1 group cursor-pointer"
                      >
                        <span className="border-b border-charcoal/40 group-hover:border-gold pb-0.5">
                          {isAr ? 'عرض الكل' : 'VIEW ALL'}
                        </span>
                        {isAr ? (
                          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Center Column (45%): Large Primary Featured Project Card */}
                  <div className="lg:col-span-5">
                    <article
                      onClick={() =>
                        setSelectedProject({
                          title: fTitle,
                          category: catTitle,
                          location: fLoc,
                          year: feat.year,
                          image: feat.image,
                          alt: feat.alt,
                          desc: isAr ? feat.descAr || '' : feat.descEn || '',
                          scopeText: fScope,
                          scope: isAr ? feat.scopeListAr : feat.scopeListEn,
                          slug: feat.slug,
                        })
                      }
                      className="group/feat cursor-pointer flex flex-col"
                    >
                      {/* Card Image Container */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone/20 border border-stone/20">
                        <Image
                          src={feat.image}
                          alt={feat.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 45vw"
                          className="object-cover group-hover/feat:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>

                      {/* Text details below card (as in Reference Image) */}
                      <div className="pt-4 flex flex-col">
                        <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-charcoal group-hover/feat:text-gold transition-colors">
                          {fTitle}
                        </h3>
                        <p className="text-xs text-charcoal/60 mt-1">
                          {fLoc} | {feat.year}
                        </p>
                        <p className="text-xs text-charcoal/70 font-medium mt-0.5">
                          {fScope}
                        </p>
                      </div>
                    </article>
                  </div>

                  {/* Right Column (30%): 2 Stacked Horizontal Sub-Project Cards */}
                  <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-7">
                    {cat.subProjects.map((sub) => {
                      const sTitle = isAr ? sub.titleAr : sub.titleEn
                      const sLoc = isAr ? sub.locationAr : sub.locationEn
                      const sScope = isAr ? sub.scopeAr : sub.scopeEn

                      return (
                        <article
                          key={sub.id}
                          onClick={() =>
                            setSelectedProject({
                              title: sTitle,
                              category: catTitle,
                              location: sLoc,
                              year: sub.year,
                              image: sub.image,
                              alt: sub.alt,
                              desc: isAr ? sub.descAr || '' : sub.descEn || '',
                              scopeText: sScope,
                              scope: isAr ? sub.scopeListAr : sub.scopeListEn,
                              slug: sub.slug,
                            })
                          }
                          className="group/sub cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2.5 sm:p-3 -m-2.5 sm:-m-3 rounded-xs hover:bg-stone/15 transition-colors duration-200"
                        >
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            {/* Horizontal Thumbnail */}
                            <div className="relative w-28 sm:w-32 aspect-[16/10] shrink-0 overflow-hidden bg-stone/20 border border-stone/20">
                              <Image
                                src={sub.image}
                                alt={sub.alt}
                                fill
                                sizes="(max-width: 640px) 112px, 128px"
                                className="object-cover group-hover/sub:scale-105 transition-transform duration-500 ease-out"
                              />
                            </div>

                            {/* Project Information */}
                            <div className="flex flex-col min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal group-hover/sub:text-gold transition-colors line-clamp-1">
                                {sTitle}
                              </h4>
                              <p className="text-[11px] text-charcoal/60 mt-0.5 line-clamp-1">
                                {sLoc} | {sub.year}
                              </p>
                              <p className="text-[11px] text-charcoal/70 font-medium mt-0.5 line-clamp-1">
                                {sScope}
                              </p>
                            </div>
                          </div>

                          {/* Circular Arrow Button (Reference Image) */}
                          <div className="size-9 sm:size-10 rounded-full border border-stone/30 flex items-center justify-center shrink-0 ms-auto text-charcoal/70 group-hover/sub:border-gold group-hover/sub:bg-gold group-hover/sub:text-charcoal transition-all duration-300">
                            {isAr ? (
                              <ArrowLeft className="size-4" strokeWidth={1.75} />
                            ) : (
                              <ArrowRight className="size-4" strokeWidth={1.75} />
                            )}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          4. OUR PHILOSOPHY SECTION (Exact Section from Reference Image 2)
          - Left: OUR PHILOSOPHY / Better environments create brighter lives.
          - Center: We design across disciplines to create meaningful places...
          - Right: High-resolution visual banner with NATURE/PEOPLE/CULTURE/PROGRESS
         ========================================================================= */}
      <section className="bg-[#FAF9F6] border-t border-stone/30 py-16 sm:py-24">
        <div className="container-viwan">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Heading & Eyebrow */}
            <div className="lg:col-span-4 flex flex-col">
              <span className="eyebrow text-xs text-gold tracking-[0.25em] font-semibold uppercase mb-3 block">
                {t.projectsPage.philosophyEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light leading-tight tracking-tight">
                {t.projectsPage.philosophyTitle}
              </h2>
            </div>

            {/* Center: Quote & Architectural Mission */}
            <div className="lg:col-span-4 flex flex-col justify-center border-s-0 lg:border-s border-stone/30 lg:ps-8">
              <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed mb-4">
                {t.projectsPage.philosophyQuote}
              </p>
              <div className="flex items-center gap-3 text-[11px] eyebrow text-gold font-medium tracking-widest">
                <span className="w-8 h-px bg-gold inline-block" aria-hidden="true" />
                <span>{t.projectsPage.philosophyAccent}</span>
              </div>
            </div>

            {/* Right: Visual Image with Vertical Typography */}
            <div className="lg:col-span-4 relative">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone/20 shadow-xs group">
                <Image
                  src="/images/hero-villa-2.jpg"
                  alt="Viwan architectural philosophy visual"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-charcoal/25" />

                {/* Vertical overlay words */}
                <div
                  dir="ltr"
                  className="absolute top-0 end-0 bottom-0 px-4 py-4 flex flex-col justify-between items-center text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-ivory/90 uppercase select-none pointer-events-none bg-charcoal/30 backdrop-blur-[2px]"
                >
                  <span>NATURE</span>
                  <span>PEOPLE</span>
                  <span>CULTURE</span>
                  <span className="text-gold font-bold">PROGRESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. LET'S BUILD TOGETHER (Bottom Dark Banner from Reference Image 2)
          - Left: LET'S BUILD TOGETHER / Start your next project.
          - Center: Share your vision and explore how we can bring it to life...
          - Right: 30 MINUTES FREE CONSULTATION -> button
         ========================================================================= */}
      <section className="bg-[#11110F] text-ivory py-12 sm:py-16 border-t border-stone/30">
        <div className="container-viwan">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-4">
              <span className="eyebrow text-gold text-xs tracking-widest font-medium uppercase block mb-2">
                {t.projectsPage.letsBuildEyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-light tracking-tight">
                {t.projectsPage.letsBuildTitle}
              </h2>
            </div>

            {/* Center Column */}
            <div className="lg:col-span-5 border-s-0 lg:border-s border-white/10 lg:ps-8">
              <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed">
                {t.projectsPage.letsBuildSubtitle}
              </p>
            </div>

            {/* Right Column: CTA Button */}
            <div className="lg:col-span-3 flex justify-start lg:justify-end">
              <Link
                href="/consultation"
                className="px-6 py-3.5 bg-[#8C6D46] hover:bg-gold text-charcoal font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-xs inline-flex items-center gap-3 group shadow-md"
              >
                <span>{t.projectsPage.freeConsultationCta}</span>
                {isAr ? (
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ARCHITECTURAL FAQS SECTION (AIA / RIBA Inquiries & Governance)
         ========================================================================= */}
      <ProjectsFaqSection />

      {/* =========================================================================
          7. INTERACTIVE PROJECT PREVIEW MODAL
         ========================================================================= */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-dialog-title"
        >
          <div
            className="relative w-full max-w-2xl bg-[#FBFBFA] border border-stone/30 shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
              className="absolute top-4 end-4 z-20 size-10 flex items-center justify-center rounded-full bg-charcoal/70 hover:bg-charcoal text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* High-res Image Banner */}
            <div className="relative aspect-[16/9] w-full bg-secondary">
              <Image
                src={selectedProject.image}
                alt={selectedProject.alt}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-6 end-6 flex items-baseline justify-between text-ivory">
                <span className="eyebrow text-gold text-xs tracking-widest font-semibold">
                  {selectedProject.category}
                </span>
                <span className="eyebrow text-ivory/70 text-xs tracking-wider">
                  VIWAN PORTFOLIO
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              <div>
                <h3
                  id="project-dialog-title"
                  className="font-serif text-2xl sm:text-3xl text-charcoal mb-2"
                >
                  {selectedProject.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/70 mb-3">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-gold shrink-0" />
                    <span>{selectedProject.location}</span>
                  </span>
                  {selectedProject.year && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-gold shrink-0" />
                      <span>{selectedProject.year}</span>
                    </span>
                  )}
                  {selectedProject.scopeText && (
                    <span className="text-gold font-medium">
                      {selectedProject.scopeText}
                    </span>
                  )}
                </div>
                {selectedProject.desc && (
                  <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed">
                    {selectedProject.desc}
                  </p>
                )}
              </div>

              {/* Scope Checklist if available */}
              {selectedProject.scope && selectedProject.scope.length > 0 && (
                <div>
                  <h4 className="eyebrow text-gold text-xs font-semibold mb-2.5">
                    {isAr ? 'مراحل العمل المنجزة' : 'Delivered Scope'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProject.scope.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/85">
                        <CheckCircle2 className="size-3.5 text-gold shrink-0" strokeWidth={1.5} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-stone/20">
                {selectedProject.slug && (
                  <Link
                    href={`/projects/${selectedProject.slug}`}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gold text-charcoal font-semibold text-xs uppercase tracking-wider text-center hover:bg-gold/90 transition-colors rounded-xs inline-flex items-center justify-center gap-2"
                  >
                    <span>{isAr ? 'عرض صفحة المشروع بالكامل' : 'View Full Monograph'}</span>
                    {isAr ? (
                      <ArrowLeft className="size-3.5" />
                    ) : (
                      <ArrowRight className="size-3.5" />
                    )}
                  </Link>
                )}
                <ButtonLink
                  href="/consultation"
                  variant="solid"
                  className="w-full sm:w-auto text-center"
                >
                  {isAr ? 'حجز استشارة لمشروع مشابه' : 'Consult on a Similar Project'}
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-5 py-2.5 eyebrow text-xs text-charcoal/70 hover:text-charcoal transition-colors text-center cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
