import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  className = '', 
  hoverEffect = true,
  onClick 
}) {
  const baseStyles = "bg-surface border border-white/5 p-cardPadding rounded-card shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-300";
  const hoverStyles = hoverEffect ? "hover:border-primary/20 hover:shadow-[0_8px_35px_rgba(228,87,61,0.05)] cursor-pointer" : "";

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect && onClick ? { y: -4 } : {}}
      className={`${baseStyles} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
}
