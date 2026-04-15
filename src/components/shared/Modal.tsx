'use client';

import React from 'react';
import { X } from '@/components/shared/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${widths[size]} w-full glass-card border border-gold-dark/20 overflow-hidden`}>
        <div className="flex justify-between items-center p-6 border-b border-gold-dark/10">
          <h3 className="text-lg font-bold text-white font-playfair">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
