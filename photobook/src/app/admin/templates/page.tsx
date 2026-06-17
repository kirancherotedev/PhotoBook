'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { Plus, Pencil, Trash2, BookOpen, Eye, EyeOff, Star } from 'lucide-react';

interface Template {
  id: string; name: string; description: string | null; category: string;
  isPublic: boolean; isFeatured: boolean;
  createdBy?: { name: string };
  createdAt: string;
}

export default function AdminTemplatesPage() {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'wedding', isPublic: true });

  const fetchTemplates = () => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => { if (d.success) setTemplates(d.data); setLoading(false); });
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/templates/${editId}` : '/api/templates';
    const method = editId ? 'PUT' : 'POST';

    const body = editId ? form : {
      ...form,
      designData: JSON.stringify({
        bookConfig: { size: '8x8', coverType: 'hardcover', paperType: 'matte', pageCount: 20 },
        pages: [
          { id: crypto.randomUUID(), type: 'front_cover', background: { type: 'color', value: '#FEF6F7' }, elements: [] },
          ...Array.from({ length: 20 }, () => ({
            id: crypto.randomUUID(), type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [],
          })),
          { id: crypto.randomUUID(), type: 'back_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [] },
        ],
      }),
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    if (d.success) {
      showToast(editId ? 'Template updated' : 'Template created', 'success');
      setShowModal(false);
      setEditId(null);
      setForm({ name: '', description: '', category: 'wedding', isPublic: true });
      fetchTemplates();
    } else {
      showToast(d.error || 'Failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) {
      showToast('Template deleted', 'success');
      fetchTemplates();
    }
  };

  const handleEdit = (t: Template) => {
    setEditId(t.id);
    setForm({ name: t.name, description: t.description || '', category: t.category, isPublic: t.isPublic });
    setShowModal(true);
  };

  const handleToggleFeatured = async (t: Template) => {
    await fetch(`/api/templates/${t.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !t.isFeatured }),
    });
    fetchTemplates();
  };

  return (
    <div className="page-enter">
      <div className="admin-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)' }}>Templates</h1>
          <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>{templates.length} templates</p>
        </div>
        <button onClick={() => { setEditId(null); setForm({ name: '', description: '', category: 'wedding', isPublic: true }); setShowModal(true); }} className="btn btn-primary">
          <Plus size={16} /> Add Template
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 8 }} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {templates.map(t => (
            <div key={t.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                aspectRatio: '16/9', background: 'var(--blush-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 6, position: 'relative',
              }}>
                <BookOpen size={24} color="var(--blush-900)" />
                <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blush-900)', fontWeight: 500 }}>
                  {t.category}
                </span>
                {t.isFeatured && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'var(--blush-900)', color: 'var(--blush-50)',
                    padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    <Star size={10} /> Featured
                  </div>
                )}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontWeight: 600, color: 'var(--blush-900)' }}>
                    {t.name}
                  </h4>
                  <span style={{ fontSize: 10, color: 'var(--blush-600)' }}>
                    {t.isPublic ? <Eye size={12} /> : <EyeOff size={12} />}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--blush-600)', lineHeight: 1.4, marginBottom: 10 }}>
                  {t.description || 'No description'}
                </p>
                <div style={{ fontSize: 11, color: 'var(--blush-600)', marginBottom: 12 }}>
                  By {t.createdBy?.name || 'Unknown'}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleEdit(t)} className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 11 }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleToggleFeatured(t)} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                    <Star size={12} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="btn btn-ghost btn-sm" style={{ color: '#991B1B', fontSize: 11 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--blush-900)', marginBottom: 24 }}>
              {editId ? 'Edit Template' : 'New Template'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label>Name</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="wedding">Wedding</option>
                  <option value="travel">Travel</option>
                  <option value="baby">Baby</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} style={{ accentColor: 'var(--blush-900)' }} />
                Make public (visible to all customers)
              </label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
