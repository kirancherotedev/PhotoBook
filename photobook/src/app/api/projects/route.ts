import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

// GET /api/projects - List user's projects
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.userId },
      include: { template: { select: { name: true, category: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, templateId } = body;

    let designData: string;

    if (templateId) {
      const template = await prisma.template.findUnique({ where: { id: templateId } });
      if (!template) {
        return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
      }
      designData = template.designData;
    } else {
      // Blank project with default design data
      const defaultPages = [];
      defaultPages.push({
        id: uuid(),
        type: 'front_cover',
        background: { type: 'color', value: '#FFFFFF' },
        elements: [],
      });
      for (let i = 0; i < 20; i++) {
        defaultPages.push({
          id: uuid(),
          type: 'content',
          background: { type: 'color', value: '#FFFFFF' },
          elements: [],
        });
      }
      defaultPages.push({
        id: uuid(),
        type: 'back_cover',
        background: { type: 'color', value: '#FFFFFF' },
        elements: [],
      });
      designData = JSON.stringify({
        bookConfig: {
          size: '8x8',
          coverType: 'hardcover',
          paperType: 'matte',
          pageCount: 20,
        },
        pages: defaultPages,
      });
    }

    const project = await prisma.project.create({
      data: {
        name: name || 'Untitled Book',
        designData,
        userId: user.userId,
        templateId: templateId || null,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Project create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
