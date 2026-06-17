'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/Toast';
import { DollarSign, Save } from 'lucide-react';

interface PricingRule {
  id: string; category: string; name: string; description: string | null;
  value: number; unit: string | null; isActive: boolean;
}

export default function AdminPricingPage() {
  const { showToast } = useToast();
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/admin/pricing-rules')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setRules(d.data);
          const values: Record<string, number> = {};
          d.data.forEach((r: PricingRule) => { values[r.id] = r.value; });
          setEditValues(values);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (rule: PricingRule) => {
    const newValue = editValues[rule.id];
    if (newValue === rule.value) return;

    const res = await fetch('/api/admin/pricing-rules', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: rule.id, value: newValue }),
    });
    const d = await res.json();
    if (d.success) {
      showToast(`${rule.name} updated to ₹${newValue}`, 'success');
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, value: newValue } : r));
    }
  };

  const grouped = rules.reduce((acc, rule) => {
    if (!acc[rule.category]) acc[rule.category] = [];
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, PricingRule[]>);

  const categoryLabels: Record<string, string> = {
    base_price: 'Base Prices (by size)',
    per_page: 'Per-Page Costs',
    cover_type: 'Cover Type Surcharges',
    paper_type: 'Paper Type Surcharges',
  };

  return (
    <div className="page-enter">
      <div className="admin-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)' }}>Pricing Rules</h1>
          <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>Edit prices without a code deploy</p>
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 400, borderRadius: 8 }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {Object.entries(grouped).map(([category, categoryRules]) => (
            <div key={category}>
              <h3 style={{
                fontSize: 14, fontWeight: 600, color: 'var(--blush-900)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <DollarSign size={14} />
                {categoryLabels[category] || category}
              </h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price (₹)</th>
                      <th>Active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryRules.map(rule => (
                      <tr key={rule.id}>
                        <td style={{ fontWeight: 500 }}>{rule.name}</td>
                        <td className="text-muted" style={{ fontSize: 13 }}>{rule.description || '—'}</td>
                        <td>
                          <input
                            type="number"
                            className="input"
                            style={{ width: 100, padding: '4px 8px', fontSize: 13 }}
                            value={editValues[rule.id] ?? rule.value}
                            onChange={e => setEditValues(prev => ({ ...prev, [rule.id]: +e.target.value }))}
                          />
                        </td>
                        <td>
                          <span className={`badge ${rule.isActive ? 'badge-paid' : 'badge-cancelled'}`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {editValues[rule.id] !== rule.value && (
                            <button onClick={() => handleSave(rule)} className="btn btn-primary btn-sm" style={{ fontSize: 11 }}>
                              <Save size={12} /> Save
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
