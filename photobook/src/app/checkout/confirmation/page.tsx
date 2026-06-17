'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  const [order, setOrder] = useState<{
    orderNumber: string; total: number; status: string;
    items: { label: string; amount: number }[];
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    if (!orderId) { router.push('/'); return; }
    fetch(`/api/orders/${orderId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setOrder(d.data); });
  }, [orderId, router]);

  if (!order) {
    return <div className="checkout-layout"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></div>;
  }

  return (
    <div className="checkout-layout page-enter" style={{ textAlign: 'center', maxWidth: 560 }}>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ marginBottom: 24 }}
      >
        <CheckCircle size={64} color="#059669" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--blush-900)', marginBottom: 8 }}
      >
        Order Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontSize: 15, color: 'var(--blush-600)', marginBottom: 32 }}
      >
        Thank you for your order. Your photobook is being prepared.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card" style={{ textAlign: 'left', marginBottom: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--blush-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Number</p>
            <p style={{ fontSize: 18, fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--blush-900)' }}>{order.orderNumber}</p>
          </div>
          <span className="badge badge-paid">Paid</span>
        </div>

        <hr className="divider" style={{ margin: '16px 0' }} />

        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0' }}>
            <span className="text-muted">{item.label}</span>
            <span style={{ color: item.amount < 0 ? '#059669' : 'var(--blush-900)' }}>
              {item.amount < 0 ? '-' : ''}₹{Math.abs(item.amount)}
            </span>
          </div>
        ))}

        <hr className="divider" style={{ margin: '16px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600 }}>
          <span>Total Paid</span>
          <span style={{ fontFamily: 'var(--font-serif)' }}>₹{order.total}</span>
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link href="/my-orders" className="btn btn-outline">
          <Package size={14} /> View Orders
        </Link>
        <Link href="/templates" className="btn btn-primary">
          <BookOpen size={14} /> Create Another Book <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="checkout-layout"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></div>}>
        <ConfirmationContent />
      </Suspense>
    </>
  );
}
