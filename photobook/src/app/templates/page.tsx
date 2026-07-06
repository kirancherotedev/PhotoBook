'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { TemplateItem } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
<<<<<<< Updated upstream
import { PRODUCT_IMAGES, formatProductName } from '@/lib/products';

const CATEGORIES = [
  { key: 'all',          label: 'All' },
  { key: 'wedding',      label: 'Wedding' },
  { key: 'travel',       label: 'Travel' },
  { key: 'baby',         label: 'Baby' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'portfolio',    label: 'Portfolio' },
];

const FALLBACK = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB40QZoa3vbcCOv-qZUPABvj6DOr1zIA4xLWBzaNfIukHHT9c2MMWRT1cGc6tujUQPJTedWtwT7WdSkDkKy9sIy4IQx_UnzwC_4dWf1EzRZEX7rDvQwqqWqpjmnirAMGy_l2e41Yj5psNXYYAOqpUjVur11RHOx-HnOtmbBT3MLT4Ur_BnXDINVZDklDwNVyMW3L4FADkBk-2F6rAC_67XUPOKmCiU57240aUxN7VqVgfRFHL_vxoXM-C--uQ0nN6fs1Ag1SS4GEn0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDOLR65wso_o4TY89sKcTvBRS193yQKwCfh3VcfL6u-8BHdb7dwiCOopFCsSXNh9xeXiugDIYcTfwH8DjBzbtDgt9OhlxD3fwuSBWg89-qw7DEpMW8bdGYRtyk85NyOiIILDnjb2UFi0mRBEHsWlL2-IeyDzgat-UhBjFt9_2Hbx2r_Cq2ShTGOR93DNRS4KEA2rsyC_uib9zOhSX9tqlS_GjtZNExas-PYQvqVAOpBDnwZYMSankhaYjIJCjd3kpbhR1v0uwoW0Tw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuALRjE1x-ZZ0wX5Kxh70IlHBb4jHxfweJnCG-yvf0rw5NX4Lhj7snp81sQL3zgMbCkx7ov0tgoGOlV_K2qdEr8yJvpDJZTLvABb3h5f15i7NbaYtzfctFv-ju0-N_rKFct3xTSHiYNHb_u2z21as60fHuL1XkLcc5JFbGL4DAxCRoEhF_5JxgtmkvHjyoVrWu-Vh5L1GVs1Nuv7fS_1t9c1Mzq53WGNpdIl9-Yuw21uKmMmZDDH51dqqyqJFHXZrZYajMgbE8r5Vj0',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWQKxqOpcrlDbpWYSU9g8KPivltRMVigTbl4x9nGxc5DKzCgC56SmEUvaNf4bhJ9eLZnT5Cl53LGlN82-JNmslW09FLGvA22ZfeFwy9gxC6O4SKCBmQA0MwAIj63yaYc1w0mdARufnk07O153vI5a5SzlrEKGBTY571Kui1UsHMcedH0wLhcUfj8EBA3HZMeJWnoR5_pHedNfz4rVss5TKD04u336d_F4EBg4GAQIDZhrDUw2lRBQe4VqC1YnVh_rbdOVMaGSerlc',
];
=======
>>>>>>> Stashed changes

export default function TemplatesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
<<<<<<< Updated upstream
      .then(d => { 
        if (d.success && d.data.length > 0) {
          const baseId = d.data[0].id;
          const categories = ['wedding', 'travel', 'baby', 'relationship', 'portfolio'];
          const mockTemplates = PRODUCT_IMAGES.map((img, i) => ({
            id: baseId, // valid db ID so creation works
            name: formatProductName(img),
            description: 'Explore our artisanal templates, designed to beautifully frame your memories with timeless elegance.',
            category: categories[i % categories.length],
            thumbnail: img,
          }));
          setTemplates(mockTemplates as unknown as TemplateItem[]);
        }
        setLoading(false); 
=======
      .then(d => {
        if (d.success) setTemplates(d.data);
        setLoading(false);
>>>>>>> Stashed changes
      })
      .catch(() => setLoading(false));
  }, []);

