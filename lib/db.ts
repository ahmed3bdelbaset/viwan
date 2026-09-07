import fs from 'fs'
import path from 'path'
import { PROJECTS as INITIAL_PROJECTS, Project } from './projects'
import { JOBS as INITIAL_JOBS, Job } from './jobs'
import { CONTACT as INITIAL_CONTACT } from './site'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'db.json')

export interface ContactSubmission {
  id: string
  name: string
  company?: string
  email: string
  phone: string
  projectLocation?: string
  projectType?: string
  projectSize?: string
  budget?: string
  stage?: string
  message: string
  submittedAt: string
  status: 'new' | 'replied'
}

export interface ConsultationBooking {
  id: string
  name: string
  email: string
  phone: string
  preferredDate?: string
  preferredTime?: string
  projectType: string
  location?: string
  notes?: string
  submittedAt: string
  status: 'new' | 'confirmed' | 'completed'
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  password?: string
  createdAt: string
  status: 'active' | 'inactive'
}

export interface SiteImageItem {
  id: string
  labelEn: string
  labelAr: string
  section: string
  currentUrl: string
  description: string
  descriptionAr?: string
  year?: string
  location?: string
  locationAr?: string
  aspectRatio: string
}

export interface CounterMetric {
  id: string
  value: string
  labelEn: string
  labelAr: string
  subEn: string
  subAr: string
}

export interface SiteSettings {
  // Contact & Branches
  phone: string
  phoneCairo?: string
  phoneRiyadh?: string
  phoneSyria?: string
  whatsapp?: string
  email: string
  emailCareers?: string
  emailPress?: string
  city: string
  secondaryCity: string
  addressCairo?: string
  addressRiyadh?: string
  addressSyria?: string

  // Social
  linkedin: string
  instagram: string
  behance?: string
  houzz?: string
  facebook?: string

  // Animated Counters & Impact
  impactProjects: string
  impactM2: string
  impactDisciplines: string
  impactMarkets: string
  mapEgyptCount?: number
  mapSaudiCount?: number
  mapSyriaCount?: number

  // Map Coordinates & Embed
  mapLatitude?: number
  mapLongitude?: number
  mapZoom?: number
  mapLocationName?: string
  mapCaptionEn?: string
  mapCaptionAr?: string
  mapTaglineEn?: string
  mapTaglineAr?: string
  mapEmbedUrl?: string
}

export interface DatabaseSchema {
  projects: Project[]
  jobs: Job[]
  contacts: ContactSubmission[]
  consultations: ConsultationBooking[]
  settings: SiteSettings
  admins?: AdminUser[]
  siteImages?: SiteImageItem[]
  counters?: CounterMetric[]
  adminAuth?: {
    password?: string
    updatedAt?: string
    emails?: string[]
  }
}

