'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, Filter, Plus, LayoutDashboard, Grid,
  AlertCircle, Download
} from '@/components/shared/Icons';
import MatterCard from '@/components/legal/MatterCard';

import Link from 'next/link';
import { useMatterStore, MatterStage } from '@/lib/matter-service';

const STAGES = ['Intake', 'Discovery', 'Pre-Trial', 'Hearing', 'Judgment', 'Closed'] as const;

export default function CasesBoardPage() {
  const matters = useMatterStore((state) => state.matters) || [];
  const updateMatter = useMatterStore((state) => state.updateMatter);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  // Drag-and-drop state
  const [activeDropStage, setActiveDropStage] = useState<MatterStage | null>(null);
  const dragMatterId = useRef<string | null>(null);

  const handleExportDocket = async () => {
    if (isExporting || !filteredMatters.length) return;
    setIsExporting(true);
    try {
      const { exportToPDF } = await import('@/lib/pdf-service');
      await exportToPDF({
        type: 'docket',
        title: 'Active Matter Docket',
        data: { matters: filteredMatters },
        filename: `chambers-docket-${new Date().toISOString().slice(0, 10)}.pdf`,
      });
      setExportToast(true);
      setTimeout(() => setExportToast(false), 3000);
    } catch (err) {
      console.error('Failed to export docket:', err);
    } finally {
      setIsExporting(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredMatters = (matters || []).filter(m => {
    if (!m) return false;
    const matchesSearch = (m.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (m.suitNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || m.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-10 h-10 rounded-full border-2 border-gold-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Export Success Toast */}
      <AnimatePresence>
        {exportToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-[100] bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-6 py-3 rounded-xl backdrop-blur-lg flex items-center gap-3 shadow-[0_8px_32px_rgba(34,197,94,0.15)]"
          >
            <Download size={14} className="text-gold-primary" />
            Chambers docket exported successfully
          </motion.div>
        )}
      </AnimatePresence>

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
          <button 
            onClick={handleExportDocket}
            disabled={isExporting}
            className="btn-outline px-4 py-2 flex items-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <span className="w-3 h-3 rounded-full border border-gold-primary border-t-transparent animate-spin" />
            ) : (
              <Download size={14} className="text-gold-primary" />
            )}
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
               const isDropTarget = activeDropStage === stage;
               return (
                 <div key={stage} className="min-w-[320px] max-w-[320px] flex flex-col snap-center">
                    {/* Column header */}
                    <div className={`flex justify-between items-center mb-4 p-3 border-b-2 transition-colors duration-200 ${
                      isDropTarget ? 'border-gold-primary' : 'border-gold-primary/30'
                    }`}>
                       <h3 className={`font-playfair font-bold text-lg uppercase tracking-wide transition-colors duration-200 ${
                         isDropTarget ? 'text-gold-primary' : 'text-white'
                       }`}>{stage}</h3>
                       <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
                         isDropTarget ? 'bg-gold-primary/30 text-gold-primary' : 'bg-white/10 text-gold-primary'
                       }`}>{stageMatters.length}</span>
                    </div>

                    {/* Drop zone */}
                    <div
                      className={`flex-1 space-y-4 min-h-[500px] p-2 rounded-xl border transition-all duration-200 ${
                        isDropTarget
                          ? 'bg-gold-primary/5 border-gold-primary/40 shadow-[0_0_24px_rgba(212,175,55,0.12)]'
                          : 'bg-black/50 border-gold-dark/5'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        setActiveDropStage(stage);
                      }}
                      onDragLeave={(e) => {
                        // Only clear if leaving the column entirely (not entering a child)
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                          setActiveDropStage(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const id = e.dataTransfer.getData('text/plain') || dragMatterId.current;
                        if (id) updateMatter(id, { stage });
                        setActiveDropStage(null);
                        dragMatterId.current = null;
                      }}
                    >
                       {stageMatters.map((matter, i) => (
                         <div
                           key={matter.id}
                           draggable
                           onDragStart={(e) => {
                             dragMatterId.current = matter.id;
                             e.dataTransfer.setData('text/plain', matter.id);
                             e.dataTransfer.effectAllowed = 'move';
                             // Briefly reduce opacity of the dragged element
                             (e.currentTarget as HTMLElement).style.opacity = '0.45';
                           }}
                           onDragEnd={(e) => {
                             (e.currentTarget as HTMLElement).style.opacity = '1';
                             dragMatterId.current = null;
                             setActiveDropStage(null);
                           }}
                           className="cursor-grab active:cursor-grabbing"
                         >
                           <MatterCard matter={matter} delay={i * 0.05} compact />
                         </div>
                       ))}
                       {stageMatters.length === 0 && (
                         <div className={`h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl transition-colors duration-200 ${
                           isDropTarget
                             ? 'border-gold-primary/40 text-gold-primary/60'
                             : 'border-gold-dark/10 text-gray-600'
                         }`}>
                            <AlertCircle size={24} className="mb-2 opacity-30" />
                            <p className="text-[10px] uppercase tracking-widest font-bold">
                              {isDropTarget ? 'Drop here' : 'No Matters'}
                            </p>
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
