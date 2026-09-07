import { NextResponse } from 'next/server'
import { readDb, writeDb, AdminUser } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({ success: true, admins: db.admins || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch administrators' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
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

    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      name: String(name).trim(),
      email: cleanEmail,
      role: role ? String(role).trim() : 'Studio Architect',
      avatar: avatar ? String(avatar).trim() : '/images/consultation-architects.jpg',
      password: password ? String(password).trim() : 'viwan_admin_2026',
      createdAt: new Date().toISOString(),
      status: 'active',
    }

    db.admins.push(newAdmin)
    writeDb(db)

    return NextResponse.json({ success: true, admin: newAdmin, message: 'تمت إضافة المسؤول بنجاح' })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: 'Failed to create administrator' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
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

    db.admins[idx] = {
      ...current,
      name: dataToUpdate.name ? String(dataToUpdate.name).trim() : current.name,
      role: dataToUpdate.role ? String(dataToUpdate.role).trim() : current.role,
      avatar: dataToUpdate.avatar ? String(dataToUpdate.avatar).trim() : current.avatar,
      status: dataToUpdate.status === 'inactive' ? 'inactive' : 'active',
      password: dataToUpdate.password ? String(dataToUpdate.password).trim() : current.password,
    }

    writeDb(db)
    return NextResponse.json({ success: true, admin: db.admins[idx], message: 'تم تحديث بيانات المسؤول' })
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to update administrator' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
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
