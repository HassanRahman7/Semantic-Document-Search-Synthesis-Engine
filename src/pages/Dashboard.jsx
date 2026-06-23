import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Database, ShieldAlert, Cpu, ArrowRight, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import DocumentStatusBadge from '../components/documents/DocumentStatusBadge';
import UploadDropzone from '../components/upload/UploadDropzone';
import { useDocuments } from '../hooks/documents/useDocuments';

// Helper to format file sizes
function formatBytes(bytes, decimals = 1) {
  if (!bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: documents, isLoading, isError, error, refetch } = useDocuments();

  // Get 5 most recent documents
  const recentDocuments = documents ? [...documents].slice(0, 5) : [];

  return (
    <PageContainer>
      {/* Visual Hero Section */}
      <div className="relative py-16 md:py-20 mb-8 rounded-card overflow-hidden bg-gradient-to-br from-[#1d1b1a] to-surface border border-white/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        {/* Glow Layer */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="space-y-6 max-w-2xl text-left">
          <Badge variant="accent">// IDENTITY PROTOCOL INITIALIZED</Badge>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-none">
            Deploy your <span className="text-primary font-semibold">credential.</span>
          </h1>
          <p className="text-textSecondary text-sm md:text-base max-w-xl font-light leading-relaxed">
            Upload enterprise documents, extract semantic knowledge, and synthesize citations instantly. Validated by 10,000+ operators.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="primary" onClick={() => navigate('/search')}>
              Start Search Workspace
            </Button>
            <Button variant="secondary" onClick={() => navigate('/documents')}>
              Manage Documents
            </Button>
          </div>
        </div>

        {/* Visual Decoration */}
        <div className="mt-12 md:mt-0 relative w-full md:w-80 h-64 shrink-0 flex items-center justify-center">
          <div className="absolute w-56 h-56 rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-44 h-44 rounded-full border border-white/5 flex items-center justify-center">
            <Database className="w-10 h-10 text-primary/75" />
          </div>
          {/* Animated node sparks */}
          <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#34D399]" />
          <div className="absolute bottom-12 right-10 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_#E4573D]" />
        </div>
      </div>

      {/* Quick Ask Section */}
      <div className="mb-12">
        <Card 
          hoverEffect={true} 
          onClick={() => navigate('/search')} 
          className="cursor-pointer border-primary/20 bg-primary/[0.01] hover:bg-primary/[0.03] p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-[16px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium text-sm md:text-base">Quick Ask</h3>
              <p className="text-textSecondary text-xs font-light">
                Have a question? Head over to the Search Workspace to query your indexed files instantly.
              </p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate('/search'); 
            }}
          >
            Open Search Workspace <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Ingestion Card */}
        <div className="lg:col-span-2">
          <Card hoverEffect={false} className="h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Document Ingestion</h2>
                <Badge variant="accent">ACTIVE_CHANNEL</Badge>
              </div>
              <p className="text-textSecondary text-xs font-light">
                Submit raw PDF files to build vector embeddings for search.
              </p>

              {/* Upload Drag/Drop Box */}
              <UploadDropzone onSuccess={() => refetch()} />
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-textSecondary font-mono">
              <span>Supports PDF files</span>
              <span className="text-accent">ONLINE</span>
            </div>
          </Card>
        </div>

        {/* System Activity & Recent Docs Panel */}
        <div>
          <Card hoverEffect={false} className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
                <button 
                  onClick={() => navigate('/documents')}
                  className="text-primary hover:text-primary-hover flex items-center text-xs font-mono font-semibold"
                >
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              {/* Loader, Error, or List */}
              {isLoading ? (
                <div className="space-y-4 py-8 text-center">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
                  <p className="text-textSecondary text-xs">Loading recent documents...</p>
                </div>
              ) : isError ? (
                <div className="space-y-3 py-8 text-center text-red-400">
                  <AlertCircle className="w-8 h-8 mx-auto" />
                  <p className="text-xs">Failed to load recent files.</p>
                </div>
              ) : recentDocuments.length === 0 ? (
                <div className="space-y-4 py-12 text-center border border-white/5 border-dashed rounded-card bg-black/10">
                  <FileText className="w-10 h-10 text-textSecondary/20 mx-auto" />
                  <p className="text-textSecondary text-sm font-light">No documents indexed.</p>
                  <p className="text-textSecondary/40 text-xs">Upload a file to build your knowledge base.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div 
                      key={doc.document_id}
                      onClick={() => navigate('/documents')}
                      className="bg-[#131519] border border-white/5 hover:border-white/10 p-3.5 rounded-[20px] flex items-center justify-between cursor-pointer transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3 truncate max-w-[65%]">
                        <FileText className="w-4 h-4 text-textSecondary group-hover:text-primary transition-colors shrink-0" />
                        <div className="truncate">
                          <p className="text-white text-xs font-medium truncate">{doc.file_name}</p>
                          <span className="text-[10px] text-textSecondary font-mono mt-0.5 block">
                            {formatBytes(doc.file_size)}
                          </span>
                        </div>
                      </div>
                      <DocumentStatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-textSecondary">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>Model: gemini-2.5-flash</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-textSecondary">
                <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                <span>Embedding: bge-small-en-v1.5</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
