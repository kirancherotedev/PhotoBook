'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  LayoutDashboard, ShoppingBag, Users, BookOpen, DollarSign,
  FileText, LogOut, BookOpenCheck,
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { href: '/admin/orders', icon: <ShoppingBag size={16} />, label: 'Orders' },
  { href: '/admin/customers', icon: <Users size={16} />, label: 'Customers' },
  { href: '/admin/templates', icon: <BookOpen size={16} />, label: 'Templates' },
  { href: '/admin/pricing', icon: <DollarSign size={16} />, label: 'Pricing' },
  { href: '/admin/audit', icon: <FileText size={16} />, label: 'Audit Log' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <div style={{ padding: '0 24px 24px', borderBottom: '0.5px solid var(--blush-400)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpenCheck size={20} color="var(--blush-900)" />
            <span style={{
              fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, color: 'var(--blush-900)',
            }}>Admin Panel</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '0.5px solid var(--blush-400)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--blush-900)', marginBottom: 2 }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--blush-600)', marginBottom: 12 }}>
            {user?.email}
          </div>
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
