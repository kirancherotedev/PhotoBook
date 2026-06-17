'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/my-projects';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--blush-50)',
      }}>
        <div className="animate-fade-in-up" style={{
          width: '100%',
          maxWidth: 400,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <BookOpen size={32} color="var(--blush-900)" style={{ marginBottom: 16 }} />
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              color: 'var(--blush-900)',
              marginBottom: 8,
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: 'var(--blush-600)' }}>
              Sign in to continue designing your photobooks
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: '#FEE2E2',
              border: '0.5px solid #EF4444',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              color: '#991B1B',
              marginBottom: 20,
            }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--blush-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="email"
                  type="email"
                  className="input"
                  style={{ paddingLeft: 38 }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--blush-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="password"
                  type="password"
                  className="input"
                  style={{ paddingLeft: 38 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            fontSize: 14,
            color: 'var(--blush-600)',
            marginTop: 24,
          }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--blush-900)', fontWeight: 500 }}>
              Create one
            </Link>
          </p>

          <div style={{
            marginTop: 32,
            padding: '16px',
            background: 'var(--blush-100)',
            border: '0.5px solid var(--blush-400)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            color: 'var(--blush-600)',
          }}>
            <p style={{ fontWeight: 600, marginBottom: 6, color: 'var(--blush-900)' }}>Demo Accounts</p>
            <p>Admin: admin@gmail.com / admin123</p>
            <p>Customer: demo@photobook.local / customer123</p>
          </div>
        </div>
      </div>
    </>
  );
}
