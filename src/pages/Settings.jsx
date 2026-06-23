import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Database, Key } from 'lucide-react';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Settings() {
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••••');
  const [chunkSize, setChunkSize] = useState('500');
  const [chunkOverlap, setChunkOverlap] = useState('50');

  return (
    <PageContainer>
      <SectionHeader
        monoTag="SYSTEM_CONFIG"
        title="Settings Workspace"
        subtitle="Fine-tune your document parsing configurations, LLM parameters, and API environment setups."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* RAG Parameters */}
        <Card hoverEffect={false} className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-white/5">
            <Sliders className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">Chunking Parameters</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Chunk Size (Characters)"
              placeholder="e.g. 500"
              value={chunkSize}
              onChange={(e) => setChunkSize(e.target.value)}
              disabled
              className="opacity-80"
            />
            <Input
              label="Chunk Overlap (Characters)"
              placeholder="e.g. 50"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(e.target.value)}
              disabled
              className="opacity-80"
            />
            <p className="text-textSecondary text-xs leading-relaxed font-light">
              * Chunk parameters are optimized during the backend training phase. Modifying these requires rebuilding the vector database.
            </p>
          </div>
        </Card>

        {/* API Configurations */}
        <Card hoverEffect={false} className="space-y-6">
          <div className="flex items-center space-x-3 pb-2 border-b border-white/5">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-white">API Keys & Services</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Gemini API Key"
              type="password"
              placeholder="Enter Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled
              className="opacity-80"
            />
            
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-textSecondary pl-1">Embedding Engine</span>
              <div className="w-full bg-[#131519] border border-white/10 text-white text-sm px-5 py-3.5 rounded-[20px] select-none opacity-80 flex justify-between items-center">
                <span>BAAI/bge-small-en-v1.5</span>
                <Badge variant="accent">LOCAL</Badge>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-textSecondary pl-1">Synthesis Model</span>
              <div className="w-full bg-[#131519] border border-white/10 text-white text-sm px-5 py-3.5 rounded-[20px] select-none opacity-80 flex justify-between items-center">
                <span>gemini-2.5-flash</span>
                <Badge variant="accent">CLOUD</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="primary" className="cursor-not-allowed opacity-60" disabled>
          Save Configurations
        </Button>
      </div>
    </PageContainer>
  );
}
