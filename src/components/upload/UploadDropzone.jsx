import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useUploadDocument } from '../../hooks/documents/useUploadDocument';
import Button from '../Button';

export default function UploadDropzone({ onSuccess }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadState, setUploadState] = useState('idle'); // 'idle', 'uploading', 'processing', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);
  const uploadMutation = useUploadDocument();

  // Drag handers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const validateAndUpload = (file) => {
    // Reset state
    setErrorMessage('');
    uploadMutation.reset();

    // Validate type
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadState('error');
      setErrorMessage('Invalid file format. Only PDF files are supported.');
      return;
    }

    // Limit to 50MB (50 * 1024 * 1024 bytes)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadState('error');
      setErrorMessage('File size exceeds the 50MB limit.');
      return;
    }

    setSelectedFile(file);
    setUploadState('uploading');
    setProgress(0);

    uploadMutation.mutate(
      {
        file,
        onUploadProgress: (percent) => {
          setProgress(percent);
          if (percent === 100) {
            setUploadState('processing'); // Server is now embedding and indexing the document
          }
        },
      },
      {
        onSuccess: (data) => {
          setUploadState('success');
          setProgress(100);
          if (onSuccess) {
            onSuccess(data);
          }
        },
        onError: (err) => {
          setUploadState('error');
          setErrorMessage(err.message || 'Unable to upload document. Please try again.');
        },
      }
    );
  };

  const resetUpload = () => {
    setUploadState('idle');
    setProgress(0);
    setSelectedFile(null);
    setErrorMessage('');
    uploadMutation.reset();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploadState === 'uploading' || uploadState === 'processing'}
        id="file-upload-input"
        aria-label="Upload PDF Document"
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border border-dashed rounded-card p-10 flex flex-col items-center justify-center text-center transition-all duration-300 relative min-h-[300px] select-none
          ${isDragActive ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(228,87,61,0.08)]' : 'border-white/10 bg-black/10 hover:bg-black/20 hover:border-white/20'}
          ${(uploadState === 'uploading' || uploadState === 'processing') ? 'pointer-events-none' : ''}
        `}
      >
        {/* Ambient background glow when drag active */}
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/5 rounded-card blur-md pointer-events-none" />
        )}

        <div className="relative space-y-6 max-w-sm w-full z-10">
          {/* STATE 1: IDLE */}
          {uploadState === 'idle' && (
            <>
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-105">
                <UploadCloud className="w-8 h-8 text-textSecondary" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-medium text-sm">
                  Drag & drop your PDF file here, or{' '}
                  <span 
                    onClick={onButtonClick} 
                    className="text-primary hover:text-primary-hover font-semibold cursor-pointer underline underline-offset-4 decoration-primary/30"
                  >
                    browse files
                  </span>
                </p>
                <p className="text-textSecondary text-xs">Supports PDF format up to 50MB</p>
              </div>
              <div className="pt-2">
                <Button 
                  variant="secondary" 
                  onClick={onButtonClick}
                >
                  Choose Document
                </Button>
              </div>
            </>
          )}

          {/* STATE 2: UPLOADING */}
          {uploadState === 'uploading' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-semibold text-sm">Uploading document...</p>
                <p className="text-textSecondary text-xs truncate max-w-xs mx-auto">{selectedFile?.name}</p>
              </div>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-textSecondary">
                  <span>{progress}%</span>
                  <span>Uploading to server</span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: PROCESSING */}
          {uploadState === 'processing' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
                <RefreshCw className="w-8 h-8 animate-[spin_3s_linear_infinite]" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-semibold text-sm">Processing & Indexing...</p>
                <p className="text-textSecondary text-xs truncate max-w-xs mx-auto">{selectedFile?.name}</p>
                <p className="text-accent/80 text-xs font-mono animate-pulse mt-1">Generating vector embeddings</p>
              </div>
              {/* Infinite/Indeterminate progress bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent animate-[pulse_1.5s_infinite] rounded-full w-full" />
              </div>
            </div>
          )}

          {/* STATE 4: SUCCESS */}
          {uploadState === 'success' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto text-accent">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold text-sm">Indexed Successfully</p>
                <p className="text-textSecondary text-xs truncate max-w-xs mx-auto">{selectedFile?.name}</p>
              </div>
              <div className="pt-2 flex justify-center space-x-3">
                <Button variant="secondary" onClick={resetUpload}>
                  Upload Another
                </Button>
              </div>
            </div>
          )}

          {/* STATE 5: ERROR */}
          {uploadState === 'error' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-semibold text-sm">Upload Failed</p>
                <p className="text-red-400/90 text-xs font-light max-w-xs mx-auto leading-relaxed">
                  {errorMessage}
                </p>
              </div>
              <div className="pt-2 flex justify-center space-x-3">
                <Button variant="secondary" onClick={resetUpload}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
