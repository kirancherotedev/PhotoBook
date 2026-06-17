'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { BookOpen, Plus, Pencil, Trash2, Clock } from 'lucide-react';

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
    <>
      <Navbar />
      <div className="container page-enter" style={{ padding: '48px 24px 80px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40,
        }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--blush-900)', marginBottom: 4 }}>
              My Projects
            </h1>
            <p style={{ fontSize: 14, color: 'var(--blush-600)' }}>
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>
          <button onClick={() => router.push('/templates')} className="btn btn-primary">
            <Plus size={16} /> New Book
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 200, borderRadius: 8 }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
          }}>
            <BookOpen size={48} color="var(--blush-400)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--blush-900)', marginBottom: 8 }}>
              No projects yet
            </h3>
            <p style={{ fontSize: 14, color: 'var(--blush-600)', marginBottom: 24 }}>
              Start designing your first photobook from a template or blank canvas.
            </p>
            <button onClick={() => router.push('/templates')} className="btn btn-primary">
              Browse Templates
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {projects.map(project => {
              const design = JSON.parse(project.designData);
              return (
                <div
                  key={project.id}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'var(--blush-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 8, cursor: 'pointer',
                  }}
                  onClick={() => router.push(`/editor/${project.id}`)}
                  >
                    <BookOpen size={28} color="var(--blush-900)" />
                    <span style={{ fontSize: 11, color: 'var(--blush-900)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {design.bookConfig?.size || '8x8'} · {design.bookConfig?.coverType || 'hardcover'}
                    </span>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 15, fontWeight: 600, color: 'var(--blush-900)' }}>
                          {project.name}
                        </h4>
                        {project.template && (
                          <p style={{ fontSize: 12, color: 'var(--blush-600)' }}>
                            From: {project.template.name}
                          </p>
                        )}
                      </div>
                      <span className={`badge badge-${project.status === 'draft' ? 'pending' : 'paid'}`}>
                        {project.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--blush-600)', marginBottom: 12 }}>
                      <Clock size={12} />
                      Updated {formatDate(project.updatedAt)}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => router.push(`/editor/${project.id}`)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                        disabled={project.status === 'locked'}
                      >
                        <Pencil size={13} /> {project.status === 'locked' ? 'Locked' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="btn btn-outline btn-sm btn-icon"
                        style={{ color: '#991B1B' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
