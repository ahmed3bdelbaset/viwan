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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const service: ServiceItem = body.service || body;

    if (!service || !service.id) {
      return NextResponse.json({ success: false, error: 'Invalid service payload' }, { status: 400 });
    }

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
