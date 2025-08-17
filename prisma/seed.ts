import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const suppliers = await prisma.$transaction([
    prisma.supplier.upsert({
      where: { name: 'ASOS Core Sourcing' },
      update: {},
      create: { name: 'ASOS Core Sourcing', status: 'active' }
    }),
    prisma.supplier.upsert({
      where: { name: 'FastTrack Textiles' },
      update: {},
      create: { name: 'FastTrack Textiles', status: 'active' }
    }),
    prisma.supplier.upsert({
      where: { name: 'Glow Cosmetics Ltd' },
      update: {},
      create: { name: 'Glow Cosmetics Ltd', status: 'active' }
    })
  ]);

  const [s1, s2, s3] = suppliers;

  await prisma.$transaction([
    prisma.sku.upsert({
      where: { name_supplierId: { name: 'Ribbed Crop Top', supplierId: s1.id } },
      update: {},
      create: {
        name: 'Ribbed Crop Top',
        description: 'Fast-fashion ribbed crop top, cotton blend',
        category: 'Apparel',
        cost: 5.75,
        supplierId: s1.id,
        leadTime: 12
      }
    }),
    prisma.sku.upsert({
      where: { name_supplierId: { name: 'Oversized Hoodie', supplierId: s2.id } },
      update: {},
      create: {
        name: 'Oversized Hoodie',
        description: 'Unisex hoodie, fleece-lined',
        category: 'Apparel',
        cost: 11.2,
        supplierId: s2.id,
        leadTime: 16
      }
    }),
    prisma.sku.upsert({
      where: { name_supplierId: { name: 'Hydrating Lip Gloss', supplierId: s3.id } },
      update: {},
      create: {
        name: 'Hydrating Lip Gloss',
        description: 'Vegan formula, shimmer finish',
        category: 'Cosmetics',
        cost: 2.3,
        supplierId: s3.id,
        leadTime: 18
      }
    })
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


