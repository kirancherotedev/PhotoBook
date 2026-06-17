import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET /api/templates/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const template = await prisma.template.findUnique({
      where: { id },
      include: { createdBy: { select: { name: true } } },
    });
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error('Template GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/templates/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    // Only admin or the creator can edit
    if (user.role !== 'admin' && template.createdById !== user.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.template.update({
      where: { id },
      data: {
        name: body.name ?? template.name,
        description: body.description ?? template.description,
        category: body.category ?? template.category,
        designData: body.designData ? (typeof body.designData === 'string' ? body.designData : JSON.stringify(body.designData)) : template.designData,
        isPublic: body.isPublic ?? template.isPublic,
        isFeatured: user.role === 'admin' ? (body.isFeatured ?? template.isFeatured) : template.isFeatured,
        thumbnail: body.thumbnail ?? template.thumbnail,
      },
    });

    if (user.role === 'admin') {
      await prisma.auditLog.create({
        data: {
          action: 'update',
          entity: 'template',
          entityId: id,
          details: JSON.stringify({ changes: Object.keys(body) }),
          userId: user.userId,
        },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Template update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/templates/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && template.createdById !== user.userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await prisma.template.delete({ where: { id } });

    if (user.role === 'admin') {
      await prisma.auditLog.create({
        data: {
          action: 'delete',
          entity: 'template',
          entityId: id,
          details: JSON.stringify({ name: template.name }),
          userId: user.userId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Template delete error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
