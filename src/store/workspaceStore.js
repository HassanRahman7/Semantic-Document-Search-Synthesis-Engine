import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      searchHistory: [], // Array of { id, question, timestamp, answer, sources, docFilter }
      activeSearch: null, // Current active search item { id, question, answer, sources, docFilter }
      sidebarOpen: true,
      selectedCitation: null,

      addSearchToHistory: (question, answer, sources, docFilter = '') => {
        const id = crypto.randomUUID();
        const newItem = {
          id,
          question,
          timestamp: new Date().toISOString(),
          answer,
          sources,
          docFilter,
        };
        set((state) => ({
          searchHistory: [newItem, ...state.searchHistory],
          activeSearch: newItem,
        }));
        return newItem;
      },

      setActiveSearch: (item) => set({ activeSearch: item }),
      
      removeSearchFromHistory: (id) => set((state) => {
        const filtered = state.searchHistory.filter((item) => item.id !== id);
        const nextActive = state.activeSearch?.id === id ? (filtered[0] || null) : state.activeSearch;
        return {
          searchHistory: filtered,
          activeSearch: nextActive,
        };
      }),

      clearHistory: () => set({ searchHistory: [], activeSearch: null, selectedCitation: null }),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setSelectedCitation: (citation) => set({ selectedCitation: citation }),
    }),
    {
      name: 'semantic-workspace-storage', // key in localStorage
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        activeSearch: state.activeSearch,
      }),
    }
  )
);
