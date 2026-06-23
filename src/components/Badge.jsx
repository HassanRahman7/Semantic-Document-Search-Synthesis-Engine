import React from 'react';

export default function Badge({ 
  children, 
  variant = 'default',
  className = ''
}) {
  const baseStyles = "inline-flex items-center px-3 py-1 text-[10px] font-mono font-semibold tracking-wider uppercase rounded-full";
  
  const variants = {
    default: "bg-white/5 text-textSecondary border border-white/10",
    indexed: "bg-accent/10 text-accent border border-accent/25",
    processing: "bg-primary/10 text-primary border border-primary/25",
    failed: "bg-red-500/10 text-red-400 border border-red-500/25",
    accent: "bg-primary/20 text-white border border-primary/40",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
