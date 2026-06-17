'use client';

import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, BookOpen, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalTemplates: number;
  totalProjects: number;
  ordersByStatus: Record<string, number>;
  recentOrders: { id: string; orderNumber: string; total: number; status: string; createdAt: string; user?: { name: string } }[];
}

const statusColors: Record<string, string> = {
  pending: 'pending', paid: 'paid', in_production: 'production',
  shipped: 'shipped', delivered: 'delivered',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); setLoading(false); });
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });

  if (loading || !stats) {
    return (
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)', marginBottom: 32 }}>Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 8 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="admin-header">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)' }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>Overview of your photobook business</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <div className="stat-card">
          <h4><DollarSign size={12} style={{ verticalAlign: -1, marginRight: 4 }} />Revenue</h4>
          <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-change"><TrendingUp size={11} style={{ verticalAlign: -1, marginRight: 2 }} /> From paid orders</div>
        </div>
        <div className="stat-card">
          <h4><ShoppingBag size={12} style={{ verticalAlign: -1, marginRight: 4 }} />Orders</h4>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-change">{stats.ordersByStatus.pending || 0} pending</div>
        </div>
        <div className="stat-card">
          <h4><Users size={12} style={{ verticalAlign: -1, marginRight: 4 }} />Customers</h4>
          <div className="stat-value">{stats.totalCustomers}</div>
          <div className="stat-change">{stats.totalProjects} projects created</div>
        </div>
        <div className="stat-card">
          <h4><BookOpen size={12} style={{ verticalAlign: -1, marginRight: 4 }} />Templates</h4>
          <div className="stat-value">{stats.totalTemplates}</div>
          <div className="stat-change">Available in gallery</div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card-surface">
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--blush-900)', marginBottom: 20 }}>Orders by Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`badge badge-${statusColors[status] || 'pending'}`} style={{ minWidth: 90, textAlign: 'center' }}>
                  {status.replace('_', ' ')}
                </span>
                <div style={{ flex: 1, height: 6, background: 'var(--blush-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${stats.totalOrders ? (count / stats.totalOrders) * 100 : 0}%`,
                    background: 'var(--blush-200)', borderRadius: 3, minWidth: count > 0 ? 4 : 0,
                  }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--blush-900)', minWidth: 24, textAlign: 'right' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card-surface">
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--blush-900)', marginBottom: 20 }}>Recent Orders</h4>
          {stats.recentOrders.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>No orders yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.recentOrders.map(order => (
                <div key={order.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '0.5px solid var(--blush-400)',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--blush-900)' }}>{order.orderNumber}</div>
                    <div style={{ fontSize: 11, color: 'var(--blush-600)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} /> {formatDate(order.createdAt)} · {order.user?.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--blush-900)' }}>₹{order.total}</div>
                    <span className={`badge badge-${statusColors[order.status] || 'pending'}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
