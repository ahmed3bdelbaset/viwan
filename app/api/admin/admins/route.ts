import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDb, writeDb, AdminUser } from '@/lib/db'
import { hashPassword } from '@/lib/admin-auth'
import { verifySecureAdminToken } from '@/lib/security'

async function checkAdminAuth(req: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('viwan_admin_token')?.value
  const authHeader = req.headers.get('authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  const token = cookieToken || headerToken
  return verifySecureAdminToken(token).valid
}

/**
 * Strips password and sensitive hash fields from admin objects before serialization
 */
function sanitizeAdminResponse(admin: any) {
  if (!admin) return null
  const { password, ...safeAdmin } = admin
  return safeAdmin
}

export async function GET(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب تسجيل الدخول للوصول إلى بيانات المسؤولين' },
        { status: 401 }
      )
    }

    const db = readDb()
    const safeAdmins = (db.admins || []).map(sanitizeAdminResponse)
    return NextResponse.json({ success: true, admins: safeAdmins })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch administrators' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب تسجيل الدخول لإضافة مسؤول جديد' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, email, role, avatar, password } = body || {}

    if (!name || !email) {
      return NextResponse.json({ error: 'الاسم والبريد الإلكتروني مطلوبان' }, { status: 400 })
    }

    const cleanEmail = String(email).trim().toLowerCase()
    const db = readDb()

    if (!Array.isArray(db.admins)) {
      db.admins = []
    }

    if (db.admins.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل بالفعل لمسؤول آخر' }, { status: 400 })
    }

    const rawPassword = password ? String(password).trim() : 'viwan_admin_2026'
    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      name: String(name).trim(),
      email: cleanEmail,
      role: role ? String(role).trim() : 'Studio Architect',
      avatar: avatar ? String(avatar).trim() : '/images/consultation-architects.jpg',
      password: hashPassword(rawPassword),
      createdAt: new Date().toISOString(),
      status: 'active',
    }

    db.admins.push(newAdmin)
    writeDb(db)

    return NextResponse.json({
      success: true,
      admin: sanitizeAdminResponse(newAdmin),
      message: 'تمت إضافة المسؤول بنجاح',
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: 'Failed to create administrator' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب تسجيل الدخول لتعديل بيانات المسؤول' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, email, updates } = body || {}
    const identifier = id || email

    if (!identifier) {
      return NextResponse.json({ error: 'معرّف المسؤول مطلوب' }, { status: 400 })
    }

    const db = readDb()
    if (!Array.isArray(db.admins)) {
      db.admins = []
    }

    const idx = db.admins.findIndex(
      (a) => a.id === identifier || a.email.toLowerCase() === String(identifier).toLowerCase()
    )

    if (idx === -1) {
      return NextResponse.json({ error: 'المسؤول غير موجود' }, { status: 404 })
    }

    const current = db.admins[idx]
    const dataToUpdate = updates || body

    const updatedPassword = dataToUpdate.password
      ? hashPassword(String(dataToUpdate.password).trim())
      : current.password

    db.admins[idx] = {
      ...current,
      name: dataToUpdate.name ? String(dataToUpdate.name).trim() : current.name,
      role: dataToUpdate.role ? String(dataToUpdate.role).trim() : current.role,
      avatar: dataToUpdate.avatar ? String(dataToUpdate.avatar).trim() : current.avatar,
      status: dataToUpdate.status === 'inactive' ? 'inactive' : 'active',
      password: updatedPassword,
    }

    writeDb(db)
    return NextResponse.json({
      success: true,
      admin: sanitizeAdminResponse(db.admins[idx]),
      message: 'تم تحديث بيانات المسؤول بنجاح',
    })
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to update administrator' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req)
    if (!isAuth) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب تسجيل الدخول لحذف مسؤول' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    let id = searchParams.get('id') || searchParams.get('email')
    if (!id) {
      const body = await req.json().catch(() => ({}))
      id = body?.id || body?.email
    }

    if (!id) {
      return NextResponse.json({ error: 'معرّف المسؤول مطلوب للحذف' }, { status: 400 })
    }

    const db = readDb()
    if (!Array.isArray(db.admins)) {
      return NextResponse.json({ error: 'لا يوجد مسؤولون' }, { status: 404 })
    }

    if (db.admins.length <= 1) {
      return NextResponse.json({ error: 'لا يمكن حذف المسؤول الأخير في النظام' }, { status: 400 })
    }

    const cleanId = String(id).toLowerCase()
    const initialLen = db.admins.length
    db.admins = db.admins.filter((a) => a.id !== id && a.email.toLowerCase() !== cleanId)

    if (db.admins.length === initialLen) {
      return NextResponse.json({ error: 'المسؤول غير موجود' }, { status: 404 })
    }

    writeDb(db)
    return NextResponse.json({ success: true, message: 'تم حذف المسؤول بنجاح' })
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json({ error: 'Failed to delete administrator' }, { status: 500 })
  }
}
