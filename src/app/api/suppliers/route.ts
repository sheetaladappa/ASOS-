import { NextResponse } from 'next/server';

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
