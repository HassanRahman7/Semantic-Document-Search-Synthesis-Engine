import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  isLoading: false,
  activeDocumentId: null,

  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, { id: crypto.randomUUID(), timestamp: new Date(), ...message }] 
    })),
    
  setLoading: (loading) => set({ isLoading: loading }),
  
  setActiveDocument: (documentId) => set({ activeDocumentId: documentId }),
  
  clearChat: () => set({ messages: [], activeDocumentId: null }),
}));