export const DEFAULT_SITE_IMAGES: SiteImageItem[] = [
  {
    "id": "home-hero-villa",
    "labelEn": "Homepage Hero Villa (Twilight)",
    "labelAr": "صورة الهيدر الرئيسية (الفيلا والإنفينيتي بول)",
    "section": "Hero Banners",
    "currentUrl": "/images/hero-villa.png",
    "year": "2024",
    "location": "New Cairo, Egypt",
    "locationAr": "القاهرة الجديدة، مصر",
    "description": "Monumental travertine and glass villa at twilight with illuminated infinity pool.",
    "descriptionAr": "كتل معمارية متوازنة من الترافيرتين والزجاج عند الغسق مع مسبح عاكس.",
    "aspectRatio": "16/9"
  },
  {
    "id": "hero-villa-2",
    "labelEn": "Cinematic Villa Angle II",
    "labelAr": "اللقطة السينمائية الثانية للفيلا",
    "section": "Hero Banners",
    "currentUrl": "/images/hero-villa-2.jpg",
    "year": "2024",
    "location": "Sheikh Zayed, Egypt",
    "locationAr": "الشيخ زايد، مصر",
    "description": "Cantilevered rooflines and lush courtyard vegetation at twilight.",
    "descriptionAr": "بروزات خرسانية كابولية ومساحات خضراء في فناء الفيلا عند الغروب.",
    "aspectRatio": "16/9"
  },
  {
    "id": "hero-villa-3",
    "labelEn": "Minimalist Architecture Villa III",
    "labelAr": "الفيلا المعمارية التبسيطية",
    "section": "Hero Banners",
    "currentUrl": "/images/hero-villa-3.jpg",
    "year": "2024",
    "location": "Katameya Dunes, Egypt",
    "locationAr": "قطامية ديونز، مصر",
    "description": "Clean geometric lines, water reflections, and warm architectural lighting.",
    "descriptionAr": "خطوط هندسية نقية وانعكاسات مائية مع إضاءة معمارية دافئة.",
    "aspectRatio": "16/9"
  },
  {
    "id": "projects-hero",
    "labelEn": "Projects Page Hero (Olive Tree Villa)",
    "labelAr": "هيدر صفحة المشاريع (الفيلا وشجرة الزيتون)",
    "section": "Hero Banners",
    "currentUrl": "/images/projects-hero-villa.jpg",
    "year": "2024",
    "location": "New Cairo, Egypt",
    "locationAr": "القاهرة الجديدة، مصر",
    "description": "Ultra-luxury modern villa at twilight with illuminated olive tree and reflecting pool.",
    "descriptionAr": "فيلا عصرية فائقة الفخامة مع شجرة زيتون مضاءة وفناء مائي عاكس.",
    "aspectRatio": "16/9"
  },
  {
    "id": "services-hero",
    "labelEn": "Services Page Hero Colonnade",
    "labelAr": "هيدر صفحة الخدمات (الأعمدة المعمارية)",
    "section": "Hero Banners",
    "currentUrl": "/images/services-hero-colonnade.jpg",
    "year": "2024",
    "location": "Riyadh, KSA",
    "locationAr": "الرياض، السعودية",
    "description": "Rhythmic architectural colonnade and natural daylight filtering through canopy.",
    "descriptionAr": "إيقاع معماري متناسق للأعمدة وتسلل الضوء الطبيعي عبر الممرات.",
    "aspectRatio": "16/9"
  },
  {
    "id": "how-we-work-hero",
    "labelEn": "How We Work Process Hero",
    "labelAr": "هيدر منهجية العمل والتنفيذ",
    "section": "Hero Banners",
    "currentUrl": "/images/how-we-work-hero.jpg",
    "year": "2024",
    "location": "Cairo Studio HQ",
    "locationAr": "المقر الرئيسي، القاهرة",
    "description": "Architects analyzing blueprint details and tactile material samples.",
    "descriptionAr": "المهندسون يراجعون التفاصيل التنفيذية وعينات المواد الطبيعية.",
    "aspectRatio": "16/9"
  },
  {
    "id": "careers-hero",
    "labelEn": "Careers Studio Master Hero",
    "labelAr": "هيدر صفحة الوظائف وفريق العمل",
    "section": "Hero Banners",
    "currentUrl": "/images/careers-hero-viwan.jpg",
    "year": "2024",
    "location": "VIWAN Atelier",
    "locationAr": "استوديو إيوان",
    "description": "High-end architectural design lab and creative workstations.",
    "descriptionAr": "مختبر التصميم المعماري ومساحات الابتكار والتطوير في إيوان.",
    "aspectRatio": "16/9"
  },
  {
    "id": "consultation-banner",
    "labelEn": "Consultation & Meeting Banner",
    "labelAr": "صورة حجز الاستشارة الهندسية",
    "section": "Hero Banners",
    "currentUrl": "/images/consultation-architects.jpg",
    "year": "2024",
    "location": "VIWAN Meeting Suite",
    "locationAr": "قاعة الاجتماعات الرئيسية",
    "description": "Partner architects reviewing client requirements and schematic designs.",
    "descriptionAr": "جلسة استشارية هندسية لمراجعة متطلبات المشروع والمخططات الأولية.",
    "aspectRatio": "16/9"
  },
  {
    "id": "service-architecture",
    "labelEn": "01. Architecture Discipline",
    "labelAr": "01. الهندسة المعمارية",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-architecture.jpg",
    "year": "2024",
    "location": "Regional Portfolio",
    "locationAr": "مشاريع المنطقة",
    "description": "Contemporary residential and commercial architectural composition.",
    "descriptionAr": "صياغة معمارية متفردة للمشاريع السكنية والتجارية الكبرى.",
    "aspectRatio": "16/10"
  },
  {
    "id": "service-interior",
    "labelEn": "02. Interior Design Discipline",
    "labelAr": "02. التصميم الداخلي الفاخر",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-interior-design.jpg",
    "year": "2024",
    "location": "Cairo & Riyadh",
    "locationAr": "القاهرة والرياض",
    "description": "Ultra-luxury interior living space with bespoke millwork and cove lighting.",
    "descriptionAr": "فضاءات داخلية استثنائية بتشطيبات رخامية وأعمال خشبية مصممة خصيصاً.",
    "aspectRatio": "16/10"
  },
  {
    "id": "service-urban",
    "labelEn": "03. Urban Planning Discipline",
    "labelAr": "03. التخطيط والتصميم العمراني",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-urban-design.jpg",
    "year": "2024",
    "location": "New Capital, Egypt",
    "locationAr": "العاصمة الإدارية، مصر",
    "description": "Sustainable masterplanning and pedestrian-friendly urban frameworks.",
    "descriptionAr": "مخططات عمرانية متكاملة تعزز المشهد البيئي والاستدامة الحضرية.",
    "aspectRatio": "16/10"
  },
  {
    "id": "service-landscape",
    "labelEn": "04. Landscape Architecture",
    "labelAr": "04. هندسة وتنسيق المواقع",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-landscape-design.jpg",
    "year": "2024",
    "location": "Sheikh Zayed, Egypt",
    "locationAr": "الشيخ زايد، مصر",
    "description": "Private villa garden with indigenous Mediterranean flora and water features.",
    "descriptionAr": "حدائق سكنية تجمع بين النباتات الملائمة بيئياً والعناصر المائية.",
    "aspectRatio": "16/10"
  },
  {
    "id": "service-supervision",
    "labelEn": "05. Construction Supervision",
    "labelAr": "05. الإشراف الهندسي والتنفيذي",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-construction-supervision.jpg",
    "year": "2024",
    "location": "On-Site Execution",
    "locationAr": "المواقع الإنشائية",
    "description": "Rigorous engineering site supervision, quality audits, and structural oversight.",
    "descriptionAr": "إشراف ميداني هندسي صارم وضبط جودة المواد وفق أعلى المعايير.",
    "aspectRatio": "16/10"
  },
  {
    "id": "service-engineering",
    "labelEn": "06. Sustainable Engineering & MEP",
    "labelAr": "06. الهندسة المستدامة وكفاءة الطاقة",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-engineering.jpg",
    "year": "2024",
    "location": "Riyadh, KSA",
    "locationAr": "الرياض، السعودية",
    "description": "Bioclimatic design, solar orientation, and energy-efficient building systems.",
    "descriptionAr": "أنظمة كهروميكانيكية متطورة وحلول طاقة مستدامة متوافقة مع المناخ.",
    "aspectRatio": "16/10"
  },
  {
    "id": "service-fitout",
    "labelEn": "07. Turnkey Contracting & Fitout",
    "labelAr": "07. المقاولات المتكاملة والمفتاح باليد",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-fitout-marble.jpg",
    "year": "2024",
    "location": "Cairo, Egypt",
    "locationAr": "القاهرة، مصر",
    "description": "Precision Italian Calacatta marble wall cladding and turnkey execution.",
    "descriptionAr": "تنفيذ دقيق لتكسيات الرخام الإيطالي وأعمال التشطيب الشاملة.",
    "aspectRatio": "16/10"
  },
  {
    "id": "service-management",
    "labelEn": "08. Historic Restoration & PM",
    "labelAr": "08. الترميم وإحياء التراث وإدارة المشاريع",
    "section": "The 8 Disciplines",
    "currentUrl": "/images/service-project-management.jpg",
    "year": "2024",
    "location": "Old Damascus & Historic Cairo",
    "locationAr": "دمشق القديمة والقاهرة التاريخية",
    "description": "Restoring historic masonry, mashrabiya details, and heritage preservation.",
    "descriptionAr": "صيانة وترميم الواجهات التراثية والمشربيات والمباني التاريخية الأصيلة.",
    "aspectRatio": "16/10"
  },
  {
    "id": "project-private-residence",
    "labelEn": "Private Residence Cairo",
    "labelAr": "إقامة خاصة فاخرة بالقاهرة",
    "section": "Featured Projects",
    "currentUrl": "/images/project-private-residence.png",
    "year": "2024",
    "location": "New Cairo, Egypt",
    "locationAr": "القاهرة الجديدة، مصر",
    "description": "Luxury residential masterwork blending natural stone, glass, and private courtyard.",
    "descriptionAr": "تحفة سكنية خاصة تدمج الحجر الطبيعي والزجاج والخصوصية التامة.",
    "aspectRatio": "16/10"
  },
  {
    "id": "project-commercial-riyadh",
    "labelEn": "Commercial Landmark Tower",
    "labelAr": "مبنى تجاري وإداري بالرياض",
    "section": "Featured Projects",
    "currentUrl": "/images/project-commercial-riyadh.png",
    "year": "2024",
    "location": "King Fahd Rd, Riyadh, KSA",
    "locationAr": "طريق الملك فهد، الرياض، السعودية",
    "description": "Iconic commercial headquarters with bioclimatic facade louvers and glass curtain.",
    "descriptionAr": "صرح تجاري مع كواسر شمسية ذكية وواجهات زجاجية مزدوجة متطورة.",
    "aspectRatio": "16/10"
  },
  {
    "id": "project-lake-house",
    "labelEn": "Lake House Waterfront Villa",
    "labelAr": "فيلا الواجهة المائية والبحيرة",
    "section": "Featured Projects",
    "currentUrl": "/images/project-lake-house.png",
    "year": "2023",
    "location": "Red Sea Coast, Egypt",
    "locationAr": "ساحل البحر الأحمر، مصر",
    "description": "Waterfront residence opening completely to marine breeze and infinity horizons.",
    "descriptionAr": "إقامة شاطئية بتصميم مفتوح بالكامل على الأفق البحري والنسيم الطبيعي.",
    "aspectRatio": "16/10"
  },
  {
    "id": "project-hillside-villa",
    "labelEn": "Hillside Contemporary Villa",
    "labelAr": "فيلا المرتفعات التضاريسية",
    "section": "Featured Projects",
    "currentUrl": "/images/project-hillside-villa.png",
    "year": "2024",
    "location": "Katameya Heights, Egypt",
    "locationAr": "قطامية هايتس، مصر",
    "description": "Terraced residential architecture following natural topographic contours.",
    "descriptionAr": "تكوين معماري مدرج يتناغم بسلاسة مع التضاريس الطبيعية للموقع.",
    "aspectRatio": "16/10"
  },
  {
    "id": "project-executive-office",
    "labelEn": "Executive Corporate Suite",
    "labelAr": "مقر إداري ومكتب تنفيذي",
    "section": "Featured Projects",
    "currentUrl": "/images/project-executive-office.png",
    "year": "2024",
    "location": "Financial District, New Cairo",
    "locationAr": "حي المال والأعمال، القاهرة الجديدة",
    "description": "Minimalist corporate headquarters with acoustic timber paneling and glass partitions.",
    "descriptionAr": "مكتب تنفيذي راقٍ يجمع بين الخشب العازل للصوت والقواطع الزجاجية.",
    "aspectRatio": "16/10"
  },
  {
    "id": "project-majlis",
    "labelEn": "Modern Heritage Majlis",
    "labelAr": "المجلس النجدي المعاصر",
    "section": "Featured Projects",
    "currentUrl": "/images/project-majlis.png",
    "year": "2024",
    "location": "Diriyah, Riyadh, KSA",
    "locationAr": "الدرعية، الرياض، السعودية",
    "description": "Contemporary interpretation of traditional Najdi hospitality spaces with bespoke lighting.",
    "descriptionAr": "إعادة صياغة عصرية للمجلس التراثي بأصالة نجدية وإضاءة خافتة فاخرة.",
    "aspectRatio": "16/10"
  },
  {
    "id": "interior-living-marble",
    "labelEn": "Living Lounge & Italian Marble",
    "labelAr": "صالة المعيشة والرخام الإيطالي",
    "section": "Interiors & Living Spaces",
    "currentUrl": "/images/interior-living-marble.jpg",
    "year": "2024",
    "location": "New Cairo Residence",
    "locationAr": "إقامة القاهرة الجديدة",
    "description": "Double-height living space with bookmatched Calacatta marble wall and velvet seating.",
    "descriptionAr": "صالة معيشة بارتفاع مضاعف وجدار رخام كلكتا مع أثاث مخملي راقٍ.",
    "aspectRatio": "16/9"
  },
  {
    "id": "interior-living-fireplace",
    "labelEn": "Living Space & Bronze Fireplace",
    "labelAr": "صالة المعيشة والمدفأة البرونزية",
    "section": "Interiors & Living Spaces",
    "currentUrl": "/images/interior-living-fireplace.jpg",
    "year": "2024",
    "location": "Katameya Dunes, Egypt",
    "locationAr": "قطامية ديونز، مصر",
    "description": "Architectural linear fireplace embedded in fluted bronze paneling with warm ambient illumination.",
    "descriptionAr": "مدفأة خطية مدمجة في تكسيات برونزية مضلعة مع إضاءة دافئة هادئة.",
    "aspectRatio": "21/9"
  },
  {
    "id": "interior-bedroom",
    "labelEn": "Master Suite Bedroom",
    "labelAr": "جناح النوم الرئيسي الفاخر",
    "section": "Interiors & Living Spaces",
    "currentUrl": "/images/interior-bedroom.png",
    "year": "2024",
    "location": "Private Villa, Cairo",
    "locationAr": "فيلا خاصة، القاهرة",
    "description": "Serene master retreat with panoramic garden views and bespoke upholstered headboard.",
    "descriptionAr": "ملاذ هادئ بإطلالة بانورامية على الحديقة وألواح تكسية فندقية فاخرة.",
    "aspectRatio": "16/10"
  },
  {
    "id": "interior-dining",
    "labelEn": "Bespoke Dining Pavilion",
    "labelAr": "قاعة الطعام والضيافة",
    "section": "Interiors & Living Spaces",
    "currentUrl": "/images/interior-dining.png",
    "year": "2024",
    "location": "Sheikh Zayed, Egypt",
    "locationAr": "الشيخ زايد، مصر",
    "description": "Sculptural brass chandelier above custom marble table and fluted oak credenza.",
    "descriptionAr": "ثريا نحاسية نحتية تعلو طاولة رخامية مخصصة مع خلفيات خشبية مضلعة.",
    "aspectRatio": "16/10"
  },
  {
    "id": "detail-courtyard",
    "labelEn": "Reflective Courtyard & Olive Tree",
    "labelAr": "الفناء المائي العاكس وشجرة الزيتون",
    "section": "Interiors & Living Spaces",
    "currentUrl": "/images/detail-courtyard.png",
    "year": "2024",
    "location": "New Cairo Villa",
    "locationAr": "فيلا القاهرة الجديدة",
    "description": "Travertine perimeter corridor wrapping an illuminated olive tree reflecting pool.",
    "descriptionAr": "رواق محيطي من حجر الترافيرتين يطوق فناء مائياً مع شجرة زيتون معمرة.",
    "aspectRatio": "4/3"
  },
  {
    "id": "material-stone",
    "labelEn": "Natural Travertine & Limestone",
    "labelAr": "حجر الترافيرتين والحجر الجيري الطبيعي",
    "section": "Architectural Materials",
    "currentUrl": "/images/material-stone.png",
    "year": "2024",
    "location": "Material Lab",
    "locationAr": "مختبر المواد",
    "description": "Textured tactile stone specimens selected for enduring durability and desert warmth.",
    "descriptionAr": "عينات حجرية طبيعية عالية الجودة تجمع بين الديمومة ودفء الصحراء.",
    "aspectRatio": "1/1"
  },
  {
    "id": "material-wood",
    "labelEn": "Smoked Oak & Bespoke Millwork",
    "labelAr": "خشب البلوط المعتق والأعمال الخشبية",
    "section": "Architectural Materials",
    "currentUrl": "/images/material-wood.png",
    "year": "2024",
    "location": "Material Lab",
    "locationAr": "مختبر المواد",
    "description": "Grain-matched sustainable timber and fluted paneling details.",
    "descriptionAr": "أخشاب مستدامة بتفاصيل معمارية دقيقة وتشطيبات غير لامعة.",
    "aspectRatio": "1/1"
  },
  {
    "id": "material-metal",
    "labelEn": "Brushed Bronze & Titanium Zinc",
    "labelAr": "البرونز المصقول والزنك المعماري",
    "section": "Architectural Materials",
    "currentUrl": "/images/material-metal.png",
    "year": "2024",
    "location": "Material Lab",
    "locationAr": "مختبر المواد",
    "description": "Custom architectural metals with hand-applied patina for bespoke accents.",
    "descriptionAr": "معادن معمارية ذات لمعان مخملي مطفأ تستخدم في الفواصل والإطارات.",
    "aspectRatio": "1/1"
  },
  {
    "id": "material-fabric",
    "labelEn": "Belgian Linen & Architectural Textiles",
    "labelAr": "الكتان البلجيكي والمنسوجات المعمارية",
    "section": "Architectural Materials",
    "currentUrl": "/images/material-fabric.png",
    "year": "2024",
    "location": "Material Lab",
    "locationAr": "مختبر المواد",
    "description": "Acoustic fabrics and tactile upholstery textiles for soft luxury environments.",
    "descriptionAr": "أقمشة عازلة للصوت وأنسجة طبيعية فاخرة تمنح المكان راحة وفخامة.",
    "aspectRatio": "1/1"
  },
  {
    "id": "studio-space",
    "labelEn": "VIWAN Design Atelier & Studio Lab",
    "labelAr": "استوديو إيوان ومختبر التصميم",
    "section": "Studio & Careers",
    "currentUrl": "/images/studio-space.png",
    "year": "2024",
    "location": "Cairo Studio HQ",
    "locationAr": "المقر الرئيسي، القاهرة",
    "description": "The creative collaborative floor where architectural visions take shape.",
    "descriptionAr": "المساحة الإبداعية التي تنطلق منها الرؤى والمخططات المعمارية الفاخرة.",
    "aspectRatio": "16/9"
  },
  {
    "id": "careers-workstation",
    "labelEn": "BIM & Parametric Modeling Stations",
    "labelAr": "محطات النمذجة ثلاثية الأبعاد وBIM",
    "section": "Studio & Careers",
    "currentUrl": "/images/careers-studio-workstation-hd.jpg",
    "year": "2024",
    "location": "Cairo Studio HQ",
    "locationAr": "المقر الرئيسي، القاهرة",
    "description": "High-precision dual-display architectural workstations for BIM modeling.",
    "descriptionAr": "أحدث محطات العمل الهندسية لنمذجة معلومات البناء والتصميم البارامتري.",
    "aspectRatio": "16/9"
  },
  {
    "id": "careers-gallery-1",
    "labelEn": "Collaborative Concept Session",
    "labelAr": "جلسة العصف الذهني والتصميم المشترك",
    "section": "Studio & Careers",
    "currentUrl": "/images/careers-gallery-1.jpg",
    "year": "2024",
    "location": "Studio Floor",
    "locationAr": "الاستوديو",
    "description": "Architectural team iterating on schematic blueprints and volumetric studies.",
    "descriptionAr": "الفريق الهندسي يناقش الكتل المعمارية والمخططات الأولية للمشاريع.",
    "aspectRatio": "4/3"
  },
  {
    "id": "careers-gallery-2",
    "labelEn": "Material Palette & Moodboard Review",
    "labelAr": "مراجعة لوحة الخامات وعينات التشطيب",
    "section": "Studio & Careers",
    "currentUrl": "/images/careers-gallery-2.jpg",
    "year": "2024",
    "location": "Material Library",
    "locationAr": "مكتبة الخامات",
    "description": "Selecting natural stone slabs, veneer finishes, and bronze hardware.",
    "descriptionAr": "انتقاء عينات الرخام والأخشاب والقطع المعدنية لكل مشروع بعناية.",
    "aspectRatio": "4/3"
  },
  {
    "id": "careers-gallery-3",
    "labelEn": "Design Critique & 3D Review",
    "labelAr": "جلسة النقد المعماري والمراجعة البصرية",
    "section": "Studio & Careers",
    "currentUrl": "/images/careers-gallery-3.jpg",
    "year": "2024",
    "location": "Design Review Suite",
    "locationAr": "قاعة المراجعة والتطوير",
    "description": "Senior partners and project directors reviewing spatial layouts.",
    "descriptionAr": "مراجعة المخططات الفراغية مع الشركاء المؤسسين ومديري المشاريع.",
    "aspectRatio": "4/3"
  },
  {
    "id": "careers-gallery-4",
    "labelEn": "Site Execution & Quality Check",
    "labelAr": "المتابعة الميدانية والتدقيق التنفيذي",
    "section": "Studio & Careers",
    "currentUrl": "/images/careers-gallery-4.jpg",
    "year": "2024",
    "location": "Active Construction Site",
    "locationAr": "الموقع الإنشائي",
    "description": "Architects inspecting structural alignment and facade substructure.",
    "descriptionAr": "المهندسون يدققون تفاصيل الواجهات والهيكل الإنشائي بالموقع.",
    "aspectRatio": "4/3"
  },
  {
    "id": "regional-map",
    "labelEn": "Regional Reach Map Asset",
    "labelAr": "خريطة التواجد الإقليمي للشرق الأوسط",
    "section": "Studio & Careers",
    "currentUrl": "/images/regional-map.png",
    "year": "2024",
    "location": "Middle East Region",
    "locationAr": "منطقة الشرق الأوسط",
    "description": "Cartographic representation of active projects across Cairo, Riyadh, and Damascus.",
    "descriptionAr": "تمثيل جغرافي لمشاريع واستوديوهات إيوان في القاهرة والرياض ودمشق.",
    "aspectRatio": "16/9"
  }
]

