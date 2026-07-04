'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEditorStore } from '@/store/editor-store';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { DesignData, TextProperties } from '@/lib/types';
<<<<<<< Updated upstream
import {
  Save, ChevronLeft, ChevronRight, Plus, Trash2, Type, Image as ImageIcon,
  Palette, Settings, Eye, ShoppingCart, ArrowLeft, BookOpen, ZoomIn, ZoomOut,
  Square, RotateCcw,
=======
import { photobookCoversRegistry } from '@/lib/curated-themes';
import Link from 'next/link';
import { 
  ImagePlus, Type, Palette, Plus, Trash2, 
  ShoppingBag, Undo, Redo, Save, Settings, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  ZoomIn, ZoomOut, UploadCloud, X
>>>>>>> Stashed changes
} from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestType = searchParams.get('type');
<<<<<<< Updated upstream
=======
  const templateId = searchParams.get('templateId');
  const themeFileName = searchParams.get('themeFileName');
>>>>>>> Stashed changes
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const {
    designData, currentPageIndex, selectedElementId, isDirty, isSaving, lastSaved, projectName,
<<<<<<< Updated upstream
    setProject, setProjectName, setCurrentPage, selectElement,
    updateBookConfig, addPage, removePage, updatePageBackground,
    addElement, updateElement, removeElement,
=======
    history, historyIndex,
    setProject, setCurrentPage, selectElement,
    updateBookConfig, addPage, removePage, updatePageBackground,
    addElement, updateElement, removeElement,
    undo, redo,
>>>>>>> Stashed changes
    markSaving, markSaved,
  } = useEditorStore();

  const [loading, setLoading] = useState(true);
<<<<<<< Updated upstream
  const [activePanel, setActivePanel] = useState<'photos' | 'text' | 'backgrounds' | 'pages' | 'settings'>('pages');
  const [zoom, setZoom] = useState(0.7);
=======
  const [activePanel, setActivePanel] = useState<'photos' | 'text' | 'backgrounds' | 'settings'>('photos');
  const [zoom, setZoom] = useState(0.85);
>>>>>>> Stashed changes
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

<<<<<<< Updated upstream
  // Load project
  useEffect(() => {
    if (projectId === 'guest') {
=======
  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Load project
  useEffect(() => {
    if (projectId === 'guest') {
      if (templateId) {
        fetch(`/api/templates/${templateId}`)
          .then(r => r.json())
          .then(d => {
            if (d.success) {
              const data = JSON.parse(d.data.designData) as DesignData;
              setProject('guest', d.data.name, data);
            } else {
              showToast('Template not found', 'error');
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
        return;
      }
      
>>>>>>> Stashed changes
      let defaultPages;
      if (guestType === 'polaroid') {
        defaultPages = [
          { id: 'page-1', type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [] }
        ];
<<<<<<< Updated upstream
=======
      } else if (themeFileName) {
        const theme = photobookCoversRegistry.find(t => t.fileName === themeFileName);
        const scale = 540 / 1200; // 10x10 canvas size is 540
        const elements = theme ? [
          ...theme.imageBoxes.map((box, i) => ({
            id: `img-${i}`,
            type: 'image' as const,
            x: box.x * scale,
            y: box.y * scale,
            width: box.width * scale,
            height: box.height * scale,
            rotation: 0,
            zIndex: i + 1,
            properties: { src: `/polaroids/${(i % 6) + 1}.png` }
          })),
          ...theme.textBoxes.map((box, i) => ({
            id: `txt-${i}`,
            type: 'text' as const,
            x: box.x * scale,
            y: box.y * scale,
            width: box.width * scale,
            height: box.height * scale,
            rotation: 0,
            zIndex: theme.imageBoxes.length + i + 1,
            properties: { 
              content: box.content, 
              fontFamily: 'var(--font-inter), sans-serif', 
              fontSize: box.fontSize * scale, 
              color: '#0A0A0A', 
              textAlign: box.textAlign,
              fontWeight: '400'
            }
          }))
        ] : [];
        
        defaultPages = [
          { id: 'page-front', type: 'front_cover', background: { type: 'color', value: '#FAF7F3' }, elements },
          ...Array.from({ length: 20 }).map((_, i) => ({ id: `page-${i}`, type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [] })),
          { id: 'page-back', type: 'back_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [] }
        ];
>>>>>>> Stashed changes
      } else {
        defaultPages = [
          { id: 'page-front', type: 'front_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [] },
          ...Array.from({ length: 20 }).map((_, i) => ({ id: `page-${i}`, type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [] })),
          { id: 'page-back', type: 'back_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [] }
        ];
      }
      setProject('guest', guestType === 'polaroid' ? 'My Polaroids' : 'Guest Project', {
        bookConfig: { projectType: guestType === 'polaroid' ? 'polaroid' : 'photobook', size: '10x10', coverType: 'hardcover', paperType: 'matte', pageCount: defaultPages.length },
        pages: defaultPages as any,
      });
      setLoading(false);
      return;
    }
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated && projectId) {
      fetch(`/api/projects/${projectId}`)
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            const data = JSON.parse(d.data.designData) as DesignData;
            setProject(d.data.id, d.data.name, data);
          } else {
            showToast('Project not found', 'error');
            router.push('/my-projects');
          }
          setLoading(false);
        });
    }
  }, [authLoading, isAuthenticated, projectId, router, setProject, showToast]);

  // Autosave
  const autoSave = useCallback(async () => {
<<<<<<< Updated upstream
    if (!projectId || !isDirty || isSaving || projectId === 'guest') return;
=======
    if (!isDirty || !projectId || projectId === 'guest') return;
>>>>>>> Stashed changes
    markSaving();
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designData }),
      });
      markSaved();
    } catch {
      showToast('Failed to save', 'error');
    }
  }, [isDirty, projectId, designData, markSaving, markSaved, showToast]);

  useEffect(() => {
    if (isDirty) {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(autoSave, 2000);
    }
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [isDirty, autoSave]);

  const currentPage = designData.pages[currentPageIndex];
<<<<<<< Updated upstream

  // Canvas dimensions
  const isPolaroid = designData.bookConfig.projectType === 'polaroid';
  const sizeMap: Record<string, number> = { '8x8': 480, '10x10': 540, '12x12': 600 };
  const baseSize = sizeMap[designData.bookConfig.size] || 540;
  
  const canvasHeight = baseSize;
  const canvasWidth = isPolaroid ? baseSize * (88 / 107) : baseSize;

  // Mouse handlers for dragging elements
=======
  const sizeMap: Record<string, number> = { '8x8': 480, '10x10': 540, '12x12': 600 };
  const canvasSize = sizeMap[designData.bookConfig.size] || 480;

>>>>>>> Stashed changes
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    selectElement(elementId);
    const el = currentPage?.elements.find(el => el.id === elementId);
    if (!el) return;
    setDragging(elementId);
    setDragStart({ x: e.clientX, y: e.clientY, elX: el.x, elY: el.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !currentPage) return;
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    const el = currentPage.elements.find(el => el.id === dragging);
    if (!el) return;
    updateElement(currentPage.id, dragging, {
      x: Math.round(dragStart.elX + dx),
      y: Math.round(dragStart.elY + dy),
    });
  }, [dragging, currentPage, dragStart, zoom, updateElement]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

<<<<<<< Updated upstream
  // Add text element
=======
>>>>>>> Stashed changes
  const handleAddText = () => {
    if (!currentPage) return;
    addElement(currentPage.id, {
      type: 'text',
<<<<<<< Updated upstream
      x: canvasWidth / 2 - 100,
      y: isPolaroid ? canvasHeight * 0.8 : canvasHeight / 2 - 20,
=======
      x: canvasSize / 2 - 100,
      y: canvasSize / 2 - 20,
>>>>>>> Stashed changes
      width: 200,
      height: 40,
      rotation: 0,
      zIndex: currentPage.elements.length + 1,
      properties: {
        content: 'Double-click to edit',
        fontFamily: 'Inter',
        fontSize: 18,
<<<<<<< Updated upstream
        color: 'var(--color-on-surface)',
=======
        color: '#0A0A0A',
>>>>>>> Stashed changes
        textAlign: 'center',
        fontWeight: '400',
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentPage) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
<<<<<<< Updated upstream
        let w = img.width;
        let h = img.height;
        const ratio = img.width / img.height;
        
        let targetX = 0;
        let targetY = 0;

        if (currentPage.type === 'front_cover' || currentPage.type === 'back_cover') {
          // Full bleed for covers
          w = canvasWidth;
          h = canvasHeight;
          targetX = 0;
          targetY = 0;
        } else if (isPolaroid) {
          // Polaroid photo area is a perfect square at the top
          const margin = canvasWidth * 0.06;
          const photoAreaSize = canvasWidth - (margin * 2);
          
          // Force the element to be a perfect square, it will be cropped by objectFit: cover
          w = photoAreaSize;
          h = photoAreaSize;
          
          targetX = margin;
          targetY = margin;
        } else {
          // Content pages get some padding (fit within 85%)
          const maxW = canvasWidth * 0.85;
          const maxH = canvasHeight * 0.85;
          
          if (w > maxW || h > maxH) {
             if (w / maxW > h / maxH) {
                w = maxW;
                h = w / ratio;
             } else {
                h = maxH;
                w = h * ratio;
             }
          }
          targetX = (canvasWidth - w) / 2;
          targetY = (canvasHeight - h) / 2;
        }

        addElement(currentPage.id, {
          type: 'image',
          x: targetX,
          y: targetY,
=======
        const maxW = canvasSize * 0.6;
        const ratio = img.width / img.height;
        const w = Math.min(maxW, img.width);
        const h = w / ratio;
        addElement(currentPage.id, {
          type: 'image',
          x: (canvasSize - w) / 2,
          y: (canvasSize - h) / 2,
>>>>>>> Stashed changes
          width: w,
          height: h,
          rotation: 0,
          zIndex: currentPage.elements.length + 1,
          properties: {
            src: reader.result as string,
            originalWidth: img.width,
            originalHeight: img.height,
          },
        });
<<<<<<< Updated upstream

        // Auto-advance to the next page if not on the last page
        if (currentPageIndex < designData.pages.length - 1) {
          setCurrentPage(currentPageIndex + 1);
        }
=======
>>>>>>> Stashed changes
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selectedElement = currentPage?.elements.find(el => el.id === selectedElementId);

  if (loading || authLoading) {
    return (
<<<<<<< Updated upstream
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-surface)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen size={36} color="var(--color-on-surface-variant)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>Loading editor...</p>
        </div>
=======
      <div className="h-screen w-screen bg-[#FFFFFF] flex flex-col items-center justify-center">
        <div className="animate-spin-slow w-8 h-8 border-4 border-[#E85D2C] border-t-transparent rounded-full mb-4"></div>
        <p className="text-[#E85D2C] font-medium">Loading studio...</p>
>>>>>>> Stashed changes
      </div>
    );
  }

  return (
<<<<<<< Updated upstream
    <div className="editor-layout">
      {/* ── Toolbar ── */}
      <div className="editor-toolbar">
        <button onClick={() => router.push(isAuthenticated ? '/my-projects' : '/templates')} className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontWeight: 600, 
              fontSize: 15, 
              color: 'var(--color-primary)',
              background: 'transparent',
              border: '1px solid transparent',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              textAlign: 'center',
              outline: 'none',
              padding: '2px 8px',
              maxWidth: 200,
            }}
            placeholder="Untitled Book"
          />
          <span style={{ fontSize: 11, color: 'var(--color-on-surface-variant)' }}>
            Page {currentPageIndex + 1} of {designData.pages.length}
=======
    <div className="flex flex-col h-screen w-full bg-[#f9f3eb] text-[#0A0A0A] font-sans overflow-hidden">
      
      {/* TopBar */}
      <header className="h-14 shrink-0 border-b border-[#E8E2DA] bg-[#FFFFFF] flex items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-xl tracking-tight text-[#0A0A0A] hover:text-[#E85D2C] transition-colors">
            PhotoBook<span className="text-[#E85D2C]">.</span>
          </Link>
          <span className="text-xs text-[#8A8A8A] hidden sm:inline">
            {projectName} · {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Saved'}
>>>>>>> Stashed changes
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={historyIndex <= 0} className={`p-1.5 rounded transition-colors ${historyIndex > 0 ? 'text-[#0A0A0A] hover:bg-[#f9f3eb]' : 'text-[#8A8A8A] opacity-50 cursor-not-allowed'}`} title="Undo (Ctrl+Z)"><Undo size={16}/></button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className={`p-1.5 rounded transition-colors ${historyIndex < history.length - 1 ? 'text-[#0A0A0A] hover:bg-[#f9f3eb]' : 'text-[#8A8A8A] opacity-50 cursor-not-allowed'}`} title="Redo (Ctrl+Y)"><Redo size={16}/></button>
          
          <div className="w-px h-4 bg-[#E8E2DA] mx-2"></div>
          
          <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="p-1.5 rounded hover:bg-[#f9f3eb] text-[#0A0A0A] transition-colors"><ZoomOut size={16}/></button>
          <span className="text-xs text-[#8A8A8A] w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 rounded hover:bg-[#f9f3eb] text-[#0A0A0A] transition-colors"><ZoomIn size={16}/></button>

<<<<<<< Updated upstream
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--color-on-surface-variant)' }}>
            {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ''}
          </span>
          <button onClick={autoSave} className="btn btn-ghost btn-sm" disabled={!isDirty}>
            <Save size={14} /> Save
          </button>
          <button onClick={() => router.push(`/checkout/cart?projectId=${projectId}`)} className="btn btn-primary btn-sm">
            <ShoppingCart size={14} /> Checkout
=======
          <div className="w-px h-4 bg-[#E8E2DA] mx-2"></div>
          
          <button onClick={autoSave} disabled={!isDirty} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[#4A4A4A] hover:bg-[#f9f3eb] text-xs font-medium transition-colors disabled:opacity-50">
            <Save size={14} />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button onClick={() => router.push(`/checkout/cart?projectId=${projectId}`)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-[#E85D2C] text-[#FFFFFF] text-sm font-medium hover:bg-[#C84A1F] transition-colors">
            <ShoppingBag size={14} />
            Checkout
>>>>>>> Stashed changes
          </button>
        </div>
      </header>

<<<<<<< Updated upstream
      {/* ── Left Side Panel ── */}
      <div className="editor-sidepanel">
        {/* Panel Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { key: 'photos' as const, icon: <ImageIcon size={14} />, label: 'Photos' },
            { key: 'text' as const, icon: <Type size={14} />, label: 'Text' },
            { key: 'backgrounds' as const, icon: <Palette size={14} />, label: 'Bg' },
            { key: 'pages' as const, icon: <BookOpen size={14} />, label: 'Pages' },
            { key: 'settings' as const, icon: <Settings size={14} />, label: 'Book' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActivePanel(tab.key)}
              className={`btn btn-sm ${activePanel === tab.key ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12, padding: '5px 10px' }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Photos Panel */}
        {activePanel === 'photos' && (
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 12 }}>Upload Photos</h4>
            <label
              className="btn btn-outline btn-sm"
              style={{ width: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
            >
              <ImageIcon size={14} /> Choose File
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <p style={{ fontSize: 11, color: 'var(--color-on-surface-variant)', marginTop: 8, textAlign: 'center' }}>
              Drag uploaded photos onto the canvas
            </p>
          </div>
        )}

        {/* Text Panel */}
        {activePanel === 'text' && (
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 12 }}>Add Text</h4>
            <button onClick={handleAddText} className="btn btn-outline btn-sm" style={{ width: '100%', marginBottom: 8 }}>
              <Type size={14} /> Add Heading
            </button>
            <button
              onClick={() => {
                if (!currentPage) return;
                addElement(currentPage.id, {
                  type: 'text', x: canvasWidth / 2 - 80, y: (isPolaroid ? canvasHeight * 0.8 : canvasHeight / 2 - 10),
                  width: 160, height: 24, rotation: 0, zIndex: currentPage.elements.length + 1,
                  properties: {
                    content: 'Body text', fontFamily: 'Inter', fontSize: 13,
                    color: 'var(--color-on-surface)', textAlign: 'left', fontWeight: '400',
                  },
                });
              }}
              className="btn btn-outline btn-sm"
              style={{ width: '100%' }}
            >
              <Type size={12} /> Add Body Text
            </button>
          </div>
        )}

        {/* Backgrounds Panel */}
        {activePanel === 'backgrounds' && (
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 12 }}>Page Background</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {['#FFFFFF', '#FEF6F7', '#F0DADD', '#E5BDC5', '#F5F0EB', '#E8E4E0', '#F0F0F0', '#2C2C2C'].map(color => (
                <button
                  key={color}
                  onClick={() => currentPage && updatePageBackground(currentPage.id, { type: 'color', value: color })}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 4,
                    background: color, border: `1.5px solid ${currentPage?.background.value === color ? 'var(--color-primary)' : 'var(--color-outline-variant)'}`,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pages Panel */}
        {activePanel === 'pages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>Pages ({designData.pages.length})</h4>
              <button onClick={addPage} className="btn btn-ghost btn-sm" style={{ padding: 4 }}>
                <Plus size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {designData.pages.map((page, idx) => (
                <div
                  key={page.id}
                  onClick={() => setCurrentPage(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                    borderRadius: 4, cursor: 'pointer',
                    background: idx === currentPageIndex ? 'var(--color-surface-container)' : 'transparent',
                    border: idx === currentPageIndex ? '0.5px solid var(--color-outline-variant)' : '0.5px solid transparent',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 3, flexShrink: 0,
                    background: page.background.value || '#fff',
                    border: '0.5px solid var(--color-outline-variant)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'var(--color-on-surface-variant)',
                  }}>
                    {page.elements.find(el => el.type === 'image') ? (
                      <img 
                        src={(page.elements.find(el => el.type === 'image')!.properties as { src: string }).src} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                        alt="" 
                      />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-primary)', textTransform: 'capitalize' }}>
                      {page.type === 'content' ? `Page ${idx}` : page.type.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-on-surface-variant)' }}>
                      {page.elements.length} element{page.elements.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {page.type === 'content' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                      className="btn btn-ghost btn-sm btn-icon"
                      style={{ padding: 3 }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Settings Panel */}
        {activePanel === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
              {isPolaroid ? 'Polaroid Settings' : 'Book Settings'}
            </h4>
            {!isPolaroid && (
              <>
                <div className="input-group">
                  <label>Size</label>
                  <select className="input" value={designData.bookConfig.size} onChange={e => updateBookConfig({ size: e.target.value as DesignData['bookConfig']['size'] })}>
                    <option value="8x8">8×8 inch</option>
                    <option value="10x10">10×10 inch</option>
                    <option value="12x12">12×12 inch</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Cover Type</label>
                  <select className="input" value={designData.bookConfig.coverType} onChange={e => updateBookConfig({ coverType: e.target.value as DesignData['bookConfig']['coverType'] })}>
                    <option value="hardcover">Hardcover</option>
                    <option value="softcover">Softcover</option>
                    <option value="leather">Leather</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Paper Type</label>
                  <select className="input" value={designData.bookConfig.paperType} onChange={e => updateBookConfig({ paperType: e.target.value as DesignData['bookConfig']['paperType'] })}>
                    <option value="matte">Matte</option>
                    <option value="glossy">Glossy</option>
                    <option value="silk">Silk</option>
                  </select>
                </div>
              </>
            )}
            {isPolaroid && (
              <div style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}>
                Polaroid frames use premium vintage stock. Configure border tint from the Backgrounds tab!
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Canvas Area ── */}
      <div className="editor-canvas-area" onClick={() => selectElement(null)}>
        {/* Zoom Controls */}
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-surface)',
          border: '0.5px solid var(--color-outline-variant)', borderRadius: 6, padding: '4px 8px', zIndex: 10,
        }}>
          <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="btn btn-ghost btn-icon" style={{ padding: 4 }}>
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', minWidth: 40, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="btn btn-ghost btn-icon" style={{ padding: 4 }}>
            <ZoomIn size={14} />
          </button>
          <button onClick={() => setZoom(0.7)} className="btn btn-ghost btn-icon" style={{ padding: 4 }}>
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Page Navigation */}
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPageIndex - 1))}
          disabled={currentPageIndex === 0}
          className="btn btn-ghost btn-icon"
          style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'var(--color-surface)', border: '0.5px solid var(--color-outline-variant)',
            zIndex: 10, opacity: currentPageIndex === 0 ? 0.3 : 1,
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentPage(Math.min(designData.pages.length - 1, currentPageIndex + 1))}
          disabled={currentPageIndex >= designData.pages.length - 1}
          className="btn btn-ghost btn-icon"
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'var(--color-surface)', border: '0.5px solid var(--color-outline-variant)',
            zIndex: 10, opacity: currentPageIndex >= designData.pages.length - 1 ? 0.3 : 1,
          }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Canvas */}
        {currentPage && (
          <div
            ref={canvasRef}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              background: currentPage.background.value || '#FFFFFF',
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              position: 'relative',
              border: '0.5px solid var(--color-outline-variant)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Page type label */}
            <div style={{
              position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 6px',
              background: 'var(--color-surface-variant)', borderRadius: 3, color: 'var(--color-on-surface-variant)',
              textTransform: 'uppercase', letterSpacing: '0.06em', zIndex: 50,
            }}>
              {currentPage.type.replace('_', ' ')}
            </div>

            {/* Elements */}
            {currentPage.elements
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(element => (
                <div
                  key={element.id}
                  onMouseDown={(e) => handleMouseDown(e, element.id)}
                  onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
                  style={{
                    position: 'absolute',
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: `rotate(${element.rotation}deg)`,
                    cursor: dragging === element.id ? 'grabbing' : 'grab',
                    outline: selectedElementId === element.id ? '2px solid var(--color-primary)' : 'none',
                    outlineOffset: 2,
                    zIndex: element.zIndex,
                    userSelect: 'none',
                  }}
                >
                  {element.type === 'image' && (
                    <img
                      src={(element.properties as { src: string }).src}
                      alt=""
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                    />
                  )}
                  {element.type === 'text' && (
                    <div
                      contentEditable={selectedElementId === element.id}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        updateElement(currentPage.id, element.id, {
                          properties: { ...(element.properties as TextProperties), content: e.currentTarget.textContent || '' },
                        });
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        fontFamily: (element.properties as TextProperties).fontFamily,
                        fontSize: (element.properties as TextProperties).fontSize,
                        color: (element.properties as TextProperties).color,
                        textAlign: (element.properties as TextProperties).textAlign,
                        fontWeight: (element.properties as TextProperties).fontWeight || '400',
                        letterSpacing: (element.properties as TextProperties).letterSpacing,
                        lineHeight: 1.4,
                        outline: 'none',
                        overflow: 'hidden',
                        cursor: selectedElementId === element.id ? 'text' : 'grab',
                      }}
                    >
                      {(element.properties as TextProperties).content}
                    </div>
                  )}

                  {/* Resize handle */}
                  {selectedElementId === element.id && (
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startW = element.width;
                        const startH = element.height;

                        const onMove = (e2: MouseEvent) => {
                          const dw = (e2.clientX - startX) / zoom;
                          const dh = (e2.clientY - startY) / zoom;
                          updateElement(currentPage.id, element.id, {
                            width: Math.max(40, startW + dw),
                            height: Math.max(20, startH + dh),
                          });
                        };
                        const onUp = () => {
                          window.removeEventListener('mousemove', onMove);
                          window.removeEventListener('mouseup', onUp);
                        };
                        window.addEventListener('mousemove', onMove);
                        window.addEventListener('mouseup', onUp);
                      }}
                      style={{
                        position: 'absolute', right: -5, bottom: -5,
                        width: 10, height: 10, background: 'var(--color-primary)',
                        borderRadius: 2, cursor: 'nwse-resize',
                      }}
                    />
                  )}
                </div>
              ))}

            {/* Click to add image overlay */}
            {currentPage && currentPage.elements.length === 0 && (
              <label
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-hanken)',
                  fontSize: 14,
                  cursor: 'pointer',
                  zIndex: 9999,
                }}
              >
                <span>Click here to add image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        )}
      </div>

      {/* ── Right Properties Panel ── */}
      <div className="editor-properties">
        {selectedElement ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'capitalize' }}>
                {selectedElement.type} Properties
              </h4>
              <button
                onClick={() => currentPage && removeElement(currentPage.id, selectedElement.id)}
                className="btn btn-ghost btn-sm btn-icon"
                style={{ color: '#991B1B' }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Position & Size */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Position & Size
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div className="input-group">
                  <label style={{ fontSize: 10 }}>X</label>
                  <input
                    type="number" className="input" style={{ padding: '4px 8px', fontSize: 12 }}
                    value={Math.round(selectedElement.x)}
                    onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, { x: +e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: 10 }}>Y</label>
                  <input
                    type="number" className="input" style={{ padding: '4px 8px', fontSize: 12 }}
                    value={Math.round(selectedElement.y)}
                    onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, { y: +e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: 10 }}>W</label>
                  <input
                    type="number" className="input" style={{ padding: '4px 8px', fontSize: 12 }}
                    value={Math.round(selectedElement.width)}
                    onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, { width: +e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: 10 }}>H</label>
                  <input
                    type="number" className="input" style={{ padding: '4px 8px', fontSize: 12 }}
                    value={Math.round(selectedElement.height)}
                    onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, { height: +e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Text-specific properties */}
            {selectedElement.type === 'text' && (() => {
              const props = selectedElement.properties as TextProperties;
              return (
                <>
                  <div className="input-group">
                    <label>Font Family</label>
                    <select
                      className="input"
                      value={props.fontFamily}
                      onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, {
                        properties: { ...props, fontFamily: e.target.value },
                      })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div className="input-group">
                      <label>Font Size</label>
                      <input type="number" className="input" value={props.fontSize}
                        onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, {
                          properties: { ...props, fontSize: +e.target.value },
                        })} />
                    </div>
                    <div className="input-group">
                      <label>Color</label>
                      <input type="color" className="input" value={props.color} style={{ padding: 2, height: 34 }}
                        onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, {
                          properties: { ...props, color: e.target.value },
                        })} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Alignment</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['left', 'center', 'right'] as const).map(align => (
                        <button
                          key={align}
                          onClick={() => currentPage && updateElement(currentPage.id, selectedElement.id, {
                            properties: { ...props, textAlign: align },
                          })}
                          className={`btn btn-sm ${props.textAlign === align ? 'btn-primary' : 'btn-outline'}`}
                          style={{ flex: 1, textTransform: 'capitalize', fontSize: 11 }}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Font Weight</label>
                    <select className="input" value={props.fontWeight || '400'}
                      onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, {
                        properties: { ...props, fontWeight: e.target.value },
                      })}>
                      <option value="300">Light</option>
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi Bold</option>
                      <option value="700">Bold</option>
                    </select>
                  </div>
                </>
              );
            })()}

            {/* Image-specific properties */}
            {selectedElement.type === 'image' && (
              <div className="input-group">
                <label>Opacity</label>
                <input
                  type="range" min="0.1" max="1" step="0.05"
                  value={(selectedElement.properties as { opacity?: number }).opacity || 1}
                  onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, {
                    properties: { ...selectedElement.properties, opacity: +e.target.value },
                  })}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {/* Z-Index */}
            <div className="input-group">
              <label>Layer Order</label>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => currentPage && updateElement(currentPage.id, selectedElement.id, {
                    zIndex: Math.max(1, selectedElement.zIndex - 1),
                  })}
                  className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 11 }}
                >
                  Back
                </button>
                <button
                  onClick={() => currentPage && updateElement(currentPage.id, selectedElement.id, {
                    zIndex: selectedElement.zIndex + 1,
                  })}
                  className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 11 }}
                >
                  Front
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-on-surface-variant)' }}>
            <Square size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 13 }}>Select an element to edit its properties</p>
          </div>
        )}
      </div>
