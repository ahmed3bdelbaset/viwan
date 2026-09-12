import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const cfCountry = req.headers.get('cf-ipcountry')
    const vercelCountry = req.headers.get('x-vercel-ip-country')
    const geoCountry = req.headers.get('x-user-country')
    
    // Cloudflare or edge country code (e.g. "EG", "SA", "QA", "AE", "KW")
    const detectedCountry = (cfCountry || vercelCountry || geoCountry || '').trim().toUpperCase()

    const validCountry = detectedCountry && detectedCountry !== 'XX' && detectedCountry.length === 2
      ? detectedCountry
      : null

    return NextResponse.json({
      success: true,
      country: validCountry,
    })
  } catch (error) {
    return NextResponse.json({ success: false, country: null })
  }
}
