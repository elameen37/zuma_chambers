'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'gray';
  size?: 'sm' | 'md';
}

const VARIANTS: Record<string, string> = {
  gold: 'bg-gold-primary/10 text-gold-primary border-gold-primary/20',
  green: 'bg-green-500/10 text-green-500 border-green-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function Badge({ children, variant = 'gold', size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[8px]' : 'px-3 py-1 text-[10px]';
  return (
    <span className={`inline-flex items-center rounded-sm font-bold tracking-widest uppercase border ${VARIANTS[variant]} ${sizeClasses}`}>
      {children}
    </span>
  );
}
