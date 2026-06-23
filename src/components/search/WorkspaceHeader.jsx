import React from 'react';
import { Menu, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import Badge from '../Badge';

export default function WorkspaceHeader({ docFilterLabel, onClearFilter }) {
  const { sidebarOpen, setSidebarOpen } = useWorkspaceStore();

  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/5 rounded-lg text-textSecondary hover:text-white transition-all focus:outline-none"
          title={sidebarOpen ? "Hide History" : "Show History"}
          aria-label="Toggle search history"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wider font-mono text-white uppercase">
            // AI ASSISTANT WORKSPACE
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {docFilterLabel && (
          <Badge 
            variant="primary" 
            onClick={onClearFilter} 
            className="cursor-pointer hover:bg-primary/20 transition-all text-[10px]"
          >
            Scope: {docFilterLabel} &times;
          </Badge>
        )}
        <Badge variant="accent">Gemini 2.5 Flash</Badge>
      </div>
    </div>
  );
}
