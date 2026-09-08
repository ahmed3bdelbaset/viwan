import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDb } from '@/lib/db'
import { verifySecureAdminToken } from '@/lib/security'

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token =
      cookieStore.get('viwan_admin_token')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

    const authResult = verifySecureAdminToken(token)
    if (!authResult.valid) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب تسجيل الدخول للوصول إلى قاعدة البيانات' },
        { status: 401 }
      )
    }

    const db = readDb()
    return NextResponse.json({
      projects: db.projects,
      jobs: db.jobs,
      contacts: db.contacts,
      consultations: db.consultations,
      settings: db.settings,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 })
  }
}
