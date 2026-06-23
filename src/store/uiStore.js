import { create } from 'zustand';

export const useUiStore = create((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  notifications: [],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setMobileSidebar: (open) => set({ mobileSidebarOpen: open }),
  
  addNotification: (message, type = 'info') => 
    set((state) => ({
      notifications: [
        ...state.notifications, 
        { id: crypto.randomUUID(), message, type, timestamp: new Date() }
      ]
    })),
    
  removeNotification: (id) => 
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
}));
