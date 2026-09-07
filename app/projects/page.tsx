'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, X, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import { Eyebrow, ButtonLink } from '@/components/site/primitives'
import { useLanguage } from '@/lib/i18n'
import { ProjectsFaqSection } from '@/components/projects/faq-section'

interface SubProject {
  titleEn: string
  titleAr: string
  locationEn: string
  locationAr: string
  image: string
  alt: string
  year?: string
  descEn?: string
  descAr?: string
}

interface DisciplineCategory {
  id: string
  num: string
  titleEn: string
  titleAr: string
  featured: {
    titleEn: string
    titleAr: string
    locationEn: string
    locationAr: string
    year: string
    image: string
    alt: string
    descEn: string
    descAr: string
    scopeEn: string[]
    scopeAr: string[]
  }
  subProjects: [SubProject, SubProject]
}

const PORTFOLIO_DATA: DisciplineCategory[] = [
  {
    id: 'architecture',
    num: '01',
    titleEn: 'Architecture',
    titleAr: 'الهندسة المعمارية',
    featured: {
      titleEn: 'Modern Villa',
      titleAr: 'فيلا عصرية فاخرة',
      locationEn: 'New Cairo, Egypt',
      locationAr: 'القاهرة الجديدة، مصر',
      year: '2024',
      image: '/images/service-architecture.jpg',
      alt: 'Contemporary luxury travertine stone and glass villa at twilight',
      descEn:
        'A monolithic residential composition balancing travertine stone volumes, cantilevered roofs, and full-height glass walls opening directly to a reflective pool courtyard.',
      descAr:
        'كتل سكنية متوازنة من حجر الترافيرتين الطبيعي، وأسقف كابولية خرسانية، وواجهات زجاجية ممتدة بارتفاع كامل تطل على فناء مائي عاكس.',
      scopeEn: ['Concept Design', 'Schematic Design', 'BIM Modeling', 'Façade Detailing'],
      scopeAr: ['الفكرة التصميمية', 'المخططات المعمارية', 'نمذجة BIM', 'تفاصيل الواجهات'],
    },
    subProjects: [
      {
        titleEn: 'Residential Compound',
        titleAr: 'كمبوند سكني متكامل',
        locationEn: 'Sheikh Zayed, Egypt',
        locationAr: 'الشيخ زايد، مصر',
        image: '/images/hero-villa.png',
        alt: 'Contemporary luxury villa with infinity pool at dusk',
        descEn: 'Private masterplanned gated villa enclave integrating modern Mediterranean architectural vernacular.',
        descAr: 'مجمع فيلات سكنية فاخرة يدمج الهوية المعمارية المتوسطية العصرية مع الخصوصية.',
      },
      {
        titleEn: 'Mixed-Use Building',
        titleAr: 'مبنى تجاري متعدد الاستخدام',
        locationEn: 'Riyadh, KSA',
        locationAr: 'الرياض، السعودية',
        image: '/images/project-commercial-riyadh.png',
        alt: 'Contemporary commercial building in Riyadh',
        descEn: 'Corporate commercial landmark featuring bioclimatic solar shading louvers and stone cladding.',
        descAr: 'صرح تجاري وإداري في الرياض يتميز بكواسر شمسية ذكية وتكسيات حجرية متطورة.',
      },
    ],
  },
  {
    id: 'interior-design',
    num: '02',
    titleEn: 'Interior Design',
    titleAr: 'التصميم الداخلي',
    featured: {
      titleEn: 'Private Residence',
      titleAr: 'إقامة خاصة فاخرة',
      locationEn: 'Cairo, Egypt',
      locationAr: 'القاهرة، مصر',
      year: '2024',
      image: '/images/service-interior-design.jpg',
      alt: 'Ultra-luxury modern interior living room with bespoke furniture and cove lighting',
      descEn:
        'A warm minimalist interior where custom fluted walnut timber, backlit Calacatta marble fireplaces, and bespoke linen sectional furniture harmonize seamlessly.',
      descAr:
        'تصميم داخلي مينيمالي دافئ يجمع بين أخشاب الجوز المضلعة، ومواقد رخام الكلكتا بإضاءة خفية، وأثاث كتاني مصمم خصيصاً للمكان.',
      scopeEn: ['Space Planning', 'Custom Joinery', 'Architectural Lighting', 'FF&E Selection'],
      scopeAr: ['تخطيط الفراغات', 'النجارة الحصرية', 'الإضاءة المعمارية', 'انتقاء الأثاث والديكور'],
    },
    subProjects: [
      {
        titleEn: 'Luxury Apartment',
        titleAr: 'شقة سكنية راقية',
        locationEn: 'New Cairo, Egypt',
        locationAr: 'القاهرة الجديدة، مصر',
        image: '/images/interior-dining.png',
        alt: 'Luxury dining room with marble table and sculptural light',
        descEn: 'Penthouse dining and living sequence with custom bronze fixtures and travertine dining table.',
        descAr: 'سلسلة فراغات معيشة واستقبال لبنتهاوس مع إكسسوارات برونزية وطاولة طعام حجرية.',
      },
      {
        titleEn: 'Office Headquarters',
        titleAr: 'مقر إداري رئيسي',
        locationEn: 'Cairo, Egypt',
        locationAr: 'القاهرة، مصر',
        image: '/images/project-executive-office.png',
        alt: 'Executive board office with timber cladding',
        descEn: 'Executive corporate suite balancing acoustic comfort, natural wood paneling, and discreet technology.',
        descAr: 'أجنحة إدارية تنفيذية توازن بين العزل الصوتي الفائق، والتجاليد الخشبية الطبيعية، والتقنيات الذكية.',
      },
    ],
  },
  {
    id: 'landscape-design',
    num: '03',
    titleEn: 'Landscape Design',
    titleAr: 'عمارة البيئة واللاندسكيب',
    featured: {
      titleEn: 'Private Garden',
      titleAr: 'حديقة فيلا خاصة',
      locationEn: 'New Cairo, Egypt',
      locationAr: 'القاهرة الجديدة، مصر',
      year: '2024',
      image: '/images/service-landscape-design.jpg',
      alt: 'Luxury private villa landscape garden at sunset with pool and pergola',
      descEn:
        'A curated landscape design blending an infinity swimming pool, floating stone steps, custom timber pergolas, and climate-resilient olive trees and subtropical flora.',
      descAr:
        'عمارة بيئية متكاملة تجمع بين مسبح إنفينيتي عاكس، ومسارات حجرية عائمة، ومظلات خشبية، وأشجار زيتون معمرة ونباتات متوافقة بيئياً.',
      scopeEn: ['Masterplanning', 'Hardscape & Decks', 'Softscape Curation', 'Smart Irrigation'],
      scopeAr: ['المخطط العام للحديقة', 'العناصر الصلبة والمظلات', 'انتقاء النباتات', 'شبكات الري الذكية'],
    },
    subProjects: [
      {
        titleEn: 'Residential Landscape',
        titleAr: 'لاندسكيب سكني خاص',
        locationEn: 'Sheikh Zayed, Egypt',
        locationAr: 'الشيخ زايد، مصر',
        image: '/images/detail-courtyard.png',
        alt: 'Minimalist courtyard with olive tree and stone fountain',
        descEn: 'A contemplative inner courtyard centered around an ancient olive tree and linear water feature.',
        descAr: 'فناء داخلي للتأمل يتمحور حول شجرة زيتون عتيقة ونافورة مائية هادئة.',
      },
      {
        titleEn: 'Hospitality Resort',
        titleAr: 'منتجع ساحلي فاخر',
        locationEn: 'Red Sea, Egypt',
        locationAr: 'البحر الأحمر، مصر',
        image: '/images/project-lake-house.png',
        alt: 'Resort villa on water edge with natural planting',
        descEn: 'Coastal resort masterplan integrating private beach terraces, native desert planting, and sea breeze corridors.',
        descAr: 'مخطط لمنتجع ساحلي يدمج مصاطب شاطئية خاصة مع الغطاء النباتي الصحراوي وتيارات الهواء الطبيعية.',
      },
    ],
  },
  {
    id: 'urban-design',
    num: '04',
    titleEn: 'Urban Design',
    titleAr: 'التصميم والتخطيط العمراني',
    featured: {
      titleEn: 'Mixed-Use Masterplan',
      titleAr: 'مخطط عام متعدد الاستخدام',
      locationEn: 'Riyadh, KSA',
      locationAr: 'الرياض، السعودية',
      year: '2024',
      image: '/images/service-urban-design.jpg',
      alt: 'Aerial architectural drone view of contemporary masterplanned community',
      descEn:
        'A pedestrian-oriented sustainable urban masterplan featuring tree-canopied boulevards, water canals, mixed-use low-rise quarters, and walkable plazas.',
      descAr:
        'مخطط حضري مستدام يركز على المشاة، يضم جادات عريضة مظللة بالأشجار، وقنوات مائية، ومجمعات سكنية وتجارية منخفضة الارتفاع.',
      scopeEn: ['Urban Density Strategy', 'Circulation & Walkability', 'Public Realm', '3D Visual Simulation'],
      scopeAr: ['استراتيجية الكثافة العمرانية', 'حركة المشاة والسيارات', 'الفضاء العام', 'المحاكاة ثلاثية الأبعاد'],
    },
    subProjects: [
      {
        titleEn: 'Urban District',
        titleAr: 'حي عمراني مستدام',
        locationEn: 'New Capital, Egypt',
        locationAr: 'العاصمة الإدارية، مصر',
        image: '/images/project-hillside-villa.png',
        alt: 'Terraced contemporary residential buildings',
        descEn: 'Terraced urban residential community designed for natural daylight access and communal green gardens.',
        descAr: 'مجتمع سكني حضري متدرج مصمم لتعظيم الاستفادة من الإضاءة الطبيعية والحدائق المشتركة.',
      },
      {
        titleEn: 'City Expansion Study',
        titleAr: 'دراسة توسع وتطوير حضري',
        locationEn: 'AlUla, KSA',
        locationAr: 'العلا، السعودية',
        image: '/images/hero-villa-2.jpg',
        alt: 'Desert architectural volumes integrated with landscape',
        descEn: 'Ecological masterplanning framework integrating vernacular stone architecture with natural canyon topography.',
        descAr: 'إطار تخطيط بيئي يدمج العمارة الحجرية المحلية مع تضاريس الأودية والجبال الطبيعية.',
      },
    ],
  },
  {
    id: 'engineering',
    num: '05',
    titleEn: 'Engineering',
    titleAr: 'التنسيق الهندسي الشامل',
    featured: {
      titleEn: 'Industrial Facility',
      titleAr: 'منشأة صناعية متطورة',
      locationEn: '10th of Ramadan, Egypt',
      locationAr: 'العاشر من رمضان، مصر',
      year: '2024',
      image: '/images/service-engineering.jpg',
      alt: 'Contemporary architectural engineering office building with precise structural grid',
      descEn:
        'A high-performance commercial and industrial facility engineered with long-span structural grids, advanced energy-efficient envelope, and seamless MEP integration.',
      descAr:
        'منشأة صناعية وتجارية متطورة مصممة بهياكل إنشائية واسعة البحور، وغلاف مبنى موفر للطاقة، وتنسيق كهروميكانيكي محكم.',
      scopeEn: ['Structural Engineering', 'MEP Infrastructure', 'BIM Clash Detection', 'Value Engineering'],
      scopeAr: ['الهندسة الإنشائية', 'البنية التحتية الكهروميكانيكية', 'فحص التعارضات عبر BIM', 'الهندسة القيمية'],
    },
    subProjects: [
      {
        titleEn: 'Infrastructure Design',
        titleAr: 'تصميم البنية التحتية والشبكات',
        locationEn: 'Egypt',
        locationAr: 'مصر',
        image: '/images/material-stone.png',
        alt: 'Engineered stone and civil infrastructure foundation',
        descEn: 'Civil coordination, drainage grading, and underground utilities network modeling for private compounds.',
        descAr: 'التنسيق المدني، وشبكات تصريف الأمطار، ونمذجة البنية التحتية للمجمعات السكنية الخاصة.',
      },
      {
        titleEn: 'MEP Coordination',
        titleAr: 'التنسيق الكهروميكانيكي المتقدم',
        locationEn: 'Cairo, Egypt',
        locationAr: 'القاهرة، مصر',
        image: '/images/service-project-management.jpg',
        alt: 'Engineering workspace with blueprints and laptop',
        descEn: 'Fully coordinated Revit MEP model resolving hundreds of ceiling duct and pipe clashes prior to site execution.',
        descAr: 'نموذج ريفيت كهروميكانيكي منسق بالكامل يحل كافة تعارضات التكييف والمواسير قبل التنفيذ بالموقع.',
      },
    ],
  },
  {
    id: 'project-management',
    num: '06',
    titleEn: 'Project Management',
    titleAr: 'إدارة المشاريع',
    featured: {
      titleEn: 'Residential Compound',
      titleAr: 'مجمع سكني متكامل',
      locationEn: 'Sheikh Zayed, Egypt',
      locationAr: 'الشيخ زايد، مصر',
      year: '2024',
      image: '/images/hero-villa-3.jpg',
      alt: 'Limestone private villa estate with illuminated pool terrace at sunset',
      descEn:
        'Comprehensive project management overseeing procurement, cost tracking, milestone scheduling, and quality audit across 18 luxury estate villas.',
      descAr:
        'إدارة شاملة للمشروع تشمل المشتريات، وضبط التكاليف، والجدولة الزمنية، وتدقيق الجودة عبر 18 فيلا سكنية فاخرة.',
      scopeEn: ['Schedule Governance', 'Budget Administration', 'Contract Management', 'Quality Assurance'],
      scopeAr: ['حوكمة الجدول الزمني', 'إدارة الميزانية', 'إدارة العقود والمستخلصات', 'توكيد ومراقبة الجودة'],
    },
    subProjects: [
      {
        titleEn: 'Commercial Complex',
        titleAr: 'مجمع تجاري وإداري',
        locationEn: 'Cairo, Egypt',
        locationAr: 'القاهرة، مصر',
        image: '/images/project-majlis.png',
        alt: 'Contemporary commercial atrium architecture',
        descEn: 'Milestone management and contractor supervision for a 12,000 sqm commercial lifestyle center.',
        descAr: 'إدارة المهل الزمنية والإشراف على المقاولين لمركز تجاري وترفيهي بمساحة 12,000 متر مربع.',
      },
      {
        titleEn: 'Hospitality Project',
        titleAr: 'مشروع فندقي ساحلي',
        locationEn: 'Red Sea, Egypt',
        locationAr: 'البحر الأحمر، مصر',
        image: '/images/consultation-architects.jpg',
        alt: 'Architects reviewing blueprints at project meeting',
        descEn: 'Turnkey schedule management and consultant coordination for a beachfront luxury boutique hotel.',
        descAr: 'إدارة متكاملة للتسليم على المفتاح وتنسيق الاستشاريين لفندق بوتيك شاطئي فاخر.',
      },
    ],
  },
  {
    id: 'finishing-fit-out',
    num: '07',
    titleEn: 'Finishing & Fit-Out',
    titleAr: 'التشطيبات والتجهيز الداخلي',
    featured: {
      titleEn: 'Hotel Interiors',
      titleAr: 'تشطيبات فندقية فاخرة',
      locationEn: 'Cairo, Egypt',
      locationAr: 'القاهرة، مصر',
      year: '2024',
      image: '/images/service-fitout-marble.jpg',
      alt: 'Architectural bookmatched marble wall adjacent to fluted wood paneling',
      descEn:
        'Bespoke architectural execution including full-height bookmatched Italian Calacatta marble wall cladding, acoustic timber ribs, and concealed lighting profiles.',
      descAr:
        'تنفيذ معماري دقيق يشمل تجاليد رخام كلكتا إيطالي ممتد للأسقف، وتجاليد خشبية عازلة للصوت، ومسارات إضاءة مخفية.',
      scopeEn: ['Marble Installation', 'Architectural Millwork', 'Custom Metalwork', 'Acoustic Finishes'],
      scopeAr: ['تركيب الرخام الفاخر', 'الأعمال الخشبية الدقيقة', 'التشطيبات المعدنية', 'المعالجات الصوتية'],
    },
    subProjects: [
      {
        titleEn: 'Residential Finishing',
        titleAr: 'تشطيبات سكنية حصرية',
        locationEn: 'New Cairo, Egypt',
        locationAr: 'القاهرة الجديدة، مصر',
        image: '/images/interior-living-marble.jpg',
        alt: 'Luxury living room with fine marble and wood',
        descEn: 'Turnkey interior finishing featuring seamless micro-cement flooring and fluted timber wall accents.',
        descAr: 'تشطيبات سكنية متكاملة بأرضيات مايكروسمنت انسيابية وتجاليد خشبية أنيقة.',
      },
      {
        titleEn: 'Office Fit-Out',
        titleAr: 'تجهيز مكاتب تنفيذية',
        locationEn: 'Cairo, Egypt',
        locationAr: 'القاهرة، مصر',
        image: '/images/interior-bedroom.png',
        alt: 'Luxury interior bedroom suite with fine joinery',
        descEn: 'High-end fit-out of executive boardroom suites with custom acoustic paneling and bronze hardware.',
        descAr: 'تجهيز رفيع المستوى لقاعات الاجتماعات التنفيذية بتكسيات صوتية ومقابض برونزية خاصة.',
      },
    ],
  },
  {
    id: 'construction-supervision',
    num: '08',
    titleEn: 'Construction Supervision',
    titleAr: 'الإشراف على التنفيذ',
    featured: {
      titleEn: 'Office Building',
      titleAr: 'مبنى إداري ذكي',
      locationEn: 'New Administrative Capital, Egypt',
      locationAr: 'العاصمة الإدارية، مصر',
      year: '2024',
      image: '/images/service-construction-supervision.jpg',
      alt: 'Site engineer in hardhat and safety vest inspecting building under construction',
      descEn:
        'Daily on-site engineering supervision, material compliance testing, structural concrete inspection, and facade installation quality control.',
      descAr:
        'إشراف هندسي ميداني يومي بالموقع، واختبارات مطابقة المواد، وفحص صب الخرسانات، ومراقبة جودة تركيب الواجهات.',
      scopeEn: ['Daily Site Inspection', 'Specification Compliance', 'Concrete & Steel Testing', 'Snagging & Handover'],
      scopeAr: ['التفتيش الميداني اليومي', 'مطابقة المواصفات القياسية', 'فحص الخرسانة والحديد', 'الفحص النهائي والتسليم'],
    },
    subProjects: [
      {
        titleEn: 'Residential Villas',
        titleAr: 'فيلات سكنية فاخرة',
        locationEn: 'New Cairo, Egypt',
        locationAr: 'القاهرة الجديدة، مصر',
        image: '/images/project-private-residence.png',
        alt: 'Luxury villa private residence under finished supervision',
        descEn: 'Full structural and architectural supervision ensuring complete fidelity to architectural drawings.',
        descAr: 'إشراف إنشائي ومعماري متكامل يضمن مطابقة ما يُنفذ على الأرض للمخططات بنسبة 100%.',
      },
      {
        titleEn: 'Commercial Project',
        titleAr: 'مشروع تجاري متكامل',
        locationEn: 'Cairo, Egypt',
        locationAr: 'القاهرة، مصر',
        image: '/images/studio-space.png',
        alt: 'Architectural studio and commercial construction space',
        descEn: 'Rigorous engineering oversight during MEP installation, glass curtain wall testing, and life safety approvals.',
        descAr: 'إشراف هندسي صارم أثناء تمديدات الأنظمة الكهروميكانيكية وفحص الواجهات الزجاجية واعتمادات السلامة.',
      },
    ],
  },
]

