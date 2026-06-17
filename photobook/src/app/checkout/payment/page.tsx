'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/Toast';
import { CreditCard, Shield, CheckCircle, XCircle, Loader } from 'lucide-react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();
  const { showToast } = useToast();

  const [order, setOrder] = useState<{ id: string; orderNumber: string; total: number } | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { router.push('/my-projects'); return; }
    fetch(`/api/orders/${orderId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setOrder(d.data);
        setLoading(false);
      });
  }, [orderId, router]);

  const handlePay = async () => {
    if (!orderId) return;
    setStatus('processing');

    // Step 1: Create payment session
    const sessionRes = await fetch('/api/payments/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    const sessionData = await sessionRes.json();
    if (!sessionData.success) {
      showToast(sessionData.error || 'Payment failed', 'error');
      setStatus('idle');
      return;
    }

    setSessionId(sessionData.data.sessionId);

    // Simulate processing delay (like a real payment gateway)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Simulate webhook — success
    const webhookRes = await fetch('/api/payments/simulate-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionData.data.sessionId,
        status: 'success',
      }),
    });
    const webhookData = await webhookRes.json();

    if (webhookData.success && webhookData.data.paymentStatus === 'confirmed') {
      setStatus('success');
      showToast('Payment successful!', 'success');
      setTimeout(() => {
        router.push(`/checkout/confirmation?orderId=${orderId}`);
      }, 1500);
    } else {
      setStatus('failed');
      showToast('Payment failed', 'error');
    }
  };

  const handleSimulateFailure = async () => {
    if (!orderId) return;
    setStatus('processing');

    const sessionRes = await fetch('/api/payments/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    const sessionData = await sessionRes.json();

    await new Promise(resolve => setTimeout(resolve, 1500));

    await fetch('/api/payments/simulate-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionData.data.sessionId, status: 'failure' }),
    });

    setStatus('failed');
    showToast('Payment declined', 'error');
  };

  if (loading) {
    return <div className="checkout-layout"><div className="skeleton" style={{ height: 400, borderRadius: 8 }} /></div>;
  }

  return (
    <div className="checkout-layout page-enter">
      <div className="checkout-steps">
        <div className="checkout-step completed"><span className="step-number">✓</span> Cart</div>
        <div className="step-connector" />
        <div className="checkout-step completed"><span className="step-number">✓</span> Shipping</div>
        <div className="step-connector" />
        <div className="checkout-step active"><span className="step-number">3</span> Payment</div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)', marginBottom: 8, textAlign: 'center' }}>
          Payment
        </h1>
        <p style={{ fontSize: 14, color: 'var(--blush-600)', textAlign: 'center', marginBottom: 32 }}>
          Secure dummy payment for testing
        </p>

        {/* Payment Card */}
        <div className="card" style={{ padding: 32 }}>
          {status === 'idle' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <CreditCard size={40} color="var(--blush-600)" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 13, color: 'var(--blush-600)', marginBottom: 4 }}>
                  Order {order?.orderNumber}
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, color: 'var(--blush-900)',
                }}>
                  ₹{order?.total}
                </div>
              </div>

              {/* Simulated Card UI */}
              <div style={{
                background: 'linear-gradient(135deg, var(--blush-900), #6d4f55)',
                borderRadius: 12, padding: '24px 20px', color: 'var(--blush-50)',
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 16, letterSpacing: '0.1em' }}>DUMMY CARD</div>
                <div style={{ fontSize: 16, letterSpacing: '0.15em', marginBottom: 16, fontFamily: 'monospace' }}>
                  •••• •••• •••• 4242
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 9, opacity: 0.6 }}>CARDHOLDER</div>
                    <div style={{ fontSize: 13 }}>TEST USER</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, opacity: 0.6 }}>EXPIRES</div>
                    <div style={{ fontSize: 13 }}>12/28</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--blush-600)', marginBottom: 20, justifyContent: 'center' }}>
                <Shield size={12} />
                This is a simulated payment for testing purposes
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={handlePay} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <CheckCircle size={16} /> Pay ₹{order?.total} (Success)
                </button>
                <button onClick={handleSimulateFailure} className="btn btn-outline" style={{ width: '100%' }}>
                  <XCircle size={16} /> Simulate Payment Failure
                </button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader size={40} color="var(--blush-600)" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--blush-900)', marginBottom: 4 }}>Processing Payment...</p>
              <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>Please wait while we verify your payment</p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={48} color="#059669" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 18, fontWeight: 600, color: '#059669', marginBottom: 4 }}>Payment Successful!</p>
              <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>Redirecting to confirmation...</p>
            </div>
          )}

          {status === 'failed' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <XCircle size={48} color="#EF4444" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 18, fontWeight: 600, color: '#991B1B', marginBottom: 4 }}>Payment Failed</p>
              <p style={{ fontSize: 13, color: 'var(--blush-600)', marginBottom: 24 }}>Your payment was declined. Please try again.</p>
              <button onClick={() => setStatus('idle')} className="btn btn-primary">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="checkout-layout"><div className="skeleton" style={{ height: 400, borderRadius: 8 }} /></div>}>
        <PaymentContent />
      </Suspense>
    </>
  );
}
