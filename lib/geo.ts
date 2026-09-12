/**
 * Detect client country from multiple signals:
 * 1. Cookie 'viwan_geo_country' (set by proxy via Cloudflare cf-ipcountry)
 * 2. API /api/geo
 * 3. Browser Intl timezone approximation (Fallback)
 */

const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'Asia/Qatar': 'QA',
  'Asia/Riyadh': 'SA',
  'Africa/Cairo': 'EG',
  'Asia/Dubai': 'AE',
  'Asia/Kuwait': 'KW',
  'Asia/Bahrain': 'BH',
  'Asia/Muscat': 'OM',
  'Asia/Amman': 'JO',
  'Asia/Beirut': 'LB',
  'Asia/Baghdad': 'IQ',
  'Asia/Damascus': 'SY',
}

let cachedCountry: string | null = null

export async function detectVisitorCountry(): Promise<string> {
  if (cachedCountry) return cachedCountry

  if (typeof window === 'undefined') return 'EG'

  // 1. Check Cookie
  const match = document.cookie.match(/(?:^|; )viwan_geo_country=([^;]+)/)
  if (match && match[1] && match[1].length === 2) {
    cachedCountry = match[1].toUpperCase()
    return cachedCountry
  }

  // 2. Check localStorage
  const saved = localStorage.getItem('viwan_detected_country')
  if (saved && saved.length === 2) {
    cachedCountry = saved.toUpperCase()
    return cachedCountry
  }

  // 3. Fallback to TimeZone
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz && TIMEZONE_COUNTRY_MAP[tz]) {
      cachedCountry = TIMEZONE_COUNTRY_MAP[tz]
      localStorage.setItem('viwan_detected_country', cachedCountry)
      return cachedCountry
    }
  } catch (e) {}

  // 4. Fetch /api/geo asynchronously
  try {
    const res = await fetch('/api/geo')
    const data = await res.json()
    if (data.country) {
      cachedCountry = data.country.toUpperCase()
      localStorage.setItem('viwan_detected_country', cachedCountry)
      return cachedCountry
    }
  } catch (e) {}

  cachedCountry = 'EG'
  return cachedCountry
}