=======
      <div className="flex flex-1 min-h-0">
        
        {/* PagesStrip */}
        <aside className="w-44 shrink-0 border-r border-[#E8E2DA] bg-[#f9f3eb] flex flex-col">
          <div className="px-4 py-3 border-b border-[#E8E2DA]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8A8A8A] font-medium">Pages</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 custom-scrollbar">
            {designData.pages.map((page, idx) => {
              const isActive = idx === currentPageIndex;
              const isCover = page.type !== 'content';
              const label = page.type === 'content' ? `${idx}` : page.type === 'front_cover' ? 'Front' : 'Back';
              return (
                <div key={page.id} className="space-y-1">
                  <button 
                    onClick={() => setCurrentPage(idx)} 
                    className={`group relative w-full aspect-square rounded-md overflow-hidden transition-all ${isActive ? "ring-2 ring-[#E85D2C]" : "ring-1 ring-[#E8E2DA] hover:ring-[#8A8A8A]"}`} 
                    style={{ background: page.background.value || '#fff' }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[40px] font-bold opacity-[0.03]">
                      {isCover ? (page.type === 'front_cover' ? 'F' : 'B') : idx}
                    </span>
                    
                    {!isCover && (
                      <span
                        onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                        className="absolute top-1 right-1 p-1 rounded bg-[#FFFFFF]/90 opacity-0 group-hover:opacity-100 hover:bg-[#FFFFFF] transition-opacity cursor-pointer"
                      >
                        <Trash2 size={11} className="text-[#4A4A4A]" />
                      </span>
                    )}
                  </button>
                  <div className="text-[10px] text-center text-[#8A8A8A] font-medium tracking-wide">
                    {isCover ? label.toUpperCase() : label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-3 border-t border-[#E8E2DA]">
            <button onClick={addPage} className="w-full h-10 rounded-md border border-dashed border-[#E8E2DA] text-[#4A4A4A] hover:border-[#E85D2C] hover:text-[#E85D2C] transition-colors flex items-center justify-center gap-2 text-sm">
              <Plus size={14} /> Add page
            </button>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 min-w-0 flex flex-col items-center justify-center p-6 gap-3 overflow-auto custom-scrollbar relative" onClick={() => selectElement(null)}>
          
          {selectedElement && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#FFFFFF] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E8E2DA] px-3 py-1.5 flex items-center gap-3 z-20">
              <span className="text-xs font-medium text-[#8A8A8A] pr-2 border-r border-[#E8E2DA] capitalize">
                {selectedElement.type}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); currentPage && updateElement(currentPage.id, selectedElement.id, { zIndex: selectedElement.zIndex + 1 }) }}
                className="text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors text-xs font-medium" title="Bring Forward"
              >
                Forward
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); currentPage && updateElement(currentPage.id, selectedElement.id, { zIndex: Math.max(1, selectedElement.zIndex - 1) }) }}
                className="text-[#4A4A4A] hover:text-[#0A0A0A] transition-colors text-xs font-medium" title="Send Backward"
              >
                Backward
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (currentPage) {
                    if (selectedElement.type === 'image') {
                      updateElement(currentPage.id, selectedElement.id, {
                        properties: { src: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==' }
                      });
                    } else if (selectedElement.type === 'text') {
                      updateElement(currentPage.id, selectedElement.id, {
                        properties: { ...(selectedElement.properties as any), content: '' }
                      });
                    } else {
                      removeElement(currentPage.id, selectedElement.id);
                    }
                  }
                }}
                className="text-[#ba1a1a] hover:text-[#93000a] transition-colors ml-1 pl-3 border-l border-[#E8E2DA]" title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}

          {currentPage && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              {currentPage.type !== 'content' && (
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8A8A8A] font-medium mb-3">
                  {currentPage.type.replace('_', ' ')}
                </div>
              )}
              
              <div 
                ref={canvasRef}
                className="relative transition-transform duration-300 overflow-hidden"
                style={{
                  width: canvasSize,
                  height: canvasSize,
                  background: currentPage.background.value || '#ffffff',
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  boxShadow: currentPage.type !== 'content'
                    ? '0 2px 4px rgba(10,10,10,0.06), 0 16px 40px rgba(10,10,10,0.14)'
                    : '0 1px 2px rgba(10,10,10,0.04), 0 8px 24px rgba(10,10,10,0.08)'
                }}
              >
                
                {currentPage.elements
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map(element => (
                    <div
                      key={element.id}
                      onMouseDown={(e) => {
                        if (selectedElementId === element.id && element.type === 'text') {
                          e.stopPropagation();
                          return;
                        }
                        handleMouseDown(e, element.id);
                      }}
                      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
                      className="absolute group"
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        transform: `rotate(${element.rotation}deg)`,
                        cursor: (selectedElementId === element.id && element.type === 'text') ? 'text' : (dragging === element.id ? 'grabbing' : 'grab'),
                        zIndex: element.zIndex,
                        userSelect: (selectedElementId === element.id && element.type === 'text') ? 'text' : 'none',
                      }}
                    >
                      {/* Selection Box */}
                      {selectedElementId === element.id && (
                        <div className="absolute -inset-0 border-[1.5px] border-[#E85D2C] z-20 pointer-events-none">
                          <div 
                            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#FFFFFF] border-[1.5px] border-[#E85D2C] pointer-events-auto cursor-nwse-resize"
                            onMouseDown={(e) => { e.stopPropagation(); /* resize logic */ }}
                          />
                          <div 
                            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#FFFFFF] border-[1.5px] border-[#E85D2C] pointer-events-auto cursor-nesw-resize"
                          />
                          <div 
                            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#FFFFFF] border-[1.5px] border-[#E85D2C] pointer-events-auto cursor-nesw-resize"
                          />
                          <div 
                            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#FFFFFF] border-[1.5px] border-[#E85D2C] pointer-events-auto cursor-nwse-resize"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const startW = element.width;
                              const startH = element.height;
      
                              const onMove = (e2: MouseEvent) => {
                                const dw = (e2.clientX - startX) / zoom;
                                const dh = (e2.clientY - startY) / zoom;
                                updateElement(currentPage.id, element.id, {
                                  width: Math.max(40, startW + dw),
                                  height: Math.max(20, startH + dh),
                                });
                              };
                              const onUp = () => {
                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                              };
                              window.addEventListener('mousemove', onMove);
                              window.addEventListener('mouseup', onUp);
                            }}
                          />
                        </div>
                      )}

                      {element.type === 'image' && (
                        <div 
                          className="w-full h-full relative"
                          onClick={() => {
                            if ((element.properties as any).src === 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==') {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    updateElement(currentPage.id, element.id, {
                                      properties: { src: e.target?.result as string }
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              };
                              input.click();
                            }
                          }}
                        >
                          <img
                            src={(element.properties as { src: string }).src}
                            alt=""
                            draggable={false}
                            className="w-full h-full object-cover pointer-events-none"
                            style={{ opacity: (element.properties as any).opacity || 1 }}
                          />
                          {(element.properties as any).src === 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#E85D2C]/70 border border-[#E85D2C]/40 border-dashed cursor-pointer hover:bg-[#FCE7DC]/20 transition-colors">
                              <span className="text-sm font-medium">+ Add photo</span>
                            </div>
                          )}
                        </div>
                      )}

                      {element.type === 'text' && (
                        <div
                          contentEditable={selectedElementId === element.id}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            updateElement(currentPage.id, element.id, {
                              properties: { ...(element.properties as TextProperties), content: e.currentTarget.textContent || '' },
                            });
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            fontFamily: (element.properties as TextProperties).fontFamily,
                            fontSize: (element.properties as TextProperties).fontSize,
                            color: (element.properties as TextProperties).color,
                            textAlign: (element.properties as TextProperties).textAlign,
                            fontWeight: (element.properties as TextProperties).fontWeight || '400',
                            letterSpacing: (element.properties as TextProperties).letterSpacing || 'normal',
                            lineHeight: 1.4,
                            outline: 'none',
                            overflow: 'hidden',
                            cursor: selectedElementId === element.id ? 'text' : 'grab',
                          }}
                        >
                          {(element.properties as TextProperties).content}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>

        {/* ToolsPanel */}
        <aside className="w-72 shrink-0 border-l border-[#E8E2DA] bg-[#FFFFFF] flex flex-col">
          <div className="flex border-b border-[#E8E2DA]">
            {[
              { id: 'photos', label: 'Photos', icon: ImagePlus },
              { id: 'text', label: 'Text', icon: Type },
              { id: 'backgrounds', label: 'Color', icon: Palette },
              { id: 'settings', label: 'Book', icon: Settings },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activePanel === id;
              return (
                <button
                  key={id}
                  onClick={() => setActivePanel(id as any)}
                  className={`flex-1 h-12 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${isActive ? "text-[#E85D2C] border-b-2 border-[#E85D2C] -mb-px" : "text-[#4A4A4A] hover:text-[#0A0A0A]"}`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            
            {activePanel === 'photos' && (
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E8E2DA] p-5 text-center cursor-pointer hover:border-[#E85D2C] hover:bg-[#f9f3eb] transition-colors group">
                  <UploadCloud size={20} className="mx-auto mb-2 text-[#4A4A4A] group-hover:text-[#E85D2C] transition-colors" />
                  <p className="text-sm text-[#0A0A0A]">Upload photos</p>
                  <p className="text-xs text-[#8A8A8A] mt-1">Click to browse</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                <p className="text-xs text-[#8A8A8A] leading-relaxed">
                  Once you upload, you can add images directly to the canvas by selecting empty frames.
                </p>
              </div>
            )}

            {activePanel === 'text' && (
              <div className="space-y-4">
                <button 
                  onClick={handleAddText} 
                  className="w-full h-12 rounded-md bg-[#0A0A0A] text-[#FFFFFF] hover:bg-[#4A4A4A] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Type size={16} /> Add text box
                </button>

                {selectedElement && selectedElement.type === 'text' && (() => {
                  const props = selectedElement.properties as TextProperties;
                  return (
                    <div className="space-y-3 pt-3 border-t border-[#E8E2DA]">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#8A8A8A] font-medium">Selected text</p>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-[#4A4A4A] block mb-1">Size</label>
                          <input 
                            type="number" 
                            value={props.fontSize}
                            onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, { properties: { ...props, fontSize: +e.target.value } })}
                            className="w-full text-sm border border-[#E8E2DA] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#E85D2C] bg-[#FFFFFF]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-[#4A4A4A] block mb-1">Color</label>
                          <input 
                            type="color" 
                            value={props.color}
                            onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, { properties: { ...props, color: e.target.value } })}
                            className="w-full h-9 border border-[#E8E2DA] rounded-md cursor-pointer bg-[#FFFFFF] p-0.5"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-[#4A4A4A] block mb-1">Align</label>
                        <div className="flex rounded-md border border-[#E8E2DA] overflow-hidden">
                          {(['left', 'center', 'right'] as const).map(align => (
                            <button
                              key={align}
                              onClick={() => currentPage && updateElement(currentPage.id, selectedElement.id, { properties: { ...props, textAlign: align } })}
                              className={`flex-1 h-8 flex justify-center items-center text-xs transition-colors ${props.textAlign === align ? "bg-[#0A0A0A] text-[#FFFFFF]" : "bg-[#FFFFFF] text-[#4A4A4A] hover:bg-[#f9f3eb]"}`}
                            >
                              {align === 'left' ? <AlignLeft size={14}/> : align === 'center' ? <AlignCenter size={14}/> : <AlignRight size={14}/>}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-[#4A4A4A] block mb-1">Font</label>
                        <select 
                          value={props.fontFamily}
                          onChange={e => currentPage && updateElement(currentPage.id, selectedElement.id, { properties: { ...props, fontFamily: e.target.value } })}
                          className="w-full text-sm border border-[#E8E2DA] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#E85D2C] bg-[#FFFFFF]"
                        >
                          <option value="var(--font-inter), sans-serif">Inter (sans)</option>
                          <option value="var(--font-instrument), serif">Instrument Serif</option>
                          <option value="Georgia, serif">Georgia</option>
                        </select>
                      </div>
                    </div>
                  );
                })()}
                
                {(!selectedElement || selectedElement.type !== 'text') && (
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">
                    Tip: select a text box on the page to edit its content, font, size and alignment here.
                  </p>
                )}
              </div>
            )}

            {activePanel === 'backgrounds' && (
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#8A8A8A] font-medium">Page background</p>
                <div className="grid grid-cols-4 gap-2">
                  {['#FFFFFF', '#FAF7F3', '#FCE7DC', '#F5E6D3', '#E85D2C', '#0A0A0A', '#2C2C2C', '#D4E5D4', '#D4DCE5', '#E5D4DC', '#F0E6FF', '#FFF4D4'].map(color => (
                    <button
                      key={color}
                      onClick={() => currentPage && updatePageBackground(currentPage.id, { type: 'color', value: color })}
                      className={`aspect-square rounded-md transition-all ${currentPage?.background.value === color ? "ring-2 ring-[#E85D2C]" : "ring-1 ring-[#E8E2DA] hover:ring-[#8A8A8A]"}`}
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#8A8A8A] font-medium mb-2">Custom</p>
                  <input
                    type="color"
                    value={currentPage?.background.value || '#ffffff'}
                    onChange={e => currentPage && updatePageBackground(currentPage.id, { type: 'color', value: e.target.value })}
                    className="w-full h-10 rounded-md border border-[#E8E2DA] cursor-pointer p-1 bg-[#FFFFFF]"
                  />
                </div>
              </div>
            )}

            {activePanel === 'settings' && (
              <div className="space-y-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8A8A8A] font-medium">Book Details</p>
                <div>
                  <label className="text-xs text-[#4A4A4A] block mb-1">Book Size</label>
                  <select 
                    className="w-full text-sm border border-[#E8E2DA] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#E85D2C] bg-[#FFFFFF]"
                    value={designData.bookConfig.size} 
                    onChange={e => updateBookConfig({ size: e.target.value as any })}
                  >
                    <option value="8x8">8 × 8 inch (Square)</option>
                    <option value="10x10">10 × 10 inch (Square)</option>
                    <option value="12x12">12 × 12 inch (Square)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#4A4A4A] block mb-1">Cover Material</label>
                  <select 
                    className="w-full text-sm border border-[#E8E2DA] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#E85D2C] bg-[#FFFFFF]"
                    value={designData.bookConfig.coverType} 
                    onChange={e => updateBookConfig({ coverType: e.target.value as any })}
                  >
                    <option value="hardcover">Hardcover (Linen)</option>
                    <option value="softcover">Softcover</option>
                    <option value="leather">Premium Leather</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#4A4A4A] block mb-1">Paper Finish</label>
                  <select 
                    className="w-full text-sm border border-[#E8E2DA] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#E85D2C] bg-[#FFFFFF]"
                    value={designData.bookConfig.paperType} 
                    onChange={e => updateBookConfig({ paperType: e.target.value as any })}
                  >
                    <option value="matte">Matte Archive</option>
                    <option value="glossy">Gallery Glossy</option>
                    <option value="silk">Fine Art Silk</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </aside>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E2DA; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8A8A8A; }
      `}} />
>>>>>>> Stashed changes
    </div>
  );
}

