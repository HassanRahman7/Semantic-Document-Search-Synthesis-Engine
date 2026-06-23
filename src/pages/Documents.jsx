import React from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Documents() {
  return (
    <PageContainer>
      <SectionHeader
        monoTag="DOCUMENT_STORE"
        title="Document Vault"
        subtitle="Manage and monitor indexed PDF files available for Retrieval-Augmented Generation."
        action={
          <Button variant="primary" className="cursor-not-allowed opacity-60" disabled>
            <Plus className="w-4 h-4 mr-2" /> Upload Document
          </Button>
        }
      />

      <Card hoverEffect={false} className="py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <FolderKanban className="w-8 h-8 text-textSecondary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">No documents available</h2>
            <p className="text-textSecondary text-sm max-w-sm mx-auto font-light leading-relaxed">
              Your document repository is currently empty. Upload files in the dashboard to populate the vector indices.
            </p>
          </div>
          <div className="pt-2">
            <Badge variant="default">0 Documents Loaded</Badge>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
