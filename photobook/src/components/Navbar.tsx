'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't show navbar on editor pages
  if (pathname.startsWith('/editor')) return null;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--blush-50)',
      borderBottom: '0.5px solid var(--blush-400)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
        }}>
          <BookOpen size={22} color="var(--blush-900)" />
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--blush-900)',
            letterSpacing: '-0.01em',
          }}>
            PhotoBook Studio
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link
            href="/templates"
            style={{
              fontSize: 14,
              fontWeight: pathname === '/templates' ? 500 : 400,
              color: pathname === '/templates' ? 'var(--blush-900)' : 'var(--blush-600)',
              letterSpacing: '0.01em',
            }}
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            style={{
              fontSize: 14,
              fontWeight: pathname === '/pricing' ? 500 : 400,
              color: pathname === '/pricing' ? 'var(--blush-900)' : 'var(--blush-600)',
              letterSpacing: '0.01em',
            }}
          >
            Pricing
          </Link>

          {isAuthenticated ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="btn btn-ghost btn-sm"
                style={{ gap: 6 }}
              >
                <User size={16} />
                <span>{user?.name}</span>
                <ChevronDown size={14} style={{
                  transform: menuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 150ms ease',
                }} />
              </button>

              {menuOpen && (
                <div className="animate-scale-in" style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: 8,
                  background: 'var(--blush-50)',
                  border: '0.5px solid var(--blush-400)',
                  borderRadius: 'var(--radius-md)',
                  minWidth: 200,
                  padding: '8px 0',
                  zIndex: 200,
                }}>
                  <div style={{
                    padding: '8px 16px 12px',
                    borderBottom: '0.5px solid var(--blush-400)',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--blush-600)' }}>{user?.email}</div>
                  </div>

                  <Link
                    href="/my-projects"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      fontSize: 14,
                      color: 'var(--blush-900)',
                    }}
                  >
                    <BookOpen size={15} />
                    My Projects
                  </Link>

                  <Link
                    href="/my-orders"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      fontSize: 14,
                      color: 'var(--blush-900)',
                    }}
                  >
                    <LayoutDashboard size={15} />
                    My Orders
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 16px',
                        fontSize: 14,
                        color: 'var(--blush-900)',
                        borderTop: '0.5px solid var(--blush-400)',
                      }}
                    >
                      <LayoutDashboard size={15} />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      fontSize: 14,
                      color: 'var(--blush-900)',
                      width: '100%',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      borderTop: '0.5px solid var(--blush-400)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
