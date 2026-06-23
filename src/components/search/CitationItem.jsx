import React from 'react';
import { FileText } from 'lucide-react';

export default function CitationItem({ file, page }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-[16px] bg-white/5 border border-white/5 hover:border-white/10 transition-all font-mono text-[11px] group">
      <div className="flex items-center space-x-2.5 truncate max-w-[70%]">
        <FileText className="w-4 h-4 text-textSecondary shrink-0 group-hover:text-primary transition-colors" />
        <span className="text-white truncate font-medium" title={file}>
          {file}
        </span>
      </div>
      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold shrink-0">
        Page {page}
      </span>
    </div>
  );
}
