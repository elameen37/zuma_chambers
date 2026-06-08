'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useMatterStore, Matter, MatterStage } from '@/lib/matter-service';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Tag,
  Download
} from '@/components/shared/Icons';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Intake': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    'Discovery': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Pre-Trial': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Hearing': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Judgment': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Closed': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  
  return (
    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${styles[status] || styles['Hearing']}`}>
      {status}
    </span>
  );
};

const getNextActivityDate = (matter: Matter) => {
  if (matter.stage === 'Closed') return 'Completed';
  if (matter.nextHearing) {
    return new Date(matter.nextHearing).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  const upcomingEvents = (matter.events || [])
    .filter(e => !e.isCompleted && e.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (upcomingEvents.length > 0) {
    return new Date(upcomingEvents[0].date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return 'TBD';
};

const MatterRow = ({ matter, index }: { matter: Matter, index: number }) => (
  <motion.tr 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="hover:bg-white/[0.02] border-b border-gold-dark/5 transition-colors group cursor-pointer"
  >
    <td className="p-4">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white font-inter">{matter.suitNumber}</span>
        <span className="text-[10px] text-gray-500 font-inter">{matter.court}</span>
      </div>
    </td>
    <td className="p-4">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-200 font-playfair group-hover:text-gold-primary transition-colors">{matter.title}</span>
        <div className="flex items-center gap-2 mt-1">
          <User size={10} className="text-gold-primary" />
          <span className="text-[10px] text-gray-500">{matter.client}</span>
        </div>
      </div>
    </td>
    <td className="p-4">
      <StatusBadge status={matter.stage} />
    </td>
    <td className="p-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{matter.type}</span>
        <span className="text-[9px] text-gray-600 mt-1">Lead: {matter.leadCounsel}</span>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-[10px] text-gray-400">
        <Calendar size={12} className="text-gold-primary" />
        {getNextActivityDate(matter)}
      </div>
    </td>
    <td className="p-4 text-right">
      <Link href={`/dashboard/cases/${matter.id}`} className="p-2 text-gray-500 hover:text-gold-primary transition-colors inline-block">
        <MoreVertical size={16} />
      </Link>
    </td>
  </motion.tr>
);

export default function MattersPage() {
  const storeMatters = useMatterStore((state) => state.matters) || [];
  const syncWithSupabase = useMatterStore((state) => state.syncWithSupabase);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [sortBy, setSortBy] = useState('Sort by Date');
  const [isExporting, setIsExporting] = useState(false);
  const [exportToast, setExportToast] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (syncWithSupabase) {
      syncWithSupabase();
    }
  }, [syncWithSupabase]);

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

  const filteredMatters = storeMatters.filter((m) => {
    if (!m) return false;
    const matchesSearch =
      (m.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.suitNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.client || '').toLowerCase().includes(search.toLowerCase());

    const typeLower = (m.type || '').toLowerCase();
    let matchesDept = true;
    if (deptFilter === 'Litigation') {
      matchesDept = typeLower.includes('litigation') || typeLower.includes('appellate');
    } else if (deptFilter === 'Commercial') {
      matchesDept = typeLower.includes('commercial') || typeLower.includes('ip') || typeLower.includes('tech') || typeLower.includes('compliance');
    } else if (deptFilter === 'Energy') {
      matchesDept = typeLower.includes('energy') || typeLower.includes('oil');
    }

    return matchesSearch && matchesDept;
  });

  // Sort logic
  const sortedMatters = [...filteredMatters].sort((a, b) => {
    if (sortBy === 'Priority (High)') {
      return (b.riskScore || 0) - (a.riskScore || 0);
    }
    if (sortBy === 'Status') {
      const stageWeights: Record<MatterStage, number> = {
        'Intake': 1,
        'Discovery': 2,
        'Pre-Trial': 3,
        'Hearing': 4,
        'Judgment': 5,
        'Closed': 6,
      };
      return (stageWeights[a.stage] || 0) - (stageWeights[b.stage] || 0);
    }
    // Default: Sort by Date (created date descending)
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Matter Management</h1>
          <p className="text-gray-400 text-sm font-inter">Manage the complete lifecycle of your chambers&apos; legal dockets.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button 
            onClick={handleExportDocket}
            disabled={isExporting || sortedMatters.length === 0}
            className="flex-1 sm:flex-none btn-outline px-4 py-3 flex items-center justify-center gap-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <span className="w-3 h-3 rounded-full border border-gold-primary border-t-transparent animate-spin" />
            ) : (
              <Download size={14} className="text-gold-primary" />
            )}
            Export Docket
          </button>
          <Link href="/dashboard/cases/new" className="flex-1 sm:flex-none btn-luxury px-6 py-3 flex items-center justify-center gap-2 text-xs font-bold whitespace-nowrap">
            <Plus size={18} />
            Create New Matter
          </Link>
        </div>
      </div>

      {/* Tools & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary" size={16} />
          <input 
            type="text" 
            placeholder="Search by suit no, title, or client..." 
            className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-gold-primary transition-all font-inter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-10 text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer"
          >
            <option value="All Departments">All Departments</option>
            <option value="Litigation">Litigation</option>
            <option value="Commercial">Commercial</option>
            <option value="Energy">Energy</option>
          </select>
        </div>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-10 text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer"
          >
            <option value="Sort by Date">Sort by Date</option>
            <option value="Priority (High)">Priority (High)</option>
            <option value="Status">Status</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-primary px-3 py-1 bg-gold-primary/10 rounded-full">Active Docket</span>
            <span className="text-gray-500 text-[10px] uppercase font-bold">{sortedMatters.length} Results Found</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-gold-primary text-black rounded hover:bg-gold-light transition-colors"><CheckCircle2 size={16} /></button>
            <button className="p-2 border border-gold-dark/20 text-gray-400 rounded hover:border-gold-primary transition-colors"><AlertCircle size={16} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {sortedMatters.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-inter">No matters found matching your criteria.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Suit Detail</th>
                  <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Matter Title & Client</th>
                  <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
                  <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Assigned Team</th>
                  <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Next activity</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {sortedMatters.map((matter, i) => (
                  <MatterRow key={matter.id} matter={matter} index={i} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-gold-dark/10 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-500">
          <span>Showing {sortedMatters.length > 0 ? 1 : 0} — {sortedMatters.length} of {sortedMatters.length} matters</span>
          <div className="flex gap-4">
            <button className="hover:text-gold-primary transition-colors disabled:opacity-30" disabled>Previous</button>
            <span className="text-gold-primary">1</span>
            <button className="hover:text-gold-primary transition-colors disabled:opacity-30" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

