'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { PriceBreakdown, DesignData } from '@/lib/types';
import { ShoppingCart, ArrowRight, Pencil, Tag } from 'lucide-react';

function CartContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [pricing, setPricing] = useState<PriceBreakdown | null>(null);
  const [designData, setDesignData] = useState<DesignData | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (!projectId) { router.push('/my-projects'); return; }
    fetch(`/api/projects/${projectId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const data = JSON.parse(d.data.designData) as DesignData;
          setDesignData(data);
          setProjectName(d.data.name);
          return fetch('/api/pricing/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ designData: data }),
          });
        }
        throw new Error('Project not found');
      })
      .then(r => r!.json())
      .then(d => { if (d.success) setPricing(d.data); setLoading(false); })
      .catch(() => { showToast('Failed to load project', 'error'); setLoading(false); });
  }, [projectId, router, showToast]);

  const handleApplyPromo = async () => {
    if (!promoCode || !designData) return;
    const res = await fetch('/api/pricing/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ designData, promoCode }),
    });
    const d = await res.json();
    if (d.success && d.data.discount > 0) {
      setPricing(d.data);
      setAppliedPromo(promoCode);
      showToast('Promo code applied!', 'success');
    } else {
      showToast('Invalid or expired promo code', 'error');
    }
  };

  if (loading) {
    return (
      <div className="checkout-layout">
        <div className="skeleton" style={{ height: 400, borderRadius: 8 }} />
      </div>
    );
  }

  return (
    <div className="checkout-layout page-enter">
      {/* Steps */}
      <div className="checkout-steps">
        <div className="checkout-step active"><span className="step-number">1</span> Cart</div>
        <div className="step-connector" />
        <div className="checkout-step"><span className="step-number">2</span> Shipping</div>
        <div className="step-connector" />
        <div className="checkout-step"><span className="step-number">3</span> Payment</div>
      </div>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)', marginBottom: 32 }}>
        Review Your Order
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        {/* Cart Items */}
        <div>
          <div className="card-surface" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--blush-900)' }}>
                  {projectName}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>
                  {designData?.bookConfig.size} · {designData?.bookConfig.coverType} · {designData?.bookConfig.paperType} · {designData?.bookConfig.pageCount} pages
                </p>
              </div>
              <button onClick={() => router.push(`/editor/${projectId}`)} className="btn btn-ghost btn-sm">
                <Pencil size={13} /> Edit
              </button>
            </div>
          </div>

          {/* Promo Code */}
          <div className="card-surface">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag size={14} color="var(--blush-600)" />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--blush-900)' }}>Promo Code</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                className="input"
                placeholder="Enter code (try WELCOME20)"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                style={{ flex: 1 }}
              />
              <button onClick={handleApplyPromo} className="btn btn-outline btn-sm">Apply</button>
            </div>
            {appliedPromo && (
              <p style={{ fontSize: 12, color: '#059669', marginTop: 8 }}>
                ✓ {pricing?.discountLabel} applied
              </p>
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--blush-900)', marginBottom: 20 }}>
            Price Summary
          </h4>
          {pricing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="text-muted">Base Price ({pricing.basePriceLabel})</span>
                <span>₹{pricing.basePrice}</span>
              </div>
              {pricing.extraPages > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span className="text-muted">Extra Pages ({pricing.extraPages})</span>
                  <span>₹{pricing.perPageCost}</span>
                </div>
              )}
              {pricing.coverSurcharge !== 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span className="text-muted">Cover: {pricing.coverLabel}</span>
                  <span>{pricing.coverSurcharge >= 0 ? '₹' : '-₹'}{Math.abs(pricing.coverSurcharge)}</span>
                </div>
              )}
              {pricing.paperSurcharge !== 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span className="text-muted">Paper: {pricing.paperLabel}</span>
                  <span>₹{pricing.paperSurcharge}</span>
                </div>
              )}
              <hr className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="text-muted">Subtotal</span>
                <span>₹{pricing.subtotal}</span>
              </div>
              {pricing.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#059669' }}>
                  <span>Discount</span>
                  <span>-₹{pricing.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="text-muted">Shipping</span>
                <span>₹{pricing.shippingCost}</span>
              </div>
              <hr className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600 }}>
                <span>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)' }}>₹{pricing.total}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => router.push(`/checkout/shipping?projectId=${projectId}&promo=${appliedPromo}`)}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 24 }}
          >
            Continue to Shipping <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="checkout-layout"><div className="skeleton" style={{ height: 400, borderRadius: 8 }} /></div>}>
        <CartContent />
      </Suspense>
    </>
  );
}
