import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldAlert, FileSearch, Lightbulb, 
  CheckCircle2, Brain, Zap, ArrowRight, RefreshCw,
  Search, FileText, ChevronRight
} from 'lucide-react';
import { useAIStore, AIInsight } from '@/lib/ai-service';

export default function AIInsightPanel({ matterId }: { matterId: string }) {
  const { insights, processMatter, isAnalyzing } = useAIStore();
  const matterInsights = insights[matterId] || [];

  const handleAnalyze = () => {
    processMatter(matterId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gold-primary/5 border border-gold-primary/20 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-primary/10 to-transparent opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gold-primary text-black rounded-lg animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold text-white font-playfair tracking-tight">AI Case <span className="gold-text italic">Intelligence</span></h3>
          </div>
          <p className="text-gray-400 text-xs font-inter max-w-sm">Neural analysis of case filings, precedents, and statutory deadlines.</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="relative z-10 btn-luxury px-6 py-3 text-[10px] flex items-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
          {isAnalyzing ? 'Processing Intelligence...' : 'Run Neural Analysis'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {matterInsights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-6 relative overflow-hidden border-l-4 ${
                insight.category === 'Critical' ? 'border-l-red-500' : 
                insight.category === 'Warning' ? 'border-l-amber-500' : 'border-l-gold-primary'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/5 ${
                    insight.category === 'Critical' ? 'text-red-500' : 'text-gold-primary'
                  }`}>
                    {insight.type}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">CONF: {(insight.confidence * 100).toFixed(1)}%</span>
                </div>
                {insight.category === 'Critical' && <ShieldAlert size={16} className="text-red-500 animate-bounce" />}
              </div>
              
              <p className="text-sm text-gray-300 font-inter leading-relaxed mb-6 italic">
                &quot;{insight.content}&quot;
              </p>

              <div className="flex justify-between items-center">
                 <button className="text-[10px] font-bold text-gold-primary uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all group">
                   Explore Basis <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
                 <div className="flex gap-1">
                   {[1,2,3].map(dot => (
                     <div key={dot} className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-gold-primary' : 'bg-gold-dark'}`} />
                   ))}
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {matterInsights.length === 0 && !isAnalyzing && (
        <div className="py-20 flex flex-col items-center justify-center text-center glass-card border-dashed">
          <Brain size={48} className="text-gold-dark/20 mb-4" />
          <h4 className="text-white font-playfair font-bold text-lg mb-2">Intelligence Engine Standby</h4>
          <p className="text-gray-500 text-sm font-inter max-w-xs">Click the button above to begin semantic analysis of this matter.</p>
        </div>
      )}
    </div>
  );
}
