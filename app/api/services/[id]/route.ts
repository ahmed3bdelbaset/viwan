import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { INITIAL_SERVICES } from '@/lib/data/seed';
import { ServiceItem } from '@/lib/admin-types';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
