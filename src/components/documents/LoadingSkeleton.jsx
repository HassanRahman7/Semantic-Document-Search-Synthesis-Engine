import React from 'react';
import Card from '../Card';

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} hoverEffect={false} className="animate-pulse flex flex-col justify-between h-48 space-y-4">
          <div className="space-y-3">
            {/* Header / Title skeleton */}
            <div className="flex justify-between items-start">
              <div className="h-4 bg-white/10 rounded w-2/3" />
              <div className="h-4 bg-white/10 rounded-full w-16" />
            </div>
            {/* Details skeleton */}
            <div className="h-3 bg-white/5 rounded w-1/2" />
            <div className="h-3 bg-white/5 rounded w-1/3" />
          </div>
          {/* Footer skeleton */}
          <div className="border-t border-white/5 pt-4 flex justify-between items-center">
            <div className="h-3 bg-white/5 rounded w-1/4" />
            <div className="h-6 bg-white/10 rounded-full w-14" />
          </div>
        </Card>
      ))}
    </div>
  );
}
