import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';
import Card from '../Card';

export default function SearchEmptyState() {
  return (
    <Card hoverEffect={false} className="py-20 border border-white/5 bg-surface/30">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary animate-pulse">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white tracking-tight">AI Synthesis Console</h2>
          <p className="text-textSecondary text-sm max-w-sm mx-auto font-light leading-relaxed">
            Ask a natural language question about your uploaded documents. Answers will be synthesized using relevant knowledge retrievals backed by precise source citations.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] font-mono text-textSecondary uppercase">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span>Ready for query input</span>
        </div>
      </div>
    </Card>
  );
}