export const DEFAULT_COUNTERS: CounterMetric[] = [
  {
    id: 'projects',
    value: '45+',
    labelEn: 'Delivered Projects',
    labelAr: 'مشروعاً منجزاً',
    subEn: 'Across Egypt & Saudi Arabia',
    subAr: 'عبر مصر والمملكة العربية السعودية',
  },
  {
    id: 'm2',
    value: '140K+',
    labelEn: 'm² Coordinated',
    labelAr: 'متر مربع منسق',
    subEn: 'Precision BIM & Architecture',
    subAr: 'بأعلى معايير BIM والتصميم المعماري',
  },
  {
    id: 'disciplines',
    value: '4',
    labelEn: 'In-House Disciplines',
    labelAr: 'تخصصات متكاملة',
    subEn: 'Architecture · Interior · Landscape · MEP',
    subAr: 'عمارة · تصميم داخلي · لاندسكيب · كهروميكانيك',
  },
  {
    id: 'markets',
    value: '3',
    labelEn: 'Regional Hubs',
    labelAr: 'مكاتب إقليمية',
    subEn: 'Cairo · Riyadh · Dubai',
    subAr: 'القاهرة · الرياض · دبي',
  },
]

export const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Ahmed El-Sharif',
    email: 'admin@viwan.studio',
    role: 'Lead Architect & Managing Director',
    avatar: '/images/consultation-architects.jpg',
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 'adm-2',
    name: 'Studio Director',
    email: 'admin@viwan.com',
    role: 'Partner & Design Principal',
    avatar: '/images/service-project-management.jpg',
    createdAt: '2026-02-01T00:00:00.000Z',
    status: 'active',
  },
]

