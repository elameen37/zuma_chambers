'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ExecutiveAnalytics from '@/components/legal/ExecutiveAnalytics';
import { Target, TrendingUp, Sparkles } from 'lucide-react';

export default function InsightsPage() {
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
              <Target size={20} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase font-inter">Business Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-playfair tracking-tight">Executive <span className="gold-text italic">Insights</span></h1>
          <p className="text-gray-400 text-sm font-inter max-w-2xl leading-relaxed">
            High-fidelity analytics and performance metrics across Zuma Chambers. 
            Real-time tracking of partner revenue, case success rates, and organizational KPIs.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 bg-white/5 border border-gold-dark/10 p-4 rounded-xl"
        >
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none mb-1">Q2 Performance</p>
            <p className="text-[11px] text-green-500 font-bold">+14.2% Growth</p>
          </div>
        </motion.div>
      </div>

      {/* Main Analytics Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ExecutiveAnalytics />
      </motion.div>
    </div>
  );
}
