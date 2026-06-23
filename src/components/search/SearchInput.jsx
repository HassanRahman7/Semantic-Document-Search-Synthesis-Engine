import React, { useRef, useEffect } from 'react';
import { Send, ArrowUp } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';

export default function SearchInput({ onSubmit, disabled }) {
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    isSearchFocused, 
    setSearchFocused 
  } = useSearchStore();

  const textareaRef = useRef(null);

  // Auto-grow textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [currentQuestion]);

  const handleKeyDown = (e) => {
    // Submit on Enter key (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentQuestion.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div 
      className={`border rounded-[24px] p-2 bg-[#121110]/95 backdrop-blur-md flex items-end space-x-2 transition-all duration-300 relative group
        ${isSearchFocused 
          ? 'border-primary shadow-[0_0_40px_rgba(228,87,61,0.12)]' 
          : 'border-white/10 hover:border-white/20'
        }
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        placeholder="Ask a question about your documents..."
        disabled={disabled}
        className="flex-1 bg-transparent border-0 text-white placeholder-textSecondary/70 text-sm font-light py-3 px-4 focus:ring-0 focus:outline-none resize-none min-h-[46px] max-h-[180px] leading-relaxed scrollbar-thin"
        aria-label="Ask a question about your documents"
      />
      
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !currentQuestion.trim()}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50
          ${currentQuestion.trim() && !disabled
            ? 'bg-primary text-white shadow-[0_4px_15px_rgba(228,87,61,0.3)] hover:scale-105 hover:bg-primary-hover'
            : 'bg-white/5 text-textSecondary cursor-not-allowed'
          }
        `}
        title="Submit Question"
        aria-label="Submit Question"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
