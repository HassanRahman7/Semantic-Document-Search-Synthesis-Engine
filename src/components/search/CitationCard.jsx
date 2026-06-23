import React from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Badge from '../Badge';
import { useDocuments } from '../../hooks/documents/useDocuments';

export default function CitationCard({ file, page }) {
  const [expanded, setExpanded] = React.useState(false);
  const { data: documents } = useDocuments();

  // Look up document details if loaded
  const docDetails = documents?.find((doc) => doc.file_name === file);

  const formatBytes = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  };

  return (
    <div 
      className={`border rounded-[18px] transition-all duration-300 overflow-hidden font-mono text-[11px]
        ${expanded 
          ? 'bg-primary/[0.02] border-primary/20 shadow-[0_4px_25px_rgba(228,87,61,0.04)]' 
          : 'bg-[#121110]/40 border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
        }
      `}
    >
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-3.5 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2.5 truncate max-w-[75%]">
          <FileText className="w-4 h-4 text-textSecondary shrink-0 group-hover:text-primary transition-colors" />
          <span className="text-white truncate font-medium" title={file}>
            {file}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[9px] font-semibold">
            Page {page}
          </span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-textSecondary" /> : <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />}
        </div>
      </div>

      {expanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 space-y-2 bg-black/10">
          <div className="grid grid-cols-2 gap-2 text-[9px] text-textSecondary">
            <div>
              <span className="text-textSecondary/50 font-semibold block uppercase tracking-wider">// FILE SIZE</span>
              <span className="text-white mt-0.5 block">{docDetails ? formatBytes(docDetails.file_size) : 'Unknown size'}</span>
            </div>
            <div>
              <span className="text-textSecondary/50 font-semibold block uppercase tracking-wider">// UPLOADED AT</span>
              <span className="text-white mt-0.5 block">
                {docDetails ? new Date(docDetails.uploaded_at).toLocaleDateString() : 'Unknown date'}
              </span>
            </div>
          </div>
          {docDetails && (
            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px]">
              <span className="text-textSecondary/60">Status: <span className="text-accent">INDEXED</span></span>
              <span className="text-primary/70 hover:text-primary flex items-center cursor-pointer">
                Jump to details <ExternalLink className="w-2.5 h-2.5 ml-1" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
