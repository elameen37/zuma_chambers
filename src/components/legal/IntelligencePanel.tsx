'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, BookOpen, Scale, ArrowUpRight, 
  ChevronRight, AlertTriangle, Zap, Info
} from 'lucide-react';
import { Statute, RiskLevel } from '@/lib/matter-service';

export default function IntelligencePanel({ riskScore, riskLevel, statutes }: { riskScore: number, riskLevel: RiskLevel, statutes: Statute[] }) {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-amber-500';
      case 'High': return 'text-red-500';
      case 'Critical': return 'text-red-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Risk Assessment Card */}
      <section className="glass-card p-6 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white font-playfair flex items-center gap-3">
              <ShieldAlert className={getRiskColor(riskLevel)} size={20} /> Matter Exposure
            </h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Risk Intelligence</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
            riskLevel === 'Low' ? 'text-green-500 border-green-500/20' : 
            riskLevel === 'Medium' ? 'text-amber-500 border-amber-500/20' : 
            'text-red-500 border-red-500/20'
          }`}>
            {riskLevel} Risk
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Progress (CSS only) */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64" cy="64" r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="64" cy="64" r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 - (364.4 * riskScore) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={getRiskColor(riskLevel)}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white font-playfair">{riskScore}</span>
              <span className="text-[8px] text-gray-500 uppercase font-bold">Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded border border-gold-dark/10">
              <Zap size={16} className="text-gold-primary mt-1 shrink-0" />
              <div>
                <p className="text-xs text-white font-bold font-inter mb-1">Impact Analysis</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">Matter involves high-stakes constitutional interpretation. Favorable outcome could set new industry precedent for energy licensing in Nigeria.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded border border-gold-dark/10">
              <AlertTriangle size={16} className="text-amber-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-white font-bold font-inter mb-1">Critical Deadlines</p>
                <p className="text-[10px] text-gray-400">Next substantive hearing in 14 days. Failure to file rebuttal by May 5th will increase risk score to Critical.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statutes & Precedents */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
            <BookOpen className="text-gold-primary" size={20} /> Legal Intelligence
          </h3>
          <button className="text-gold-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Intelligence Vault <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {statutes.length === 0 ? (
            <div className="glass-card p-6 text-center italic text-gray-500 text-xs">
              No specific statutes or precedents linked to this matter yet.
            </div>
          ) : (
            statutes.map((statute, idx) => (
              <motion.div
                key={statute.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="glass-card p-4 hover:border-gold-primary/40 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Scale size={14} className="text-gold-primary" />
                    <span className="text-xs font-bold text-white font-inter">{statute.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gold-primary/60">{statute.reference}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-inter line-clamp-2 leading-relaxed">{statute.description}</p>
                <div className="mt-3 flex justify-end">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gold-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Full Text <ArrowUpRight size={10} />
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
