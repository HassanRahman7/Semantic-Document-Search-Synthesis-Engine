import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
  selectedDocument: null,
  uploadDialogOpen: false,
  activeFilter: 'all', // 'all', 'indexed', 'processing', 'failed'
  deleteTargetDocument: null, // document metadata of target to delete

  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
  
  setUploadDialogOpen: (open) => set({ uploadDialogOpen: open }),
  
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  setDeleteTargetDocument: (doc) => set({ deleteTargetDocument: doc }),
}));
