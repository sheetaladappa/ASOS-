import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreatePoSchema = z.object({
  skuId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
});

export async function GET() {
  try {
    const items = await prisma.po.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        sku: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching POs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let payload: any;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    }

    const parsed = CreatePoSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { skuId, quantity } = parsed.data;

    const sku = await prisma.sku.findUnique({ where: { id: skuId }, include: { supplier: true } });
    if (!sku || !sku.supplier) {
      return NextResponse.json({ error: 'SKU or Supplier not found' }, { status: 404 });
    }

    const po = await prisma.po.create({
      data: {
        skuId: sku.id,
        supplierId: sku.supplierId,
        quantity,
        status: 'draft',
      },
    });

    return NextResponse.json({ success: true, po }, { status: 201 });
  } catch (error) {
    console.error('Error creating PO:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
