import React from 'react';
import { Clipboard, Check, RefreshCw, XCircle, ArrowLeftRight } from 'lucide-react';

export default function AnswerActions({ onCopyAnswer, onCopyCitation, onClear, onNewQuestion }) {
  const [copiedAnswer, setCopiedAnswer] = React.useState(false);
  const [copiedCitation, setCopiedCitation] = React.useState(false);

  const handleCopyAnswer = () => {
    onCopyAnswer();
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const handleCopyCitation = () => {
    onCopyCitation();
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-2.5 items-center">
      <button
        onClick={handleCopyAnswer}
        className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all text-xs text-white flex items-center space-x-2 focus:outline-none"
      >
        {copiedAnswer ? (
          <>
            <Check className="w-3.5 h-3.5 text-accent animate-scale" />
            <span className="font-medium text-accent">Copied Answer</span>
          </>
        ) : (
          <>
            <Clipboard className="w-3.5 h-3.5 text-textSecondary" />
            <span>Copy Answer</span>
          </>
        )}
      </button>

      {onCopyCitation && (
        <button
          onClick={handleCopyCitation}
          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all text-xs text-white flex items-center space-x-2 focus:outline-none"
        >
          {copiedCitation ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent" />
              <span className="font-medium text-accent">Copied Citations</span>
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-3.5 h-3.5 text-textSecondary" />
              <span>Copy Citations</span>
            </>
          )}
        </button>
      )}

      {onNewQuestion && (
        <button
          onClick={onNewQuestion}
          className="px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all text-xs text-primary flex items-center space-x-2 focus:outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="font-semibold">Ask Another Question</span>
        </button>
      )}

      <button
        onClick={onClear}
        className="px-3.5 py-2 rounded-xl bg-transparent border border-white/5 hover:border-white/10 text-xs text-textSecondary hover:text-white transition-all flex items-center space-x-2 focus:outline-none ml-auto"
      >
        <XCircle className="w-3.5 h-3.5" />
        <span>Clear Session</span>
      </button>
    </div>
  );
}
