import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useDeleteDocument } from '../../hooks/documents/useDeleteDocument';
import { useDocumentStore } from '../../store/documentStore';
import Button from '../Button';

export default function DeleteDocumentModal() {
  const { deleteTargetDocument, setDeleteTargetDocument } = useDocumentStore();
  const deleteMutation = useDeleteDocument();

  const isOpen = !!deleteTargetDocument;

  const handleClose = () => {
    if (deleteMutation.isPending) return; // Prevent closing while deleting
    setDeleteTargetDocument(null);
    deleteMutation.reset();
  };

  const handleDelete = () => {
    if (!deleteTargetDocument) return;
    deleteMutation.mutate(deleteTargetDocument.document_id, {
      onSuccess: () => {
        setDeleteTargetDocument(null);
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 350 } }}
              exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
              className="bg-surface border border-white/5 rounded-card p-6 md:p-8 w-full max-w-md pointer-events-auto relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                disabled={deleteMutation.isPending}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-textSecondary hover:text-white hover:bg-white/5 transition-all focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                {/* Header icon */}
                <div className="flex items-center space-x-3 text-red-400">
                  <div className="w-10 h-10 rounded-[12px] bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Delete Document</h3>
                </div>

                {/* Body Message */}
                <div className="space-y-2">
                  <p className="text-textSecondary text-sm font-light leading-relaxed">
                    Are you sure you want to permanently delete <strong className="text-white font-medium">{deleteTargetDocument.file_name}</strong>?
                  </p>
                  <p className="text-red-400/80 text-xs font-light">
                    This action will purge the local PDF, delete its parsed pages, and wipe all similarity vectors from ChromaDB. This cannot be undone.
                  </p>
                </div>

                {/* Error Banner */}
                {deleteMutation.isError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-[20px] text-xs">
                    {deleteMutation.error?.message || 'Failed to delete document. Please try again.'}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={deleteMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 shadow-[0_4px_20px_rgba(239,68,68,0.2)] hover:shadow-[0_4px_25px_rgba(239,68,68,0.4)]"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanent'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
