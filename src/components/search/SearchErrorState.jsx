import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';

export default function SearchErrorState({ error, onRetry }) {
  const errorMessage = error?.message || 'Unable to generate an answer. Please try again.';

  return (
    <Card hoverEffect={false} className="py-16 border border-red-500/10 bg-red-500/[0.01]">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Synthesis Blocked</h2>
          <p className="text-red-400/90 text-sm max-w-sm mx-auto font-light leading-relaxed">
            {errorMessage}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <Button variant="secondary" onClick={onRetry} className="border-red-500/20 hover:bg-red-500/5">
              <RotateCcw className="w-4 h-4 mr-2 text-red-400" /> Retry Query
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
