'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { Package, Eye, Clock } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'pending', paid: 'paid', in_production: 'production',
  printed: 'production', shipped: 'shipped', delivered: 'delivered',
  cancelled: 'cancelled', refunded: 'cancelled',
};

export default function MyOrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/orders')
        .then(r => r.json())
        .then(d => { if (d.success) setOrders(d.data); setLoading(false); });
    }
  }, [isAuthenticated]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <Navbar />
      <div className="container page-enter" style={{ padding: '48px 24px 80px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--blush-900)', marginBottom: 32 }}>
          My Orders
        </h1>

        {loading ? (
          <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Package size={48} color="var(--blush-400)" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 15, color: 'var(--blush-600)' }}>No orders yet. Start by creating a photobook!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 500 }}>{order.orderNumber}</td>
                    <td className="text-muted"><Clock size={12} style={{ marginRight: 4, verticalAlign: -1 }} />{formatDate(order.createdAt)}</td>
                    <td><span className={`badge badge-${statusColors[order.status] || 'pending'}`}>{order.status.replace('_', ' ')}</span></td>
                    <td style={{ fontWeight: 500 }}>₹{order.total}</td>
                    <td>
                      <button onClick={() => router.push(`/checkout/confirmation?orderId=${order.id}`)} className="btn btn-ghost btn-sm">
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
