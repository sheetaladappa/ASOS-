import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const SkuSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.string().min(1),
  cost: z.coerce.number().nonnegative(),
  supplierId: z.string(),
  leadTime: z.coerce.number().int().nonnegative(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sku = await prisma.sku.findUnique({
      where: { id: params.id },
      include: { supplier: true }
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'SKU not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sku);
  } catch (error) {
    console.error('Error fetching SKU:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const raw = Object.fromEntries(formData.entries());
    
    const parsed = SkuSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    const data = parsed.data;
    
    // Check if SKU exists
    const existingSku = await prisma.sku.findUnique({
      where: { id: params.id }
    });

    if (!existingSku) {
      return NextResponse.json(
        { error: 'SKU not found' },
        { status: 404 }
      );
    }

    // Get all active suppliers
    const suppliers = await prisma.supplier.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' }
    });
    
    // Map supplier selection to actual supplier ID
    const supplierIndex = parseInt(data.supplierId.replace('supplier-', '')) - 1;
    const supplier = suppliers[supplierIndex];
    
    if (!supplier) {
      return NextResponse.json(
        { error: 'Invalid supplier selected' },
        { status: 400 }
      );
    }

    // Check if SKU name already exists for this supplier (excluding current SKU)
    const duplicateSku = await prisma.sku.findFirst({
      where: {
        name: data.name,
        supplierId: supplier.id,
        id: { not: params.id }
      }
    });

    if (duplicateSku) {
      return NextResponse.json(
        { error: 'SKU with this name already exists for the selected supplier' },
        { status: 409 }
      );
    }

    // Update the SKU
    const updatedSku = await prisma.sku.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category,
        cost: data.cost,
        supplierId: supplier.id,
        leadTime: data.leadTime,
      },
    });

    return NextResponse.json({ success: true, sku: updatedSku });
    
  } catch (error) {
    console.error('Error updating SKU:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skuId = params.id;

    // Check if SKU exists
    const existingSku = await prisma.sku.findUnique({
      where: { id: skuId }
    });

    if (!existingSku) {
      return NextResponse.json(
        { error: 'SKU not found' },
        { status: 404 }
      );
    }

    // Delete the SKU
    await prisma.sku.delete({
      where: { id: skuId }
    });

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting SKU:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
