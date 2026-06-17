'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import { BookOpen, ArrowRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TemplateItem } from '@/lib/types';

const categories = ['all', 'wedding', 'travel', 'baby', 'portfolio'];

export default function TemplatesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => {
        if (d.success) setTemplates(d.data);
        setLoading(false);
      });
  }, []);

  const filtered = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory);

  const handleUseTemplate = async (templateId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/templates');
      return;
    }

    setCreating(templateId);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/editor/${data.data.id}`);
      } else {
        showToast(data.error || 'Failed to create project', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
    setCreating(null);
  };

  const handleBlankProject = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/templates');
      return;
    }
    setCreating('blank');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Photo Book' }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/editor/${data.data.id}`);
      }
    } catch {
      showToast('Network error', 'error');
    }
    setCreating(null);
  };

  return (
    <>
      <Navbar />
      <div className="container page-enter" style={{ padding: '48px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--blush-600)', marginBottom: 12,
          }}>
            Choose Your Starting Point
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--blush-900)', marginBottom: 12,
          }}>
            Template Gallery
          </h1>
          <p style={{ fontSize: 15, color: 'var(--blush-600)', maxWidth: 500, margin: '0 auto' }}>
            Pick a template to get started, or begin from a blank canvas. Every element is fully customizable.
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 40,
        }}>
          <Filter size={14} color="var(--blush-600)" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blank Canvas Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={handleBlankProject}
            style={{
              background: 'var(--blush-50)',
              border: '1px dashed var(--blush-400)',
              borderRadius: 8,
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            <div style={{
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: '1px dashed var(--blush-400)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, color: 'var(--blush-600)',
              }}>+</div>
              <span style={{ fontSize: 13, color: 'var(--blush-600)', fontWeight: 500 }}>
                {creating === 'blank' ? 'Creating...' : 'Blank Canvas'}
              </span>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '0.5px solid var(--blush-400)' }}>
              <h4 style={{
                fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600,
                color: 'var(--blush-900)', marginBottom: 4,
              }}>Start from Scratch</h4>
              <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>
                Complete creative freedom with a blank canvas
              </p>
            </div>
          </motion.div>

          {/* Template Cards */}
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '4/3' }} />
                <div style={{ padding: 20 }}>
                  <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '90%' }} />
                </div>
              </div>
            ))
          ) : (
            filtered.map(template => (
              <motion.div
                key={template.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--blush-100)',
                  border: '0.5px solid var(--blush-400)',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  aspectRatio: '4/3',
                  background: 'var(--blush-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  <BookOpen size={32} color="var(--blush-900)" />
                  <span style={{
                    fontSize: 11, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: 'var(--blush-900)', fontWeight: 500,
                  }}>
                    {template.category}
                  </span>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600,
                    color: 'var(--blush-900)', marginBottom: 6,
                  }}>
                    {template.name}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--blush-600)', lineHeight: 1.5, marginBottom: 16 }}>
                    {template.description}
                  </p>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    disabled={creating === template.id}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    {creating === template.id ? 'Creating...' : 'Use Template'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
