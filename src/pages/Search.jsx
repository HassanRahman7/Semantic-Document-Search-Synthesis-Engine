import React, { useEffect, useState } from 'react';
import { useAskQuestion } from '../hooks/search/useAskQuestion';
import { useDocuments } from '../hooks/documents/useDocuments';
import { useSearchStore } from '../store/searchStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

import SearchHistorySidebar from '../components/search/SearchHistorySidebar';
import WorkspaceHeader from '../components/search/WorkspaceHeader';
import WorkspaceEmptyState from '../components/search/WorkspaceEmptyState';
import SearchInput from '../components/search/SearchInput';
import ConversationView from '../components/chat/ConversationView';
import SearchErrorState from '../components/search/SearchErrorState';

import { Terminal, FileText, Filter, Cpu, RefreshCw } from 'lucide-react';

const STAGED_MESSAGES = [
  'Searching indexed documents...',
  'Retrieving relevant context...',
  'Generating answer...',
];

export default function Search() {
  const { data: documents } = useDocuments();
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    selectedDocIdFilter, 
    setSelectedDocIdFilter 
  } = useSearchStore();

  const {
    activeSearch,
    setActiveSearch,
    addSearchToHistory,
    sidebarOpen,
  } = useWorkspaceStore();

  const askMutation = useAskQuestion();
  const [loadingStage, setLoadingStage] = useState(0);

  // Staged loading simulation
  useEffect(() => {
    let interval;
    if (askMutation.isPending) {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < STAGED_MESSAGES.length - 1 ? prev + 1 : prev));
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [askMutation.isPending]);

  const handleSearchSubmit = () => {
    const questionText = currentQuestion.trim();
    if (!questionText || askMutation.isPending) return;

    askMutation.mutate(
      {
        question: questionText,
        documentId: selectedDocIdFilter,
      },
      {
        onSuccess: (data) => {
          // Add to local persistent history
          const newItem = addSearchToHistory(questionText, data.answer, data.sources, selectedDocIdFilter);
          // Reset current input question
          setCurrentQuestion('');
        },
      }
    );
  };

  const handleRetry = () => {
    handleSearchSubmit();
  };

  const handleNewQuestion = () => {
    setActiveSearch(null);
    setCurrentQuestion('');
  };

  const handleClearSession = () => {
    setActiveSearch(null);
    setCurrentQuestion('');
    askMutation.reset();
  };

  // Determine if active search or mutation result is "no answer"
  const getIsNoAnswer = (item) => {
    if (!item) return false;
    const ans = item.answer?.toLowerCase() || '';
    return ans.includes('i do not know') || ans.includes("don't know") || (ans.length < 35 && (!item.sources || item.sources.length === 0));
  };

  const selectedDocObj = documents?.find(doc => doc.document_id === selectedDocIdFilter);

  // Find doc filter name for active historical searches if stored
  const getFilterLabel = () => {
    if (activeSearch) {
      const activeDoc = documents?.find(d => d.document_id === activeSearch.docFilter);
      return activeDoc ? activeDoc.file_name : null;
    }
    return selectedDocObj ? selectedDocObj.file_name : null;
  };

  return (
    <PageContainer>
      <div className="flex -mx-8 -my-6 overflow-hidden h-[calc(100vh-112px)] relative">
        {/* Left Sidebar */}
        <SearchHistorySidebar />

        {/* Workspace panel */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-thin">
          <WorkspaceHeader 
            docFilterLabel={getFilterLabel()} 
            onClearFilter={() => {
              setSelectedDocIdFilter('');
              if (activeSearch) {
                // If viewing a history item, clear its doc filter too
                setActiveSearch({ ...activeSearch, docFilter: '' });
              }
            }}
          />

          <div className="flex-1 flex flex-col justify-between space-y-6">
            
            {/* Top Workspace display */}
            <div className="flex-1">
              {/* Case 1: Fetching API right now */}
              {askMutation.isPending && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-pulse max-w-4xl mx-auto w-full">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-start space-x-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-[20px]">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-textSecondary shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="h-3 bg-white/5 rounded w-16" />
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                      </div>
                    </div>

                    <Card hoverEffect={false} className="border-accent/10 bg-accent/[0.01] p-6 md:p-8 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-xs font-mono text-primary font-semibold">
                            {STAGED_MESSAGES[loadingStage]}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-white/10 rounded w-full" />
                        <div className="h-4 bg-white/10 rounded w-[92%]" />
                        <div className="h-4 bg-white/10 rounded w-[85%]" />
                      </div>
                    </Card>
                  </div>
                  <div>
                    <Card hoverEffect={false} className="border-white/5 bg-[#121110]/10 p-5 space-y-4">
                      <div className="h-3 bg-white/10 rounded w-1/3" />
                      <div className="h-10 bg-white/5 rounded-[16px] w-full animate-pulse" />
                    </Card>
                  </div>
                </div>
              )}

              {/* Case 2: Mutation error */}
              {askMutation.isError && !askMutation.isPending && (
                <div className="max-w-4xl mx-auto w-full">
                  <SearchErrorState 
                    error={askMutation.error} 
                    onRetry={handleRetry} 
                  />
                </div>
              )}

              {/* Case 3: Viewing an active historical search */}
              {activeSearch && !askMutation.isPending && (
                <div className="max-w-6xl mx-auto w-full">
                  {getIsNoAnswer(activeSearch) ? (
                    <div className="space-y-6">
                      <div className="flex items-start space-x-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-[20px] max-w-4xl mx-auto w-full">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-textSecondary shrink-0" />
                        <div className="space-y-1.5 flex-1 min-w-0 text-left">
                          <span className="text-[9px] font-mono tracking-widest text-textSecondary uppercase block">// USER_QUERY</span>
                          <p className="text-white text-sm font-light leading-relaxed">{activeSearch.question}</p>
                        </div>
                      </div>
                      <Card hoverEffect={false} className="py-16 border border-white/5 bg-[#121110]/10 text-center space-y-4 max-w-4xl mx-auto w-full">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-textSecondary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-white font-medium text-sm">No relevant information found</p>
                          <p className="text-textSecondary text-xs max-w-sm mx-auto font-light leading-relaxed">
                            No relevant information was found in the indexed documents to answer this question. Please upload additional context files.
                          </p>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex justify-center mt-6">
                          <Button variant="secondary" onClick={handleNewQuestion}>
                            Ask Another Question
                          </Button>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <ConversationView 
                      question={activeSearch.question} 
                      answer={activeSearch.answer} 
                      sources={activeSearch.sources} 
                      onClear={handleClearSession}
                      onNewQuestion={handleNewQuestion}
                    />
                  )}
                </div>
              )}

              {/* Case 4: No active search selected (Empty state) */}
              {!activeSearch && !askMutation.isPending && !askMutation.isError && (
                <div className="max-w-4xl mx-auto w-full">
                  <WorkspaceEmptyState />
                </div>
              )}
            </div>

            {/* Bottom Search Input Area */}
            {!activeSearch && (
              <div className="max-w-4xl mx-auto w-full pt-4">
                <SearchInput 
                  onSubmit={handleSearchSubmit} 
                  disabled={askMutation.isPending} 
                />
                
                {/* Search options bar */}
                <div className="mt-3 flex flex-wrap gap-4 items-center justify-between px-4 text-[10px] font-mono text-textSecondary">
                  <div className="flex items-center space-x-4">
                    {documents && documents.length > 0 ? (
                      <div className="relative group">
                        <button className="flex items-center space-x-1.5 hover:text-white transition-colors">
                          <Filter className="w-3 h-3 text-primary" />
                          <span>Scope: {selectedDocObj ? selectedDocObj.file_name.slice(0, 20) : 'All Vault Docs'}</span>
                        </button>
                        <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-surface border border-white/5 p-1.5 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                          <div 
                            onClick={() => setSelectedDocIdFilter('')}
                            className={`p-2 rounded text-left cursor-pointer ${
                              !selectedDocIdFilter ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            All Documents Scope
                          </div>
                          {documents.map((doc) => (
                            <div 
                              key={doc.document_id}
                              onClick={() => setSelectedDocIdFilter(doc.document_id)}
                              className={`p-2 rounded text-left truncate cursor-pointer ${
                                selectedDocIdFilter === doc.document_id ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 hover:text-white'
                              }`}
                              title={doc.file_name}
                            >
                              {doc.file_name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span>No documents uploaded</span>
                    )}
                  </div>

                  <span>Submit query to launch RAG pipeline</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </PageContainer>
  );
}