function getInitialData(): DatabaseSchema {
  return {
    projects: INITIAL_PROJECTS,
    jobs: INITIAL_JOBS,
    contacts: [
      {
        id: 'cs-demo-1',
        name: 'Hesham Mansour',
        company: 'Private Client',
        email: 'hesham@example.com',
        phone: '+20 101 234 5678',
        projectLocation: 'New Cairo',
        projectType: 'Private Residence',
        projectSize: '1,200 m²',
        budget: '$500k - $1M',
        stage: 'Concept Design',
        message: 'Looking to start architecture and interior design for a private modern villa in New Cairo.',
        submittedAt: new Date().toISOString(),
        status: 'new',
      },
    ],
    consultations: [
      {
        id: 'cb-demo-1',
        name: 'Tariq Al-Otaibi',
        email: 'tariq@example.sa',
        phone: '+966 50 123 4567',
        preferredDate: '2026-09-15',
        preferredTime: '14:00 - 14:30',
        projectType: 'Commercial Fit-Out & Office',
        location: 'Riyadh, KSA',
        notes: 'Discussion about modern executive offices and BIM documentation.',
        submittedAt: new Date().toISOString(),
        status: 'new',
      },
    ],
    settings: {
      phone: '+20 100 000 0000',
      phoneCairo: '+20 100 000 0000',
      phoneRiyadh: '+966 50 123 4567',
      phoneSyria: '+963 11 000 0000',
      whatsapp: '+20 100 000 0000',
      email: 'info@viwan.studio',
      city: 'Cairo, Egypt',
      secondaryCity: 'Riyadh, Saudi Arabia',
      addressCairo: 'Sheikh Zayed, Giza & New Cairo, Egypt',
      addressRiyadh: 'King Fahd Road, Riyadh, Saudi Arabia',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
      behance: 'https://behance.net',
      houzz: 'https://houzz.com',
      facebook: 'https://facebook.com',
      impactProjects: '45+',
      impactM2: '140,000+',
      impactDisciplines: '4',
      impactMarkets: '3',
      mapEgyptCount: 28,
      mapSaudiCount: 14,
      mapSyriaCount: 5,
      mapLatitude: 30.0131,
      mapLongitude: 31.4989,
      mapZoom: 14,
      mapLocationName: 'New Cairo, Cairo, Egypt',
      mapCaptionEn: 'Based in Cairo, Working across Egypt and the region.',
      mapCaptionAr: 'مقرنا في القاهرة، ونعمل عبر مصر وكافة أنحاء المنطقة.',
      mapTaglineEn: 'EGYPT / MIDDLE EAST BEYOND BORDERS',
      mapTaglineAr: 'مصر · الشرق الأوسط وما وراء الحدود',
    },
    admins: DEFAULT_ADMINS,
    siteImages: DEFAULT_SITE_IMAGES,
    counters: DEFAULT_COUNTERS,
  }
}

