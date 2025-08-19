import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    // With Vercel Postgres enabled, always read from DB
    const { prisma } = await import('@/lib/prisma');
    const suppliers = await prisma.supplier.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        status: true
      }
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

const SupplierSchema = z.object({
  name: z.string().trim().min(1).max(120),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: any;
    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const form = await req.formData();
      payload = Object.fromEntries(form.entries());
    }

    const parsed = SupplierSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { prisma } = await import('@/lib/prisma');

    const existing = await prisma.supplier.findFirst({ where: { name: parsed.data.name } });
    if (existing) {
      return NextResponse.json({ error: 'Supplier already exists', supplier: existing }, { status: 409 });
    }

    const created = await prisma.supplier.create({
      data: { name: parsed.data.name, status: parsed.data.status },
      select: { id: true, name: true, status: true },
    });

    return NextResponse.json({ supplier: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
