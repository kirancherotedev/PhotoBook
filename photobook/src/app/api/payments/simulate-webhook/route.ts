import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/payments/simulate-webhook
// Simulates what Razorpay's server-to-server webhook would do.
// In production, this endpoint would verify Razorpay's webhook signature.
export async function POST(request: NextRequest) {
  try {
    const { sessionId, status } = await request.json();

    if (!sessionId || !['success', 'failure'].includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'sessionId and status (success/failure) are required',
      }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { sessionId },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment session not found' }, { status: 404 });
    }

    if (payment.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Payment already processed' }, { status: 400 });
    }

    if (status === 'success') {
      // Mark payment as confirmed
      await prisma.payment.update({
        where: { sessionId },
        data: {
          status: 'confirmed',
          gatewayRef: `dummy_${Date.now()}`,
        },
      });

      // Update order status to paid and lock the project
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'paid' },
      });

      // Lock the project so the design can't be edited after payment
      await prisma.project.update({
        where: { id: payment.order.projectId },
        data: { status: 'locked' },
      });

      return NextResponse.json({
        success: true,
        data: { paymentStatus: 'confirmed', orderStatus: 'paid' },
        message: 'Payment confirmed. Order is now paid and design is locked.',
      });
    } else {
      // Mark payment as failed
      await prisma.payment.update({
        where: { sessionId },
        data: { status: 'failed' },
      });

      return NextResponse.json({
        success: true,
        data: { paymentStatus: 'failed', orderStatus: 'pending' },
        message: 'Payment failed. Order remains pending.',
      });
    }
  } catch (error) {
    console.error('Webhook simulation error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
