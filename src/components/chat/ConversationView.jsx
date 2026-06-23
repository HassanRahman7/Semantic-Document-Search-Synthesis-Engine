import React from 'react';
import QuestionBubble from './QuestionBubble';
import AnswerBubble from './AnswerBubble';
import CitationCard from '../search/CitationCard';
import Card from '../Card';

export default function ConversationView({ question, answer, sources = [], onClear, onNewQuestion }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Question & Answer Flow */}
      <div className="lg:col-span-2 space-y-6">
        <QuestionBubble question={question} />
        <AnswerBubble 
          answer={answer} 
          sources={sources} 
          onClear={onClear}
          onNewQuestion={onNewQuestion}
        />
      </div>

      {/* Citations Column */}
      <div className="space-y-4">
        <Card hoverEffect={false} className="border-white/5 bg-[#121110]/20 p-5 text-left h-full">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-textSecondary uppercase block">
              // SOURCE CITATIONS ({sources.length})
            </span>
            {sources.length === 0 ? (
              <p className="text-xs text-textSecondary/60 font-mono italic">No citations retrieved for this response.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {sources.map((source, index) => (
                  <CitationCard 
                    key={index} 
                    file={source.file} 
                    page={source.page} 
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
