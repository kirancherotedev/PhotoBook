'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="container page-enter" style={{ padding: '60px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--blush-600)', marginBottom: 12,
          }}>
            Simple, Transparent Pricing
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '2.4rem',
            color: 'var(--blush-900)', marginBottom: 12,
          }}>
            Every book, made to order
          </h1>
          <p style={{ fontSize: 15, color: 'var(--blush-600)', maxWidth: 500, margin: '0 auto' }}>
            No hidden fees. The price updates live in the editor as you change your options.
          </p>
        </div>

        {/* Size Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 56 }}>
          {[
            { size: '8×8"', price: '₹999', desc: 'Compact & personal', features: ['20 pages included', 'Hardcover standard', 'Matte paper'] },
            { size: '10×10"', price: '₹1,499', desc: 'Our most popular', popular: true, features: ['20 pages included', 'Hardcover standard', 'Matte paper'] },
            { size: '12×12"', price: '₹1,999', desc: 'Grand & gallery-worthy', features: ['20 pages included', 'Hardcover standard', 'Matte paper'] },
          ].map((plan) => (
            <motion.div
              key={plan.size}
              {...fadeInUp}
              className="card-surface"
              style={{
                padding: 32, textAlign: 'center', position: 'relative',
                border: plan.popular ? '1.5px solid var(--blush-900)' : '0.5px solid var(--blush-400)',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--blush-900)', color: 'var(--blush-50)',
                  padding: '4px 16px', borderRadius: 100, fontSize: 11,
                  fontWeight: 600, letterSpacing: '0.06em',
                }}>
                  POPULAR
                </div>
              )}
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--blush-900)', marginBottom: 4 }}>
                {plan.size}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--blush-600)', marginBottom: 16 }}>{plan.desc}</p>
              <div style={{
                fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 600,
                color: 'var(--blush-900)', marginBottom: 4,
              }}>
                {plan.price}
              </div>
              <p style={{ fontSize: 12, color: 'var(--blush-600)', marginBottom: 24 }}>starting price</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, textAlign: 'left' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--blush-600)' }}>
                    <Check size={14} color="var(--blush-900)" /> {f}
                  </div>
                ))}
              </div>
              <Link href="/templates" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Start Designing <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Add-ons Table */}
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.4rem',
            color: 'var(--blush-900)', textAlign: 'center', marginBottom: 24,
          }}>
            Customization Add-ons
          </h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Option</th><th>Price</th></tr>
              </thead>
              <tbody>
                <tr><td>Additional page</td><td>₹49 per page</td></tr>
                <tr><td>Softcover (discount)</td><td>-₹200</td></tr>
                <tr><td>Leather cover (upgrade)</td><td>+₹800</td></tr>
                <tr><td>Glossy paper</td><td>+₹200</td></tr>
                <tr><td>Silk paper</td><td>+₹400</td></tr>
                <tr><td>Standard shipping</td><td>₹99</td></tr>
                <tr><td>Express shipping</td><td>₹199</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
