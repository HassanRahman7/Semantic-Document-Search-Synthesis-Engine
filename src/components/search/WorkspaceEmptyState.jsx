import React from 'react';
import { Sparkles, Terminal, FileText, Cpu } from 'lucide-react';
import Card from '../Card';

export default function WorkspaceEmptyState() {
  return (
    <Card hoverEffect={false} className="py-24 border border-white/5 bg-surface/30">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary animate-pulse">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white tracking-tight">AI Assistant Ingress</h2>
          <p className="text-textSecondary text-sm max-w-sm mx-auto font-light leading-relaxed">
            Ask your first question. Your uploaded documents are indexed, vectorized, and ready to be explored.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="bg-[#121110]/50 border border-white/5 p-4 rounded-[16px] text-left space-y-2">
            <Cpu className="w-4 h-4 text-primary" />
            <h4 className="text-white text-xs font-semibold">RAG Retrieval</h4>
            <p className="text-[10px] text-textSecondary leading-normal font-light">Fetches exact paragraphs matching search context.</p>
          </div>
          <div className="bg-[#121110]/50 border border-white/5 p-4 rounded-[16px] text-left space-y-2">
            <FileText className="w-4 h-4 text-accent" />
            <h4 className="text-white text-xs font-semibold">Page Citations</h4>
            <p className="text-[10px] text-textSecondary leading-normal font-light">Tracks sources back to document page coordinates.</p>
          </div>
        </div>
        <div className="pt-4 flex items-center justify-center space-x-2 text-[10px] font-mono text-textSecondary uppercase">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span>Console Connection Established</span>
        </div>
      </div>
    </Card>
  );
}
