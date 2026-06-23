import React from 'react';
import { Sparkles, Terminal, FileText, Filter, CheckCircle2 } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useAskQuestion } from '../hooks/search/useAskQuestion';
import { useDocuments } from '../hooks/documents/useDocuments';
import { useSearchStore } from '../store/searchStore';
import SearchInput from '../components/search/SearchInput';
import AnswerCard from '../components/search/AnswerCard';
import SearchEmptyState from '../components/search/SearchEmptyState';
import SearchLoadingState from '../components/search/SearchLoadingState';
import SearchErrorState from '../components/search/SearchErrorState';

export default function Search() {
  const { data: documents } = useDocuments();
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    selectedDocIdFilter, 
    setSelectedDocIdFilter 
  } = useSearchStore();

  const askMutation = useAskQuestion();

  const handleSearchSubmit = () => {
    if (!currentQuestion.trim() || askMutation.isPending) return;

    askMutation.mutate({
      question: currentQuestion,
      documentId: selectedDocIdFilter,
    });
  };

  const handleRetry = () => {
    handleSearchSubmit();
  };

  // Determine if response is empty-answer state
  const isNoAnswer = 
    askMutation.isSuccess && 
    (askMutation.data?.answer?.toLowerCase()?.includes('i do not know') || 
     askMutation.data?.answer?.toLowerCase()?.includes("don't know") ||
     (askMutation.data?.answer?.length < 30 && askMutation.data?.sources?.length === 0));

  // Find selected document filename
  const selectedDocObj = documents?.find(doc => doc.document_id === selectedDocIdFilter);

  return (
    <PageContainer>
      <SectionHeader
        monoTag="RAG_WORKSPACE"
        title="Search Workspace"
        subtitle="Submit natural language queries to synthesize answers backed by exact source citations."
        action={
          <div className="flex items-center space-x-3">
            {/* Document Filter Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/5 hover:border-white/10 p-2.5 rounded-[16px] text-xs font-mono text-textSecondary hover:text-white transition-all cursor-pointer">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>
                  {selectedDocObj ? `Target: ${selectedDocObj.file_name.slice(0, 15)}...` : 'Filter: All Vault'}
                </span>
              </div>
              
              {/* Dropdown Items list */}
              <div className="absolute right-0 top-full mt-2 w-64 rounded-[20px] bg-surface border border-white/5 p-2 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div 
                  onClick={() => setSelectedDocIdFilter('')}
                  className={`p-2.5 rounded-[12px] text-xs font-mono cursor-pointer transition-all ${
                    !selectedDocIdFilter ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-white/5 hover:text-white'
                  }`}
                >
                  All Vault Documents
                </div>
                {documents && documents.length > 0 && (
                  <div className="border-t border-white/5 my-1.5" />
                )}
                {documents?.map((doc) => (
                  <div 
                    key={doc.document_id}
                    onClick={() => setSelectedDocIdFilter(doc.document_id)}
                    className={`p-2.5 rounded-[12px] text-xs font-mono cursor-pointer truncate transition-all ${
                      selectedDocIdFilter === doc.document_id ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:bg-white/5 hover:text-white'
                    }`}
                    title={doc.file_name}
                  >
                    {doc.file_name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Search Bar Input Container */}
        <div className="max-w-4xl mx-auto w-full">
          <SearchInput 
            onSubmit={handleSearchSubmit} 
            disabled={askMutation.isPending} 
          />
          {selectedDocObj && (
            <div className="mt-3 flex items-center space-x-2 text-[10px] font-mono text-primary px-4">
              <FileText className="w-3.5 h-3.5" />
              <span>Query restricted to: {selectedDocObj.file_name}</span>
            </div>
          )}
        </div>

        {/* Workspace Display Area */}
        <div className="pt-4 border-t border-white/5">
          {/* STATE 1: IDLE / EMPTY */}
          {askMutation.isIdle && <SearchEmptyState />}

          {/* STATE 2: LOADING */}
          {askMutation.isPending && <SearchLoadingState />}

          {/* STATE 3: ERROR */}
          {askMutation.isError && (
            <SearchErrorState 
              error={askMutation.error} 
              onRetry={handleRetry} 
            />
          )}

          {/* STATE 4: SUCCESS WITH ANSWERS */}
          {askMutation.isSuccess && !isNoAnswer && (
            <div className="space-y-6">
              {/* Question header */}
              <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-[20px] border border-white/5">
                <Terminal className="w-4 h-4 text-primary shrink-0" />
                <p className="text-white text-sm font-light truncate">
                  <span className="text-textSecondary mr-1.5 font-mono">Q:</span>
                  {askMutation.variables?.question}
                </p>
              </div>

              {/* RAG Card */}
              <AnswerCard 
                answer={askMutation.data.answer} 
                sources={askMutation.data.sources} 
              />
            </div>
          )}

          {/* STATE 5: NO ANSWER FOUND (Intentional state) */}
          {isNoAnswer && (
            <div className="space-y-6">
              {/* Question header */}
              <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-[20px] border border-white/5">
                <Terminal className="w-4 h-4 text-primary shrink-0" />
                <p className="text-white text-sm font-light truncate">
                  <span className="text-textSecondary mr-1.5 font-mono">Q:</span>
                  {askMutation.variables?.question}
                </p>
              </div>

              <Card hoverEffect={false} className="py-16 border border-white/5 bg-[#121110]/10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-textSecondary">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-white font-medium text-sm">No relevant information found</p>
                  <p className="text-textSecondary text-xs max-w-sm mx-auto font-light leading-relaxed">
                    No relevant information was found in the indexed documents to answer this question. Please upload additional context files or modify your query.
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
