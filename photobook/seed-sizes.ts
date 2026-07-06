import prisma from './src/lib/prisma';

const DPI = 300;

const seedSizes = [
  // Square
  { name: '6x6', label: '6×6″ Small Square', category: 'Square', desc: 'Mini format', widthIn: 6, heightIn: 6, screenW: 400, screenH: 400, printW: 6*DPI, printH: 6*DPI, isActive: true },
  { name: '8x8', label: '8×8″ Medium Square', category: 'Square', desc: 'Perfect for Instagram photos', widthIn: 8, heightIn: 8, screenW: 480, screenH: 480, printW: 8*DPI, printH: 8*DPI, isActive: true },
  { name: '10x10', label: '10×10″ Large Square', category: 'Square', desc: 'Our most popular size', widthIn: 10, heightIn: 10, screenW: 540, screenH: 540, printW: 10*DPI, printH: 10*DPI, isActive: true },
  { name: '12x12', label: '12×12″ XL Square', category: 'Square', desc: 'Premium format', widthIn: 12, heightIn: 12, screenW: 600, screenH: 600, printW: 12*DPI, printH: 12*DPI, isActive: true },
  // Landscape
  { name: '11x8', label: '11×8″ Landscape', category: 'Landscape', desc: 'Great for panoramic shots', widthIn: 11, heightIn: 8, screenW: 580, screenH: 420, printW: 11*DPI, printH: 8*DPI, isActive: true },
  { name: '14x11', label: '14×11″ Large Landscape', category: 'Landscape', desc: 'Stunning double-page spreads', widthIn: 14, heightIn: 11, screenW: 620, screenH: 490, printW: 14*DPI, printH: 11*DPI, isActive: true },
  // Portrait
  { name: '8x11', label: '8×11″ Portrait', category: 'Portrait', desc: 'Classic photobook feel', widthIn: 8, heightIn: 11, screenW: 420, screenH: 580, printW: 8*DPI, printH: 11*DPI, isActive: true },
  { name: '11x14', label: '11×14″ Large Portrait', category: 'Portrait', desc: 'Elegant vertical format', widthIn: 11, heightIn: 14, screenW: 490, screenH: 620, printW: 11*DPI, printH: 14*DPI, isActive: true },
  // Standard paper sizes
  { name: 'A5', label: 'A5 (5.8×8.3″)', category: 'Standard', desc: 'Standard printer paper size', widthIn: 5.83, heightIn: 8.27, screenW: 410, screenH: 580, printW: Math.round(5.83*DPI), printH: Math.round(8.27*DPI), isActive: true },
  { name: 'A4', label: 'A4 (8.3×11.7″)', category: 'Standard', desc: 'Standard printer paper size', widthIn: 8.27, heightIn: 11.69, screenW: 440, screenH: 620, printW: Math.round(8.27*DPI), printH: Math.round(11.69*DPI), isActive: true },
  { name: 'A3', label: 'A3 (11.7×16.5″)', category: 'Standard', desc: 'Standard printer paper size', widthIn: 11.69, heightIn: 16.54, screenW: 460, screenH: 650, printW: Math.round(11.69*DPI), printH: Math.round(16.54*DPI), isActive: true },
];

async function main() {
  for (const size of seedSizes) {
    await prisma.bookSize.upsert({
      where: { name: size.name },
      update: size,
      create: size,
    });
  }
  console.log('Seeded book sizes');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
