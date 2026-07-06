import { create } from 'zustand';
import type { DesignData, BookPage, PageElement } from '@/lib/types';
import { v4 as uuid } from 'uuid';

export type LayoutPreset = {
  id: string;
  name: string;
  // x, y, width, height are percentages (0-1) of the page width/height
  elements: Omit<PageElement, 'id'>[];
};

export const PRESET_LAYOUTS: LayoutPreset[] = [
  {
    id: 'single-full',
    name: 'Full Bleed',
    elements: [
      { type: 'image', x: 0, y: 0, width: 1, height: 1, rotation: 0, zIndex: 1, properties: { src: '' } }
    ]
  },
  {
    id: 'single-centered',
    name: 'Centered Square',
    elements: [
      { type: 'image', x: 0.1, y: 0.1, width: 0.8, height: 0.8, rotation: 0, zIndex: 1, properties: { src: '' } }
    ]
  },
  {
    id: 'two-vertical',
    name: 'Two Vertical',
    elements: [
      { type: 'image', x: 0.05, y: 0.05, width: 0.425, height: 0.9, rotation: 0, zIndex: 1, properties: { src: '' } },
      { type: 'image', x: 0.525, y: 0.05, width: 0.425, height: 0.9, rotation: 0, zIndex: 2, properties: { src: '' } }
    ]
  },
  {
    id: 'two-horizontal',
    name: 'Two Horizontal',
    elements: [
      { type: 'image', x: 0.05, y: 0.05, width: 0.9, height: 0.425, rotation: 0, zIndex: 1, properties: { src: '' } },
      { type: 'image', x: 0.05, y: 0.525, width: 0.9, height: 0.425, rotation: 0, zIndex: 2, properties: { src: '' } }
    ]
  },
  {
    id: 'polaroid-style',
    name: 'Polaroid Style',
    elements: [
      { type: 'image', x: 0.1, y: 0.1, width: 0.8, height: 0.65, rotation: 0, zIndex: 1, properties: { src: '' } },
      { type: 'text', x: 0.1, y: 0.8, width: 0.8, height: 0.1, rotation: 0, zIndex: 2, properties: { content: 'Add caption', fontFamily: 'Inter', fontSize: 14, color: '#000000', textAlign: 'center', fontWeight: '400' } }
    ]
  }
];


interface EditorState {
  projectId: string | null;
  projectName: string;
  designData: DesignData;
  currentPageIndex: number;
  selectedElementId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
<<<<<<< Updated upstream
=======
  
  // History
  history: DesignData[];
  historyIndex: number;
>>>>>>> Stashed changes

  // Actions
  setProject: (id: string, name: string, data: DesignData) => void;
  setProjectName: (name: string) => void;
  setCurrentPage: (index: number) => void;
  selectElement: (id: string | null) => void;

<<<<<<< Updated upstream
=======
  // Undo/Redo
  undo: () => void;
  redo: () => void;

>>>>>>> Stashed changes
  // Design data mutations
  updateBookConfig: (config: Partial<DesignData['bookConfig']>) => void;
  addPage: () => void;
  removePage: (pageId: string) => void;
  updatePageBackground: (pageId: string, bg: BookPage['background']) => void;
  addElement: (pageId: string, element: Omit<PageElement, 'id'>) => void;
  updateElement: (pageId: string, elementId: string, updates: Partial<PageElement>) => void;
  removeElement: (pageId: string, elementId: string) => void;
  moveElement: (pageId: string, elementId: string, x: number, y: number) => void;
  resizeElement: (pageId: string, elementId: string, width: number, height: number) => void;
  applyLayoutToPage: (pageId: string, layoutId: string, canvasWidth: number, canvasHeight: number) => void;

  // Save
  markSaving: () => void;
  markSaved: () => void;
  markDirty: () => void;
}

const defaultDesignData: DesignData = {
  bookConfig: { size: '8x8', coverType: 'hardcover', paperType: 'matte', pageCount: 20 },
  pages: [],
};

const pushHistory = (state: EditorState, newDesignData: DesignData) => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(newDesignData);
  if (newHistory.length > 50) newHistory.shift();
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  projectName: 'Untitled Book',
  designData: defaultDesignData,
  currentPageIndex: 0,
  selectedElementId: null,
  isDirty: false,
  isSaving: false,
  lastSaved: null,
<<<<<<< Updated upstream
=======
  history: [defaultDesignData],
  historyIndex: 0,
>>>>>>> Stashed changes

  setProject: (id, name, data) => set({
    projectId: id,
    projectName: name,
    designData: data,
    currentPageIndex: 0,
    selectedElementId: null,
    isDirty: false,
<<<<<<< Updated upstream
=======
    history: [data],
    historyIndex: 0,
>>>>>>> Stashed changes
  }),

  setProjectName: (name) => set({ projectName: name, isDirty: true }),

  setCurrentPage: (index) => set({ currentPageIndex: index, selectedElementId: null }),
  selectElement: (id) => set({ selectedElementId: id }),
  addUploadedImage: (url) => set((state) => ({ uploadedImages: [...state.uploadedImages, url] })),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        designData: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        designData: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }
    return state;
  }),

<<<<<<< Updated upstream
  updateBookConfig: (config) => set((state) => ({
    designData: {
      ...state.designData,
      bookConfig: { ...state.designData.bookConfig, ...config },
    },
    isDirty: true,
  })),
=======
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        designData: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        designData: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      };
    }
    return state;
  }),

  updateBookConfig: (config) => set((state) => {
    const newData = {
      ...state.designData,
      bookConfig: { ...state.designData.bookConfig, ...config },
    };
    return { designData: newData, isDirty: true, ...pushHistory(state, newData) };
  }),
