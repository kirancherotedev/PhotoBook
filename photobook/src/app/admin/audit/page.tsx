'use client';

import { useEffect, useState } from 'react';
import { FileText, Clock, User } from 'lucide-react';

interface AuditEntry {
  id: string; action: string; entity: string; entityId: string | null;
  details: string | null; createdAt: string;
  user: { name: string; email: string };
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-log')
      .then(r => r.json())
      .then(d => { if (d.success) setLogs(d.data); setLoading(false); });
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const actionColors: Record<string, string> = {
    create: '#059669',
    update: '#3B82F6',
    update_status: '#6366F1',
    delete: '#EF4444',
  };

  return (
    <div className="page-enter">
      <div className="admin-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--blush-900)' }}>Audit Log</h1>
          <p style={{ fontSize: 13, color: 'var(--blush-600)' }}>Track all admin actions</p>
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 400, borderRadius: 8 }} />
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--blush-600)' }}>
          <FileText size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p>No audit entries yet. Actions will appear here as admins make changes.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {logs.map((log, idx) => (
            <div
              key={log.id}
              style={{
                display: 'flex', gap: 16, padding: '16px 0',
                borderBottom: idx < logs.length - 1 ? '0.5px solid var(--blush-400)' : 'none',
              }}
            >
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: actionColors[log.action] || 'var(--blush-400)',
                  flexShrink: 0, marginTop: 4,
                }} />
                {idx < logs.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'var(--blush-400)', marginTop: 4 }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.04em', color: actionColors[log.action] || 'var(--blush-600)',
                  }}>
                    {log.action.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--blush-900)', fontWeight: 500, textTransform: 'capitalize' }}>
                    {log.entity.replace('_', ' ')}
                  </span>
                </div>

                {log.details && (
                  <div style={{
                    fontSize: 12, color: 'var(--blush-600)',
                    background: 'var(--blush-100)', padding: '6px 10px',
                    borderRadius: 4, fontFamily: 'monospace', marginBottom: 6,
                    maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {log.details}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--blush-600)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={10} /> {log.user.name}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {formatDate(log.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
