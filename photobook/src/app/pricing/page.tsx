'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PricingPage() {
  // Intersection Observer for fade-in animations
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: '#fff8f0', color: '#1d1b17', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, paddingBottom: 80 }}>
        
        {/* ── HERO ── */}
        <section
          style={{
            padding: '80px 24px 60px',
            textAlign: 'center',
            maxWidth: 900,
            margin: '0 auto',
          }}
          className="fade-in-up"
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-hanken)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#745757',
              border: '1px solid rgba(116,87,87,0.3)',
              borderRadius: 999,
              padding: '5px 16px',
              marginBottom: 24,
            }}
          >
            Crafted for Posterity
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              color: '#173124',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            Transparent Pricing for Eternal Memories
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: 'clamp(16px, 2vw, 18px)',
              color: '#424844',
              lineHeight: 1.7,
              maxWidth: 640,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            Invest in quality that lasts generations. Our pricing is as clear as our glass-finish paper, with no hidden fees—only premium craftsmanship.
          </p>
        </section>

        {/* ── PRICING TIERS ── */}
        <section style={{ padding: '0 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
              alignItems: 'center',
            }}
          >
            {/* Essential Tier */}
            <div
              className="fade-in-up"
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(194,200,194,0.4)',
                borderRadius: 8,
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 500, color: '#173124', marginBottom: 8 }}>The Essential</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 40, fontWeight: 600, color: '#173124' }}>₹999</span>
                <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#727973' }}>starting price</span>
              </div>
              <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(194,200,194,0.3)', marginBottom: 32 }} />
              <ul style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, textAlign: 'left' }}>
                {[
                  { ok: true, text: '20 pages included' },
                  { ok: true, text: 'Hardcover standard' },
                  { ok: true, text: 'Matte paper finish' },
                  { ok: false, text: 'Premium lay-flat binding' },
                ].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-hanken)', fontSize: 15, color: f.ok ? '#424844' : '#727973' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: f.ok ? '#173124' : '#c2c8c2' }}>{f.ok ? 'check_circle' : 'cancel'}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link
                href="/templates"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '16px 0',
                  border: '1px solid #173124',
                  color: '#173124',
                  borderRadius: 4,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                Start Designing
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
            </div>

            {/* Heritage Tier (Featured) */}
            <div
              className="fade-in-up"
              style={{
                backgroundColor: '#173124',
                color: '#fff',
                borderRadius: 8,
                padding: 48,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 12px 30px rgba(23,49,36,0.15)',
                transform: 'scale(1.02)',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#f3ede5',
                  color: '#173124',
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '6px 16px',
                  borderRadius: 999,
                }}
              >
                Most Popular
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 26, fontWeight: 500, color: '#fff', marginBottom: 8 }}>The Heritage</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 44, fontWeight: 600, color: '#fff' }}>₹1,499</span>
                <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>starting price</span>
              </div>
              <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 32 }} />
              <ul style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, textAlign: 'left' }}>
                {[
                  '40 pages included',
                  'Premium Linen cover',
                  'Silk paper finish',
                  'Lay-flat binding',
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-hanken)', fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fff' }}>check_circle</span>
                    {text}
                  </li>
                ))}
              </ul>
              <Link
                href="/templates"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '16px 0',
                  backgroundColor: '#fff',
                  color: '#173124',
                  borderRadius: 4,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                Start Designing
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
            </div>

            {/* Archive Tier */}
            <div
              className="fade-in-up"
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(194,200,194,0.4)',
                borderRadius: 8,
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 500, color: '#173124', marginBottom: 8 }}>The Archive</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 40, fontWeight: 600, color: '#173124' }}>₹1,999</span>
                <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#727973' }}>starting price</span>
              </div>
              <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(194,200,194,0.3)', marginBottom: 32 }} />
              <ul style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, textAlign: 'left' }}>
                {[
                  '60 pages included',
                  'Full Grain Leather cover',
                  'Artisan luster paper',
                  'Velvet presentation case',
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-hanken)', fontSize: 15, color: '#424844' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#173124' }}>check_circle</span>
                    {text}
                  </li>
                ))}
              </ul>
              <Link
                href="/templates"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '16px 0',
                  border: '1px solid #173124',
                  color: '#173124',
                  borderRadius: 4,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                Start Designing
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CUSTOMIZATION ADD-ONS ── */}
        <section style={{ padding: '0 24px 80px', maxWidth: 900, margin: '0 auto' }}>
          <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 500, color: '#173124' }}>Customization Add-ons</h2>
            <div style={{ width: 60, height: 2, backgroundColor: '#173124', margin: '20px auto 0', opacity: 0.3 }} />
          </div>
          
          <div
            className="fade-in-up"
            style={{
              backgroundColor: '#fff',
              border: '1px solid rgba(194,200,194,0.4)',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '16px 24px', backgroundColor: '#f3ede5', borderBottom: '1px solid rgba(194,200,194,0.4)' }}>
              <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#727973' }}>Option</span>
              <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#727973', textAlign: 'right' }}>Price</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { name: 'Additional page',          desc: '',                             price: '₹49 per page', isRed: false },
                { name: 'Softcover (discount)',     desc: 'Available for Essential tier', price: '-₹200',        isRed: true  },
                { name: 'Leather cover (upgrade)',  desc: '',                             price: '+₹800',        isRed: false },
                { name: 'Glossy paper',             desc: '',                             price: '+₹200',        isRed: false },
                { name: 'Silk paper',               desc: '',                             price: '+₹400',        isRed: false },
                { name: 'Standard shipping',        desc: '',                             price: '₹99',          isRed: false },
                { name: 'Express shipping',         desc: '1-2 business days',            price: '₹199',         isRed: false },
              ].map((row, i, arr) => (
                <div
                  key={row.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '20px 24px',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(194,200,194,0.3)' : 'none',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 15, fontWeight: 600, color: '#1d1b17' }}>{row.name}</span>
                    {row.desc && <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#727973', fontStyle: 'italic', marginTop: 4 }}>{row.desc}</span>}
                  </div>
                  <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 15, fontWeight: 500, textAlign: 'right', color: row.isRed ? '#ba1a1a' : '#173124' }}>
                    {row.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE CRAFT SECTION ── */}
        <section style={{ backgroundColor: '#f3ede5', padding: '80px 24px' }}>
          <div
            className="fade-in-up"
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 60,
              alignItems: 'center',
            }}
          >
            {/* Image stack */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: 500, margin: '0 auto' }}>
              <img
                src="/products/2Medium Photobook.png"
                alt="Medium Photobook"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4, boxShadow: '0 4px 30px rgba(0,0,0,0.06)' }}
              />
              <img
                className="hidden md:block"
                src="/products/1Mini PhotoBook.png"
                alt="Mini Photobook"
                style={{
                  position: 'absolute',
                  bottom: -40,
                  right: -40,
                  width: '70%',
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  borderRadius: 4,
                  border: '12px solid #fff',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
                }}
              />
            </div>

            {/* Text side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, color: '#173124' }}>
                The Craft Behind Every Photobook
              </h2>
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 16, color: '#424844', lineHeight: 1.7 }}>
                We believe your memories are too precious to stay trapped on a screen. Every photobook we create is a premium tribute to your most cherished moments, crafted with archival-grade materials designed to last a lifetime.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#173124', marginBottom: 12 }}>
                    Premium Quality
                  </h4>
                  <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#727973', lineHeight: 1.6 }}>
                    High-definition printing and luxury paper options ensure your photos look vibrant and true to life.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-hanken)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#173124', marginBottom: 12 }}>
                    Perfectly Bound
                  </h4>
                  <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#727973', lineHeight: 1.6 }}>
                    Our lay-flat binding allows your panoramic shots to flow seamlessly across two pages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
