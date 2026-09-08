import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'
import { extractYouTubeId } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = readDb()
    const standaloneVideos = (db.youtubeVideos || []).map((v) => ({
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

    const projectVideos: any[] = []
    if (Array.isArray(db.projects)) {
      db.projects.forEach((p: any, idx: number) => {
        if (p.youtubeUrl && typeof p.youtubeUrl === 'string') {
          const vId = p.youtubeId || extractYouTubeId(p.youtubeUrl)
          if (vId) {
            // Avoid duplicate if already exists in standalone list
            if (!standaloneVideos.some((sv) => sv.videoId === vId)) {
              projectVideos.push({
                id: `project-vid-${p.slug || p.id || idx}`,
                titleEn: p.title_en || p.name || 'Project Film',
                titleAr: p.title_ar || p.nameAr || p.title || 'فيلم وثائقي للمشروع',
                youtubeUrl: p.youtubeUrl,
                videoId: vId,
                categoryEn: p.type || p.category || 'Architectural Tour',
                categoryAr: p.sector_ar || 'جولة معمارية',
                thumbnailUrl: `https://img.youtube.com/vi/${vId}/maxresdefault.jpg`,
                order: 100 + idx,
              })
            }
          }
        }
      })
    }

    const videos = [...standaloneVideos, ...projectVideos].sort((a, b) => a.order - b.order)

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
