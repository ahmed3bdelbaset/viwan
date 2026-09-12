import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'
import { verifySecureAdminToken } from '@/lib/security'
import { cookies } from 'next/headers'

async function checkAdminAuth(req: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('viwan_admin_token')?.value
  const authHeader = req.headers.get('authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  const token = cookieToken || headerToken
  return verifySecureAdminToken(token).valid
}

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({
      success: true,
      settings: db.settings,
      companyInfo: db.companyInfo || null,
      siteImages: db.siteImages || [],
      counters: db.counters || [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', error: 'غير مصرح: يرجى تسجيل الدخول كمسؤول' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const db = readDb()

    if (body.companyInfo) {
      db.companyInfo = body.companyInfo

      // Derive settings from companyInfo if present
      const info = body.companyInfo
      const generalEmail = info.emails?.find((e: any) => e.label_en?.toLowerCase().includes('general') || e.label_ar?.includes('عام'))?.email || info.emails?.[0]?.email
      const consultEmail = info.emails?.find((e: any) => e.label_en?.toLowerCase().includes('consult') || e.label_ar?.includes('استشار'))?.email || generalEmail
      const careersEmail = info.emails?.find((e: any) => e.label_en?.toLowerCase().includes('career') || e.label_ar?.includes('توظيف'))?.email || generalEmail

      db.settings = {
        ...db.settings,
        phone: info.phones?.[0]?.number || db.settings.phone,
        phoneCairo: info.phones?.find((p: any) => p.label_en?.toLowerCase().includes('cairo') || p.label_ar?.includes('القاهرة'))?.number || info.phones?.[0]?.number,
        phoneRiyadh: info.phones?.find((p: any) => p.label_en?.toLowerCase().includes('riyadh') || p.label_ar?.includes('الرياض'))?.number || info.phones?.[1]?.number,
        whatsapp: info.social?.whatsapp || info.phones?.find((p: any) => p.is_whatsapp)?.number || db.settings.whatsapp,
        email: generalEmail || db.settings.email,
        emailGeneral: generalEmail || db.settings.emailGeneral,
        emailConsultations: consultEmail || db.settings.emailConsultations,
        emailCareers: careersEmail || db.settings.emailCareers,
        linkedin: info.social?.linkedin || db.settings.linkedin,
        instagram: info.social?.instagram || db.settings.instagram,
        facebook: info.social?.facebook || db.settings.facebook,
        youtube: info.social?.youtube || db.settings.youtube,
        behance: info.social?.behance || db.settings.behance,
        footerSummaryEn: info.footer_summary_en || db.settings.footerSummaryEn,
        footerSummaryAr: info.footer_summary_ar || db.settings.footerSummaryAr,
        addressCairo: info.cairo_studio?.address_ar || info.cairo_studio?.address_en || db.settings.addressCairo,
        addressRiyadh: info.riyadh_studio?.address_ar || info.riyadh_studio?.address_en || db.settings.addressRiyadh,
      }
    }

    if (body.settings) {
      db.settings = {
        ...db.settings,
        ...body.settings,
      }
    } else if (!body.companyInfo) {
      // If direct key-values were passed
      const { siteImages, counters, ...directSettings } = body
      db.settings = {
        ...db.settings,
        ...directSettings,
      }
    }

    if (Array.isArray(body.siteImages)) {
      db.siteImages = body.siteImages
    }

    if (Array.isArray(body.counters)) {
      db.counters = body.counters
    }

    writeDb(db)
    return NextResponse.json({
      success: true,
      settings: db.settings,
      companyInfo: db.companyInfo,
      siteImages: db.siteImages,
      counters: db.counters,
      message: 'تم حفظ الإعدادات بنجاح',
    })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  return POST(req)
}

