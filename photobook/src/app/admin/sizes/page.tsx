'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/Toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookSize {
  id: string;
  name: string;
  label: string;
  category: string;
  desc: string | null;
  widthIn: number;
  heightIn: number;
  screenW: number;
  screenH: number;
  printW: number;
  printH: number;
  isActive: boolean;
}

export default function AdminSizesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [sizes, setSizes] = useState<BookSize[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingSize, setEditingSize] = useState<BookSize | null>(null);
  const [formData, setFormData] = useState<Partial<BookSize>>({
    name: '', label: '', category: 'Square', desc: '',
    widthIn: 8, heightIn: 8, screenW: 480, screenH: 480, printW: 2400, printH: 2400, isActive: true
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    } else if (user?.role === 'admin') {
      fetchSizes();
    }
  }, [user, authLoading, router]);

  const fetchSizes = async () => {
    try {
      const res = await fetch('/api/admin/sizes');
      const data = await res.json();
      if (data.success) {
        setSizes(data.data);
      }
    } catch (error) {
      showToast('Failed to fetch sizes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingSize;
    const url = isEditing ? `/api/admin/sizes/${editingSize.id}` : '/api/admin/sizes';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Size ${isEditing ? 'updated' : 'created'} successfully`, 'success');
        setShowModal(false);
        fetchSizes();
      } else {
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (error) {
      showToast('Network error', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this size?')) return;
    try {
      const res = await fetch(`/api/admin/sizes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Size deleted', 'success');
        fetchSizes();
      }
    } catch (error) {
      showToast('Failed to delete', 'error');
    }
  };

  const openModal = (size?: BookSize) => {
    if (size) {
      setEditingSize(size);
      setFormData(size);
    } else {
      setEditingSize(null);
      setFormData({
        name: '', label: '', category: 'Square', desc: '',
        widthIn: 8, heightIn: 8, screenW: 480, screenH: 480, printW: 2400, printH: 2400, isActive: true
      });
    }
    setShowModal(true);
  };

  if (authLoading || loading) return <div style={{ padding: 48, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--blush-900)' }}>Book Sizes</h1>
            <p style={{ color: 'var(--blush-600)' }}>Manage available canvas dimensions and properties.</p>
          </div>
          <button onClick={() => openModal()} className="btn btn-primary">
            <Plus size={16} style={{ marginRight: 8 }} /> Add Size
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#6b7280', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 24px' }}>Name</th>
                <th style={{ padding: '16px 24px' }}>Category</th>
                <th style={{ padding: '16px 24px' }}>Dimensions</th>
                <th style={{ padding: '16px 24px' }}>Screen (px)</th>
                <th style={{ padding: '16px 24px' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map(size => (
                <tr key={size.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 500, color: '#111827' }}>{size.label}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{size.name}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#4b5563' }}>{size.category}</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563' }}>{size.widthIn}×{size.heightIn}″</td>
                  <td style={{ padding: '16px 24px', color: '#4b5563' }}>{size.screenW}×{size.screenH}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                      background: size.isActive ? '#dcfce7' : '#f3f4f6',
                      color: size.isActive ? '#166534' : '#4b5563'
                    }}>
                      {size.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => openModal(size)} className="btn btn-ghost btn-sm btn-icon" style={{ marginRight: 8 }} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(size.id)} className="btn btn-ghost btn-sm btn-icon" style={{ color: '#ef4444' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {sizes.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                    No sizes found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)', padding: 24, overflowY: 'auto'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 600, padding: 32, position: 'relative', margin: 'auto' }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
              >
                <X size={20} />
              </button>
              
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: '#111827', marginBottom: 24 }}>
                {editingSize ? 'Edit Size' : 'Create New Size'}
              </h2>

              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Internal ID (e.g. 8x8)</label>
                    <input required className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={!!editingSize} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Display Label</label>
                    <input required className="input" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Category</label>
                    <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Square">Square</option>
                      <option value="Landscape">Landscape</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Description</label>
                    <input className="input" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} />
                  </div>
                </div>

                <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Physical Dimensions (Inches)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Width</label>
                      <input type="number" step="0.01" required className="input" value={formData.widthIn} onChange={e => setFormData({...formData, widthIn: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Height</label>
                      <input type="number" step="0.01" required className="input" value={formData.heightIn} onChange={e => setFormData({...formData, heightIn: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8, marginBottom: 16 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Canvas/Screen Dimensions (Pixels)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Screen Width</label>
                      <input type="number" required className="input" value={formData.screenW} onChange={e => setFormData({...formData, screenW: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Screen Height</label>
                      <input type="number" required className="input" value={formData.screenH} onChange={e => setFormData({...formData, screenH: parseInt(e.target.value)})} />
                    </div>
                  </div>
                </div>

                <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8, marginBottom: 24 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Print Dimensions (300 DPI)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Print Width</label>
                      <input type="number" required className="input" value={formData.printW} onChange={e => setFormData({...formData, printW: parseInt(e.target.value)})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Print Height</label>
                      <input type="number" required className="input" value={formData.printH} onChange={e => setFormData({...formData, printH: parseInt(e.target.value)})} />
                    </div>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', marginBottom: 24, cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} style={{ marginRight: 8 }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Active (Available to users)</span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Size</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
