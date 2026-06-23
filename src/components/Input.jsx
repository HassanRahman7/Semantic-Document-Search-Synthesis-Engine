import React from 'react';

export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  label,
  error,
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-2 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-textSecondary pl-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#131519] border border-white/10 text-white placeholder-textSecondary/40 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300 px-5 py-3.5 rounded-[20px] ${error ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 pl-1">
          {error}
        </span>
      )}
    </div>
  );
}
