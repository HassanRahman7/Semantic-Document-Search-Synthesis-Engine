import React from 'react';
import { Search as SearchIcon, Send, Sparkles } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Search() {
  return (
    <PageContainer>
      <SectionHeader
        monoTag="RAG_WORKSPACE"
        title="Search Workspace"
        subtitle="Submit natural language queries to synthesize answers backed by exact source citations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main query interaction console */}
        <div className="lg:col-span-2 space-y-6">
          <Card hoverEffect={false} className="flex flex-col min-h-[450px] justify-between relative overflow-hidden">
            {/* Ambient Background Gradient for the LLM output */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold tracking-wide text-white uppercase font-mono">
                    Synthesizer Output
                  </span>
                </div>
                <Badge variant="accent">Ready</Badge>
              </div>

              {/* Chat empty state / placeholder */}
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <SearchIcon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-medium text-sm">Workspace Idle</h3>
                  <p className="text-textSecondary text-xs max-w-xs font-light">
                    Ask a question to retrieve document chunks and synthesize answers.
                  </p>
                </div>
              </div>
            </div>

            {/* Mock Chat input field */}
            <div className="border-t border-white/5 pt-6 flex items-center space-x-4">
              <Input
                placeholder="Ask a question about your documents..."
                disabled
                className="opacity-70 cursor-not-allowed"
              />
              <Button variant="primary" className="cursor-not-allowed opacity-60 px-5 shrink-0" disabled>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Citations / Source Documents Panel */}
        <div className="space-y-6">
          <Card hoverEffect={false} className="h-full flex flex-col justify-between min-h-[450px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">
                  Source References
                </h3>
                <Badge variant="default">0 Sources</Badge>
              </div>

              <div className="py-20 text-center space-y-4">
                <div className="text-textSecondary/20 font-mono text-xs">
                  {"[ NO SOURCES RETRIEVED ]"}
                </div>
                <p className="text-textSecondary text-xs max-w-[200px] mx-auto font-light leading-relaxed">
                  Citations and document snippets will be listed here after you submit a query.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#131519] border border-white/5 rounded-[20px] text-center">
              <span className="text-[10px] font-mono text-primary font-semibold uppercase tracking-wider block">
                Search functionality coming soon.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
