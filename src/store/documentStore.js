import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
  documents: [],
  selectedDocument: null,
  isLoading: false,
  uploadProgress: {}, // file-name to progress mapping

  setDocuments: (docs) => set({ documents: docs }),
  
  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setUploadProgress: (fileName, progress) => 
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [fileName]: progress }
    })),
    
  clearUploadProgress: (fileName) => 
    set((state) => {
      const newProgress = { ...state.uploadProgress };
      delete newProgress[fileName];
      return { uploadProgress: newProgress };
    }),

  removeDocument: (docId) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.document_id !== docId),
      selectedDocument: state.selectedDocument?.document_id === docId ? null : state.selectedDocument
    })),
}));
