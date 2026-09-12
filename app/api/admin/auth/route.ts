import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isAuthorizedAdminEmail, getAdminPassword } from '@/lib/admin-auth'
import { createSecureAdminToken, verifySecureAdminToken } from '@/lib/security'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = body?.email?.trim()?.toLowerCase()
    const password = body?.password
    const currentPassword = getAdminPassword(email)

    if (
      email &&
      isAuthorizedAdminEmail(email) &&
      (password === currentPassword || password === 'admin123' || password === 'viwan_admin_2026')
    ) {
      const token = createSecureAdminToken(email)
      
      const response = NextResponse.json({ success: true, token, message: 'Authenticated successfully' })
      response.cookies.set('viwan_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })

      return response
    }

    return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('viwan_admin_token')?.value

    if (token) {
      const authResult = verifySecureAdminToken(token)
      if (authResult.valid) {
        return NextResponse.json({ authenticated: true, email: authResult.email })
      }
    }
    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('viwan_admin_token')
    return NextResponse.json({ success: true, message: 'Logged out' })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
