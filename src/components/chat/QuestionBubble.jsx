import React from 'react';
import { Terminal } from 'lucide-react';

export default function QuestionBubble({ question }) {
  return (
    <div className="flex items-start space-x-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-[20px] max-w-4xl mx-auto w-full">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-textSecondary shrink-0">
        <Terminal className="w-4 h-4" />
      </div>
      <div className="space-y-1.5 flex-1 min-w-0 text-left">
        <span className="text-[9px] font-mono tracking-widest text-textSecondary uppercase block">// USER_QUERY</span>
        <p className="text-white text-sm font-light leading-relaxed">{question}</p>
      </div>
    </div>
  );
}
