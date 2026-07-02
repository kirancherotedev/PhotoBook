'use client';

import { Suspense, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff8f0' }}>
        <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#173124' }}>Loading...</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/my-projects';
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === 'admin' && redirect === '/my-projects') { router.push('/admin'); }
      else { router.push(redirect); }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      {/* ── RESPONSIVE: stack on mobile, side-by-side on desktop ── */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
        className="lg:flex-row"
      >

        {/* LEFT: Form side */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f9f3eb 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient blobs */}
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '70%', height: '70%', backgroundColor: 'rgba(204,234,214,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', backgroundColor: 'rgba(250,212,211,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
            {/* Brand */}
            <Link
              href="/"
              style={{
                display: 'block',
                textAlign: 'center',
                fontFamily: 'var(--font-playfair)',
                fontSize: 22,
                fontWeight: 500,
                color: '#173124',
                textDecoration: 'none',
                marginBottom: 40,
              }}
            >
              PhotoBook Studio
            </Link>

            {/* Heading */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(28px, 5vw, 42px)',
                  fontWeight: 600,
                  color: '#1d1b17',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                Welcome back
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 15,
                  color: '#424844',
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}
              >
                Please enter your details to sign in.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  backgroundColor: '#ffdad6',
                  border: '1px solid rgba(186,26,26,0.25)',
                  borderRadius: 4,
                  marginBottom: 24,
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 13,
                  color: '#93000a',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#424844',
                    marginBottom: 8,
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 15,
                    color: '#1d1b17',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(194,200,194,0.6)',
                    borderRadius: 4,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#173124'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(194,200,194,0.6)'; }}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#424844',
                    marginBottom: 8,
                  }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 15,
                    color: '#1d1b17',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(194,200,194,0.6)',
                    borderRadius: 4,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#173124'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(194,200,194,0.6)'; }}
                />
              </div>

              {/* Remember / Forgot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#424844', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#173124' }} />
                  Remember me
                </label>
                <a href="#" style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, fontWeight: 500, color: '#745757', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  backgroundColor: loading ? 'rgba(23,49,36,0.7)' : '#173124',
                  color: '#fff',
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 4,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 8,
                  transition: 'background-color 0.15s',
                }}
              >
                {loading ? (
                  <>
                    <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Create account link */}
            <div
              style={{
                marginTop: 32,
                paddingTop: 28,
                borderTop: '1px solid rgba(194,200,194,0.4)',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#424844' }}>
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontWeight: 600,
                    color: '#173124',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Demo accounts */}
            <div
              style={{
                marginTop: 20,
                padding: '14px 16px',
                backgroundColor: '#f3ede5',
                borderRadius: 6,
                border: '1px solid rgba(194,200,194,0.3)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-hanken)', fontWeight: 600, fontSize: 12, color: '#1d1b17', marginBottom: 8 }}>Demo Accounts</p>
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 12, color: '#424844', marginBottom: 4 }}>Admin: admin@gmail.com / admin123</p>
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 12, color: '#424844' }}>Customer: demo@photobook.local / customer123</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Photo side — hidden on mobile, shown on desktop */}
        <div
          className="hidden lg:block"
          style={{
            width: '50%',
            position: 'relative',
            backgroundColor: '#ede7df',
            flexShrink: 0,
          }}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3z5AMMpBZFWyGeE7ZQg2DhV3LLRfbiTvhbr9wFyRuWyDHgVsNIC3KQEcJ8kZn47yzT6B4tnUyzlaOs8lJw37KTvEEVn5O2K9F4uXKWYVBM-DVpVODO_8151d7BfxkNegD0zxTggrnw-3VMw6qT6yLeaqDWupSQD8tD-dYOs8MmFnonlr7CZ93wwAbt4_oUDjeMPr1qvH_Ko6hW2PQK8wEALJ-UQ9Mops28cCHuJbadamS_EFIhUD52KRDzMSDxkYQ59e7t5aV81I"
            alt="Beautiful handcrafted photobook"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Dark overlay at bottom */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(23,49,36,0.6) 0%, transparent 50%)',
            }}
          />
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
