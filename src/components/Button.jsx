import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  disabled = false,
  className = '',
  icon: Icon
}) {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none px-6 py-3 rounded-[20px]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-[0_4px_20px_rgba(228,87,61,0.2)] hover:shadow-[0_4px_25px_rgba(228,87,61,0.4)]",
    secondary: "bg-transparent text-white border border-border/30 hover:border-border hover:bg-white/5",
    text: "bg-transparent text-textSecondary hover:text-white px-3 py-2",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </motion.button>
  );
}
