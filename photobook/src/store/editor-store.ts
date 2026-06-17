import { create } from 'zustand';
import type { DesignData, BookPage, PageElement } from '@/lib/types';
import { v4 as uuid } from 'uuid';

interface EditorState {
  projectId: string | null;
  projectName: string;
  designData: DesignData;
  currentPageIndex: number;
  selectedElementId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // Actions
  setProject: (id: string, name: string, data: DesignData) => void;
  setCurrentPage: (index: number) => void;
  selectElement: (id: string | null) => void;

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

  // Save
  markSaving: () => void;
  markSaved: () => void;
  markDirty: () => void;
}

const defaultDesignData: DesignData = {
  bookConfig: { size: '8x8', coverType: 'hardcover', paperType: 'matte', pageCount: 20 },
  pages: [],
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

  setProject: (id, name, data) => set({
    projectId: id,
    projectName: name,
    designData: data,
    currentPageIndex: 0,
    selectedElementId: null,
    isDirty: false,
  }),

  setCurrentPage: (index) => set({ currentPageIndex: index, selectedElementId: null }),
  selectElement: (id) => set({ selectedElementId: id }),

  updateBookConfig: (config) => set((state) => ({
    designData: {
      ...state.designData,
      bookConfig: { ...state.designData.bookConfig, ...config },
    },
    isDirty: true,
  })),

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
    return {
      designData: {
        ...state.designData,
        bookConfig: { ...state.designData.bookConfig, pageCount: state.designData.bookConfig.pageCount + 1 },
        pages,
      },
      isDirty: true,
    };
  }),

  removePage: (pageId) => set((state) => {
    const page = state.designData.pages.find(p => p.id === pageId);
    if (!page || page.type !== 'content') return state; // Can't remove covers
    return {
      designData: {
        ...state.designData,
        bookConfig: { ...state.designData.bookConfig, pageCount: Math.max(1, state.designData.bookConfig.pageCount - 1) },
        pages: state.designData.pages.filter(p => p.id !== pageId),
      },
      currentPageIndex: Math.min(state.currentPageIndex, state.designData.pages.length - 2),
      isDirty: true,
    };
  }),

  updatePageBackground: (pageId, bg) => set((state) => ({
    designData: {
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId ? { ...p, background: bg } : p
      ),
    },
    isDirty: true,
  })),

  addElement: (pageId, element) => set((state) => {
    const newElement: PageElement = { ...element, id: uuid() };
    return {
      designData: {
        ...state.designData,
        pages: state.designData.pages.map(p =>
          p.id === pageId
            ? { ...p, elements: [...p.elements, newElement] }
            : p
        ),
      },
      selectedElementId: newElement.id,
      isDirty: true,
    };
  }),

  updateElement: (pageId, elementId, updates) => set((state) => ({
    designData: {
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
    },
    isDirty: true,
  })),

  removeElement: (pageId, elementId) => set((state) => ({
    designData: {
      ...state.designData,
      pages: state.designData.pages.map(p =>
        p.id === pageId
          ? { ...p, elements: p.elements.filter(el => el.id !== elementId) }
          : p
      ),
    },
    selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
    isDirty: true,
  })),

  moveElement: (pageId, elementId, x, y) => {
    const state = get();
    state.updateElement(pageId, elementId, { x, y });
  },

  resizeElement: (pageId, elementId, width, height) => {
    const state = get();
    state.updateElement(pageId, elementId, { width, height });
  },

  markSaving: () => set({ isSaving: true }),
  markSaved: () => set({ isSaving: false, isDirty: false, lastSaved: new Date() }),
  markDirty: () => set({ isDirty: true }),
}));
