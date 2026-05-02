'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Brain, Cpu, MessageSquare, 
  Search, ShieldCheck, Zap, Activity
} from 'lucide-react';
import AIInsightPanel from '@/components/legal/AIInsightPanel';
import AIWorkbench from '@/components/legal/AIWorkbench';

export default function LegalAIPage() {
  const [activeTab, setActiveTab] = useState<'insights' | 'workbench'>('insights');

  return (
    <div className="space-y-10 pb-20">
      {/* AI Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3 text-gold-primary mb-2">
            <div className="p-2 bg-gold-primary/10 rounded-lg">
              <Cpu size={20} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase font-inter">Neural Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-playfair tracking-tight">Legal <span className="gold-text italic">AI Intelligence</span></h1>
          <p className="text-gray-400 text-sm font-inter max-w-2xl leading-relaxed">
            Zuma Chambers Neural Engine. Leveraging advanced heuristics and semantic analysis for matter summarization, 
            risk detection, and automated legal drafting.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 bg-white/5 border border-gold-dark/10 p-4 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary border border-gold-primary/20">
            <Zap size={18} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none mb-1">Engine Status</p>
            <p className="text-[11px] text-green-500 font-bold uppercase tracking-tighter">Neural Network Optimized</p>
          </div>
        </motion.div>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-4 border-b border-gold-dark/10">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'insights' ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Brain size={14} />
          Case Insights
          {activeTab === 'insights' && (
            <motion.div layoutId="ai-tab-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('workbench')}
          className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'workbench' ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Sparkles size={14} />
          Drafting Workbench
          {activeTab === 'workbench' && (
            <motion.div layoutId="ai-tab-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'insights' && (
             <div className="space-y-8">
               <div className="flex items-center gap-3 p-4 bg-white/5 border border-gold-dark/10 rounded-xl">
                  <Search size={16} className="text-gold-primary" />
                  <input 
                    type="text" 
                    placeholder="Enter Matter ID or Case Title to analyze..."
                    className="bg-transparent border-none text-white text-sm outline-none w-full"
                  />
               </div>
               <AIInsightPanel matterId="m1" />
             </div>
          )}
          {activeTab === 'workbench' && <AIWorkbench />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
