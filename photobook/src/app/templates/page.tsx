'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { TemplateItem } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TemplatesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => {
        if (d.success) setTemplates(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleBlankProject = async () => {
    if (!isAuthenticated) { router.push('/editor/guest'); return; }
    setCreating('blank');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Photo Book' }),
      });
      const data = await res.json();
      if (data.success) { router.push(`/editor/${data.data.id}`); }
      else { showToast(data.error || 'Failed', 'error'); setCreating(null); }
    } catch { showToast('Network error', 'error'); setCreating(null); }
  };

  const handleUseTemplate = async (id: string) => {
    if (!isAuthenticated) { router.push(`/editor/guest?templateId=${id}`); return; }
    setCreating(id);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: id }),
      });
      const data = await res.json();
      if (data.success) { router.push(`/editor/${data.data.id}`); }
      else { showToast(data.error || 'Failed', 'error'); setCreating(null); }
    } catch { showToast('Network error', 'error'); setCreating(null); }
  };

  // Skeleton cards while loading
  const SkeletonCard = () => (
    <div>
      <div style={{ aspectRatio: '1.25', backgroundColor: '#e8e2db', borderRadius: 4, marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 20, width: '65%', backgroundColor: '#e8e2db', borderRadius: 3, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 14, width: '45%', backgroundColor: '#e8e2db', borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f5f0', color: '#1d1b17' }}>
      <Navbar />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 96px' }}>

        {/* ── Page Header ── */}
        <header style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-hanken)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#745757',
            marginBottom: 16,
          }}>
            Our Collections
          </span>
          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 600,
            color: '#173124',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            Curated Collections
          </h1>
          <p style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: 16,
            color: '#424844',
            lineHeight: 1.7,
            maxWidth: 560,
            margin: '0 auto',
          }}>
            Explore our artisanal templates, designed to beautifully frame your memories with timeless elegance.
          </p>
        </header>

        {/* ── Template Grid ── */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '40px 24px',
          }}>
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '40px 24px',
          }}>
            {/* ── Blank Canvas Card ── */}
            <div
              onClick={handleBlankProject}
              style={{ cursor: 'pointer' }}
            >
              <div style={{
                aspectRatio: '1.25',
                backgroundColor: '#f3ede5',
                border: '1px dashed rgba(194,200,194,0.7)',
                borderRadius: 4,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#173124' }}>add</span>
                <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, fontWeight: 600, color: '#173124' }}>
                  {creating === 'blank' ? 'Creating...' : 'Create Custom'}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 500, color: '#173124', marginBottom: 4 }}>
                Blank Canvas
              </h3>
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#424844' }}>
                Start from scratch
              </p>
            </div>

            {/* ── Template Cards ── */}
            {templates.map((tmpl) => (
              <div key={tmpl.id} style={{ cursor: 'pointer' }}>
                {/* Image */}
                <div onClick={() => handleUseTemplate(tmpl.id)} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{
                    position: 'relative',
                    aspectRatio: '1.25',
                    overflow: 'hidden',
                    backgroundColor: '#f3ede5',
                    border: '1px solid rgba(194,200,194,0.4)',
                    borderRadius: 4,
                    padding: 8,
                    marginBottom: 16,
                  }}>
                    {/* Inner border overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 8,
                      border: '1px solid rgba(194,200,194,0.2)',
                      pointerEvents: 'none',
                      zIndex: 2,
                      borderRadius: 2,
                    }} />
                    <img
                      src={tmpl.thumbnail || ''}
                      alt={tmpl.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        transition: 'transform 0.6s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>

                  {/* Name & Category */}
                  <p style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 18,
                    fontWeight: 500,
                    color: '#173124',
                    marginBottom: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {tmpl.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#424844', marginBottom: 10, textTransform: 'capitalize' }}>
                    Photobook
                  </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleUseTemplate(tmpl.id)}
                    disabled={!!creating}
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-hanken)',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '10px 12px',
                      backgroundColor: '#173124',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 3,
                      cursor: creating ? 'not-allowed' : 'pointer',
                      opacity: creating ? 0.6 : 1,
                    }}
                  >
                    {creating === tmpl.id ? 'Starting...' : 'Use This'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
