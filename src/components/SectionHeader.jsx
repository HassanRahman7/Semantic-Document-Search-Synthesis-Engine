import React from 'react';

export default function SectionHeader({
  title,
  subtitle,
  monoTag,
  action,
  className = ''
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-8 space-y-4 md:space-y-0 ${className}`}>
      <div className="space-y-2">
        {monoTag && (
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            // {monoTag}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-textSecondary text-sm md:text-base max-w-2xl font-light">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
