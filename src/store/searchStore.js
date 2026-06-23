import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  currentQuestion: '',
  isSearchFocused: false,
  showSources: true,
  selectedDocIdFilter: '', // optional UUID of document to restrict search

  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  
  setSearchFocused: (focused) => set({ isSearchFocused: focused }),
  
  setShowSources: (show) => set({ showSources: show }),
  
  setSelectedDocIdFilter: (docId) => set({ selectedDocIdFilter: docId }),
  
  resetSearchUI: () => set({
    currentQuestion: '',
    isSearchFocused: false,
    showSources: true,
    selectedDocIdFilter: '',
  }),
}));
