import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../Card';
import Badge from '../Badge';
import AnswerActions from '../search/AnswerActions';

// A simple local text formatter to handle common LLM output formats (lists, paragraphs, headings)
function formatAnswerText(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc list-inside space-y-2 mb-4 text-white/90 text-sm pl-2">
          {currentList.map((item, idx) => (
            <li key={idx} className="font-light leading-relaxed">{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Headings: e.g., "### Heading" or "## Heading"
    if (trimmed.startsWith('#')) {
      flushList(index);
      const level = trimmed.match(/^#+/)[0].length;
      const content = trimmed.replace(/^#+\s*/, '');
      const headingClass = level === 1 
        ? 'text-lg font-bold text-white mt-4 mb-2' 
        : 'text-sm font-semibold tracking-wider font-mono text-white mt-4 mb-2 uppercase';
      elements.push(<h4 key={index} className={headingClass}>{content}</h4>);
    }
    // Bullet items: e.g., "- item" or "* item"
    else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.replace(/^[-*]\s*/, '');
      currentList.push(content);
    }
    // Paragraph or spacing
    else {
      flushList(index);
      if (trimmed) {
        elements.push(
          <p key={index} className="text-white/90 text-sm md:text-base font-light leading-relaxed mb-4">
            {trimmed}
          </p>
        );
      }
    }
  });

  flushList('final');
  return elements;
}

export default function AnswerBubble({ answer, sources = [], onClear, onNewQuestion }) {
  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(answer);
  };

  const handleCopyCitation = () => {
    const citationText = sources
      .map((src, idx) => `[${idx + 1}] Document: ${src.file}, Page: ${src.page}`)
      .join('\n');
    navigator.clipboard.writeText(citationText);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-4">
      <Card hoverEffect={false} className="border-accent/10 bg-accent/[0.01] p-6 md:p-8">
        {/* Header Metadata */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center space-x-2 text-accent">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider font-mono uppercase">
              // AI SYNTHESIZED RESPONSE
            </span>
          </div>
          <Badge variant="indexed">Ready</Badge>
        </div>

        {/* Structured Body content */}
        <div className="text-left py-1">
          {formatAnswerText(answer)}
        </div>

        {/* Action Panel */}
        <div className="border-t border-white/5 pt-4 mt-6">
          <AnswerActions
            onCopyAnswer={handleCopyAnswer}
            onCopyCitation={sources.length > 0 ? handleCopyCitation : null}
            onClear={onClear}
            onNewQuestion={onNewQuestion}
          />
        </div>
      </Card>
    </div>
  );
}
