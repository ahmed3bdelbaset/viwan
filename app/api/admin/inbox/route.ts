import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDb, writeDb } from '@/lib/db'
import { verifySecureAdminToken } from '@/lib/security'

async function checkAdminAuth(req: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const token =
    cookieStore.get('viwan_admin_token')?.value ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  return verifySecureAdminToken(token).valid
}

export async function GET(req: Request) {
  try {
    if (!(await checkAdminAuth(req))) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const db = readDb()
    return NextResponse.json({
      success: true,
      contacts: Array.isArray(db.contacts) ? db.contacts : [],
      consultations: Array.isArray(db.consultations) ? db.consultations : [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inbox items' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!(await checkAdminAuth(req))) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id, type, status } = await req.json()
    const db = readDb()

    if (type === 'contact') {
      const item = db.contacts.find((c) => c.id === id)
      if (item) {
        item.status = status || 'replied'
      }
    } else if (type === 'consultation') {
      const item = db.consultations.find((c) => c.id === id)
      if (item) {
        item.status = status || 'confirmed'
      }
    }

    writeDb(db)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inbox item' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await checkAdminAuth(req))) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (!id || !type) {
      return NextResponse.json({ error: 'id and type are required' }, { status: 400 })
    }

    const db = readDb()
    if (type === 'contact') {
      db.contacts = (db.contacts || []).filter((c) => c.id !== id)
    } else if (type === 'consultation') {
      db.consultations = (db.consultations || []).filter((c) => c.id !== id)
    }

    writeDb(db)
    return NextResponse.json({ success: true, message: 'Item deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inbox item' }, { status: 500 })
  }
}
