'use client';

import Link from 'next/link';



export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#434f38',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '72px 24px 40px',
        }}
      >

        {/* Grid: responsive 1 → 2 → 4 col */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px 32px',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link
              href="/"
              style={{
                display: 'block',
                fontFamily: 'var(--font-playfair)',
                fontSize: 20,
                fontWeight: 400,
                color: '#fcf9f8',
                marginBottom: 12,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              PhotoBook Studio
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 13,
                color: 'rgba(252,249,248,0.7)',
                lineHeight: 1.7,
                maxWidth: 220,
              }}
            >
              Photobooks and custom polaroids, beautifully bound and printed. Heirloom-quality keepsakes crafted with care.
            </p>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 12, color: 'rgba(252,249,248,0.5)', marginTop: 16 }}>
              © {new Date().getFullYear()} PhotoBook Studio
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(252,249,248,0.55)',
                marginBottom: 20,
              }}
            >
              Explore
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/templates', label: 'Photobooks' },
                { href: '/polaroids/start', label: 'Custom Polaroids' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/my-projects', label: 'My Projects' },
                { href: '/my-orders', label: 'My Orders' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 14,
                    color: 'rgba(252,249,248,0.85)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(252,249,248,0.55)',
                marginBottom: 20,
              }}
            >
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['About Us', 'Contact', 'Shipping Policy'].map(l => (
                <a
                  key={l}
                  href="#"
                  style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: 'rgba(252,249,248,0.85)', textDecoration: 'none' }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Le */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(252,249,248,0.55)',
                marginBottom: 20,
              }}
            >
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Privacy Policy', 'Terms of Service', 'Returns Policy'].map(l => (
                <a
                  key={l}
                  href="#"
                  style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: 'rgba(252,249,248,0.85)', textDecoration: 'none' }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom hairline */}
        <div
          style={{
            borderTop: '1px solid rgba(252,249,248,0.15)',
            marginTop: 48,
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 12, color: 'rgba(252,249,248,0.5)', letterSpacing: '0.04em' }}>
            FAQ · Legal Notice · Data Management
          </p>
        </div>
      </div>
    </footer>
  );
}
