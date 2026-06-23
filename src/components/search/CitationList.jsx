import React from 'react';
import CitationItem from './CitationItem';

export default function CitationList({ sources = [] }) {
  if (sources.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-mono tracking-widest text-textSecondary uppercase">
          // SOURCE CITATIONS ({sources.length})
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {sources.map((source, index) => (
          <CitationItem 
            key={index} 
            file={source.file} 
            page={source.page} 
          />
        ))}
      </div>
    </div>
  );
}
