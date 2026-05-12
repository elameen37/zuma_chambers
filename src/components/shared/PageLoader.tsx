'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel } from './Icons';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500); // Small delay after hitting 100%
          return 100;
        }
        // Random increment for a more "realistic" feel
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[10000] bg-onyx flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 1],
                opacity: 1,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-24 h-24 flex items-center justify-center border border-brand-primary/30 rounded-full bg-brand-primary/5 mb-12 relative"
            >
              <Gavel className="w-10 h-10 text-brand-primary" />
              
              {/* Spinning outer ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-t-2 border-brand-primary/40 rounded-full"
              />
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold tracking-[0.3em] text-white uppercase font-playfair mb-2">[COMPANY_NAME]</h2>
              <p className="text-[10px] text-brand-primary tracking-[0.5em] uppercase font-bold">Elite Legal Counsel</p>
            </motion.div>

            {/* Counter */}
            <div className="relative h-20 flex items-center justify-center">
              <motion.span 
                className="text-6xl md:text-8xl font-bold font-playfair bg-luxury-gradient bg-clip-text text-transparent"
              >
                {progress}%
              </motion.span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 h-[2px] bg-white/5 rounded-full mt-12 overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute top-0 left-0 h-full bg-brand-primary shadow-[0_0_15px_rgba(197,160,89,0.5)]"
              />
            </div>
          </div>

          {/* Decorative lines */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-brand-primary/5 to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
