'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, Filter, Plus, LayoutDashboard, Grid,
  AlertCircle
} from '@/components/shared/Icons';
import MatterCard from '@/components/legal/MatterCard';

import Link from 'next/link';
import { useMatterStore } from '@/lib/matter-service';

const STAGES = ['Intake', 'Discovery', 'Pre-Trial', 'Hearing', 'Judgment', 'Closed'] as const;

export default function CasesBoardPage() {
  const matters = useMatterStore((state) => state.matters);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const filteredMatters = matters.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.suitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || m.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2 mt-4 flex items-center gap-3">
            <span className="p-3 bg-gold-primary/10 rounded-lg"><Briefcase size={24} className="text-gold-primary" /></span> 
            Matter Control Board
          </h1>
          <p className="text-gray-400 text-sm font-inter mt-3">Enterprise case tracking and lifecycle management.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-black border border-gold-dark/20 rounded-lg p-1">
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-gold-primary/20 text-gold-primary' : 'text-gray-500 hover:text-white'}`}
             >
               <LayoutDashboard size={18} />
             </button>
             <button 
               onClick={() => setViewMode('kanban')}
               className={`p-2 rounded flex items-center justify-center transition-all ${viewMode === 'kanban' ? 'bg-gold-primary/20 text-gold-primary' : 'text-gray-500 hover:text-white'}`}
             >
               <Grid size={18} />
             </button>
          </div>
          <button className="btn-outline px-4 py-2 flex items-center gap-2 text-xs">
            Export Docket
          </button>
          <Link href="/dashboard/cases/new" className="btn-luxury px-6 py-2 flex items-center gap-2 text-xs font-bold">
            <Plus size={16} /> New Matter
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/[0.02] p-4 rounded-xl border border-gold-dark/10">
        <div className="flex-1 relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
           <input 
            type="text" 
            placeholder="Search suit number, client, or keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-gold-dark/20 rounded-lg py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-gold-primary transition-all font-inter"
           />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary" />
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-black border border-gold-dark/20 rounded-lg py-3 pl-10 pr-8 text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer"
            >
              <option value="All">All Risks</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Exposure</option>
              <option value="Medium">Medium Exposure</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div 
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredMatters.length === 0 ? (
               <div className="text-center py-20 text-gray-500 font-inter">No matters found matching your criteria.</div>
            ) : (
               filteredMatters.map((matter, i) => (
                 <MatterCard key={matter.id} matter={matter} delay={i * 0.1} />
               ))
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="kanban-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-6 overflow-x-auto pb-8 snap-x"
          >
             {STAGES.map((stage) => {
               const stageMatters = filteredMatters.filter(m => m.stage === stage);
               return (
                 <div key={stage} className="min-w-[320px] max-w-[320px] flex flex-col snap-center">
                    <div className="flex justify-between items-center mb-4 p-3 border-b-2 border-gold-primary/30">
                       <h3 className="text-white font-playfair font-bold text-lg uppercase tracking-wide">{stage}</h3>
                       <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-gold-primary font-bold">{stageMatters.length}</span>
                    </div>
                    <div className="flex-1 space-y-4 min-h-[500px] p-2 bg-black/50 rounded-xl border border-gold-dark/5">
                       {stageMatters.map((matter, i) => (
                         <MatterCard key={matter.id} matter={matter} delay={i * 0.1} compact />
                       ))}
                       {stageMatters.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center text-gray-600 p-8 text-center border-2 border-dashed border-gold-dark/10 rounded-xl">
                            <AlertCircle size={24} className="mb-2 opacity-20" />
                            <p className="text-[10px] uppercase tracking-widest font-bold">No Matters</p>
                         </div>
                       )}
                    </div>
                 </div>
               );
             })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
