import { NextResponse } from 'next/server'
import { readDb, writeDb, YouTubeVideo } from '@/lib/db'
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import { sanitizeInput } from '@/lib/security'

export async function GET() {
  try {
    const db = readDb()
    const videos = [...(db.youtubeVideos || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
    return NextResponse.json({ success: true, videos })
  } catch (error) {
    console.error('Error fetching youtube videos:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { titleEn, titleAr, youtubeUrl, categoryEn, categoryAr } = body

    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
      return NextResponse.json({ success: false, error: 'YouTube URL is required' }, { status: 400 })
    }

    const videoId = extractYouTubeId(youtubeUrl)
    if (!videoId) {
      return NextResponse.json({ success: false, error: 'Invalid YouTube URL or ID' }, { status: 400 })
    }

    const cleanTitleEn = sanitizeInput(titleEn || titleAr || 'Architectural Video Showcase')
    const cleanTitleAr = sanitizeInput(titleAr || titleEn || 'استعراض فيديو معماري')
    const cleanCategoryEn = sanitizeInput(categoryEn || 'Architectural Tour')
    const cleanCategoryAr = sanitizeInput(categoryAr || 'جولة معمارية')

    const db = readDb()
    const existing = db.youtubeVideos || []

    const maxOrder = existing.reduce((max, v) => Math.max(max, v.order || 0), 0)
    const thumbnails = getYouTubeThumbnail(videoId)

    const newVideo: YouTubeVideo = {
      id: `yt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      titleEn: cleanTitleEn,
      titleAr: cleanTitleAr,
      youtubeUrl: youtubeUrl.trim(),
      videoId,
      categoryEn: cleanCategoryEn,
      categoryAr: cleanCategoryAr,
      thumbnailUrl: thumbnails.maxres,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
    }

    const updatedVideos = [...existing, newVideo]
    db.youtubeVideos = updatedVideos
    writeDb(db)

    return NextResponse.json({ success: true, video: newVideo })
  } catch (error) {
    console.error('Error creating youtube video:', error)
    return NextResponse.json({ success: false, error: 'Failed to create video' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    // Support batch reorder: { reorder: [{ id, order }] }
    if (Array.isArray(body.reorder)) {
      const db = readDb()
      const existing = db.youtubeVideos || []
      const orderMap = new Map<string, number>()
      for (const item of body.reorder) {
        if (item.id && typeof item.order === 'number') {
          orderMap.set(item.id, item.order)
        }
      }

      db.youtubeVideos = existing
        .map((v) => {
          if (orderMap.has(v.id)) {
            return { ...v, order: orderMap.get(v.id)! }
          }
          return v
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0))

      writeDb(db)
      return NextResponse.json({ success: true, videos: db.youtubeVideos })
    }

    // Single item update
    const { id, titleEn, titleAr, youtubeUrl, categoryEn, categoryAr, order } = body
    if (!id) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
    }

    const db = readDb()
    const existing = db.youtubeVideos || []
    const index = existing.findIndex((v) => v.id === id)

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 })
    }

    const target = existing[index]
    let videoId = target.videoId
    let thumbnailUrl = target.thumbnailUrl

    if (youtubeUrl && typeof youtubeUrl === 'string' && youtubeUrl !== target.youtubeUrl) {
      const extracted = extractYouTubeId(youtubeUrl)
      if (extracted) {
        videoId = extracted
        thumbnailUrl = getYouTubeThumbnail(extracted).maxres
      }
    }

    const updated: YouTubeVideo = {
      ...target,
      titleEn: titleEn ? sanitizeInput(titleEn) : target.titleEn,
      titleAr: titleAr ? sanitizeInput(titleAr) : target.titleAr,
      youtubeUrl: youtubeUrl ? youtubeUrl.trim() : target.youtubeUrl,
      videoId,
      categoryEn: categoryEn ? sanitizeInput(categoryEn) : target.categoryEn,
      categoryAr: categoryAr ? sanitizeInput(categoryAr) : target.categoryAr,
      thumbnailUrl,
      order: typeof order === 'number' ? order : target.order,
    }

    existing[index] = updated
    db.youtubeVideos = [...existing].sort((a, b) => (a.order || 0) - (b.order || 0))
    writeDb(db)

    return NextResponse.json({ success: true, video: updated })
  } catch (error) {
    console.error('Error updating youtube video:', error)
    return NextResponse.json({ success: false, error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 })
    }

    const db = readDb()
    const existing = db.youtubeVideos || []
    db.youtubeVideos = existing.filter((v) => v.id !== id)
    writeDb(db)

    return NextResponse.json({ success: true, message: 'Video deleted successfully' })
  } catch (error) {
    console.error('Error deleting youtube video:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete video' }, { status: 500 })
  }
}
