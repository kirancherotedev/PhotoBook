import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// Middleware to check admin access
async function checkAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') {
    return false;
  }
  return true;
}

// GET /api/admin/sizes - Fetch all book sizes (admin)
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const sizes = await prisma.bookSize.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: sizes });
  } catch (error) {
    console.error('Fetch admin sizes error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/sizes - Create a new book size
export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const size = await prisma.bookSize.create({
      data: {
        name: body.name,
        label: body.label,
        category: body.category,
        desc: body.desc,
        widthIn: parseFloat(body.widthIn),
        heightIn: parseFloat(body.heightIn),
        screenW: parseInt(body.screenW),
        screenH: parseInt(body.screenH),
        printW: parseInt(body.printW),
        printH: parseInt(body.printH),
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, data: size });
  } catch (error) {
    console.error('Create size error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create size' }, { status: 500 });
  }
}
