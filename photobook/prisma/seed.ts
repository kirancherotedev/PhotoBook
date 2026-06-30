/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import path from 'path';

// Use require for the generated client (CJS compat)
const { getPrismaClientClass } = require('../src/generated/prisma/internal/class');
const PrismaClient = getPrismaClientClass();

const adapter = new PrismaBetterSqlite3({
  url: `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
});
const prisma = new PrismaClient({ adapter });

function createDefaultDesignData(pageCount: number = 20) {
  const pages: any[] = [];
  
  // Front cover
  pages.push({
    id: uuid(),
    type: 'front_cover',
    background: { type: 'color', value: '#FFFFFF' },
    elements: []
  });

  // Content pages
  for (let i = 0; i < pageCount; i++) {
    pages.push({
      id: uuid(),
      type: 'content',
      background: { type: 'color', value: '#FFFFFF' },
      elements: []
    });
  }

  // Back cover
  pages.push({
    id: uuid(),
    type: 'back_cover',
    background: { type: 'color', value: '#FFFFFF' },
    elements: []
  });

  return {
    bookConfig: {
      size: '8x8',
      coverType: 'hardcover',
      paperType: 'matte',
      pageCount: pageCount
    },
    pages
  };
}

function createWeddingTemplate() {
  const data = createDefaultDesignData(24);
  data.pages[0].background = { type: 'color', value: '#FEF6F7' };
  data.pages[0].elements = [
    {
      id: uuid(),
      type: 'text',
      x: 120, y: 280,
      width: 360, height: 60,
      rotation: 0,
      zIndex: 1,
      properties: {
        content: 'Our Wedding Day',
        fontFamily: 'Playfair Display',
        fontSize: 36,
        color: '#86636A',
        textAlign: 'center',
        fontWeight: '600'
      }
    },
    {
      id: uuid(),
      type: 'text',
      x: 180, y: 350,
      width: 240, height: 30,
      rotation: 0,
      zIndex: 2,
      properties: {
        content: 'A Love Story',
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#B08F95',
        textAlign: 'center',
        letterSpacing: '0.1em'
      }
    }
  ];
  return data;
}

function createTravelTemplate() {
  const data = createDefaultDesignData(20);
  data.pages[0].background = { type: 'color', value: '#F5F0EB' };
  data.pages[0].elements = [
    {
      id: uuid(),
      type: 'text',
      x: 100, y: 260,
      width: 400, height: 60,
      rotation: 0,
      zIndex: 1,
      properties: {
        content: 'Adventures Await',
        fontFamily: 'Playfair Display',
        fontSize: 38,
        color: '#86636A',
        textAlign: 'center',
        fontWeight: '600'
      }
    },
    {
      id: uuid(),
      type: 'text',
      x: 140, y: 340,
      width: 320, height: 30,
      rotation: 0,
      zIndex: 2,
      properties: {
        content: '2024 · Travel Journal',
        fontFamily: 'Inter',
        fontSize: 13,
        color: '#B08F95',
        textAlign: 'center',
        letterSpacing: '0.15em'
      }
    }
  ];
  return data;
}

function createBabyTemplate() {
  const data = createDefaultDesignData(16);
  data.bookConfig.size = '10x10';
  data.pages[0].background = { type: 'color', value: '#FEF6F7' };
  data.pages[0].elements = [
    {
      id: uuid(),
      type: 'text',
      x: 100, y: 240,
      width: 400, height: 70,
      rotation: 0,
      zIndex: 1,
      properties: {
        content: "Baby's First Year",
        fontFamily: 'Playfair Display',
        fontSize: 34,
        color: '#86636A',
        textAlign: 'center',
        fontWeight: '600'
      }
    },
    {
      id: uuid(),
      type: 'text',
      x: 180, y: 330,
      width: 240, height: 30,
      rotation: 0,
      zIndex: 2,
      properties: {
        content: 'Tiny Moments, Big Memories',
        fontFamily: 'Inter',
        fontSize: 12,
        color: '#B08F95',
        textAlign: 'center',
        letterSpacing: '0.08em'
      }
    }
  ];
  return data;
}

function createPortfolioTemplate() {
  const data = createDefaultDesignData(12);
  data.bookConfig.size = '12x12';
  data.bookConfig.paperType = 'glossy';
  data.pages[0].background = { type: 'color', value: '#F8F5F3' };
  data.pages[0].elements = [
    {
      id: uuid(),
      type: 'text',
      x: 80, y: 280,
      width: 440, height: 60,
      rotation: 0,
      zIndex: 1,
      properties: {
        content: 'Portfolio',
        fontFamily: 'Playfair Display',
        fontSize: 42,
        color: '#86636A',
        textAlign: 'center',
        fontWeight: '600'
      }
    },
    {
      id: uuid(),
      type: 'text',
      x: 160, y: 360,
      width: 280, height: 30,
      rotation: 0,
      zIndex: 2,
      properties: {
        content: 'Selected Works · 2024',
        fontFamily: 'Inter',
        fontSize: 13,
        color: '#B08F95',
        textAlign: 'center',
        letterSpacing: '0.12em'
      }
    }
  ];
  return data;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin',
    },
  });
  console.log('✓ Admin user created:', admin.email);

  // Create demo customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'demo@photobook.local' },
    update: {},
    create: {
      email: 'demo@photobook.local',
      password: customerPassword,
      name: 'Demo Customer',
      role: 'customer',
    },
  });
  console.log('✓ Demo customer created:', customer.email);

  // Create templates
  const templates = [
    {
      name: 'Romantic Wedding',
      description: 'An elegant, minimal design for your most precious day. Blush tones and serif typography create a timeless keepsake.',
      category: 'wedding',
      designData: JSON.stringify(createWeddingTemplate()),
      isFeatured: true,
      createdById: admin.id,
    },
    {
      name: 'Wanderlust Journal',
      description: 'Document your travels with this earthy, editorial layout. Clean lines and generous whitespace let your photos breathe.',
      category: 'travel',
      designData: JSON.stringify(createTravelTemplate()),
      isFeatured: true,
      createdById: admin.id,
    },
    {
      name: "Baby's First Year",
      description: 'Capture every milestone in soft, warm tones. Designed for parents who want something more refined than a scrapbook.',
      category: 'baby',
      designData: JSON.stringify(createBabyTemplate()),
      isFeatured: true,
      createdById: admin.id,
    },
    {
      name: 'Creative Portfolio',
      description: 'A large-format, gallery-style book for photographers, artists, and designers. Glossy paper, wide margins, minimal distraction.',
      category: 'portfolio',
      designData: JSON.stringify(createPortfolioTemplate()),
      isFeatured: false,
      createdById: admin.id,
    },
  ];

  for (const t of templates) {
    await prisma.template.create({ data: t });
  }
  console.log('✓ 4 templates created');

  // Create pricing rules
  const pricingRules = [
    // Base prices by size
    { category: 'base_price', name: '8×8 inch', value: 999, unit: 'flat', description: 'Base price for 8×8 inch book', metadata: JSON.stringify({ size: '8x8' }) },
    { category: 'base_price', name: '10×10 inch', value: 1499, unit: 'flat', description: 'Base price for 10×10 inch book', metadata: JSON.stringify({ size: '10x10' }) },
    { category: 'base_price', name: '12×12 inch', value: 1999, unit: 'flat', description: 'Base price for 12×12 inch book', metadata: JSON.stringify({ size: '12x12' }) },
    // Per-page cost
    { category: 'per_page', name: 'Additional Page', value: 49, unit: 'per_page', description: 'Cost per additional page beyond base 20', metadata: null },
    // Cover types
    { category: 'cover_type', name: 'Hardcover', value: 0, unit: 'flat', description: 'Standard hardcover (included)', metadata: JSON.stringify({ coverType: 'hardcover' }) },
    { category: 'cover_type', name: 'Softcover', value: -200, unit: 'flat', description: 'Softcover discount', metadata: JSON.stringify({ coverType: 'softcover' }) },
    { category: 'cover_type', name: 'Leather', value: 800, unit: 'flat', description: 'Premium leather cover', metadata: JSON.stringify({ coverType: 'leather' }) },
    // Paper types
    { category: 'paper_type', name: 'Matte', value: 0, unit: 'flat', description: 'Standard matte paper (included)', metadata: JSON.stringify({ paperType: 'matte' }) },
    { category: 'paper_type', name: 'Glossy', value: 200, unit: 'flat', description: 'Glossy paper upgrade', metadata: JSON.stringify({ paperType: 'glossy' }) },
    { category: 'paper_type', name: 'Silk', value: 400, unit: 'flat', description: 'Premium silk paper', metadata: JSON.stringify({ paperType: 'silk' }) },
  ];

  for (const rule of pricingRules) {
    await prisma.pricingRule.create({ data: rule });
  }
  console.log('✓ Pricing rules created');

  // Create a promo code
  await prisma.promoCode.create({
    data: {
      code: 'WELCOME20',
      description: '20% off your first order',
      discountType: 'percentage',
      discountValue: 20,
      maxUses: 100,
    },
  });
  console.log('✓ Promo code WELCOME20 created');

  console.log('\n🎉 Seed complete!');
  console.log('   Admin login: admin@gmail.com / admin123');
  console.log('   Customer login: demo@photobook.local / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
