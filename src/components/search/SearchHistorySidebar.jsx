import React from 'react';
import { History, Trash2, X } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import SearchHistoryItem from './SearchHistoryItem';
import Button from '../Button';

export default function SearchHistorySidebar() {
  const { 
    searchHistory, 
    activeSearch, 
    setActiveSearch, 
    removeSearchFromHistory, 
    clearHistory,
    sidebarOpen,
    setSidebarOpen
  } = useWorkspaceStore();

  if (!sidebarOpen) return null;

  return (
    <div className="w-full lg:w-80 shrink-0 border-r border-white/5 bg-[#0f0e0d]/90 backdrop-blur-md flex flex-col h-[calc(100vh-112px)] overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-textSecondary font-mono text-xs">
          <History className="w-4 h-4 text-primary" />
          <span>QUERY CONSOLE HISTORY</span>
        </div>
        <div className="flex items-center space-x-2">
          {searchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-[10px] font-mono text-textSecondary hover:text-red-400 flex items-center space-x-1"
              title="Clear all history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/5 rounded text-textSecondary hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {searchHistory.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <History className="w-8 h-8 text-textSecondary/10 mx-auto" />
            <p className="text-textSecondary text-xs font-mono">No previous queries</p>
            <p className="text-textSecondary/40 text-[10px] font-light max-w-[180px] mx-auto leading-normal">
              Your previous searches will be logged here.
            </p>
          </div>
        ) : (
          searchHistory.map((item) => (
            <SearchHistoryItem
              key={item.id}
              item={item}
              isActive={activeSearch?.id === item.id}
              onClick={() => setActiveSearch(item)}
              onDelete={removeSearchFromHistory}
            />
          ))
        )}
      </div>
    </div>
  );
}