const TAB_FILTERS = [
  { id: 'all', labelEn: 'ALL', labelAr: 'الكل' },
  { id: 'architecture', labelEn: 'ARCHITECTURE', labelAr: 'الهندسة المعمارية' },
  { id: 'interior-design', labelEn: 'INTERIOR DESIGN', labelAr: 'التصميم الداخلي' },
  { id: 'landscape-design', labelEn: 'LANDSCAPE DESIGN', labelAr: 'عمارة البيئة' },
  { id: 'urban-design', labelEn: 'URBAN DESIGN', labelAr: 'التخطيط العمراني' },
  { id: 'engineering', labelEn: 'ENGINEERING', labelAr: 'التنسيق الهندسي' },
  { id: 'project-management', labelEn: 'PROJECT MANAGEMENT', labelAr: 'إدارة المشاريع' },
  { id: 'finishing-fit-out', labelEn: 'FINISHING & FIT-OUT', labelAr: 'التشطيبات والتجهيز' },
  { id: 'construction-supervision', labelEn: 'CONSTRUCTION SUPERVISION', labelAr: 'الإشراف على التنفيذ' },
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
    scope?: string[]
  } | null>(null)

  const [dbProjects, setDbProjects] = useState<any[]>([])
  const [heroImage, setHeroImage] = useState<string>('/images/projects-hero-villa.jpg')

  // Load dynamic projects and site settings
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

  // Filter and sort portfolio data, merging dynamic admin additions
  const displayedCategories = useMemo(() => {
    let result = PORTFOLIO_DATA.map((cat) => {
      // Find dynamic projects matching this category/discipline
      const matched = dbProjects.filter(
        (p) =>
          p.discipline === cat.id ||
          p.category?.toLowerCase() === cat.id ||
          p.category?.toLowerCase() === cat.titleEn.toLowerCase()
      )
      if (!matched.length) return cat

      const feat = matched.find((p) => p.featured) || matched[0]
      const rest = matched.filter((p) => p.id !== feat.id)

      const updatedFeatured = {
        titleEn: feat.title || cat.featured.titleEn,
        titleAr: feat.titleAr || cat.featured.titleAr,
        locationEn: feat.location || cat.featured.locationEn,
        locationAr: feat.locationAr || cat.featured.locationAr,
        year: feat.year || cat.featured.year,
        image: feat.coverImage || cat.featured.image,
        alt: feat.title || cat.featured.alt,
        descEn: feat.description || cat.featured.descEn,
        descAr: feat.descriptionAr || cat.featured.descAr,
        scopeEn: feat.scope?.length ? feat.scope : cat.featured.scopeEn,
        scopeAr: feat.scopeAr?.length ? feat.scopeAr : cat.featured.scopeAr,
      }

      const updatedSubProjects = [...cat.subProjects] as [SubProject, SubProject]
      if (rest[0]) {
        updatedSubProjects[0] = {
          titleEn: rest[0].title,
          titleAr: rest[0].titleAr || rest[0].title,
          locationEn: rest[0].location,
          locationAr: rest[0].locationAr || rest[0].location,
          image: rest[0].coverImage || cat.subProjects[0].image,
          alt: rest[0].title,
          year: rest[0].year,
          descEn: rest[0].description,
          descAr: rest[0].descriptionAr,
        }
      }
      if (rest[1]) {
        updatedSubProjects[1] = {
          titleEn: rest[1].title,
          titleAr: rest[1].titleAr || rest[1].title,
          locationEn: rest[1].location,
          locationAr: rest[1].locationAr || rest[1].location,
          image: rest[1].coverImage || cat.subProjects[1].image,
          alt: rest[1].title,
          year: rest[1].year,
          descEn: rest[1].description,
          descAr: rest[1].descriptionAr,
        }
      }

      return {
        ...cat,
        featured: updatedFeatured,
        subProjects: updatedSubProjects,
      }
    })

    if (activeTab !== 'all') {
      result = result.filter((cat) => cat.id === activeTab)
    }
    if (sortBy === 'egypt') {
      result = result.map((cat) => ({
        ...cat,
        subProjects: [...cat.subProjects].sort((a) =>
          a.locationEn.includes('Egypt') ? -1 : 1
        ) as [SubProject, SubProject],
      }))
    } else if (sortBy === 'ksa') {
      result = result.map((cat) => ({
        ...cat,
        subProjects: [...cat.subProjects].sort((a) =>
          a.locationEn.includes('KSA') || a.locationEn.includes('Riyadh') ? -1 : 1
        ) as [SubProject, SubProject],
      }))
    }
    return result
  }, [activeTab, sortBy, dbProjects])

  return (
    <main className="min-h-screen bg-background">
      {/* 1. CINEMATIC HERO SECTION (Matching Reference Image) */}
      <section className="relative min-h-[58vh] lg:min-h-[64vh] flex flex-col justify-end surface-dark overflow-hidden select-none">
        {/* Bespoke Twilight Villa Photo with Reflective Pool & Olive Tree */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Ultra-luxury modern villa at twilight with illuminated olive tree and reflecting infinity pool"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100"
          />
        </div>

        {/* Directional Gradients for Text Contrast & Architectural Glow */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/60 to-charcoal/30 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/50 to-transparent rtl:bg-gradient-to-l rtl:from-charcoal/90 rtl:via-charcoal/50 rtl:to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Content Container */}
        <div className="container-viwan relative z-10 w-full pt-36 md:pt-44 pb-16 md:pb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex flex-col gap-3 max-w-3xl">
            <Eyebrow gold className="animate-fade-up">
              {t.projectsPage.heroEyebrow}
            </Eyebrow>

            <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.08] animate-fade-up [animation-delay:150ms]">
              {t.projectsPage.heroTitle1}
              <br />
              {t.projectsPage.heroTitle2}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-ivory/85 leading-relaxed max-w-2xl animate-fade-up [animation-delay:300ms]">
              {t.projectsPage.heroSubtitle}
            </p>
          </div>

          {/* Right Brand Pillar Block with Vertical Divider */}
          <div className="hidden md:flex items-center gap-4 animate-fade-in [animation-delay:450ms]">
            <span className="h-16 w-px bg-ivory/30 inline-block" aria-hidden="true" />
            <div className="flex flex-col gap-1 eyebrow text-ivory/70 text-xs tracking-widest font-medium">
              <span>{t.projectsPage.brandPeople}</span>
              <span>{t.projectsPage.brandPlaces}</span>
              <span className="text-gold">{t.projectsPage.brandPurpose}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SORT NAVIGATION BAR (Sticky Sub-Header) */}
      <section className="bg-[#FAF9F6] border-y border-stone/30 sticky top-20 md:top-[88px] z-30 shadow-xs">
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
                  className={`eyebrow text-xs tracking-wider px-3.5 py-2 whitespace-nowrap transition-all duration-200 cursor-pointer rounded-xs ${
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

      {/* 3. THE 8 DISCIPLINES ARCHITECTURAL SHOWCASE GRID (24 PROJECTS) */}
      <section className="bg-[#FAF9F5] py-12 md:py-16 drafting-grid relative">
        <div className="container-viwan">
          {/* 4-column layout matching reference image */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-s border-stone/30">
            {displayedCategories.map((cat, idx) => {
              const catTitle = isAr ? cat.titleAr : cat.titleEn
              const featured = cat.featured
              const fTitle = isAr ? featured.titleAr : featured.titleEn
              const fLoc = isAr ? featured.locationAr : featured.locationEn

              return (
                <article
                  key={cat.id}
                  style={{ transitionDelay: `${(idx % 4) * 90}ms` }}
                  className="reveal p-5 sm:p-6 bg-background hover:bg-[#F9F8F4] transition-colors duration-300 border-e border-b border-stone/30 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Number + Category Title + VIEW ALL -> */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-xs tracking-widest text-gold font-semibold">
                          + {cat.num}
                        </span>
                        <h2 className="display text-lg sm:text-xl text-charcoal tracking-tight font-serif">
                          {catTitle}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab(cat.id)}
                        className="inline-flex items-center gap-1 eyebrow text-[10px] sm:text-[11px] font-semibold text-charcoal/70 hover:text-gold transition-colors shrink-0 group py-1"
                      >
                        <span>{t.projectsPage.viewAll}</span>
                        <ArrowRight className="size-3 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                      </button>
                    </div>

                    {/* Primary Featured Project Card */}
                    <div
                      onClick={() =>
                        setSelectedProject({
                          title: fTitle,
                          category: catTitle,
                          location: fLoc,
                          year: featured.year,
                          image: featured.image,
                          alt: featured.alt,
                          desc: isAr ? featured.descAr : featured.descEn,
                          scope: isAr ? featured.scopeAr : featured.scopeEn,
                        })
                      }
                      className="group/card relative aspect-[16/10] w-full overflow-hidden mb-3 bg-stone/20 border border-stone/20 cursor-pointer corner-ticks"
                    >
                      <Image
                        src={featured.image}
                        alt={featured.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent" />

                      {/* Bottom Info Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3.5 flex flex-col justify-end text-ivory">
                        <h3 className="display text-base sm:text-lg text-ivory leading-tight font-serif group-hover/card:text-gold transition-colors">
                          {fTitle}
                        </h3>
                        <p className="eyebrow text-[11px] text-ivory/75 tracking-wider mt-0.5">
                          {fLoc} | {featured.year}
                        </p>
                      </div>
                    </div>

                    {/* Dual Sub-Thumbnail Cards (Side-by-Side) */}
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {cat.subProjects.map((sub, idx) => {
                        const sTitle = isAr ? sub.titleAr : sub.titleEn
                        const sLoc = isAr ? sub.locationAr : sub.locationEn

                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              setSelectedProject({
                                title: sTitle,
                                category: catTitle,
                                location: sLoc,
                                image: sub.image,
                                alt: sub.alt,
                                desc: isAr ? sub.descAr || '' : sub.descEn || '',
                              })
                            }
                            className="group/sub flex flex-col cursor-pointer"
                          >
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone/20 border border-stone/20 mb-1.5">
                              <Image
                                src={sub.image}
                                alt={sub.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, 200px"
                                className="object-cover group-hover/sub:scale-105 transition-transform duration-500 ease-out"
                              />
                            </div>
                            <h4 className="text-xs font-medium text-charcoal group-hover/sub:text-gold transition-colors line-clamp-1 leading-snug">
                              {sTitle}
                            </h4>
                            <p className="text-[10px] text-charcoal/60 line-clamp-1 mt-0.5">
                              {sLoc}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Back to All button if filtered */}
          {activeTab !== 'all' && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center gap-2 eyebrow text-xs px-5 py-2.5 bg-charcoal text-ivory hover:bg-gold transition-colors cursor-pointer rounded-xs"
              >
                <span>{isAr ? 'عرض جميع التخصصات (8)' : 'View All Disciplines (8)'}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. INTERACTIVE PROJECT PREVIEW MODAL */}
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
              className="absolute top-4 end-4 z-20 size-10 flex items-center justify-center rounded-full bg-charcoal/70 hover:bg-charcoal text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <div>
                <h3
                  id="project-dialog-title"
                  className="display text-2xl sm:text-3xl text-charcoal mb-2"
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
                  className="w-full sm:w-auto px-5 py-2.5 eyebrow text-xs text-charcoal/70 hover:text-charcoal transition-colors text-center"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.5. ARCHITECTURAL FAQS (RIBA/AIA Standards with Typewriter Animation) */}
      <ProjectsFaqSection />

      {/* 5. READY TO START? BOTTOM CALL-TO-ACTION (Matching Reference Image) */}
      <section className="surface-dark bg-[#11110F] border-t border-stone/30 py-16 md:py-24 relative overflow-hidden reveal">
        <div className="container-viwan flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          {/* Left: Eyebrow & Headline */}
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="eyebrow text-gold text-xs tracking-widest font-medium uppercase">
              {t.projectsPage.readyEyebrow}
            </span>
            <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight text-balance">
              {t.projectsPage.readyTitle}
            </h2>
          </div>

          {/* Right: Two CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <ButtonLink href="/consultation" variant="gold">
              <span>{t.projectsPage.freeConsultationCta}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </ButtonLink>

            <ButtonLink
              href="/contact"
              variant="outline"
              className="border-ivory/30 text-ivory hover:bg-ivory/10 hover:border-ivory/60"
            >
              <span>{t.projectsPage.startProjectCta}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  )
}

