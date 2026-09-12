import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { INITIAL_SERVICES } from '@/lib/data/seed';
import { ServiceItem } from '@/lib/admin-types';

import { verifySecureAdminToken } from '@/lib/security';
import { cookies } from 'next/headers';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('viwan_admin_token')?.value;
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;
    const isAuth = verifySecureAdminToken(token).valid;

    if (!isAuth) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', error: 'غير مصرح: يرجى تسجيل الدخول كمسؤول' },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
    }

    const db = readDb();
    let services: ServiceItem[] = db.services && Array.isArray(db.services)
      ? db.services
      : [...INITIAL_SERVICES];

    services = services.filter((s) => s.id !== id);
    db.services = services;
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
      services: services
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
