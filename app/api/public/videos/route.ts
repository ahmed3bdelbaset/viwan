import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = readDb()
    const videos = (db.youtubeVideos || [])
      .map((v) => ({
        id: v.id,
        titleEn: v.titleEn,
        titleAr: v.titleAr,
        youtubeUrl: v.youtubeUrl,
        videoId: v.videoId,
        categoryEn: v.categoryEn || 'Architectural Tour',
        categoryAr: v.categoryAr || 'جولة معمارية',
        thumbnailUrl: v.thumbnailUrl || `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`,
        order: v.order || 0,
      }))
      .sort((a, b) => a.order - b.order)

    return NextResponse.json(
      { success: true, videos },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching public videos:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch videos' }, { status: 500 })
  }
}
