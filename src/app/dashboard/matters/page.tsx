'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Tag
} from '@/components/shared/Icons';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Hearing': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Judgment': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Discovery': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Pre-Trial': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Closed': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  
  return (
    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${styles[status] || styles['Hearing']}`}>
      {status}
    </span>
  );
};

const MatterRow = ({ matter, index }: { matter: { suitNo: string, court: string, title: string, client: string, status: string, dept: string, leadCounsel: string, nextDate: string }, index: number }) => (
  <motion.tr 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="hover:bg-white/[0.02] border-b border-gold-dark/5 transition-colors group cursor-pointer"
  >
    <td className="p-4">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white font-inter">{matter.suitNo}</span>
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
      <StatusBadge status={matter.status} />
    </td>
    <td className="p-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{matter.dept}</span>
        <span className="text-[9px] text-gray-600 mt-1">{matter.leadCounsel}</span>
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2 text-[10px] text-gray-400">
        <Calendar size={12} className="text-gold-primary" />
        {matter.nextDate}
      </div>
    </td>
    <td className="p-4 text-right">
      <button className="p-2 text-gray-500 hover:text-gold-primary transition-colors">
        <MoreVertical size={16} />
      </button>
    </td>
  </motion.tr>
);

export default function MattersPage() {
  const [search, setSearch] = useState('');
  
  const matters = [
    { suitNo: 'FHC/ABJ/CS/120/24', court: 'Federal High Court, Abuja', title: 'Zuma vs Federal Govt of Nigeria', client: 'Zuma Energy Ltd', status: 'Hearing', dept: 'LITIGATION', leadCounsel: 'Olumide Zuma, SAN', nextDate: 'Apr 25, 2026' },
    { suitNo: 'SC/CV/245/2023', court: 'Supreme Court of Nigeria', title: 'Acme Corp Intellectual Property Dispute', client: 'Acme International', status: 'Judgment', dept: 'IP & TECH', leadCounsel: 'Adeyemi Cole', nextDate: 'May 02, 2026' },
    { suitNo: 'LD/1024/GCM/24', court: 'High Court of Lagos State', title: 'Lagos State Maritime Jurisdiction', client: 'Maritime Board', status: 'Discovery', dept: 'COMMERCIAL', leadCounsel: 'Ibrahim Musa', nextDate: 'Apr 28, 2026' },
    { suitNo: 'FCT/HC/CV/09/24', court: 'FCT High Court', title: 'Global Tech Compliance Audit', client: 'Global Tech Inc', status: 'Closed', dept: 'COMPLIANCE', leadCounsel: 'Sarah Nwosu', nextDate: 'Completed' },
    { suitNo: 'FHC/L/CS/88/24', court: 'Federal High Court, Lagos', title: 'Bank vs Telecom Aggregator', client: 'First National Bank', status: 'Pre-Trial', dept: 'LITIGATION', leadCounsel: 'Olumide Zuma, SAN', nextDate: 'May 12, 2026' },
    { suitNo: 'NICN/ABJ/12/24', court: 'National Industrial Court', title: 'Executive Severance Litigation', client: 'James Wilson', status: 'Hearing', dept: 'LABOUR', leadCounsel: 'Adeyemi Cole', nextDate: 'Apr 30, 2026' },
    { suitNo: 'CA/A/221/2024', court: 'Court of Appeal, Abuja', title: 'Oil Bloc Revocation Appeal', client: 'Delta Oil Corp', status: 'Discovery', dept: 'ENERGY', leadCounsel: 'Olumide Zuma, SAN', nextDate: 'Jun 15, 2026' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Matter Management</h1>
          <p className="text-gray-400 text-sm font-inter">Manage the complete lifecycle of your chambers&apos; legal dockets.</p>
        </div>
        <button className="btn-luxury px-6 py-3 flex items-center gap-2">
          <Plus size={18} />
          Create New Matter
        </button>
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
          <select className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-10 text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer">
            <option>All Departments</option>
            <option>Litigation</option>
            <option>Commercial</option>
            <option>Energy</option>
          </select>
        </div>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <select className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-10 text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer">
            <option>Sort by Date</option>
            <option>Priority (High)</option>
            <option>Status</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-primary px-3 py-1 bg-gold-primary/10 rounded-full">Active Docket</span>
            <span className="text-gray-500 text-[10px] uppercase font-bold">{matters.length} Results Found</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-gold-primary text-black rounded hover:bg-gold-light transition-colors"><CheckCircle2 size={16} /></button>
            <button className="p-2 border border-gold-dark/20 text-gray-400 rounded hover:border-gold-primary transition-colors"><AlertCircle size={16} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
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
              {matters.map((matter, i) => (
                <MatterRow key={i} matter={matter} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-gold-dark/10 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-gray-500">
          <span>Showing 1 — 7 of 142 matters</span>
          <div className="flex gap-4">
            <button className="hover:text-gold-primary transition-colors">Previous</button>
            <span className="text-gold-primary">1</span>
            <button className="hover:text-gold-primary transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
