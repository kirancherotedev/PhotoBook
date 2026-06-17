'use client';

import { useEffect, useState } from 'react';
import { Search, Users, ShoppingBag, BookOpen } from 'lucide-react';

interface Customer {
  id: string; name: string; email: string; phone: string | null;
  createdAt: string;
  _count: { orders: number; projects: number };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = (q?: string) => {
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    fetch(`/api/admin/customers?${params}`)
      .then(r => r.json())
      .then(d => { if (d.success) setCustomers(d.data); setLoading(false); });
  };

  useEffect(() => { fetchCustomers(); }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page-enter">
      <div className="admin-header">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)' }}>Customers</h1>
        <span style={{ fontSize: 13, color: 'var(--blush-600)' }}>{customers.length} registered customers</span>
      </div>

      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 24 }}>
        <Search size={14} color="var(--blush-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="input" placeholder="Search by name or email..."
          style={{ paddingLeft: 34 }}
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchCustomers(search)}
        />
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 8 }} />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Projects</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--blush-200)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 600, color: 'var(--blush-900)',
                      }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--blush-600)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted" style={{ fontSize: 13 }}>{c.phone || '—'}</td>
                  <td className="text-muted" style={{ fontSize: 13 }}>{formatDate(c.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <BookOpen size={12} color="var(--blush-600)" /> {c._count.projects}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <ShoppingBag size={12} color="var(--blush-600)" /> {c._count.orders}
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--blush-600)' }}>No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
