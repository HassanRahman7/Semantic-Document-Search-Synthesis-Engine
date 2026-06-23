import React from 'react';
import { UploadCloud, FileText, Database, ShieldAlert, Cpu } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Dashboard() {
  return (
    <PageContainer>
      {/* Visual Hero Section */}
      <div className="relative py-16 md:py-24 mb-12 rounded-card overflow-hidden bg-gradient-to-br from-[#1d1b1a] to-surface border border-white/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        {/* Glow Layer */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="space-y-6 max-w-2xl text-left">
          <Badge variant="accent">// IDENTITY PROTOCOL INITIALIZED</Badge>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-none">
            Deploy your <span className="text-primary font-semibold">credential.</span>
          </h1>
          <p className="text-textSecondary text-base md:text-lg max-w-xl font-light leading-relaxed">
            Upload enterprise documents, extract semantic knowledge, and synthesize citations instantly. Validated by 10,000+ operators.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="primary">Initialize Workspace</Button>
            <Button variant="secondary">View Operators</Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Ingestion Placeholder Card */}
        <div className="lg:col-span-2">
          <Card hoverEffect={false} className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Document Ingestion</h2>
                <Badge variant="default">Phase 2 Preview</Badge>
              </div>

              {/* Upload Drag/Drop Box Mock */}
              <div className="border border-white/5 border-dashed rounded-card p-10 flex flex-col items-center justify-center text-center space-y-4 bg-black/10 hover:bg-black/20 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <UploadCloud className="w-8 h-8 text-textSecondary" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Drag and drop your PDF here</p>
                  <p className="text-textSecondary text-xs mt-1">Maximum file size allowed is 50MB</p>
                </div>
                <div className="pt-2">
                  <Button variant="secondary" className="cursor-not-allowed opacity-60" disabled>
                    Select Local File
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-textSecondary font-mono">
              <span>Supports structured PDFs</span>
              <span>IN_DEVELOPMENT</span>
            </div>
          </Card>
        </div>

        {/* System Activity & Recent Docs Panel */}
        <div>
          <Card hoverEffect={false} className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
                <Badge variant="processing">Idle</Badge>
              </div>

              {/* Empty state list */}
              <div className="space-y-4 py-6 text-center">
                <FileText className="w-10 h-10 text-textSecondary/20 mx-auto" />
                <p className="text-textSecondary text-sm">No recent documents indexed.</p>
                <p className="text-textSecondary/40 text-xs">Upload a file in the workspace to get started.</p>
              </div>
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
