'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEditorStore, PRESET_LAYOUTS } from '@/store/editor-store';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { DesignData, TextProperties, BookPage } from '@/lib/types';
import { photobookCoversRegistry } from '@/lib/curated-themes';
import Link from 'next/link';
import {
  Save, ChevronLeft, ChevronRight, Plus, Trash2, Type, Image as ImageIcon,
  Palette, Settings, Eye, ShoppingCart, ArrowLeft, BookOpen, ZoomIn, ZoomOut,
  Square, RotateCcw, Undo, Redo, AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  UploadCloud, X, LayoutGrid, Layers, Play
} from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestType = searchParams.get('type');
  const templateId = searchParams.get('templateId');
  const themeFileName = searchParams.get('themeFileName');

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const {
    designData, selectedElementId, isDirty, isSaving, lastSaved, projectName,
    history, historyIndex,
    setProject, setProjectName, selectElement,
    updateBookConfig, addPage, removePage, updatePageBackground,
    addElement, updateElement, removeElement, applyLayoutToPage,
    undo, redo,
    markSaving, markSaved,
    uploadedImages, addUploadedImage,
  } = useEditorStore();

  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'photos' | 'text' | 'layouts' | 'backgrounds'>('photos');
  const [zoom, setZoom] = useState(0.85);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextContent, setEditingTextContent] = useState('');
  const [activePageId, setActivePageId] = useState<string | null>(null);

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

      let defaultPages;
      if (guestType === 'polaroid') {
        defaultPages = [
          { id: 'page-1', type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [] }
        ];
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
            properties: { src: '' }
          })),
          ...theme.textBoxes.map((box: any, i) => ({
            id: `txt-${i}`,
            type: 'text' as const,
            x: box.x * scale,
            y: box.y * scale,
            width: box.width * scale,
            height: box.height * scale,
            rotation: 0,
            zIndex: theme.imageBoxes.length + i + 1,
            properties: { 
              content: box.content || box.id.toUpperCase(), 
              fontFamily: 'Inter', 
              fontSize: (box.fontSize || 32) * scale, 
              color: '#0A0A0A', 
              textAlign: box.textAlign || 'center',
              fontWeight: '400'
            }
          }))
        ] : [];
        
        defaultPages = [
          { id: 'page-front', type: 'front_cover', background: { type: 'color', value: '#FAF7F3' }, elements },
          ...Array.from({ length: 20 }).map((_, i) => ({ id: `page-${i}`, type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [] })),
          { id: 'page-back', type: 'back_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [] }
        ];
      } else {
        const defaultLayoutEl = { type: 'image' as const, x: 0.1 * 540, y: 0.1 * 540, width: 0.8 * 540, height: 0.8 * 540, rotation: 0, zIndex: 1, properties: { src: '' } };
        const coverTextEl = { type: 'text' as const, x: 0.1 * 540, y: 0.8 * 540, width: 0.8 * 540, height: 50, rotation: 0, zIndex: 2, properties: { content: 'My Photobook', fontFamily: 'Inter', fontSize: 24, color: '#000000', textAlign: 'center', fontWeight: 'bold' } };
        defaultPages = [
          { id: 'page-front', type: 'front_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [{ ...defaultLayoutEl, id: 'img-front' }, { ...coverTextEl, id: 'txt-front' }] },
          ...Array.from({ length: 20 }).map((_, i) => ({ 
            id: `page-${i}`, 
            type: 'content', 
            background: { type: 'color', value: '#FFFFFF' }, 
            elements: [{ ...defaultLayoutEl, id: `img-${i}` }] 
          })),
          { id: 'page-back', type: 'back_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [{ ...defaultLayoutEl, id: 'img-back' }] }
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
  }, [authLoading, isAuthenticated, projectId, router, setProject, showToast, templateId, themeFileName, guestType]);

  // Autosave
  const autoSave = useCallback(async () => {
    if (!projectId || !isDirty || isSaving || projectId === 'guest') return;
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

  // Derive spreads from pages
  const spreads = useMemo(() => {
    const s: (BookPage | null)[][] = [];
    const front = designData.pages.find(p => p.type === 'front_cover') || null;
    s.push([null, front]);

    const contents = designData.pages.filter(p => p.type === 'content');
    for (let i = 0; i < contents.length; i += 2) {
      s.push([contents[i] || null, contents[i + 1] || null]);
    }
    
    const back = designData.pages.find(p => p.type === 'back_cover') || null;
    s.push([back, null]);
    return s;
  }, [designData.pages]);

  const currentSpread = spreads[currentSpreadIndex] || [null, null];
  const [leftPage, rightPage] = currentSpread;

  // Auto set active page id if not set
  useEffect(() => {
    if (!activePageId && (leftPage || rightPage)) {
      setActivePageId(rightPage?.id || leftPage?.id || null);
    }
  }, [currentSpreadIndex, leftPage, rightPage, activePageId]);

  // Canvas dimensions
  const isPolaroid = designData.bookConfig.projectType === 'polaroid';
  const sizeMap: Record<string, number> = { '8x8': 480, '10x10': 540, '12x12': 600 };
  const baseSize = sizeMap[designData.bookConfig.size] || 540;
  
  const canvasHeight = baseSize;
  const canvasWidth = isPolaroid ? baseSize * (88 / 107) : baseSize;

  // Mouse handlers for dragging elements
  const handleMouseDown = (e: React.MouseEvent, pageId: string, elementId: string, type: string) => {
    e.stopPropagation();
    setActivePageId(pageId);
    selectElement(elementId);
    if (type === 'image') setActivePanel('photos');
    if (type === 'text') setActivePanel('text');

    const page = designData.pages.find(p => p.id === pageId);
    const el = page?.elements.find(el => el.id === elementId);
    if (!el) return;
    setDragging(`${pageId}:${elementId}`);
    setDragStart({ x: e.clientX, y: e.clientY, elX: el.x, elY: el.y });
  };

  const getPageNumber = (pageId: string) => {
    if (pageId === 'page-front') return 'Front Cover';
    if (pageId === 'page-back') return 'Back Cover';
    const idx = designData.pages.filter(p => p.type === 'content').findIndex(p => p.id === pageId);
    if (idx !== -1) return `Page ${idx + 1}`;
    return '';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const [pageId, elementId] = dragging.split(':');
    const page = designData.pages.find(p => p.id === pageId);
    if (!page) return;
    
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    const el = page.elements.find(el => el.id === elementId);
    if (!el) return;
    updateElement(pageId, elementId, {
      x: Math.round(dragStart.elX + dx),
      y: Math.round(dragStart.elY + dy),
    });
  }, [dragging, designData.pages, dragStart, zoom, updateElement]);

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

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        addUploadedImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Find currently selected element
  let selectedElement = null;
  let selectedElementPageId = null;
  if (selectedElementId) {
    for (const page of designData.pages) {
      const el = page.elements.find(e => e.id === selectedElementId);
      if (el) {
        selectedElement = el;
        selectedElementPageId = page.id;
        break;
      }
    }
  }

  if (loading || authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen size={36} color="var(--color-on-surface-variant)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <input type="file" id="global-image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
      
      {/* ── Toolbar ── */}
      <div className="editor-toolbar">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', color: '#0d0d0c' }}>Photobook</span>
        </div>

        <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 16, color: '#0d0d0c', fontWeight: 600 }}>
             {designData.bookConfig.projectType === 'polaroid' ? 'Custom Polaroids' : 'Medium Photobook'}
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#424844' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d0d0c' }} />
            {projectName}
          </div>
          <button onClick={autoSave} className="btn btn-ghost btn-sm btn-icon" style={{ color: '#747474' }}><Save size={18} /></button>
          <button onClick={() => {}} className="btn btn-ghost btn-sm btn-icon" style={{ color: '#747474' }}><Play size={18} /></button>
          
          <button onClick={() => router.push(`/checkout/cart?projectId=${projectId}`)} style={{ background: '#0d0d0c', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
             <ShoppingCart size={16} /> Save / Add to cart <ChevronRight size={16} />
          </button>
          <button onClick={() => router.push(isAuthenticated ? '/my-projects' : '/templates')} className="btn btn-ghost btn-sm btn-icon" style={{ color: '#747474' }}><X size={20} /></button>
        </div>
      </div>

      {/* ── Left Sidebar (Global Upload) ── */}
      <div className="editor-left-sidebar">
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e5e5', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#424844' }}>
          Upload
        </div>
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <div style={{ border: '2px dashed #e5e5e5', borderRadius: 4, padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, marginBottom: 24 }}>
            <UploadCloud size={24} color="#cccccc" strokeWidth={1} />
            <p style={{ fontSize: 12, color: '#747474', lineHeight: 1.4 }}>
              Drag and drop images or upload from your computer.
            </p>
            <label style={{ background: '#747474', color: '#ffffff', padding: '8px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'inline-block', width: '100%', marginTop: 4 }}>
              Upload images
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          
          {uploadedImages.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {uploadedImages.map((src, i) => (
                <div 
                  key={i} 
                  style={{ width: '100%', aspectRatio: '1', borderRadius: 4, overflow: 'hidden', border: '1px solid #e5e5e5', cursor: 'grab' }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('image/src', src);
                  }}
                >
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Canvas Area ── */}
      <div className="editor-canvas-area" onClick={() => selectElement(null)}>
        {/* Sub-toolbar */}
        <div style={{ position: 'absolute', top: 16, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={undo} disabled={historyIndex <= 0} className="btn btn-ghost btn-icon" style={{ color: '#747474', background: '#ffffff', border: '1px solid #e5e5e5' }}><Undo size={16}/></button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="btn btn-ghost btn-icon" style={{ color: '#747474', background: '#ffffff', border: '1px solid #e5e5e5' }}><Redo size={16}/></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: 4, padding: '4px 8px' }}>
            <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="btn btn-ghost btn-icon" style={{ padding: 4 }}>-</button>
            <span style={{ fontSize: 12, color: '#747474', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="btn btn-ghost btn-icon" style={{ padding: 4 }}>+</button>
          </div>
        </div>

        {/* Spread Canvas */}
        <div style={{ display: 'flex', gap: 0, transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}>
          {[leftPage, rightPage].map((page, idx) => {
            const isLeft = idx === 0;
            if (!page) {
              return (
                <div key={`empty-${idx}`} style={{ width: canvasWidth, height: canvasHeight, background: 'transparent' }} />
              );
            }
            return (
              <div key={`page-wrapper-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div
                  key={page.id}
                onClick={(e) => { e.stopPropagation(); setActivePageId(page.id); selectElement(null); setActivePanel('layouts'); }}
                style={{
                  width: canvasWidth,
                  height: canvasHeight,
                  background: page.background.value || '#FFFFFF',
                  position: 'relative',
                  border: '1px solid #e5e5e5',
                  borderRight: isLeft ? 'none' : '1px solid #e5e5e5',
                  boxShadow: activePageId === page.id ? 'inset 0 0 0 2px #0d0d0c, 0 10px 20px rgba(0,0,0,0.05)' : '0 10px 20px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                }}
              >
                {/* Safe Area Border */}
                <div style={{ position: 'absolute', top: 12, left: 12, right: 12, bottom: 12, border: '1px solid rgba(255, 0, 255, 0.3)', pointerEvents: 'none', zIndex: 100 }}>
                  <span style={{ position: 'absolute', top: -8, left: 12, background: page.background.value || '#FFFFFF', color: 'rgba(255, 0, 255, 0.6)', fontSize: 10, padding: '0 4px', pointerEvents: 'none' }}>-safe-area-</span>
                </div>
                {/* Center fold shadow */}
                {isLeft && <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 20, background: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.05))', pointerEvents: 'none', zIndex: 90 }} />}
                {!isLeft && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.05))', pointerEvents: 'none', zIndex: 90 }} />}

                {/* Elements */}
                {page.elements.sort((a, b) => a.zIndex - b.zIndex).map(element => (
                  <div
                    key={element.id}
                    onMouseDown={(e) => handleMouseDown(e, page.id, element.id, element.type)}
                    style={{
                      position: 'absolute',
                      left: element.x, top: element.y, width: element.width, height: element.height,
                      transform: `rotate(${element.rotation}deg)`,
                      cursor: dragging === `${page.id}:${element.id}` ? 'grabbing' : (element.type === 'text' ? 'text' : 'grab'),
                      outline: selectedElementId === element.id ? '2px solid #747474' : 'none',
                      outlineOffset: 0,
                      zIndex: element.zIndex,
                      userSelect: 'none',
                    }}
                    onDoubleClick={() => {
                      if (element.type === 'text') {
                        setEditingTextId(element.id);
                        setEditingTextContent((element.properties as TextProperties).content);
                        setActivePageId(page.id);
                      }
                    }}
                  >
                    {element.type === 'image' && (
                      <div 
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const src = e.dataTransfer.getData('image/src');
                          if (src) {
                            const img = new window.Image();
                            img.onload = () => {
                              updateElement(page.id, element.id, { 
                                properties: { ...element.properties, src, originalWidth: img.width, originalHeight: img.height } 
                              });
                            };
                            img.src = src;
                          }
                        }}
                      >
                        {(element.properties as { src: string }).src ? (
                          <img
                            src={(element.properties as { src: string }).src}
                            alt=""
                            draggable={false}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', opacity: (element.properties as any).opacity || 1 }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon color="#747474" size={32} />
                          </div>
                        )}
                        
                        {/* Control Handles Overlay */}
                        {selectedElementId === element.id && (
                          <>
                            {/* Rotate Handle */}
                            <div
                              onMouseDown={(e) => e.stopPropagation()}
                              style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 12, height: 12, background: '#ffffff', border: '1px solid #747474', borderRadius: '50%', cursor: 'grab' }}
                            />
                            {/* Resize Handles */}
                            {/* Right Edge */}
                            <div onMouseDown={(e) => {
                                e.stopPropagation();
                                const startX = e.clientX; const startW = element.width;
                                const onMove = (e2: MouseEvent) => updateElement(page.id, element.id, { width: Math.max(40, startW + (e2.clientX - startX) / zoom) });
                                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
                              }}
                              style={{ position: 'absolute', right: -4, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', zIndex: 10 }} />
                            {/* Bottom Edge */}
                            <div onMouseDown={(e) => {
                                e.stopPropagation();
                                const startY = e.clientY; const startH = element.height;
                                const onMove = (e2: MouseEvent) => updateElement(page.id, element.id, { height: Math.max(20, startH + (e2.clientY - startY) / zoom) });
                                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
                              }}
                              style={{ position: 'absolute', left: 0, right: 0, bottom: -4, height: 8, cursor: 'ns-resize', zIndex: 10 }} />
                            {/* Left Edge */}
                            <div onMouseDown={(e) => {
                                e.stopPropagation();
                                const startX = e.clientX; const startW = element.width; const startElX = element.x;
                                const onMove = (e2: MouseEvent) => {
                                  const delta = (e2.clientX - startX) / zoom;
                                  const newW = Math.max(40, startW - delta);
                                  if (newW > 40) updateElement(page.id, element.id, { width: newW, x: startElX + delta });
                                };
                                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
                              }}
                              style={{ position: 'absolute', left: -4, top: 0, bottom: 0, width: 8, cursor: 'ew-resize', zIndex: 10 }} />
                            {/* Top Edge */}
                            <div onMouseDown={(e) => {
                                e.stopPropagation();
                                const startY = e.clientY; const startH = element.height; const startElY = element.y;
                                const onMove = (e2: MouseEvent) => {
                                  const delta = (e2.clientY - startY) / zoom;
                                  const newH = Math.max(20, startH - delta);
                                  if (newH > 20) updateElement(page.id, element.id, { height: newH, y: startElY + delta });
                                };
                                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
                              }}
                              style={{ position: 'absolute', left: 0, right: 0, top: -4, height: 8, cursor: 'ns-resize', zIndex: 10 }} />
                            {/* Bottom Right Corner (Visible) */}
                            <div
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                const startX = e.clientX; const startY = e.clientY;
                                const startW = element.width; const startH = element.height;
                                const onMove = (e2: MouseEvent) => {
                                  updateElement(page.id, element.id, {
                                    width: Math.max(40, startW + (e2.clientX - startX) / zoom),
                                    height: Math.max(20, startH + (e2.clientY - startY) / zoom),
                                  });
                                };
                                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
                              }}
                              style={{ position: 'absolute', right: -6, bottom: -6, width: 12, height: 12, background: '#ffffff', border: '1px solid #747474', cursor: 'nwse-resize', zIndex: 11 }}
                            />
                          </>
                        )}
                      </div>
                    )}
                    {element.type === 'text' && (
                      <div
                        style={{
                          width: '100%', height: '100%',
                          fontFamily: (element.properties as TextProperties).fontFamily,
                          fontSize: (element.properties as TextProperties).fontSize,
                          color: (element.properties as TextProperties).color,
                          textAlign: (element.properties as TextProperties).textAlign,
                          fontWeight: (element.properties as TextProperties).fontWeight || '400',
                          lineHeight: 1.4,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        {(element.properties as TextProperties).content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#747474', fontWeight: 500 }}>{getPageNumber(page.id)}</span>
            </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Carousel ── */}
      <div className="editor-bottom-carousel">
        <div style={{ position: 'absolute', top: -32, right: 24, background: '#ffffff', border: '1px solid #e5e5e5', borderBottom: 'none', padding: '6px 16px', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#424844', cursor: 'pointer', boxShadow: '0 -4px 6px rgba(0,0,0,0.02)' }}>
          <BookOpen size={16} /> Organize pages <ChevronLeft size={16} style={{ transform: 'rotate(90deg)' }} />
        </div>
        
        {spreads.map((spread, idx) => {
          const lPage = spread[0];
          const rPage = spread[1];
          return (
            <div
              key={idx}
              className={`carousel-thumbnail-wrapper ${currentSpreadIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentSpreadIndex(idx)}
            >
              <div className={`carousel-thumbnail ${(!lPage || !rPage) ? 'single' : ''}`}>
                {lPage && (
                  <div style={{ width: '50%', height: '100%', borderRight: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', background: lPage.background.value }}>
                    {lPage.elements.find(e => e.type === 'image') && <ImageIcon size={14} color="#cccccc"/>}
                  </div>
                )}
                {rPage && (
                  <div style={{ width: lPage ? '50%' : '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: rPage.background.value }}>
                    {rPage.elements.find(e => e.type === 'image') && <ImageIcon size={14} color="#cccccc"/>}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, color: '#424844' }}>
                {idx === 0 ? 'Cover' : (lPage && rPage ? `${getPageNumber(lPage.id)}` : (lPage ? getPageNumber(lPage.id) : rPage ? getPageNumber(rPage.id) : `Spread ${idx}`))}
              </span>
            </div>
          );
        })}
        <div style={{ width: 1, height: 40, background: '#e5e5e5', margin: '0 8px' }} />
        <button onClick={addPage} className="btn btn-outline btn-icon" title="Add Page"><Plus size={16}/></button>
        <button 
          onClick={() => {
            if (activePageId) removePage(activePageId);
            setActivePageId(null);
          }} 
          className="btn btn-outline btn-icon" 
          title="Delete Active Page"
          disabled={!activePageId || activePageId === 'page-front' || activePageId === 'page-back'}
        >
          <Trash2 size={16}/>
        </button>
      </div>

      {/* ── Right Sidebar Icons ── */}
      <div className="editor-sidepanel-icons">
        {[
          { key: 'photos', icon: <ImageIcon size={22} strokeWidth={1.5} /> },
          { key: 'text', icon: <Type size={22} strokeWidth={1.5} /> },
          { key: 'layouts', icon: <LayoutGrid size={22} strokeWidth={1.5} /> },
          { key: 'backgrounds', icon: <Palette size={22} strokeWidth={1.5} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActivePanel(tab.key as any); selectElement(null); }}
            style={{
              padding: '12px',
              background: activePanel === tab.key ? '#f8f7f7' : 'transparent',
              color: activePanel === tab.key ? '#0d0d0c' : '#747474',
              border: 'none', borderRadius: 4, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* ── Right Sidebar Content ── */}
      <div className="editor-sidepanel-content">
        {/* Upload Panel */}
        {activePanel === 'photos' && (
          <div style={{ padding: '20px 24px' }}>
            {!selectedElement ? (
              <>
                <h3 style={{ fontSize: 14, fontWeight: 400, marginBottom: 24, color: '#424844' }}>Images:</h3>
                <p style={{ fontSize: 13, color: '#747474', lineHeight: 1.5, textAlign: 'center', marginTop: 40 }}>
                  Drag an image to a page in your project or click the button at the top of the main area to add a new image box to your project.
                </p>
              </>
            ) : selectedElement.type === 'image' ? (
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0c', marginBottom: 12 }}>Image Options</h4>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Width</label>
                    <input
                      type="number" className="input"
                      value={Math.round(selectedElement.width)}
                      onChange={e => {
                        const newW = Math.max(40, parseInt(e.target.value) || 40);
                        if (selectedElementPageId) updateElement(selectedElementPageId, selectedElement.id, { width: newW });
                      }}
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Height</label>
                    <input
                      type="number" className="input"
                      value={Math.round(selectedElement.height)}
                      onChange={e => {
                        const newH = Math.max(20, parseInt(e.target.value) || 20);
                        if (selectedElementPageId) updateElement(selectedElementPageId, selectedElement.id, { height: newH });
                      }}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Opacity</label>
                  <input
                    type="range" min="0.1" max="1" step="0.05"
                    value={(selectedElement.properties as any).opacity || 1}
                    onChange={e => selectedElementPageId && updateElement(selectedElementPageId, selectedElement.id, {
                      properties: { ...selectedElement.properties, opacity: +e.target.value },
                    })}
                    style={{ width: '100%' }}
                  />
                </div>
                <button
                  onClick={() => selectedElementPageId && removeElement(selectedElementPageId, selectedElement.id)}
                  className="btn btn-outline" style={{ width: '100%', marginTop: 12, color: '#ba1a1a', borderColor: '#ffdad6' }}
                >
                  <Trash2 size={14}/> Remove Image
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 12, color: '#747474' }}>Select an image to view options.</p>
            )}
          </div>
        )}

        {/* Text Panel */}
        {activePanel === 'text' && (
          <div style={{ padding: '20px 24px' }}>
            {!selectedElement ? (
              <>
                <button onClick={() => {
                  const targetPage = activePageId ? designData.pages.find(p => p.id === activePageId) : (rightPage || leftPage);
                  if (!targetPage) return;
                  addElement(targetPage.id, {
                    type: 'text', x: canvasWidth / 2 - 100, y: canvasHeight / 2 - 20,
                    width: 200, height: 40, rotation: 0, zIndex: 10,
                    properties: { content: 'Add caption here', fontFamily: 'Inter', fontSize: 18, color: '#000000', textAlign: 'center', fontWeight: '400' },
                  });
                }} className="btn btn-outline" style={{ width: '100%', marginBottom: 12 }}>
                  <Type size={14} /> Add Text Box
                </button>
                <p style={{ fontSize: 12, color: '#747474', textAlign: 'center' }}>Double-click any text on the canvas to edit.</p>
              </>
            ) : selectedElement.type === 'text' ? (() => {
              const props = selectedElement.properties as TextProperties;
              return (
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0c', marginBottom: 12 }}>Text Options</h4>
                  <div className="input-group" style={{ marginBottom: 16 }}>
                    <label>Font Family</label>
                    <select className="input" value={props.fontFamily} onChange={e => selectedElementPageId && updateElement(selectedElementPageId, selectedElement.id, { properties: { ...props, fontFamily: e.target.value } })}>
                      <option value="Inter">Inter</option>
                      <option value="Playfair Display">Playfair Display</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div className="input-group">
                      <label>Size</label>
                      <input type="number" className="input" value={props.fontSize} onChange={e => selectedElementPageId && updateElement(selectedElementPageId, selectedElement.id, { properties: { ...props, fontSize: +e.target.value } })} />
                    </div>
                    <div className="input-group">
                      <label>Color</label>
                      <input type="color" className="input" value={props.color} style={{ padding: 2, height: 36 }} onChange={e => selectedElementPageId && updateElement(selectedElementPageId, selectedElement.id, { properties: { ...props, color: e.target.value } })} />
                    </div>
                  </div>
                  <div className="input-group" style={{ marginBottom: 16 }}>
                    <label>Alignment</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['left', 'center', 'right'] as const).map(align => (
                        <button key={align} onClick={() => selectedElementPageId && updateElement(selectedElementPageId, selectedElement.id, { properties: { ...props, textAlign: align } })} className={`btn btn-sm ${props.textAlign === align ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, textTransform: 'capitalize' }}>{align}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => selectedElementPageId && removeElement(selectedElementPageId, selectedElement.id)} className="btn btn-outline" style={{ width: '100%', marginTop: 12, color: '#ba1a1a', borderColor: '#ffdad6' }}>
                    <Trash2 size={14}/> Remove Text
                  </button>
                </div>
              );
            })() : (
              <p style={{ fontSize: 12, color: '#747474' }}>Select a text box to view options.</p>
            )}
          </div>
        )}

        {/* Layouts Panel */}
        {activePanel === 'layouts' && (
          <div style={{ padding: '20px 24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 400, color: '#424844', marginBottom: 24 }}>Layouts:</h4>
            <div className="layout-grid">
              {PRESET_LAYOUTS.map(layout => (
                <div
                  key={layout.id}
                  className="layout-thumbnail"
                  onClick={() => {
                    if (activePageId) applyLayoutToPage(activePageId, layout.id, canvasWidth, canvasHeight);
                  }}
                  title={layout.name}
                >
                  <div className="layout-thumbnail-inner">
                    {layout.elements.map((el, i) => (
                      <div key={i} style={{
                        position: 'absolute', left: `${el.x * 100}%`, top: `${el.y * 100}%`,
                        width: `${el.width * 100}%`, height: `${el.height * 100}%`,
                        background: el.type === 'image' ? '#cccccc' : 'transparent',
                        border: el.type === 'text' ? '1px dashed #cccccc' : 'none',
                      }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backgrounds Panel */}
        {activePanel === 'backgrounds' && (
          <div style={{ padding: '20px 24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 400, color: '#424844', marginBottom: 24 }}>Backgrounds:</h4>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <input 
                  type="color" 
                  value={(activePageId ? designData.pages.find(p => p.id === activePageId)?.background.value : (rightPage?.background.value || leftPage?.background.value)) || '#FFFFFF'}
                  onChange={(e) => {
                    const targetPage = activePageId ? designData.pages.find(p => p.id === activePageId) : (rightPage || leftPage);
                    if (targetPage) updatePageBackground(targetPage.id, { type: 'color', value: e.target.value });
                  }}
                  style={{ width: 40, height: 40, padding: 0, border: '1px solid #e5e5e5', borderRadius: 4, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13, color: '#424844', fontWeight: 500 }}>Custom Color</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {['#FFFFFF', '#F8F7F7', '#F0F0F0', '#E5E5E5', '#F5EBEB', '#EBF5F0', '#EBF0F5', '#1A1A1A', '#4A4A4A'].map(color => (
                <button
                  key={color}
                  onClick={() => {
                    const targetPage = activePageId ? designData.pages.find(p => p.id === activePageId) : (rightPage || leftPage);
                    if (targetPage) updatePageBackground(targetPage.id, { type: 'color', value: color });
                  }}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 4,
                    background: color, border: '1px solid #e5e5e5', cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Text Edit Modal ── */}
      {editingTextId && (
        <div className="text-edit-modal-overlay">
          <div className="text-edit-modal-content">
            <textarea
              className="text-edit-textarea"
              value={editingTextContent}
              onChange={e => setEditingTextContent(e.target.value)}
              autoFocus
              placeholder="Type your caption here..."
            />
            <div style={{ display: 'flex', gap: 16 }}>
              <button className="btn btn-outline btn-lg" onClick={() => setEditingTextId(null)}>Cancel</button>
              <button className="btn btn-primary btn-lg" onClick={() => {
                if (activePageId && editingTextId) {
                  const page = designData.pages.find(p => p.id === activePageId);
                  const el = page?.elements.find(e => e.id === editingTextId);
                  if (el && el.type === 'text') {
                    updateElement(activePageId, editingTextId, {
                      properties: { ...(el.properties as TextProperties), content: editingTextContent }
                    });
                  }
                }
                setEditingTextId(null);
              }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
