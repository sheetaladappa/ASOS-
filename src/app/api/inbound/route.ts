import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (process.env.DISABLE_DB === '1') {
    return NextResponse.json({ items: [] });
  }
  const items = await prisma.inbound.findMany({
    include: { po: { include: { sku: true, supplier: true } } },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  try {
    if (process.env.DISABLE_DB === '1') {
      return NextResponse.json({ item: {
        id: 'mock-inb-1', poId: 'mock-po-1', courier: 'DHL', trackingNumber: 'TRACK123', eta: null,
        status: 'in_transit', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      } }, { status: 201 });
    }
    const contentType = req.headers.get('content-type') || '';
    let body: any;
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = Object.fromEntries(form.entries());
    }

    const poId = String(body.poId || '').trim();
    const courier = String(body.courier || '').trim();
    const trackingNumber = String(body.trackingNumber || '').trim();
    const etaStr = body.eta ? String(body.eta) : '';
    const status = String(body.status || 'in_transit').trim();

    if (!poId || !courier || !trackingNumber) {
      return NextResponse.json({ error: 'poId, courier, and trackingNumber are required' }, { status: 400 });
    }

    const po = await prisma.po.findUnique({ where: { id: poId } });
    if (!po) {
      return NextResponse.json({ error: 'PO not found' }, { status: 404 });
    }

    const eta = etaStr ? new Date(etaStr) : null;
    if (etaStr && isNaN(eta!.getTime())) {
      return NextResponse.json({ error: 'Invalid ETA date' }, { status: 400 });
    }

    const created = await prisma.inbound.create({
      data: {
        poId,
        courier,
        trackingNumber,
        eta: eta ?? undefined,
        status: status || 'in_transit',
      },
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 });
  }
}


