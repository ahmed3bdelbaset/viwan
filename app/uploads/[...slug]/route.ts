import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getUploadsDir } from '@/lib/db'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params
    if (!slug || slug.length === 0) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Sanitize path against directory traversal
    const rawPath = slug.join('/')
    const safePath = path.normalize(rawPath).replace(/^(\.\.[\/\\])+/, '')

    const uploadsDir = path.resolve(getUploadsDir())
    let targetPath = path.resolve(uploadsDir, safePath)

    // Check if file exists in persistent volume uploads
    let exists = targetPath.startsWith(uploadsDir) && fs.existsSync(/*turbopackIgnore: true*/ targetPath)

    // Fallback: check public/uploads directory
    if (!exists) {
      const publicUploads = path.resolve(process.cwd(), 'public', 'uploads')
      const fallbackTarget = path.resolve(publicUploads, safePath)
      if (fallbackTarget.startsWith(publicUploads) && fs.existsSync(/*turbopackIgnore: true*/ fallbackTarget)) {
        targetPath = fallbackTarget
        exists = true
      }
    }

    if (!exists) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    const stat = fs.statSync(/*turbopackIgnore: true*/ targetPath)
    if (!stat.isFile()) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const ext = path.extname(targetPath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ targetPath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving uploaded file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
