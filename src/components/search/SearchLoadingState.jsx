import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';
import Card from '../Card';

export default function SearchLoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Answer skeleton */}
      <div className="lg:col-span-2 space-y-4 animate-pulse">
        <Card hoverEffect={false} className="border-white/5 bg-[#121110]/10 flex flex-col justify-between h-[250px] p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-primary animate-pulse" />
              <div className="h-3 bg-white/10 rounded w-28" />
            </div>
            <div className="h-6 bg-white/10 rounded-full w-14" />
          </div>
          
          <div className="flex-1 space-y-3 pt-4">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-[95%]" />
            <div className="h-4 bg-white/10 rounded w-[88%]" />
            <div className="h-4 bg-white/10 rounded w-[75%]" />
          </div>
          
          <div className="border-t border-white/5 pt-4 flex justify-between">
            <div className="h-3 bg-white/5 rounded w-24" />
            <div className="h-3 bg-white/5 rounded w-16" />
          </div>
        </Card>
      </div>

      {/* Citations skeleton */}
      <div className="animate-pulse">
        <Card hoverEffect={false} className="h-full border-white/5 bg-[#121110]/10 p-6 space-y-4">
          <div className="h-3 bg-white/15 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-10 bg-white/5 rounded-[16px] w-full" />
            <div className="h-10 bg-white/5 rounded-[16px] w-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}