export function readDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData()
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8')
    return initial
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8')
    const data = JSON.parse(content) as DatabaseSchema
    let changed = false

    if (!Array.isArray(data.admins) || data.admins.length === 0) {
      data.admins = DEFAULT_ADMINS
      changed = true
    }
    if (!Array.isArray(data.siteImages) || data.siteImages.length === 0) {
      data.siteImages = DEFAULT_SITE_IMAGES
      changed = true
    }
    if (!Array.isArray(data.counters) || data.counters.length === 0) {
      data.counters = DEFAULT_COUNTERS
      changed = true
    }

    // Default settings fields
    if (!data.settings) {
      data.settings = getInitialData().settings
      changed = true
    } else {
      if (!data.settings.phoneCairo) { data.settings.phoneCairo = '+20 100 000 0000'; changed = true }
      if (!data.settings.phoneRiyadh) { data.settings.phoneRiyadh = '+966 50 123 4567'; changed = true }
      if (!data.settings.phoneSyria) { data.settings.phoneSyria = '+963 11 000 0000'; changed = true }
      if (!data.settings.whatsapp) { data.settings.whatsapp = '+20 100 000 0000'; changed = true }
      if (!data.settings.addressCairo) { data.settings.addressCairo = 'Sheikh Zayed, Giza & New Cairo, Egypt'; changed = true }
      if (!data.settings.addressRiyadh) { data.settings.addressRiyadh = 'King Fahd Road, Riyadh, Saudi Arabia'; changed = true }
      if (!data.settings.mapEgyptCount) { data.settings.mapEgyptCount = 28; changed = true }
      if (!data.settings.mapSaudiCount) { data.settings.mapSaudiCount = 14; changed = true }
      if (!data.settings.mapSyriaCount) { data.settings.mapSyriaCount = 5; changed = true }
    }

    if (changed) {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
    }

    return data
  } catch (err) {
    console.error('Error reading db.json, returning initial:', err)
    return getInitialData()
  }
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
}
