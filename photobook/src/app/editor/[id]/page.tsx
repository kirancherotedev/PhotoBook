'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditorStore } from '@/store/editor-store';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { DesignData, TextProperties } from '@/lib/types';
import {
  Save, ChevronLeft, ChevronRight, Plus, Trash2, Type, Image as ImageIcon,
  Palette, Settings, Eye, ShoppingCart, ArrowLeft, BookOpen, ZoomIn, ZoomOut,
  Square, RotateCcw,
} from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const {
    designData, currentPageIndex, selectedElementId, isDirty, isSaving, lastSaved, projectName,
    setProject, setCurrentPage, selectElement,
    updateBookConfig, addPage, removePage, updatePageBackground,
    addElement, updateElement, removeElement,
    markSaving, markSaved,
  } = useEditorStore();

  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'photos' | 'text' | 'backgrounds' | 'pages' | 'settings'>('photos');
  const [zoom, setZoom] = useState(0.7);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Load project
  useEffect(() => {
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
    if (!isDirty || !projectId) return;
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
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(autoSave, 2000);
    }
    return () => clearTimeout(autoSaveTimer.current);
  }, [isDirty, autoSave]);

  const currentPage = designData.pages[currentPageIndex];

  // Canvas dimensions based on book size
  const sizeMap: Record<string, number> = { '8x8': 480, '10x10': 540, '12x12': 600 };
  const canvasSize = sizeMap[designData.bookConfig.size] || 480;

  // Mouse handlers for dragging elements
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

  // Add text element
  const handleAddText = () => {
    if (!currentPage) return;
    addElement(currentPage.id, {
      type: 'text',
      x: canvasSize / 2 - 100,
      y: canvasSize / 2 - 20,
      width: 200,
      height: 40,
      rotation: 0,
      zIndex: currentPage.elements.length + 1,
      properties: {
        content: 'Double-click to edit',
        fontFamily: 'Inter',
        fontSize: 18,
        color: '#86636A',
        textAlign: 'center',
        fontWeight: '400',
      },
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentPage) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const maxW = canvasSize * 0.6;
        const ratio = img.width / img.height;
        const w = Math.min(maxW, img.width);
        const h = w / ratio;
        addElement(currentPage.id, {
          type: 'image',
          x: (canvasSize - w) / 2,
          y: (canvasSize - h) / 2,
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
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selectedElement = currentPage?.elements.find(el => el.id === selectedElementId);

  if (loading || authLoading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--blush-50)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen size={36} color="var(--blush-600)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--blush-600)', fontSize: 14 }}>Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-layout">
      {/* ── Toolbar ── */}
      <div className="editor-toolbar">
        <button onClick={() => router.push('/my-projects')} className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 15, color: 'var(--blush-900)' }}>
            {projectName}
          </span>
          <span style={{ fontSize: 11, color: 'var(--blush-600)' }}>
            Page {currentPageIndex + 1} of {designData.pages.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--blush-600)' }}>
            {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ''}
          </span>
          <button onClick={autoSave} className="btn btn-ghost btn-sm" disabled={!isDirty}>
            <Save size={14} /> Save
          </button>
          <button onClick={() => router.push(`/checkout/cart?projectId=${projectId}`)} className="btn btn-primary btn-sm">
            <ShoppingCart size={14} /> Checkout
          </button>
        </div>
      </div>

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
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--blush-900)', marginBottom: 12 }}>Upload Photos</h4>
            <label
              className="btn btn-outline btn-sm"
              style={{ width: '100%', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
            >
              <ImageIcon size={14} /> Choose File
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <p style={{ fontSize: 11, color: 'var(--blush-600)', marginTop: 8, textAlign: 'center' }}>
              Drag uploaded photos onto the canvas
            </p>
          </div>
        )}

        {/* Text Panel */}
        {activePanel === 'text' && (
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--blush-900)', marginBottom: 12 }}>Add Text</h4>
            <button onClick={handleAddText} className="btn btn-outline btn-sm" style={{ width: '100%', marginBottom: 8 }}>
              <Type size={14} /> Add Heading
            </button>
            <button
              onClick={() => {
                if (!currentPage) return;
                addElement(currentPage.id, {
                  type: 'text', x: canvasSize / 2 - 80, y: canvasSize / 2 - 10,
                  width: 160, height: 24, rotation: 0, zIndex: currentPage.elements.length + 1,
                  properties: {
                    content: 'Body text', fontFamily: 'Inter', fontSize: 13,
                    color: '#86636A', textAlign: 'left', fontWeight: '400',
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
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--blush-900)', marginBottom: 12 }}>Page Background</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {['#FFFFFF', '#FEF6F7', '#F0DADD', '#E5BDC5', '#F5F0EB', '#E8E4E0', '#F0F0F0', '#2C2C2C'].map(color => (
                <button
                  key={color}
                  onClick={() => currentPage && updatePageBackground(currentPage.id, { type: 'color', value: color })}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 4,
                    background: color, border: `1.5px solid ${currentPage?.background.value === color ? 'var(--blush-900)' : 'var(--blush-400)'}`,
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
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--blush-900)' }}>Pages ({designData.pages.length})</h4>
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
                    background: idx === currentPageIndex ? 'var(--blush-200)' : 'transparent',
                    border: idx === currentPageIndex ? '0.5px solid var(--blush-400)' : '0.5px solid transparent',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 3, flexShrink: 0,
                    background: page.background.value || '#fff',
                    border: '0.5px solid var(--blush-400)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: 'var(--blush-600)',
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--blush-900)', textTransform: 'capitalize' }}>
                      {page.type === 'content' ? `Page ${idx}` : page.type.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--blush-600)' }}>
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
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--blush-900)' }}>Book Settings</h4>
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
          </div>
        )}
      </div>

      {/* ── Canvas Area ── */}
      <div className="editor-canvas-area" onClick={() => selectElement(null)}>
        {/* Zoom Controls */}
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--blush-50)',
          border: '0.5px solid var(--blush-400)', borderRadius: 6, padding: '4px 8px', zIndex: 10,
        }}>
          <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="btn btn-ghost btn-icon" style={{ padding: 4 }}>
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--blush-600)', minWidth: 40, textAlign: 'center' }}>
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
            background: 'var(--blush-50)', border: '0.5px solid var(--blush-400)',
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
            background: 'var(--blush-50)', border: '0.5px solid var(--blush-400)',
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
              width: canvasSize,
              height: canvasSize,
              background: currentPage.background.value || '#FFFFFF',
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              position: 'relative',
              border: '0.5px solid var(--blush-400)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Page type label */}
            <div style={{
              position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 6px',
              background: 'rgba(134,99,106,0.1)', borderRadius: 3, color: 'var(--blush-600)',
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
                    outline: selectedElementId === element.id ? '2px solid var(--blush-900)' : 'none',
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
                        width: 10, height: 10, background: 'var(--blush-900)',
                        borderRadius: 2, cursor: 'nwse-resize',
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── Right Properties Panel ── */}
      <div className="editor-properties">
        {selectedElement ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--blush-900)', textTransform: 'capitalize' }}>
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
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--blush-600)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
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
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--blush-600)' }}>
            <Square size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 13 }}>Select an element to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
