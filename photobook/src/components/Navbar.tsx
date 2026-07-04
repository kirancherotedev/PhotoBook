'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';



export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleCreate = () => {
    setMenuOpen(false);
    router.push(isAuthenticated ? '/templates' : '/editor/guest');
  };

  const isActive = (href: string) => pathname === href;

  /* ── Inline style helpers ── */
  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-hanken)',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: active ? '#434f38' : '#454840',
    textDecoration: active ? 'underline' : 'none',
    textUnderlineOffset: 5,
    cursor: 'pointer',
    transition: 'color 0.15s',
    background: 'none',
    border: 'none',
    padding: 0,
  });

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          backgroundColor: '#fcf9f8',
          borderBottom: '1px solid rgba(27,28,28,0.1)',
          boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
          transition: 'box-shadow 0.3s',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-playfair)',
              fontSize: 21,
              fontWeight: 400,
              color: '#1b1c1c',
              textDecoration: 'none',
              flexShrink: 0,
              letterSpacing: '-0.01em',
            }}
          >
            PhotoBook Studio
          </Link>

          {/* Desktop Nav links */}
          <div
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: 32 }}
          >
            <Link href="/templates" style={linkStyle(isActive('/templates'))}>Photobooks</Link>
            <Link href="/templates?category=polaroid" style={linkStyle(false)}>Polaroids</Link>
            <button onClick={handleCreate} style={linkStyle(false)}>Create</button>
            <Link href="/pricing" style={linkStyle(isActive('/pricing'))}>Pricing</Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" style={linkStyle(isActive('/admin'))}>Admin</Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: 16, flexShrink: 0 }}
          >
            {isAuthenticated ? (
              <>
                <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#454840' }}>
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <Link
                  href="/my-projects"
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#434f38',
                    border: '1px solid rgba(67,79,56,0.3)',
                    padding: '7px 16px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.15s',
                  }}
                >
                  My Projects
                </Link>
                <button
                  onClick={logout}
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#454840',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#434f38',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: '#1b1c1c',
              zIndex: 110,
              position: 'relative',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer backdrop ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(27,28,28,0.25)',
            zIndex: 99,
          }}
          className="md:hidden"
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 280,
          backgroundColor: '#fcf9f8',
          zIndex: 100,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid rgba(27,28,28,0.1)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 400, color: '#1b1c1c' }}>Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1b1c1c', padding: 4 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav style={{ padding: '24px 0', flex: 1, overflowY: 'auto' }}>
          {[
            { label: 'Photobooks', href: '/templates', icon: 'menu_book' },
            { label: 'Custom Polaroids', href: '/polaroids/start', icon: 'photo_camera' },
            { label: 'Pricing', href: '/pricing', icon: 'sell' },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                fontFamily: 'var(--font-hanken)',
                fontSize: 15,
                color: '#1b1c1c',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#434f38' }}>{l.icon}</span>
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleCreate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              fontFamily: 'var(--font-hanken)',
              fontSize: 15,
              color: '#1b1c1c',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#434f38' }}>auto_awesome</span>
            Create
          </button>
          {isAuthenticated && user?.role === 'admin' && (
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', fontFamily: 'var(--font-hanken)', fontSize: 15, color: '#1b1c1c', textDecoration: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#434f38' }}>admin_panel_settings</span>
              Admin
            </Link>
          )}

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(27,28,28,0.08)', margin: '16px 0' }} />

          {/* Auth section */}
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {isAuthenticated ? (
              <>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#454840' }}>
                  Signed in as <strong style={{ color: '#1b1c1c' }}>{user?.name}</strong>
                </p>
                <Link href="/my-projects" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#1b1c1c', textDecoration: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#434f38' }}>photo_library</span>
                  My Projects
                </Link>
                <Link href="/my-orders" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#1b1c1c', textDecoration: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#434f38' }}>package_2</span>
                  My Orders
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 14,
                    color: '#ba1a1a',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px 20px',
                    backgroundColor: '#434f38',
                    color: '#fff',
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: 8,
                    textDecoration: 'none',
                    marginBottom: 8,
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px 20px',
                    border: '1px solid rgba(67,79,56,0.3)',
                    color: '#434f38',
                    fontFamily: 'var(--font-hanken)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: 8,
                    textDecoration: 'none',
                  }}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
