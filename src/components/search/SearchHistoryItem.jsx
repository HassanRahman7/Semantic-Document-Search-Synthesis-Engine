import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';

export default function SearchHistoryItem({ item, isActive, onClick, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <div
      onClick={onClick}
      className={`group w-full p-3.5 rounded-[16px] flex items-center justify-between cursor-pointer transition-all duration-300 border
        ${isActive
          ? 'bg-primary/10 border-primary/20 text-white font-medium shadow-[0_4px_20px_rgba(228,87,61,0.05)]'
          : 'bg-[#121110]/20 border-white/5 text-textSecondary hover:border-white/10 hover:text-white hover:bg-white/[0.01]'
        }
      `}
    >
      <div className="flex items-center space-x-3 truncate max-w-[80%]">
        <MessageSquare className={`w-4 h-4 shrink-0 transition-colors
          ${isActive ? 'text-primary' : 'text-textSecondary group-hover:text-primary'}
        `} />
        <div className="truncate text-left">
          <p className="text-xs truncate">{item.question}</p>
          <span className="text-[9px] text-textSecondary/60 font-mono block mt-0.5">
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <button
        onClick={handleDeleteClick}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-md text-textSecondary hover:text-red-400 transition-all focus:outline-none"
        title="Remove Search"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
