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

  markSaving: () => set({ isSaving: true }),
  markSaved: () => set({ isSaving: false, isDirty: false, lastSaved: new Date() }),
  markDirty: () => set({ isDirty: true }),
}));
