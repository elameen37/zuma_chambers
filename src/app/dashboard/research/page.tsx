'use client';

import React from 'react';
import KnowledgeBase from '@/components/legal/KnowledgeBase';
import { motion } from 'framer-motion';
import { BookMarked, Sparkles } from 'lucide-react';

export default function LegalResearchPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3 text-gold-primary mb-2">
            <div className="p-2 bg-gold-primary/10 rounded-lg">
              <BookMarked size={20} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase font-inter">Intelligence Engine</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-playfair tracking-tight">Legal Research & <span className="gold-text italic">Knowledge Base</span></h1>
          <p className="text-gray-400 text-sm font-inter max-w-2xl leading-relaxed">
            Access the Zuma Chambers enterprise library of statutes, Supreme Court decisions, and curated precedents. 
            Integrated citation intelligence for precise litigation preparation.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 bg-white/5 border border-gold-dark/10 p-4 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary border border-gold-primary/20">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Library Pulse</p>
            <p className="text-[11px] text-gray-500">2,450+ Active Citations Synchronized</p>
          </div>
        </motion.div>
      </div>

      {/* Main Knowledge Base Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <KnowledgeBase />
      </motion.div>
    </div>
  );
}
