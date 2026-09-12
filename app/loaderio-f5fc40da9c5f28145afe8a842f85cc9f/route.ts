import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('loaderio-f5fc40da9c5f28145afe8a842f85cc9f', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
