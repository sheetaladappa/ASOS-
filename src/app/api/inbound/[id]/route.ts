import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const item = await prisma.inbound.findUnique({
    where: { id },
    include: { po: { include: { sku: true, supplier: true } } },
  });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { status, eta } = body || {};
  const data: any = {};
  if (typeof status === 'string' && status.trim()) data.status = status.trim();
  if (typeof eta === 'string' && eta) {
    const d = new Date(eta);
    if (!isNaN(d.getTime())) data.eta = d;
  }
  try {
    const updated = await prisma.inbound.update({ where: { id }, data });
    return NextResponse.json({ item: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}


