'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) { router.push('/my-projects'); }
    else { setError(result.error || 'Registration failed'); }
  };

  return (
    <main className="signin-layout">
      {/* ── Left: Form ── */}
      <div className="signin-form-side">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary-fixed opacity-10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-container opacity-10 blur-[100px] rounded-full" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Brand */}
          <Link
            href="/"
            className="text-primary block text-center mb-10 hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 500 }}
          >
            PhotoBook Studio
          </Link>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1
              className="text-on-surface mb-3"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Create your account
            </h1>
            <p className="text-on-surface-variant text-base leading-relaxed">
              Join thousands preserving their memories beautifully.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-error-container border border-error/30 rounded mb-6 text-sm text-on-error-container">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block mb-2 uppercase tracking-widest" style={{ fontFamily: 'var(--font-hanken)', fontSize: '11px', fontWeight: 600, color: '#424844' }}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-on-surface text-base"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 uppercase tracking-widest" style={{ fontFamily: 'var(--font-hanken)', fontSize: '11px', fontWeight: 600, color: '#424844' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-on-surface text-base"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 uppercase tracking-widest" style={{ fontFamily: 'var(--font-hanken)', fontSize: '11px', fontWeight: 600, color: '#424844' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/50 rounded focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-on-surface text-base"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded font-label-caps text-label-caps text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 uppercase tracking-widest mt-6 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-outline-variant/30">
            <p className="text-on-surface-variant text-base">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-secondary transition-colors border-b border-primary/30 hover:border-secondary pb-0.5 ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Visual ── */}
      <div className="signin-visual-side">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjqsjwGawzUVgTsu9vgjt3slqCg8EiIWDzDbMtxXJck4z--4tYZ98Jef3ySwhQInzKs6qORymCha9BpAcfjn3B7eZwRN5epeD9kFctT4d_0a8P_A61_KfuSo08BM6LWSjrToPgZUUzB0R1PFlORTGrzmJ5otnL1p7AhbDFvAyhBtpq9SzmgMzXkloNAcQUDncQvTwH7gtxan3vEIIRZVpJqUqa8hLVf0Y6BHg0MZJ8JdJGJbG8rN6akD47fc9JYqhyQQt0y6SuaGo"
          alt="PhotoBook Studio"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
        <div className="absolute bottom-10 left-8 right-8 text-white">
          <p className="text-lg font-medium leading-relaxed drop-shadow-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
            &ldquo;Turn your memories into art.&rdquo;
          </p>
          <p className="text-sm mt-2 text-white/70">Heirloom-quality photobooks, crafted just for you.</p>
        </div>
      </div>
    </main>
  );
}
