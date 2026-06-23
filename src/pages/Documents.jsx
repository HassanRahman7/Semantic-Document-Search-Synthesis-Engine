import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ListFilter } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Card from '../components/Card';
import { useDocuments } from '../hooks/documents/useDocuments';
import { useDocumentStore } from '../store/documentStore';
import UploadDropzone from '../components/upload/UploadDropzone';
import DocumentList from '../components/documents/DocumentList';
import LoadingSkeleton from '../components/documents/LoadingSkeleton';
import DeleteDocumentModal from '../components/documents/DeleteDocumentModal';

export default function Documents() {
  const { data: documents, isLoading, isError, error, refetch } = useDocuments();
  const { uploadDialogOpen, setUploadDialogOpen, activeFilter, setActiveFilter } = useDocumentStore();

  const totalCount = documents?.length || 0;
  const indexedCount = documents?.filter(d => d.status?.toLowerCase() === 'indexed' || d.status?.toLowerCase() === 'success').length || 0;
  const processingCount = documents?.filter(d => d.status?.toLowerCase() === 'processing' || d.status?.toLowerCase() === 'uploaded').length || 0;
  const failedCount = documents?.filter(d => d.status?.toLowerCase() === 'failed').length || 0;

  return (
    <PageContainer>
      <SectionHeader
        monoTag="DOCUMENT_STORE"
        title="Document Vault"
        subtitle="Manage and monitor indexed PDF files available for Retrieval-Augmented Generation."
        action={
          <Button 
            variant={uploadDialogOpen ? "secondary" : "primary"} 
            onClick={() => setUploadDialogOpen(!uploadDialogOpen)}
          >
            {uploadDialogOpen ? (
              <>
                <X className="w-4 h-4 mr-2" /> Close Uploader
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Upload Document
              </>
            )}
          </Button>
        }
      />

      {/* Expandable Upload Panel */}
      <AnimatePresence>
        {uploadDialogOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 32, transition: { duration: 0.3 } }}
            exit={{ height: 0, opacity: 0, marginBottom: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden"
          >
            <Card hoverEffect={false} className="border-primary/20 bg-primary/[0.01]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold tracking-wider font-mono text-white uppercase">// INGESTION CHANNEL</h3>
                <button 
                  onClick={() => setUploadDialogOpen(false)}
                  className="text-textSecondary hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <UploadDropzone onSuccess={() => refetch()} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-xs font-mono rounded-full border transition-all ${
              activeFilter === 'all'
                ? 'bg-white/10 text-white border-white/20 shadow-md'
                : 'bg-transparent text-textSecondary border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('indexed')}
            className={`px-4 py-2 text-xs font-mono rounded-full border transition-all ${
              activeFilter === 'indexed'
                ? 'bg-accent/15 text-accent border-accent/25 shadow-md'
                : 'bg-transparent text-textSecondary border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            Indexed ({indexedCount})
          </button>
          <button
            onClick={() => setActiveFilter('processing')}
            className={`px-4 py-2 text-xs font-mono rounded-full border transition-all ${
              activeFilter === 'processing'
                ? 'bg-primary/15 text-primary border-primary/25 shadow-md'
                : 'bg-transparent text-textSecondary border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            Processing ({processingCount})
          </button>
          <button
            onClick={() => setActiveFilter('failed')}
            className={`px-4 py-2 text-xs font-mono rounded-full border transition-all ${
              activeFilter === 'failed'
                ? 'bg-red-500/15 text-red-400 border-red-500/25 shadow-md'
                : 'bg-transparent text-textSecondary border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            Failed ({failedCount})
          </button>
        </div>

        {/* Action helper */}
        <div className="flex items-center space-x-2 text-xs text-textSecondary font-mono self-end sm:self-auto">
          <ListFilter className="w-4 h-4 text-primary" />
          <span>Filter states dynamically</span>
        </div>
      </div>

      {/* Main Content Area: Loading, Error, or List */}
      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : isError ? (
        <Card hoverEffect={false} className="py-12 border border-red-500/10 text-center space-y-4">
          <div className="text-red-400 text-sm">
            {error?.message || 'Failed to connect to the backend server. Please verify the service is running.'}
          </div>
          <Button variant="secondary" onClick={() => refetch()}>
            Retry Connection
          </Button>
        </Card>
      ) : (
        <DocumentList documents={documents} />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteDocumentModal />
    </PageContainer>
  );
}
