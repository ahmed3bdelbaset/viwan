/**
 * Utility functions and data types for YouTube video integration.
 * Enables zero-disk-storage video embedding with automatic thumbnail resolution.
 * Safe for both Client Components and Server Components (no node:fs).
 */

export interface YouTubeVideo {
  id: string
  titleEn: string
  titleAr: string
  youtubeUrl: string
  videoId: string
  categoryEn?: string
  categoryAr?: string
  thumbnailUrl?: string
  order: number
  createdAt: string
}

export const DEFAULT_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    titleEn: 'Private Luxury Villa Architectural Walkthrough',
    titleAr: 'جولة سينمائية متكاملة في فيلا سكنية فاخرة',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    videoId: 'aqz-KE-bpKQ',
    categoryEn: 'Architectural Tour',
    categoryAr: 'جولة معمارية',
    thumbnailUrl: 'https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'yt-2',
    titleEn: 'Contemporary Villa Interior & Ambient Lighting Design',
    titleAr: 'التصميم الداخلي والإنارة المعمارية للقصور المعاصرة',
    youtubeUrl: 'https://www.youtube.com/watch?v=7WT0nI-BwR4',
    videoId: '7WT0nI-BwR4',
    categoryEn: 'Interior & Lighting',
    categoryAr: 'التصميم الداخلي والإضاءة',
    thumbnailUrl: 'https://img.youtube.com/vi/7WT0nI-BwR4/maxresdefault.jpg',
    order: 2,
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'yt-3',
    titleEn: 'Desert Modernism & Landscape Architecture Film',
    titleAr: 'فيلم وثائقي معماري: عمارة وتنسيق المواقع المستدامة',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    videoId: 'kJQP7kiw5Fk',
    categoryEn: 'Landscape & Masterplanning',
    categoryAr: 'اللاندسكيب والتخطيط',
    thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
    order: 3,
    createdAt: '2026-01-03T00:00:00.000Z',
  },
]

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null

  const trimmed = urlOrId.trim()

  // If it's already an 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  // Regex covering standard watch URLs, youtu.be short links, embed URLs, and shorts
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function getYouTubeThumbnail(videoId: string): {
  maxres: string
  hq: string
  mq: string
  defaultImg: string
} {
  return {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    defaultImg: `https://img.youtube.com/vi/${videoId}/default.jpg`,
  }
}

export function getYouTubeEmbedUrl(videoId: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    playsinline: '1',
  })

  if (autoplay) {
    params.set('autoplay', '1')
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}
