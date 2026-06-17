import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET /api/admin/pricing-rules
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const rules = await prisma.pricingRule.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, data: rules });
  } catch (error) {
    console.error('Pricing rules GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/pricing-rules
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { category, name, description, value, unit, metadata } = body;

    const rule = await prisma.pricingRule.create({
      data: {
        category,
        name,
        description: description || '',
        value,
        unit: unit || 'flat',
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'create',
        entity: 'pricing_rule',
        entityId: rule.id,
        details: JSON.stringify({ name, category, value }),
        userId: user.userId,
      },
    });

    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    console.error('Pricing rule create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// PUT /api/admin/pricing-rules - Update a rule
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    const rule = await prisma.pricingRule.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'update',
        entity: 'pricing_rule',
        entityId: id,
        details: JSON.stringify(data),
        userId: user.userId,
      },
    });

    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    console.error('Pricing rule update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
