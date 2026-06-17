'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/Toast';
import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import type { ShippingAddress } from '@/lib/types';

function ShippingContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const promo = searchParams.get('promo') || '';
  const router = useRouter();
  const { showToast } = useToast();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '', country: 'India',
  });
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          shippingAddress: address,
          deliverySpeed,
          promoCode: promo || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/checkout/payment?orderId=${data.data.id}`);
      } else {
        showToast(data.error || 'Failed to create order', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
    setLoading(false);
  };

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="checkout-layout page-enter">
      <div className="checkout-steps">
        <div className="checkout-step completed"><span className="step-number">✓</span> Cart</div>
        <div className="step-connector" />
        <div className="checkout-step active"><span className="step-number">2</span> Shipping</div>
        <div className="step-connector" />
        <div className="checkout-step"><span className="step-number">3</span> Payment</div>
      </div>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)', marginBottom: 32 }}>
        Shipping Details
      </h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <MapPin size={16} color="var(--blush-600)" />
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--blush-900)' }}>Delivery Address</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label htmlFor="fullName">Full Name *</label>
              <input id="fullName" className="input" value={address.fullName} onChange={e => updateField('fullName', e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone *</label>
              <input id="phone" className="input" value={address.phone} onChange={e => updateField('phone', e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="addr1">Address Line 1 *</label>
            <input id="addr1" className="input" value={address.addressLine1} onChange={e => updateField('addressLine1', e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="addr2">Address Line 2</label>
            <input id="addr2" className="input" value={address.addressLine2} onChange={e => updateField('addressLine2', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="input-group">
              <label htmlFor="city">City *</label>
              <input id="city" className="input" value={address.city} onChange={e => updateField('city', e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="state">State *</label>
              <input id="state" className="input" value={address.state} onChange={e => updateField('state', e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="pincode">Pincode *</label>
              <input id="pincode" className="input" value={address.pincode} onChange={e => updateField('pincode', e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Delivery Speed */}
        <div style={{ marginTop: 32 }}>
          <h4 style={{ fontSize: 14, fontWeight: 500, color: 'var(--blush-900)', marginBottom: 12 }}>Delivery Speed</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { value: 'standard', label: 'Standard Delivery', time: '7-10 business days', cost: '₹99' },
              { value: 'express', label: 'Express Delivery', time: '3-5 business days', cost: '₹199' },
            ].map(opt => (
              <label
                key={opt.value}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 6, cursor: 'pointer',
                  border: `1.5px solid ${deliverySpeed === opt.value ? 'var(--blush-900)' : 'var(--blush-400)'}`,
                  background: deliverySpeed === opt.value ? 'var(--blush-100)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="radio" name="delivery" value={opt.value}
                    checked={deliverySpeed === opt.value}
                    onChange={e => setDeliverySpeed(e.target.value)}
                    style={{ accentColor: 'var(--blush-900)' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--blush-900)' }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--blush-600)' }}>{opt.time}</div>
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--blush-900)' }}>{opt.cost}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button type="button" onClick={() => router.back()} className="btn btn-outline">
            <ArrowLeft size={14} /> Back to Cart
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Processing...' : 'Continue to Payment'}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="checkout-layout"><div className="skeleton" style={{ height: 400, borderRadius: 8 }} /></div>}>
        <ShippingContent />
      </Suspense>
    </>
  );
}
