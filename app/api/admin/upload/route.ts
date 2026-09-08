import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { getUploadsDir } from '@/lib/db'
import { verifySecureAdminToken, validateImageMagicBytes, isSafeSvg } from '@/lib/security'

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.mp4', '.svg'])
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: Request) {
  try {
    // 1. Authenticate admin user
    const cookieStore = await cookies()
    const token =
      cookieStore.get('viwan_admin_token')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

    const authResult = verifySecureAdminToken(token)
    if (!authResult.valid) {
      return NextResponse.json(
        { error: 'غير مصرح: يجب تسجيل الدخول لرفع الملفات' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 })
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'حجم الملف يتجاوز الحد الأقصى المسموح (10 ميجابايت)' },
        { status: 400 }
      )
    }

    // 3. Validate file extension
    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مسموح به. الصيغ المسموحة: JPG, PNG, WEBP, PDF, MP4, SVG' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 4. Validate binary magic bytes or SVG safety (Anti-XSS / Malicious Polyglot)
    if (ext === '.svg') {
      const svgText = buffer.toString('utf-8')
      if (!isSafeSvg(svgText)) {
        return NextResponse.json(
          { error: 'ملف SVG يحتوي على وسوم برمجية غير آمنة وتم حظره' },
          { status: 400 }
        )
      }
    } else if (ext !== '.mp4' && ext !== '.pdf') {
      const magicCheck = validateImageMagicBytes(buffer)
      if (!magicCheck.valid) {
        return NextResponse.json(
          { error: 'محتوى الملف الثنائي لا يتطابق مع امتداده المصرّح به' },
          { status: 400 }
        )
      }
    }

    const uploadsDir = getUploadsDir()

    // 5. Sanitize filename to prevent path traversal
    const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const fileName = `${Date.now()}-${cleanName}${ext}`
    const filePath = path.join(uploadsDir, fileName)

    fs.writeFileSync(filePath, buffer)

    // Also mirror to public/uploads if separate, for local dev convenience
    try {
      const publicUploads = path.join(process.cwd(), 'public', 'uploads')
      if (path.resolve(publicUploads) !== path.resolve(uploadsDir)) {
        if (!fs.existsSync(publicUploads)) {
          fs.mkdirSync(publicUploads, { recursive: true })
        }
        fs.writeFileSync(path.join(publicUploads, fileName), buffer)
      }
    } catch {}

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
