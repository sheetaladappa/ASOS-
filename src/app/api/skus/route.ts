import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const SkuSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.string().min(1),
  cost: z.coerce.number().nonnegative(),
  supplierId: z.string(),
  leadTime: z.coerce.number().int().nonnegative(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
    const pageSize = Math.min(100, Number(searchParams.get('pageSize') ?? '20'));
    const skip = (page - 1) * pageSize;
    const q = (searchParams.get('q') ?? '').trim();
    const category = (searchParams.get('category') ?? '').trim();
    const supplierId = (searchParams.get('supplierId') ?? '').trim();
    const sort = (searchParams.get('sort') ?? 'updatedAt:desc').split(':');
    const sortField = (sort[0] as 'name' | 'updatedAt' | 'cost');
    const sortDir = (sort[1] === 'asc' ? 'asc' : 'desc') as Prisma.SortOrder;
    const orderBy: Prisma.SkuOrderByWithRelationInput[] = [{ [sortField]: sortDir } as Prisma.SkuOrderByWithRelationInput];

    const where: Prisma.SkuWhereInput = {
      AND: [
        q
          ? {
              OR: [
                { id: { equals: q } },
                { id: { contains: q } },
                { name: { contains: q } },
                { description: { contains: q } },
                { category: { contains: q } },
                { supplier: { is: { name: { contains: q } } } },
              ],
            }
          : {},
        category ? { category: { contains: category } } : {},
        supplierId ? { supplierId } : {},
      ],
    };

    const [items, total] = await Promise.all([
      prisma.sku.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.sku.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());

    const parsed = SkuSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const data = parsed.data;

    // Get all active suppliers
    const suppliers = await prisma.supplier.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
    });

    // Map supplier selection to actual supplier ID
    const supplierIndex = parseInt(data.supplierId.replace('supplier-', ''), 10) - 1;
    const supplier = suppliers[supplierIndex];

    if (!supplier) {
      return NextResponse.json({ error: 'Invalid supplier selected' }, { status: 400 });
    }

    // Check if SKU already exists
    const existingSku = await prisma.sku.findFirst({
      where: {
        name: data.name,
        supplierId: supplier.id,
      },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: 'SKU with this name already exists for the selected supplier' },
        { status: 409 },
      );
    }

    // Create the SKU
    const sku = await prisma.sku.create({
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category,
        cost: data.cost,
        supplierId: supplier.id,
        leadTime: data.leadTime,
      },
    });

    return NextResponse.json({ success: true, sku }, { status: 201 });
  } catch (error) {
    console.error('Error creating SKU:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
