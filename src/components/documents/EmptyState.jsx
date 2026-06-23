import React from 'react';
import { FolderKanban } from 'lucide-react';
import Card from '../Card';

export default function EmptyState({ 
  title = "No items found", 
  message = "Try adjusting your filters or upload a new file to get started.",
  actionButton 
}) {
  return (
    <Card hoverEffect={false} className="py-16 border border-white/5 bg-surface/40">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
          <FolderKanban className="w-8 h-8 text-textSecondary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-textSecondary text-sm max-w-sm mx-auto font-light leading-relaxed">
            {message}
          </p>
        </div>
        {actionButton && (
          <div className="pt-2">
            {actionButton}
          </div>
        )}
      </div>
    </Card>
  );
}
