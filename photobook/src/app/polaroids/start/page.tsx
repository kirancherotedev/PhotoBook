'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function StartPolaroid() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/editor/guest?type=polaroid');
    } else {
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Polaroids', projectType: 'polaroid' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) router.push(`/editor/${data.data.id}`);
          else router.push('/editor/guest?type=polaroid');
        })
        .catch(() => router.push('/editor/guest?type=polaroid'));
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)' }}>
      <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>Starting Polaroid Studio...</p>
    </div>
  );
}
