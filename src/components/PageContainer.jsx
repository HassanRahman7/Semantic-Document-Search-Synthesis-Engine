import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../lib/animations';

export default function PageContainer({ 
  children, 
  className = '',
  animate = true
}) {
  const content = (
    <div className={`max-w-[1280px] w-full mx-auto px-6 py-8 md:py-12 ${className}`}>
      {children}
    </div>
  );

  if (!animate) {
    return <div className="flex-1 flex flex-col w-full">{content}</div>;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 flex flex-col w-full"
    >
      {content}
    </motion.div>
  );
}
