'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';

interface Project {
  id: string;
  name: string;
  status: string;
  designData: string;
  createdAt: string;
  updatedAt: string;
  template?: { name: string; category: string } | null;
}

export default function MyProjectsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/my-projects');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/projects')
        .then(r => r.json())
        .then(d => {
          if (d.success) setProjects(d.data);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  if (isLoading) return null;

  return (
    <div style={{ backgroundColor: '#fff8f0', color: '#1d1b17', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '48px 24px 80px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 500, color: '#173124', marginBottom: 4 }}>
              My Projects
            </h1>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#424844' }}>
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
          <button
            onClick={() => router.push('/templates')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
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
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            New Book
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 240, borderRadius: 8 }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              backgroundColor: '#fff',
              border: '1px dashed rgba(194,200,194,0.8)',
              borderRadius: 8,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#c2c8c2', marginBottom: 16 }}>photo_library</span>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 500, color: '#173124', marginBottom: 8 }}>
              No projects yet
            </h3>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 14, color: '#424844', marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
              Start designing your first photobook from a template or blank canvas.
            </p>
            <button
              onClick={() => router.push('/templates')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: '1px solid #173124',
                color: '#173124',
                fontFamily: 'var(--font-hanken)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Browse Templates
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {projects.map(project => {
              const design = JSON.parse(project.designData);
              const previewSrc = design.pages?.[0]?.content?.image || null;

              return (
                <div
                  key={project.id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid rgba(194,200,194,0.4)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '1.25',
                      backgroundColor: '#f3ede5',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid rgba(194,200,194,0.2)',
                    }}
                  >
                    {previewSrc ? (
                      <img src={previewSrc} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c2c8c2' }}>image</span>
                    )}
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span
                        style={{
                          backgroundColor: project.status === 'draft' ? '#f3ede5' : '#e6f4ea',
                          color: project.status === 'draft' ? '#424844' : '#137333',
                          padding: '4px 10px',
                          borderRadius: 999,
                          fontFamily: 'var(--font-hanken)',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          border: '1px solid rgba(0,0,0,0.05)',
                        }}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ marginBottom: 16 }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 18,
                          fontWeight: 500,
                          color: '#173124',
                          marginBottom: 4,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {project.name}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-hanken)', fontSize: 13, color: '#727973', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                        Edited {formatDate(project.updatedAt)}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto' }}>
                      <button
                        onClick={() => router.push(`/editor/${project.id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '10px',
                          backgroundColor: '#173124',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          fontFamily: 'var(--font-hanken)',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          padding: '10px',
                          backgroundColor: '#fff',
                          color: '#ba1a1a',
                          border: '1px solid rgba(186,26,26,0.3)',
                          borderRadius: 4,
                          fontFamily: 'var(--font-hanken)',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
