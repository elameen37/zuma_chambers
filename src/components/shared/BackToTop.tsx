'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from './Icons';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(212, 175, 55, 1)' }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gold-primary text-black shadow-2xl border border-gold-primary/20 backdrop-blur-sm transition-colors duration-300 group"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" />
          
          {/* Ripple effect background */}
          <div className="absolute inset-0 rounded-full bg-gold-primary/20 animate-ping -z-10 group-hover:hidden" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
