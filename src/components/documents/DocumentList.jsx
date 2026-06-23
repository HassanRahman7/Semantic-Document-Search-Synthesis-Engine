import React from 'react';
import DocumentCard from './DocumentCard';
import EmptyState from './EmptyState';
import { useDocumentStore } from '../../store/documentStore';

export default function DocumentList({ documents = [] }) {
  const { activeFilter } = useDocumentStore();

  const filteredDocuments = documents.filter((doc) => {
    if (activeFilter === 'all') return true;
    
    const normalizedStatus = (doc.status || '').toLowerCase();
    
    if (activeFilter === 'indexed') {
      return normalizedStatus === 'indexed' || normalizedStatus === 'success';
    }
    if (activeFilter === 'processing') {
      return normalizedStatus === 'processing' || normalizedStatus === 'uploaded';
    }
    if (activeFilter === 'failed') {
      return normalizedStatus === 'failed';
    }
    return true;
  });

  if (filteredDocuments.length === 0) {
    let emptyTitle = "No documents found";
    let emptyMessage = "You don't have any files matching this status filter.";

    if (documents.length === 0) {
      emptyTitle = "No documents have been uploaded yet";
      emptyMessage = "Upload your first PDF to begin building your semantic search knowledge base.";
    }

    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDocuments.map((doc) => (
        <DocumentCard key={doc.document_id} document={doc} />
      ))}
    </div>
  );
}
