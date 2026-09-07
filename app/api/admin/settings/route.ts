import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({
      success: true,
      settings: db.settings,
      siteImages: db.siteImages || [],
      counters: db.counters || [],
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const db = readDb()

    if (body.settings) {
      db.settings = {
        ...db.settings,
        ...body.settings,
      }
    } else {
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

