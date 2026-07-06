import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/sizes - Fetch all active book sizes (public)
export async function GET() {
  try {
    const sizes = await prisma.bookSize.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { widthIn: 'asc' },
      ],
    });
    return NextResponse.json({ success: true, data: sizes });
  } catch (error) {
    console.error('Fetch sizes error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
