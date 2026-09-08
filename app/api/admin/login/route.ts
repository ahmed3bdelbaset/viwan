import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { isAuthorizedAdminEmail, getAdminPassword } from '@/lib/admin-auth'
import { createSecureAdminToken } from '@/lib/security'

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const cleanEmail = email?.trim()?.toLowerCase()

    if (!cleanEmail || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const currentPassword = getAdminPassword(cleanEmail)
    const isPasswordCorrect = safeCompare(password, currentPassword)
    const isAuthorized = isAuthorizedAdminEmail(cleanEmail)

    if (cleanEmail && isAuthorized && isPasswordCorrect) {
      const sessionToken = createSecureAdminToken(cleanEmail)
      
      const cookieStore = await cookies()
      cookieStore.set('viwan_admin_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })

      return NextResponse.json({ success: true, message: 'Authenticated successfully' })
    }

    return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('viwan_admin_token')
  return NextResponse.json({ success: true, message: 'Logged out' })
}