<<<<<<< Updated upstream
  const filtered = activeCategory === 'all' ? templates : templates.filter(t => t.category === activeCategory);

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  };

  const handleUseTemplate = async (id: string) => {
    if (!isAuthenticated) { router.push(`/login?redirect=/templates/${id}`); return; }
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
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    <div style={{ minHeight: '100vh', backgroundColor: '#fff8f0', color: '#1d1b17' }}>
      <Navbar />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 96px' }}>

        {/* ── Page Header ── */}
        <header style={{ textAlign: 'center', marginBottom: 56 }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-hanken)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#745757',
              marginBottom: 16,
            }}
          >
            Our Collections
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 600,
              color: '#173124',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Curated Collections
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: 16,
              color: '#424844',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            Explore our artisanal templates, designed to beautifully frame your memories with timeless elegance.
          </p>
        </header>

        {/* ── Category Filter Pills ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 48,
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 20px',
                borderRadius: 999,
                fontFamily: 'var(--font-hanken)',
                fontSize: 14,
                fontWeight: activeCategory === cat.key ? 600 : 400,
                border: activeCategory === cat.key
                  ? '1px solid rgba(194,200,194,0.6)'
                  : '1px solid transparent',
                backgroundColor: activeCategory === cat.key ? '#e7e2da' : '#f3ede5',
                color: activeCategory === cat.key ? '#173124' : '#424844',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Create Blank CTA ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: '20px 24px',
            border: '1px dashed rgba(194,200,194,0.7)',
            borderRadius: 8,
            backgroundColor: '#f3ede5',
            marginBottom: 40,
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 17, fontWeight: 500, color: '#173124', marginBottom: 4 }}>Start with a blank canvas</p>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#424844' }}>Full creative control — no template required.</p>
          </div>
          <button
            onClick={handleBlankProject}
            disabled={!!creating}
            style={{
              flexShrink: 0,
              backgroundColor: '#173124',
              color: '#fff',
              fontFamily: 'var(--font-hanken)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '12px 24px',
              borderRadius: 4,
              border: 'none',
              cursor: creating ? 'not-allowed' : 'pointer',
              opacity: creating ? 0.6 : 1,
            }}
          >
            {creating === 'blank' ? 'Creating...' : 'Create Custom'}
          </button>
        </div>

        {/* ── Template Grid ── */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 32,
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '1.25', borderRadius: 4, marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 20, width: '65%', borderRadius: 3, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '45%', borderRadius: 3 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#424844' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c2c8c2', display: 'block', marginBottom: 16 }}>photo_library</span>
            <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 18, fontWeight: 500, marginBottom: 8 }}>No templates found</p>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14 }}>Try a different category or start with a blank canvas.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '40px 28px',
            }}
          >
            {/* Blank Canvas Card */}
            <div className="group" style={{ cursor: 'pointer' }} onClick={handleBlankProject}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1.25',
                  overflow: 'hidden',
                  backgroundColor: '#f3ede5',
                  border: '1px dashed rgba(194,200,194,0.7)',
                  borderRadius: 4,
                  padding: 8,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  transition: 'background-color 0.2s',
                }}
                className="group-hover:bg-[#e7e2da]"
              >
                 <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#173124', marginBottom: 8 }}>add</span>
                 <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, fontWeight: 600, color: '#173124' }}>
                   {creating === 'blank' ? 'Creating...' : 'Create Custom'}
                 </span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 16, fontWeight: 500, color: '#173124' }}>Blank Canvas</h3>
                <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#424844', marginTop: 4 }}>Start from scratch</p>
              </div>
            </div>

            {filtered.map((tmpl, idx) => (
              <div key={tmpl.thumbnail || idx} className="group" style={{ cursor: 'pointer' }}>
                {/* Image wrapper */}
                <Link href={`/templates/${tmpl.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '1.25',
                      overflow: 'hidden',
                      backgroundColor: '#f3ede5',
                      border: '1px solid rgba(194,200,194,0.4)',
                      borderRadius: 4,
                      padding: 8,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 8,
                        border: '1px solid rgba(194,200,194,0.2)',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />
                    <img
                      src={tmpl.thumbnail || FALLBACK[idx % FALLBACK.length]}
                      alt={tmpl.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 2,
                        transition: 'transform 0.6s ease',
                      }}
                      className="group-hover:scale-[1.04]"
                    />
                    {/* Hover overlay */}
                    <div
                      className="group-hover:opacity-100"
                      style={{
                        position: 'absolute',
                        inset: 8,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 12,
                        zIndex: 3,
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#fff', fontWeight: 500 }}>View Details</span>
                    </div>
                  </div>

                  {/* Info row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ minWidth: 0, flex: 1, marginRight: 8 }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 18,
                          fontWeight: 500,
                          color: '#173124',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tmpl.name}
                      </p>
                      <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#424844', marginTop: 2, textTransform: 'capitalize' }}>
                        {tmpl.category?.replace(/_/g, ' ') || 'Classic Cover'}
                      </p>
                    </div>
                    {(tmpl as any).price && (
                      <span style={{ fontFamily: 'var(--font-hanken)', fontWeight: 600, fontSize: 14, color: '#173124', flexShrink: 0 }}>
                        ₹{(tmpl as any).price}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <Link
                    href={`/templates/${tmpl.id}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'var(--font-hanken)',
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '9px 12px',
                      border: '1px solid rgba(194,200,194,0.6)',
                      borderRadius: 3,
                      color: '#424844',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                  >
                    View Details
                  </Link>
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
                      padding: '9px 12px',
                      backgroundColor: '#173124',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 3,
                      cursor: creating ? 'not-allowed' : 'pointer',
                      opacity: creating ? 0.6 : 1,
                    }}
                  >
=======
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
>>>>>>> Stashed changes
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

