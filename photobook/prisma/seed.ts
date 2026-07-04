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

  // Clear existing templates and pricing rules to allow re-seeding
  await prisma.template.deleteMany({});
  await prisma.pricingRule.deleteMany({});

  const PRODUCT_IMAGES = [
    "Best Moments.png",
    "Little Joys.png",
    "Mini PhotoBook.png",
    "Our Story.png",
    "Picture Perfect.png",
    "You & Me  Timeless.png"
  ];

  const photobookCoversRegistry = [
    {
      "fileName": "You & Me  Timeless.png",
      "templateId": "single_image_timeless",
      "canvas": { "width": 1200, "height": 1200 },
      "textBoxes": [
        { "id": "category", "x": 450, "y": 200, "width": 300, "height": 40 },
        { "id": "title", "x": 200, "y": 250, "width": 800, "height": 120 },
        { "id": "footer", "x": 300, "y": 950, "width": 600, "height": 40 }
      ],
      "imageBoxes": [
        { "id": "photo1", "x": 250, "y": 400, "width": 700, "height": 480 }
      ]
    },
    {
      "fileName": "Best Moments.png",
      "templateId": "five_image_asymmetrical",
      "canvas": { "width": 1200, "height": 1200 },
      "textBoxes": [
        { "id": "category", "x": 450, "y": 150, "width": 300, "height": 30 },
        { "id": "title", "x": 200, "y": 200, "width": 800, "height": 90 },
        { "id": "subtitle", "x": 300, "y": 300, "width": 600, "height": 30 },
        { "id": "footer", "x": 300, "y": 1020, "width": 600, "height": 40 }
      ],
      "imageBoxes": [
        { "id": "photo1", "x": 120, "y": 360, "width": 630, "height": 300 },
        { "id": "photo2", "x": 770, "y": 360, "width": 310, "height": 300 },
        { "id": "photo3", "x": 120, "y": 680, "width": 310, "height": 300 },
        { "id": "photo4", "x": 450, "y": 680, "width": 300, "height": 300 },
        { "id": "photo5", "x": 770, "y": 680, "width": 310, "height": 300 }
      ]
    },
    {
      "fileName": "Little Joys.png",
      "templateId": "nine_image_grid_v2",
      "canvas": { "width": 1200, "height": 1200 },
      "textBoxes": [
        { "id": "category", "x": 400, "y": 100, "width": 400, "height": 30 },
        { "id": "title", "x": 200, "y": 150, "width": 800, "height": 90 },
        { "id": "subtitle", "x": 300, "y": 250, "width": 600, "height": 40 },
        { "id": "footer", "x": 300, "y": 1030, "width": 600, "height": 40 }
      ],
      "imageBoxes": [
        { "id": "photo1", "x": 120, "y": 320, "width": 306, "height": 210 },
        { "id": "photo2", "x": 446, "y": 320, "width": 308, "height": 210 },
        { "id": "photo3", "x": 774, "y": 320, "width": 306, "height": 210 },
        { "id": "photo4", "x": 120, "y": 550, "width": 306, "height": 210 },
        { "id": "photo5", "x": 446, "y": 550, "width": 308, "height": 210 },
        { "id": "photo6", "x": 774, "y": 550, "width": 306, "height": 210 },
        { "id": "photo7", "x": 120, "y": 780, "width": 306, "height": 210 },
        { "id": "photo8", "x": 446, "y": 780, "width": 308, "height": 210 },
        { "id": "photo9", "x": 774, "y": 780, "width": 306, "height": 210 }
      ]
    },
    {
      "fileName": "Mini PhotoBook.png",
      "templateId": "single_image_timeless",
      "canvas": { "width": 1200, "height": 1200 },
      "textBoxes": [
        { "id": "category", "x": 450, "y": 200, "width": 300, "height": 40 },
        { "id": "title", "x": 200, "y": 250, "width": 800, "height": 120 },
        { "id": "footer", "x": 300, "y": 950, "width": 600, "height": 40 }
      ],
      "imageBoxes": [
        { "id": "photo1", "x": 250, "y": 400, "width": 700, "height": 480 }
      ]
    },
    {
      "fileName": "Our Story.png",
      "templateId": "six_image_grid",
      "canvas": { "width": 1200, "height": 1200 },
      "textBoxes": [
        { "id": "category", "x": 450, "y": 150, "width": 300, "height": 30 },
        { "id": "title", "x": 200, "y": 200, "width": 800, "height": 90 },
        { "id": "subtitle", "x": 300, "y": 300, "width": 600, "height": 30 },
        { "id": "footer", "x": 300, "y": 1020, "width": 600, "height": 40 }
      ],
      "imageBoxes": [
        { "id": "photo1", "x": 120, "y": 360, "width": 306, "height": 300 },
        { "id": "photo2", "x": 446, "y": 360, "width": 308, "height": 300 },
        { "id": "photo3", "x": 774, "y": 360, "width": 306, "height": 300 },
        { "id": "photo4", "x": 120, "y": 680, "width": 306, "height": 300 },
        { "id": "photo5", "x": 446, "y": 680, "width": 308, "height": 300 },
        { "id": "photo6", "x": 774, "y": 680, "width": 306, "height": 300 }
      ]
    },
    {
      "fileName": "Picture Perfect.png",
      "templateId": "nine_image_masonry",
      "canvas": { "width": 1200, "height": 1200 },
      "textBoxes": [
        { "id": "category", "x": 400, "y": 100, "width": 400, "height": 30 },
        { "id": "title", "x": 200, "y": 150, "width": 800, "height": 90 },
        { "id": "subtitle", "x": 300, "y": 250, "width": 600, "height": 40 },
        { "id": "footer", "x": 300, "y": 1050, "width": 600, "height": 40 }
      ],
      "imageBoxes": [
        { "id": "photo1", "x": 120, "y": 320, "width": 340, "height": 220 },
        { "id": "photo2", "x": 470, "y": 320, "width": 270, "height": 220 },
        { "id": "photo3", "x": 750, "y": 320, "width": 330, "height": 220 },
        { "id": "photo4", "x": 120, "y": 550, "width": 270, "height": 220 },
        { "id": "photo5", "x": 400, "y": 550, "width": 400, "height": 220 },
        { "id": "photo6", "x": 810, "y": 550, "width": 270, "height": 220 },
        { "id": "photo7", "x": 120, "y": 780, "width": 340, "height": 220 },
        { "id": "photo8", "x": 470, "y": 780, "width": 270, "height": 220 },
        { "id": "photo9", "x": 750, "y": 780, "width": 330, "height": 220 }
      ]
    }
  ];

  function createRegistryTemplate(name: string, filename: string) {
    const registryEntry = photobookCoversRegistry.find(r => r.fileName === filename);
    const data = createDefaultDesignData(20);
    
    // Scale down from 1200 to our editor default canvas (480x480).
    const scale = 480 / 1200;
    
    data.pages[0].background = { type: 'color', value: '#F5F0EB' }; // generic warm color
    data.pages[0].elements = [];
    
    if (registryEntry) {
      let zIdx = 1;
      // Map text boxes
      for (const tbox of registryEntry.textBoxes) {
        let content = name;
        let fontSize = 32;
        let fontFamily = 'Playfair Display';
        let color = '#86636A';
        
        if (tbox.id === 'category') { content = 'CATEGORY'; fontSize = 24; fontFamily = 'Inter'; color = '#888888'; }
        if (tbox.id === 'title') { content = name.toUpperCase(); fontSize = 64; fontFamily = 'Playfair Display'; color = '#111111'; }
        if (tbox.id === 'subtitle') { content = 'A beautiful journey together'; fontSize = 28; fontFamily = 'Inter'; color = '#666666'; }
        if (tbox.id === 'footer') { content = 'Our favorite moments'; fontSize = 20; fontFamily = 'Inter'; color = '#888888'; }

        data.pages[0].elements.push({
          id: uuid(),
          type: 'text',
          x: tbox.x * scale,
          y: tbox.y * scale,
          width: tbox.width * scale,
          height: tbox.height * scale,
          rotation: 0,
          zIndex: zIdx++,
          properties: {
            content,
            fontFamily,
            fontSize: fontSize * scale,
            color,
            textAlign: 'center',
            fontWeight: '600'
          }
        });
      }
      
      // Map image boxes
      for (const ibox of registryEntry.imageBoxes) {
        data.pages[0].elements.push({
          id: uuid(),
          type: 'image',
          x: ibox.x * scale,
          y: ibox.y * scale,
          width: ibox.width * scale,
          height: ibox.height * scale,
          rotation: 0,
          zIndex: zIdx++,
          properties: {
            src: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==', // 1x1 grey pixel
          }
        });
      }
    } else {
      // Fallback
      data.pages[0].elements = [
        {
          id: uuid(), type: 'image', x: 100, y: 100, width: 400, height: 400, rotation: 0, zIndex: 1,
          properties: { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==' }
        },
        {
          id: uuid(), type: 'text', x: 100, y: 530, width: 400, height: 60, rotation: 0, zIndex: 2,
          properties: { content: name, fontFamily: 'Playfair Display', fontSize: 32, color: '#86636A', textAlign: 'center', fontWeight: '600' }
        }
      ];
    }
    
    // cast to any to bypass strict type matching on properties if needed
    data.pages[0].elements = data.pages[0].elements as any;
    return data;
  }

  // Generate templates from product images
  const templates = PRODUCT_IMAGES.map((filename) => {
    // Strip numbers at start and .png at end
    const rawName = filename.replace(/^\d+/, '').replace(/\.png$/, '').trim();
    // Use rawName if it exists, otherwise filename
    const name = rawName || filename;
    
    const designDataObj = createRegistryTemplate(name, filename);
    
    return {
      name,
      description: `Preset template for ${name}`,
      category: 'photobook',
      designData: JSON.stringify(designDataObj),
      isFeatured: true,
      thumbnail: `/products/${filename}`,
      createdById: admin.id,
    };
  });

  for (const t of templates) {
    await prisma.template.create({ data: t });
  }
  console.log(`✓ ${templates.length} preset templates created`);

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
  await prisma.promoCode.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
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
