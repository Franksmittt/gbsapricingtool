'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = ({ children, className = '', hoverEffect = false, padding = 'md' }: CardProps) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const baseClasses = `bg-gray-800 border border-white/10 shadow-soft rounded-lg ${paddings[padding]} ${className}`;
  
  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={`${baseClasses} hover:border-red-500/50 transition-colors`}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default Card;