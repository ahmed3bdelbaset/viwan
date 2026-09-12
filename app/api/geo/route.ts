import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const queryCountry = url.searchParams.get('country') || url.searchParams.get('geo')

    const cfCountry = req.headers.get('cf-ipcountry')
    const vercelCountry = req.headers.get('x-vercel-ip-country')
    const geoCountry = req.headers.get('x-user-country')
    
    // Check cookie fallback
    const cookieHeader = req.headers.get('cookie') || ''
    const cookieMatch = cookieHeader.match(/(?:^|; )viwan_geo_country=([^;]+)/)
    const cookieCountry = cookieMatch ? cookieMatch[1] : null

    // Priority: queryParam (for testing) -> Cloudflare -> Vercel -> Proxy header -> Cookie
    const detectedCountry = (queryCountry || cfCountry || vercelCountry || geoCountry || cookieCountry || '').trim().toUpperCase()

    const validCountry = detectedCountry && detectedCountry !== 'XX' && detectedCountry.length === 2
      ? detectedCountry
      : null

    const response = NextResponse.json({
      success: true,
      country: validCountry,
    })

    if (validCountry) {
      response.cookies.set('viwan_geo_country', validCountry, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      })
    }

    return response
  } catch (error) {
    return NextResponse.json({ success: false, country: null })
  }
}
