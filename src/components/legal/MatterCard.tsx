import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Clock, ShieldAlert, ArrowRight, Gavel, Scale } from '@/components/shared/Icons';
import { Matter, MatterStage } from '@/lib/matter-service';


const getStageColor = (stage: MatterStage) => {
  switch (stage) {
    case 'Intake': return 'text-gold-primary border-gold-primary/20 bg-gold-primary/10';
    case 'Discovery': return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
    case 'Pre-Trial': return 'text-purple-500 border-purple-500/20 bg-purple-500/10';
    case 'Hearing': return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
    case 'Judgment': return 'text-green-500 border-green-500/20 bg-green-500/10';
    case 'Closed': return 'text-gray-500 border-gray-500/20 bg-gray-500/10';
  }
};

const getRiskColor = (risk: Matter['riskLevel']) => {
  switch (risk) {
    case 'Low': return 'text-green-500';
    case 'Medium': return 'text-amber-500';
    case 'High': return 'text-red-500';
    case 'Critical': return 'text-red-600 animate-pulse';
  }
};

export default function MatterCard({ matter, delay, compact = false }: { matter: Matter, delay: number, compact?: boolean }) {
  const stageClasses = getStageColor(matter.stage);
  const riskClass = getRiskColor(matter.riskLevel);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="glass-card p-4 hover:border-gold-primary/30 transition-all group flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-bold tracking-widest uppercase font-mono text-gray-500">{matter.suitNumber}</span>
            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border ${stageClasses}`}>
              {matter.stage}
            </span>
          </div>
          <h4 className="text-white font-playfair font-bold text-sm mb-1 group-hover:text-gold-primary transition-colors line-clamp-2">
            {matter.title}
          </h4>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gold-dark/10 flex justify-between items-center text-[10px] text-gray-400 font-inter">
          <div className="flex items-center gap-1">
            <ShieldAlert size={12} className={riskClass} /> {matter.riskLevel} Risk
          </div>
          <Link href={`/dashboard/cases/${matter.id}`} className="text-gold-primary hover:text-white transition-colors">
            View <ArrowRight size={10} className="inline" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold-primary/30 transition-all group"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded border border-gold-dark/20 flex items-center justify-center bg-white/5">
            <Scale size={16} className="text-gold-primary" />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase font-mono text-gold-primary">{matter.suitNumber}</span>
          <span className={`px-2 py-1 rounded-sm text-[9px] font-bold tracking-widest uppercase border ${stageClasses}`}>
            {matter.stage}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white font-playfair mb-3 group-hover:text-gold-primary transition-colors">
          {matter.title}
        </h3>
        
        <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-inter">
          <span className="flex items-center gap-1 border-r border-gold-dark/20 pr-4"><Briefcase size={14} /> {matter.type}</span>
          <span className="flex items-center gap-1 border-r border-gold-dark/20 pr-4">Client: <span className="text-white font-medium">{matter.client}</span></span>
          <span className="flex items-center gap-1 border-r border-gold-dark/20 pr-4">Lead: <span className="text-white font-medium">{matter.leadCounsel}</span></span>
          <span className="flex items-center gap-1"><Clock size={14} /> Updated {matter.lastUpdated}</span>
        </div>
      </div>

      <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
        <div className="flex flex-col items-start md:items-end w-full p-3 bg-white/[0.02] border border-gold-dark/10 rounded-lg">
           <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Risk Assessment</span>
           <div className={`flex items-center gap-2 text-sm font-bold font-inter ${riskClass}`}>
             <ShieldAlert size={16} /> {matter.riskLevel} Exposure
           </div>
        </div>
        
        <Link 
          href={`/dashboard/cases/${matter.id}`} 
          className="w-full text-center py-2 px-6 rounded border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-black transition-all text-xs font-bold tracking-wider uppercase font-inter"
        >
          Open Matter
        </Link>
      </div>
    </motion.div>
  );
}
