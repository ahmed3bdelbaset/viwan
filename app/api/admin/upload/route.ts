import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Sanitize filename
    const ext = path.extname(file.name) || '.jpg'
    const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `${Date.now()}-${cleanName}${ext}`
    const filePath = path.join(uploadsDir, fileName)

    fs.writeFileSync(filePath, buffer)

    const publicUrl = `/uploads/${fileName}`
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 })
  }
}
