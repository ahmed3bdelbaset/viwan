import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { INITIAL_SERVICES } from '@/lib/data/seed';
import { ServiceItem } from '@/lib/admin-types';

export async function GET() {
  try {
    const db = readDb();
    let services: ServiceItem[] = db.services;
    
    if (!services || !Array.isArray(services) || services.length === 0) {
      services = [...INITIAL_SERVICES];
      db.services = services;
      writeDb(db);
    }
    
    // Sort by display_order
    services.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    return NextResponse.json({
      success: true,
      data: services,
      services: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ success: false, data: INITIAL_SERVICES, error: 'Failed to fetch services' }, { status: 500 });
  }
}

import { verifySecureAdminToken } from '@/lib/security';
import { serviceItemSchema, validatePayload } from '@/lib/validations';
import { cookies } from 'next/headers';

async function checkAdminAuth(req: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get('viwan_admin_token')?.value;
  const authHeader = req.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const token = cookieToken || headerToken;
  return verifySecureAdminToken(token).valid;
}

export async function POST(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', error: 'غير مصرح: يرجى تسجيل الدخول كمسؤول' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawService = body.service || body;

    const validation = validatePayload(serviceItemSchema, rawService);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'بيانات الخدمة غير صالحة', details: validation.errors },
        { status: 400 }
      );
    }

    const service = validation.data as ServiceItem;

    const db = readDb();
    let services: ServiceItem[] = db.services && Array.isArray(db.services) && db.services.length > 0
      ? db.services
      : [...INITIAL_SERVICES];

    const existingIdx = services.findIndex((s) => s.id === service.id);
    if (existingIdx >= 0) {
      services[existingIdx] = {
        ...services[existingIdx],
        ...service
      };
    } else {
      services.push(service);
    }

    // Sort by display_order
    services.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    db.services = services;
    writeDb(db);

    return NextResponse.json({
      success: true,
      data: service,
      services: services
    });
  } catch (error) {
    console.error('Error saving service:', error);
    return NextResponse.json({ success: false, error: 'Failed to save service' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const isAuth = await checkAdminAuth(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', error: 'غير مصرح: يرجى تسجيل الدخول كمسؤول' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing service ID' }, { status: 400 });
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
