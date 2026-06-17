import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      inProductionOrders,
      shippedOrders,
      deliveredOrders,
      totalCustomers,
      totalTemplates,
      totalProjects,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.count({ where: { status: 'in_production' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.order.count({ where: { status: 'delivered' } }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.template.count(),
      prisma.project.count(),
    ]);

    // Calculate revenue from paid/completed orders
    const revenueResult = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['paid', 'in_production', 'printed', 'shipped', 'delivered'] } },
    });

    const totalRevenue = revenueResult._sum.total || 0;

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    // Orders by status for chart
    const ordersByStatus = {
      pending: pendingOrders,
      paid: paidOrders,
      in_production: inProductionOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
    };

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalTemplates,
        totalProjects,
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
