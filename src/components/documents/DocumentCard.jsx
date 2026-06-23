import React from 'react';
import { FileText, Calendar, Database, Trash2 } from 'lucide-react';
import Card from '../Card';
import DocumentStatusBadge from './DocumentStatusBadge';
import { useDocumentStore } from '../../store/documentStore';

// Helper to format file sizes nicely
function formatBytes(bytes, decimals = 2) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Helper to format dates nicely
function formatDate(dateString) {
  if (!dateString) return 'Unknown Date';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
}

export default function DocumentCard({ document }) {
  const { setDeleteTargetDocument } = useDocumentStore();

  const {
    file_name,
    file_size,
    total_pages,
    uploaded_at,
    status
  } = document;

  return (
    <Card hoverEffect={true} className="flex flex-col justify-between h-52 relative group">
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3 max-w-[70%]">
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 
                title={file_name}
                className="text-white font-medium text-sm truncate"
              >
                {file_name}
              </h3>
              <span className="text-[11px] text-textSecondary font-mono mt-0.5 block">
                {formatBytes(file_size)}
              </span>
            </div>
          </div>
          <DocumentStatusBadge status={status} />
        </div>

        {/* Details row */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center space-x-2 text-[11px] text-textSecondary">
            <Calendar className="w-3.5 h-3.5" />
            <span>Uploaded: {formatDate(uploaded_at)}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-textSecondary">
            <Database className="w-3.5 h-3.5" />
            <span>
              {total_pages !== null && total_pages !== undefined 
                ? `${total_pages} pages parsed` 
                : 'Indexing pages...'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="border-t border-white/5 pt-4 flex justify-between items-center mt-auto">
        <span className="text-[10px] font-mono text-textSecondary uppercase">
          ID: {document.document_id.slice(0, 8)}...
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTargetDocument(document);
          }}
          className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-textSecondary hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/25 transition-all focus:outline-none"
          title="Delete Document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
