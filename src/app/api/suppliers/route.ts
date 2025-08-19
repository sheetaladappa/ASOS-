import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (process.env.DISABLE_DB === '1') {
      return NextResponse.json([
        { id: 'mock-sup-1', name: 'Acme Textiles', status: 'active' },
        { id: 'mock-sup-2', name: 'Global Beauty Co', status: 'active' },
        { id: 'mock-sup-3', name: 'FastFab Ltd', status: 'active' },
      ]);
    }
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
