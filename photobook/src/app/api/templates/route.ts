import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET /api/templates - List all public templates (or all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const user = await getAuthUser();

    const where: Record<string, unknown> = {};

    // Non-admin users only see public templates
    if (!user || user.role !== 'admin') {
      where.isPublic = true;
    }
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;

    const templates = await prisma.template.findMany({
      where,
      include: { createdBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('Templates GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/templates - Create a template (admin or any authenticated user)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, designData, isPublic, thumbnail } = body;

    if (!name || !category || !designData) {
      return NextResponse.json({ success: false, error: 'Name, category, and design data are required' }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        name,
        description: description || '',
        category,
        designData: typeof designData === 'string' ? designData : JSON.stringify(designData),
        isPublic: user.role === 'admin' ? (isPublic !== false) : false, // Users' templates are private by default
        isFeatured: false,
        thumbnail: thumbnail || null,
        createdById: user.userId,
      },
    });

    // Audit log for admin
    if (user.role === 'admin') {
      await prisma.auditLog.create({
        data: {
          action: 'create',
          entity: 'template',
          entityId: template.id,
          details: JSON.stringify({ name: template.name }),
          userId: user.userId,
        },
      });
    }

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error('Template create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
