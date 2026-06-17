'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { Search, Eye, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string; orderNumber: string; status: string; total: number;
  createdAt: string; user?: { name: string; email: string };
}

const statuses = ['all', 'pending', 'paid', 'in_production', 'printed', 'shipped', 'delivered', 'cancelled', 'refunded'];
const statusColors: Record<string, string> = {
  pending: 'pending', paid: 'paid', in_production: 'production',
  printed: 'production', shipped: 'shipped', delivered: 'delivered',
  cancelled: 'cancelled', refunded: 'cancelled',
};

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = () => {
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search) params.set('search', search);
    fetch(`/api/orders?${params}`)
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.data); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const d = await res.json();
    if (d.success) {
      showToast(`Order updated to ${newStatus}`, 'success');
      fetchOrders();
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page-enter">
      <div className="admin-header">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)' }}>Orders</h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
          <Search size={14} color="var(--blush-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input" placeholder="Search orders..."
            style={{ paddingLeft: 34 }}
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchOrders()}
          />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize', fontSize: 12 }}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 8 }} />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.orderNumber}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{order.user?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--blush-600)' }}>{order.user?.email}</div>
                  </td>
                  <td className="text-muted" style={{ fontSize: 13 }}>{formatDate(order.createdAt)}</td>
                  <td style={{ fontWeight: 500 }}>₹{order.total}</td>
                  <td><span className={`badge badge-${statusColors[order.status] || 'pending'}`}>{order.status.replace('_', ' ')}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <select
                        className="input" style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {statuses.filter(s => s !== 'all').map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--blush-600)' }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
