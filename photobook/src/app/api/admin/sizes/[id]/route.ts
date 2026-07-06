import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

async function checkAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') {
    return false;
  }
  return true;
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    const size = await prisma.bookSize.update({
      where: { id },
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
    console.error('Update size error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update size' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const params = await props.params;
    const { id } = params;
    await prisma.bookSize.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete size error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete size' }, { status: 500 });
  }
}
