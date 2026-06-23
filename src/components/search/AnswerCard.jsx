import React from 'react';
import { Sparkles, Share2, Clipboard, Check } from 'lucide-react';
import Card from '../Card';
import Badge from '../Badge';
import CitationList from './CitationList';

export default function AnswerCard({ answer, sources = [] }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Answer Block */}
      <div className="lg:col-span-2 space-y-4">
        <Card hoverEffect={false} className="border-accent/15 bg-accent/[0.01] flex flex-col justify-between min-h-[250px] relative p-6 md:p-8">
          {/* Top header status */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div className="flex items-center space-x-2 text-accent">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wider font-mono uppercase">
                // SYNTHESIZER OUTPUT
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="indexed">Synthesized</Badge>
              <button
                type="button"
                onClick={handleCopy}
                className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-textSecondary hover:text-white transition-all focus:outline-none"
                title="Copy Answer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Clipboard className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Main Answer Text */}
          <div className="flex-1 py-2">
            <p className="text-white text-sm md:text-base font-light leading-relaxed whitespace-pre-line tracking-wide">
              {answer}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-textSecondary">
            <span>LLM Model: gemini-2.5-flash</span>
            <span>Temperature: 0.0</span>
          </div>
        </Card>
      </div>

      {/* Sources & Citations Side Panel */}
      <div className="space-y-4">
        <Card hoverEffect={false} className="h-full border-white/5 bg-[#121110]/20 p-6">
          <CitationList sources={sources} />
        </Card>
      </div>
    </div>
  );
}
