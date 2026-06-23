import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Search, 
  Settings, 
  Menu, 
  X, 
  Fingerprint,
  Activity
} from 'lucide-react';
import { useUiStore } from '../store/uiStore';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/documents', label: 'Documents', icon: FolderOpen },
  { path: '/search', label: 'Search Workspace', icon: Search },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function MainLayout() {
  const { sidebarOpen, toggleSidebar, mobileSidebarOpen, setMobileSidebar } = useUiStore();
  const location = useLocation();

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-surface border-r border-white/5 py-8 px-6 justify-between select-none">
      {/* Brand Logo */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center shadow-[0_4px_15px_rgba(228,87,61,0.3)]">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold font-mono text-sm tracking-widest uppercase">
              Semantic
            </h2>
            <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase">
              // Protocol
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-white/5 via-white/10 to-transparent" />

        {/* Navigation Links */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setMobileSidebar(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3.5 rounded-[20px] text-sm transition-all duration-300 font-sans group
                  ${isActive 
                    ? 'bg-primary text-white shadow-[0_4px_20px_rgba(228,87,61,0.15)]' 
                    : 'text-textSecondary hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-textSecondary group-hover:text-primary'}`} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="bg-[#131519] border border-white/5 p-4 rounded-[20px] space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-mono text-white font-semibold uppercase tracking-wider">
            Operator Status
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-textSecondary">
          <span>RAG pipeline</span>
          <span className="text-accent uppercase font-bold">ONLINE</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`hidden md:block shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden border-none'}`}>
        <SidebarContent />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 z-50 md:hidden"
            >
              <div className="h-full relative">
                <SidebarContent isMobile={true} />
                <button 
                  onClick={() => setMobileSidebar(false)}
                  className="absolute top-6 -right-12 w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center text-white focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header Bar */}
        <header className="h-20 bg-surface/30 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => toggleSidebar()}
              className="hidden md:flex w-10 h-10 rounded-full border border-white/5 items-center justify-center text-textSecondary hover:text-white hover:bg-white/5 transition-all focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setMobileSidebar(true)}
              className="md:hidden w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-textSecondary hover:text-white hover:bg-white/5 transition-all focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 px-1">
              <span className="font-mono text-xs text-textSecondary">// IDENTITY CONSOLE</span>
            </div>
          </div>
          
          {/* User Status / Metadata Display */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-[10px] font-mono text-textSecondary bg-[#131519] border border-white/5 px-3 py-1.5 rounded-full">
              <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Verifying 10,000+ operators</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-mono text-sm text-white font-bold">
              OP
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-[#161514] relative">
          {/* Background Ambient Grid/Glow */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(228,87,61,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(228,87,61,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          
          <Outlet />
        </main>
      </div>
    </div>
  );
}
