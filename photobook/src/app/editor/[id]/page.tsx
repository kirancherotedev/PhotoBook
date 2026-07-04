'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEditorStore } from '@/store/editor-store';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/Toast';
import type { DesignData, TextProperties } from '@/lib/types';
import { photobookCoversRegistry } from '@/lib/curated-themes';
import Link from 'next/link';
import { 
  ImagePlus, Type, Palette, Plus, Trash2, 
  ShoppingBag, Undo, Redo, Save, Settings, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  ZoomIn, ZoomOut, UploadCloud, X
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
    designData, currentPageIndex, selectedElementId, isDirty, isSaving, lastSaved, projectName,
    history, historyIndex,
    setProject, setCurrentPage, selectElement,
    updateBookConfig, addPage, removePage, updatePageBackground,
    addElement, updateElement, removeElement,
    undo, redo,
    markSaving, markSaved,
  } = useEditorStore();

  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'photos' | 'text' | 'backgrounds' | 'settings'>('photos');
  const [zoom, setZoom] = useState(0.85);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (!isDirty || !projectId || projectId === 'guest') return;
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
  const sizeMap: Record<string, number> = { '8x8': 480, '10x10': 540, '12x12': 600 };
  const canvasSize = sizeMap[designData.bookConfig.size] || 480;

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
        color: '#0A0A0A',
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
      <div className="h-screen w-screen bg-[#FFFFFF] flex flex-col items-center justify-center">
        <div className="animate-spin-slow w-8 h-8 border-4 border-[#E85D2C] border-t-transparent rounded-full mb-4"></div>
        <p className="text-[#E85D2C] font-medium">Loading studio...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#f9f3eb] text-[#0A0A0A] font-sans overflow-hidden">
      
      {/* TopBar */}
      <header className="h-14 shrink-0 border-b border-[#E8E2DA] bg-[#FFFFFF] flex items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-xl tracking-tight text-[#0A0A0A] hover:text-[#E85D2C] transition-colors">
            PhotoBook<span className="text-[#E85D2C]">.</span>
          </Link>
          <span className="text-xs text-[#8A8A8A] hidden sm:inline">
            {projectName} · {isSaving ? 'Saving...' : isDirty ? 'Unsaved changes' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Saved'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={historyIndex <= 0} className={`p-1.5 rounded transition-colors ${historyIndex > 0 ? 'text-[#0A0A0A] hover:bg-[#f9f3eb]' : 'text-[#8A8A8A] opacity-50 cursor-not-allowed'}`} title="Undo (Ctrl+Z)"><Undo size={16}/></button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className={`p-1.5 rounded transition-colors ${historyIndex < history.length - 1 ? 'text-[#0A0A0A] hover:bg-[#f9f3eb]' : 'text-[#8A8A8A] opacity-50 cursor-not-allowed'}`} title="Redo (Ctrl+Y)"><Redo size={16}/></button>
          
          <div className="w-px h-4 bg-[#E8E2DA] mx-2"></div>
          
          <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="p-1.5 rounded hover:bg-[#f9f3eb] text-[#0A0A0A] transition-colors"><ZoomOut size={16}/></button>
          <span className="text-xs text-[#8A8A8A] w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 rounded hover:bg-[#f9f3eb] text-[#0A0A0A] transition-colors"><ZoomIn size={16}/></button>

          <div className="w-px h-4 bg-[#E8E2DA] mx-2"></div>
          
          <button onClick={autoSave} disabled={!isDirty} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[#4A4A4A] hover:bg-[#f9f3eb] text-xs font-medium transition-colors disabled:opacity-50">
            <Save size={14} />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button onClick={() => router.push(`/checkout/cart?projectId=${projectId}`)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-[#E85D2C] text-[#FFFFFF] text-sm font-medium hover:bg-[#C84A1F] transition-colors">
            <ShoppingBag size={14} />
            Checkout
          </button>
        </div>
      </header>

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
    </div>
  );
}
