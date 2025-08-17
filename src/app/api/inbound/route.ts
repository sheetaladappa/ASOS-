import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const items = await prisma.inbound.findMany({
    include: { po: { include: { sku: true, supplier: true } } },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  try {
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


