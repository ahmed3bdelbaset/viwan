/**
 * Detect client country from multiple signals:
 * 0. URL query parameter (?country=QA, ?geo=SA for instant testing)
 * 1. Cookie 'viwan_geo_country' (set by Cloudflare cf-ipcountry via proxy)
 * 2. localStorage ('viwan_detected_country')
 * 3. Browser Intl timezone approximation (Fallback)
 * 4. API /api/geo (Async server check)
 */

export const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  // Qatar
  'Asia/Qatar': 'QA',

  // Saudi Arabia
  'Asia/Riyadh': 'SA',

  // Egypt
  'Africa/Cairo': 'EG',

  // United Arab Emirates
  'Asia/Dubai': 'AE',

  // Kuwait
  'Asia/Kuwait': 'KW',

  // Bahrain
  'Asia/Bahrain': 'BH',

  // Oman
  'Asia/Muscat': 'OM',

  // Jordan
  'Asia/Amman': 'JO',

  // Lebanon
  'Asia/Beirut': 'LB',

  // Iraq
  'Asia/Baghdad': 'IQ',

  // Syria
  'Asia/Damascus': 'SY',

  // Sudan
  'Africa/Khartoum': 'SD',

  // Libya
  'Africa/Tripoli': 'LY',

  // Palestine
  'Asia/Gaza': 'PS',
  'Asia/Hebron': 'PS',
  'Asia/Jerusalem': 'PS',

  // North Africa
  'Africa/Casablanca': 'MA',
  'Africa/Tunis': 'TN',
  'Africa/Algiers': 'DZ',

  // Turkey & Europe
  'Europe/Istanbul': 'TR',
  'Asia/Istanbul': 'TR',
  'Europe/London': 'GB',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Europe/Zurich': 'CH',

  // North America
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Toronto': 'CA',
}

let cachedCountry: string | null = null

/**
 * Synchronously retrieves initial visitor country without delay/layout shift.
 */
export function getInitialVisitorCountry(): string {
  if (cachedCountry) return cachedCountry
  if (typeof window === 'undefined') return 'EG'

  // 0. URL override for testing (?country=QA or ?country=SA)
  try {
    const params = new URLSearchParams(window.location.search)
    const urlCountry = params.get('country') || params.get('geo')
    if (urlCountry && urlCountry.length === 2) {
      const cc = urlCountry.toUpperCase()
      cachedCountry = cc
      localStorage.setItem('viwan_detected_country', cc)
      document.cookie = `viwan_geo_country=${cc}; path=/; max-age=604800; SameSite=Lax`
      return cc
    }
  } catch (e) {}

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
      return cachedCountry
    }
  } catch (e) {}

  return 'EG'
}

/**
 * Asynchronously detects visitor country with full fallback hierarchy.
 */
export async function detectVisitorCountry(): Promise<string> {
  const initial = getInitialVisitorCountry()
  if (initial && initial !== 'EG') {
    return initial
  }

  if (typeof window === 'undefined') return 'EG'

  // Fetch /api/geo asynchronously to verify edge headers
  try {
    const res = await fetch('/api/geo')
    const data = await res.json()
    if (data?.country && data.country.length === 2) {
      const cc = data.country.toUpperCase()
      if (cc !== cachedCountry) {
        cachedCountry = cc
        localStorage.setItem('viwan_detected_country', cc)
        document.cookie = `viwan_geo_country=${cc}; path=/; max-age=604800; SameSite=Lax`
        window.dispatchEvent(new CustomEvent('viwan_country_changed', { detail: cc }))
      }
      return cc
    }
  } catch (e) {}

  return cachedCountry || 'EG'
}
