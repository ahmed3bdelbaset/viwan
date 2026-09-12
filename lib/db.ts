import fs from 'fs'
import path from 'path'
import { PROJECTS as INITIAL_PROJECTS, Project } from './projects'
import { JOBS as INITIAL_JOBS, Job } from './jobs'
import { CONTACT as INITIAL_CONTACT } from './site'
import { ServiceItem } from './admin-types'
import { INITIAL_SERVICES } from './data/seed'

export function getStorageDir(): string {
  if (process.env.STORAGE_PATH) {
    return path.resolve(process.env.STORAGE_PATH)
  }
  if (process.env.RAILWAY_VOLUME_MOUNT_PATH) {
    return path.resolve(process.env.RAILWAY_VOLUME_MOUNT_PATH)
  }
  // Check if running on Linux/Railway container with standard /app/data mount
  if (process.platform !== 'win32' && fs.existsSync('/app/data')) {
    return '/app/data'
  }
  return path.join(process.cwd(), 'data')
}

export function getDbFilePath(): string {
  return path.join(getStorageDir(), 'db.json')
}

export function getUploadsDir(): string {
  const dir = path.join(getStorageDir(), 'uploads')
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true })
    } catch (e) {
      console.error('Failed to create uploads directory:', e)
    }
  }
  return dir
}

export function ensureDbFile(): string {
  const storageDir = getStorageDir()
  if (!fs.existsSync(/*turbopackIgnore: true*/ storageDir)) {
    try {
      fs.mkdirSync(storageDir, { recursive: true })
    } catch (e) {
      console.error('Failed to create storage directory:', e)
    }
  }

  const dbFile = getDbFilePath()
  if (!fs.existsSync(/*turbopackIgnore: true*/ dbFile)) {
    const starterFile = path.join(process.cwd(), 'data', 'db.json')
    if (fs.existsSync(starterFile) && path.resolve(starterFile) !== path.resolve(dbFile)) {
      try {
        fs.copyFileSync(starterFile, dbFile)
        console.log(`[STORAGE] Copied repository db.json into persistent volume: ${dbFile}`)
        return dbFile
      } catch (err) {
        console.error('[STORAGE] Error copying starter db.json:', err)
      }
    }
    const initial = getInitialData()
    fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2), 'utf-8')
    console.log(`[STORAGE] Initialized new persistent db.json at: ${dbFile}`)
  }

  return dbFile
}


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

export type { SiteImageItem } from './site-images'
export { DEFAULT_SITE_IMAGES } from './site-images'
import { SiteImageItem, DEFAULT_SITE_IMAGES } from './site-images'

export interface CounterMetric {
  id: string
  value: string
  labelEn: string
  labelAr: string
  subEn: string
  subAr: string
}

export type { YouTubeVideo } from './youtube'
export { DEFAULT_YOUTUBE_VIDEOS } from './youtube'
import { YouTubeVideo, DEFAULT_YOUTUBE_VIDEOS } from './youtube'

export interface SiteSettings {
  // Contact & Branches
  phone: string
  phoneCairo?: string
  phoneRiyadh?: string
  phoneSyria?: string
  whatsapp?: string
  email: string
  emailConsultations?: string
  emailGeneral?: string
  emailCareers?: string
  emailPress?: string
  city: string
  secondaryCity: string
  addressCairo?: string
  addressRiyadh?: string
  addressSyria?: string

  // SMTP Configuration (GoDaddy / Office 365 / Custom)
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPass?: string
  smtpFrom?: string

  // Social
  linkedin: string
  instagram: string
  behance?: string
  houzz?: string
  facebook?: string
  youtube?: string

  // Footer & Bio
  footerSummaryEn?: string
  footerSummaryAr?: string

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
  companyInfo?: any
  admins?: AdminUser[]
  siteImages?: SiteImageItem[]
  counters?: CounterMetric[]
  youtubeVideos?: YouTubeVideo[]
  services?: ServiceItem[]
  adminAuth?: {
    password?: string
    updatedAt?: string
    emails?: string[]
  }
}

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
      email: 'info@viwan.net',
      emailConsultations: 'info@viwan.net',
      emailGeneral: 'info@viwan.net',
      emailCareers: 'info@viwan.net',
      emailPress: 'info@viwan.net',
      smtpHost: 'smtp.office365.com',
      smtpPort: 587,
      smtpUser: 'info@viwan.net',
      smtpFrom: 'VIWAN Architecture Studio <info@viwan.net>',
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
    youtubeVideos: DEFAULT_YOUTUBE_VIDEOS,
    services: INITIAL_SERVICES,
  }
}

export function readDb(): DatabaseSchema {
  const dbFile = ensureDbFile()

  try {
    const content = fs.readFileSync(dbFile, 'utf-8')
    const data = JSON.parse(content) as DatabaseSchema
    let changed = false

    if (!Array.isArray(data.admins) || data.admins.length === 0) {
      data.admins = DEFAULT_ADMINS
      changed = true
    }
    if (!Array.isArray(data.siteImages) || data.siteImages.length === 0) {
      data.siteImages = DEFAULT_SITE_IMAGES
      changed = true
    } else {
      // Ensure any newly registered default images (e.g. studio-hero) are present
      for (const defImg of DEFAULT_SITE_IMAGES) {
        if (!data.siteImages.some((img) => img.id === defImg.id)) {
          data.siteImages.push(defImg)
          changed = true
        }
      }
    }
    if (!Array.isArray(data.counters) || data.counters.length === 0) {
      data.counters = DEFAULT_COUNTERS
      changed = true
    }
    if (!Array.isArray(data.youtubeVideos) || data.youtubeVideos.length === 0) {
      data.youtubeVideos = DEFAULT_YOUTUBE_VIDEOS
      changed = true
    }
    if (!Array.isArray(data.services) || data.services.length === 0) {
      data.services = INITIAL_SERVICES
      changed = true
    } else {
      // Ensure no obsolete 'code' field remains on any service
      let codeStripped = false
      data.services = data.services.map((s: any) => {
        if ('code' in s) {
          const { code, ...rest } = s
          codeStripped = true
          return rest
        }
        return s
      })
      if (codeStripped) changed = true
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
      if (!data.settings.emailConsultations) { data.settings.emailConsultations = data.settings.email || 'info@viwan.net'; changed = true }
      if (!data.settings.emailGeneral) { data.settings.emailGeneral = data.settings.email || 'info@viwan.net'; changed = true }
      if (!data.settings.emailCareers) { data.settings.emailCareers = data.settings.email || 'info@viwan.net'; changed = true }
    }

    if (changed) {
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8')
    }

    return data
  } catch (err) {
    console.error('Error reading db.json, returning initial:', err)
    return getInitialData()
  }
}

export function writeDb(data: DatabaseSchema): void {
  const dbFile = ensureDbFile()
  const tempFile = `${dbFile}.tmp.${process.pid}.${Date.now()}`

  try {
    const jsonString = JSON.stringify(data, null, 2)
    fs.writeFileSync(tempFile, jsonString, 'utf-8')
    fs.renameSync(tempFile, dbFile)
  } catch (err) {
    console.error('[DB] Atomic write error, falling back to direct write:', err)
    try {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile)
    } catch {}
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8')
  }
}

