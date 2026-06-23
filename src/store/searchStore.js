import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  selectedDocIdFilter: '', // optional filter by document

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSearchResults: (results) => set({ searchResults: results }),
  
  setSearching: (searching) => set({ isSearching: searching }),
  
  setDocIdFilter: (docId) => set({ selectedDocIdFilter: docId }),
  
  clearSearch: () => set({ searchQuery: '', searchResults: [], selectedDocIdFilter: '' }),
}));
