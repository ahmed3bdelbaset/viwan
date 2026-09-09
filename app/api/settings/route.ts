import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({
      success: true,
      data: db.companyInfo || null,
      settings: db.settings,
      companyInfo: db.companyInfo || null,
      siteImages: db.siteImages || [],
      counters: db.counters || [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const db = readDb()

    // Accept companyInfo directly or wrapped
    const companyInfo = body.companyInfo || (body.name_en ? body : null)
    if (companyInfo) {
      db.companyInfo = companyInfo
      const info = companyInfo
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
    }

    writeDb(db)
    return NextResponse.json({
      success: true,
      data: db.companyInfo,
      settings: db.settings,
      companyInfo: db.companyInfo,
    })
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
