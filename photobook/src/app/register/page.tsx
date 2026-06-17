'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { BookOpen, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      router.push('/my-projects');
    } else {
      setError(result.error || 'Registration failed');
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
        <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <BookOpen size={32} color="var(--blush-900)" style={{ marginBottom: 16 }} />
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              color: 'var(--blush-900)',
              marginBottom: 8,
            }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: 'var(--blush-600)' }}>
              Start designing beautiful photobooks today
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', background: '#FEE2E2', border: '0.5px solid #EF4444',
              borderRadius: 'var(--radius-sm)', fontSize: 13, color: '#991B1B', marginBottom: 20,
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--blush-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="name" type="text" className="input" style={{ paddingLeft: 38 }} placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--blush-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="email" type="email" className="input" style={{ paddingLeft: 38 }} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--blush-600)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input id="password" type="password" className="input" style={{ paddingLeft: 38 }} placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--blush-600)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--blush-900)', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
