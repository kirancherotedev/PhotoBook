import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuid } from 'uuid';

// POST /api/payments/create-session - Create a payment session for an order
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== user.userId) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Order is not in pending status' }, { status: 400 });
    }

    const sessionId = `pay_${uuid().replace(/-/g, '').slice(0, 16)}`;

    const payment = await prisma.payment.create({
      data: {
        sessionId,
        status: 'pending',
        amount: order.total,
        method: 'dummy',
        orderId: order.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: payment.sessionId,
        amount: payment.amount,
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error('Payment session error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