>>>>>>> Stashed changes

  addPage: () => set((state) => {
    const newPage: BookPage = {
      id: uuid(),
      type: 'content',
      background: { type: 'color', value: '#FFFFFF' },
      elements: [],
    };
    const pages = [...state.designData.pages];
    // Insert before back cover
    const backCoverIdx = pages.findIndex(p => p.type === 'back_cover');
    if (backCoverIdx >= 0) {
      pages.splice(backCoverIdx, 0, newPage);
    } else {
      pages.push(newPage);
    }
<<<<<<< Updated upstream
    return {
      designData: {
        ...state.designData,
        bookConfig: { ...state.designData.bookConfig, pageCount: state.designData.bookConfig.pageCount + 1 },
        pages,
      },
      isDirty: true,
    };
    return { designData: newData, isDirty: true, ...pushHistory(state, newData) };
  }),

  removePage: (pageId) => set((state) => {
    const page = state.designData.pages.find(p => p.id === pageId);
    if (!page || page.type !== 'content') return state; // Can't remove covers
    const newData = {
      ...state.designData,
      bookConfig: { ...state.designData.bookConfig, pageCount: Math.max(1, state.designData.bookConfig.pageCount - 1) },
      pages: state.designData.pages.filter(p => p.id !== pageId),
    };
    return {
      designData: newData,
      currentPageIndex: Math.min(state.currentPageIndex, newData.pages.length - 2),
      isDirty: true,
      ...pushHistory(state, newData)
    };
  }),

  updatePageBackground: (pageId, bg) => set((state) => {
    const newData = {
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId ? { ...p, background: bg } : p
      ),
    };
    return { designData: newData, isDirty: true, ...pushHistory(state, newData) };
  }),

  addElement: (pageId, element) => set((state) => {
    const newElement: PageElement = { ...element, id: uuid() };
    const newData = {
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId
          ? { ...p, elements: [...p.elements, newElement] }
          : p
      ),
    };
    return {
      designData: newData,
      selectedElementId: newElement.id,
      isDirty: true,
      ...pushHistory(state, newData)
    };
  }),

  updateElement: (pageId, elementId, updates) => set((state) => ({
    designData: {
=======
    const newData = {
      ...state.designData,
      bookConfig: { ...state.designData.bookConfig, pageCount: state.designData.bookConfig.pageCount + 1 },
      pages,
    };
    return { designData: newData, isDirty: true, ...pushHistory(state, newData) };
  }),

  removePage: (pageId) => set((state) => {
    const page = state.designData.pages.find(p => p.id === pageId);
    if (!page || page.type !== 'content') return state; // Can't remove covers
    const newData = {
      ...state.designData,
      bookConfig: { ...state.designData.bookConfig, pageCount: Math.max(1, state.designData.bookConfig.pageCount - 1) },
      pages: state.designData.pages.filter(p => p.id !== pageId),
    };
    return {
      designData: newData,
      currentPageIndex: Math.min(state.currentPageIndex, newData.pages.length - 2),
      isDirty: true,
      ...pushHistory(state, newData)
    };
  }),

  updatePageBackground: (pageId, bg) => set((state) => {
    const newData = {
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId ? { ...p, background: bg } : p
      ),
    };
    return { designData: newData, isDirty: true, ...pushHistory(state, newData) };
  }),

  addElement: (pageId, element) => set((state) => {
    const newElement: PageElement = { ...element, id: uuid() };
    const newData = {
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId
          ? { ...p, elements: [...p.elements, newElement] }
          : p
      ),
    };
    return {
      designData: newData,
      selectedElementId: newElement.id,
      isDirty: true,
      ...pushHistory(state, newData)
    };
  }),

  updateElement: (pageId, elementId, updates) => set((state) => {
    const newData = {
>>>>>>> Stashed changes
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId
          ? {
              ...p,
              elements: p.elements.map(el =>
                el.id === elementId ? { ...el, ...updates } : el
              ),
            }
          : p
      ),
    };
    return { designData: newData, isDirty: true, ...pushHistory(state, newData) };
  }),

<<<<<<< Updated upstream
  removeElement: (pageId, elementId) => set((state) => ({
    designData: {
=======
  removeElement: (pageId, elementId) => set((state) => {
    const newData = {
>>>>>>> Stashed changes
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId
          ? { ...p, elements: p.elements.filter(el => el.id !== elementId) }
          : p
      ),
<<<<<<< Updated upstream
    },
    selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
    isDirty: true,
  })),
=======
    };
    return {
      designData: newData,
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
      isDirty: true,
      ...pushHistory(state, newData)
    };
  }),
>>>>>>> Stashed changes

  moveElement: (pageId, elementId, x, y) => {
    const state = get();
    state.updateElement(pageId, elementId, { x, y });
  },

  resizeElement: (pageId, elementId, width, height) => {
    const state = get();
    state.updateElement(pageId, elementId, { width, height });
  },

  applyLayoutToPage: (pageId, layoutId, canvasWidth, canvasHeight) => set((state) => {
    const layout = PRESET_LAYOUTS.find(l => l.id === layoutId);
    if (!layout) return state;

    const newElements = layout.elements.map(el => ({
      ...el,
      id: uuid(),
      x: el.x * canvasWidth,
      y: el.y * canvasHeight,
      width: el.width * canvasWidth,
      height: el.height * canvasHeight,
    }));

    const newData = {
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId ? { ...p, elements: newElements } : p
      ),
    };
    return { designData: newData, isDirty: true, ...pushHistory(state, newData) };
  }),

  markSaving: () => set({ isSaving: true }),
  markSaved: () => set({ isSaving: false, isDirty: false, lastSaved: new Date() }),
  markDirty: () => set({ isDirty: true }),
}));
