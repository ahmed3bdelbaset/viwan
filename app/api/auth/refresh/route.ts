import { NextResponse } from 'next/server';

export async function POST() {
  const token = Buffer.from(`refresh:${Date.now()}:viwan_secret`).toString('base64');
  return NextResponse.json({ success: true, token });
}
