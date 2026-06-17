import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET /api/orders - List orders (customer sees their own, admin sees all)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (user.role !== 'admin') {
      where.userId = user.userId;
    }
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/orders - Create an order from a project
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, shippingAddress, deliverySpeed, promoCode } = body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== user.userId) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    // Calculate price server-side
    const designData = JSON.parse(project.designData);
    const pricingRes = await fetch(new URL('/api/pricing/calculate', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ designData, promoCode }),
    });
    const pricingResult = await pricingRes.json();
    const pricing = pricingResult.data;

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `PB-${String(orderCount + 1001).padStart(6, '0')}`;

    // Determine shipping cost based on delivery speed
    const shippingCost = deliverySpeed === 'express' ? 199 : 99;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'pending',
        designSnapshot: project.designData,
        subtotal: pricing.subtotal,
        shippingCost,
        discount: pricing.discount,
        total: pricing.subtotal - pricing.discount + shippingCost,
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
        deliverySpeed: deliverySpeed || 'standard',
        userId: user.userId,
        projectId: project.id,
        items: {
          create: [
            { label: `Base Price (${pricing.basePriceLabel})`, amount: pricing.basePrice },
            ...(pricing.extraPages > 0 ? [{ label: `Extra Pages (${pricing.extraPages} pages)`, amount: pricing.perPageCost }] : []),
            ...(pricing.coverSurcharge !== 0 ? [{ label: `Cover: ${pricing.coverLabel}`, amount: pricing.coverSurcharge }] : []),
            ...(pricing.paperSurcharge !== 0 ? [{ label: `Paper: ${pricing.paperLabel}`, amount: pricing.paperSurcharge }] : []),
            { label: 'Shipping', amount: shippingCost },
            ...(pricing.discount > 0 ? [{ label: `Discount: ${pricing.discountLabel}`, amount: -pricing.discount }] : []),
          ],
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
