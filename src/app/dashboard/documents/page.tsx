'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Folder, 
  FileText, 
  Upload, 
  Search, 
  ShieldAlert, 
  Eye, 
  Lock, 
  ChevronRight, 
  Gavel,
  Scale,
  MoreVertical,
  Filter,
  Grid,
  List as ListIcon,
  CheckCircle,
  FileBadge
} from 'lucide-react';

const FileItem = ({ name, size, type, modified, security, delay }: { name: string, size: string, type: string, modified: string, security: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card hover:bg-white/[0.03] transition-colors p-4 group cursor-pointer border-l-2 border-l-transparent hover:border-l-gold-primary"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
        <FileText className="text-gold-primary" size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-200 truncate font-inter">{name}</h4>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
          <span>{size}</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full" />
          <span>{modified}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border ${
          security === 'LEVEL 1' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
          security === 'LEVEL 2' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
          'bg-green-500/10 text-green-500 border-green-500/20'
        }`}>
          {security}
        </span>
        <div className="flex gap-2">
          <button className="p-2 text-gray-500 hover:text-gold-primary transition-colors"><Eye size={16} /></button>
          <button className="p-2 text-gray-500 hover:text-gold-primary transition-colors"><MoreVertical size={16} /></button>
        </div>
      </div>
    </div>
  </motion.div>
);

const FolderCard = ({ name, files, delay }: { name: string, files: number, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 border-gold-dark/10 hover:border-gold-primary/30 transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-gold-primary/10 rounded-xl group-hover:bg-gold-primary group-hover:text-black transition-colors">
        <Folder size={24} className="text-gold-primary group-hover:text-black" />
      </div>
      <button className="text-gray-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
    </div>
    <h3 className="text-lg font-bold text-white font-playfair mb-1">{name}</h3>
    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-inter">{files} Digital Files</p>
  </motion.div>
);

export default function DocumentVaultPage() {
  const folders = [
    { name: 'Active Case Briefs', files: 142 },
    { name: 'Evidence Repository', files: 894 },
    { name: 'Supreme Court Precedents', files: 2150 },
    { name: 'Partner Research Docs', files: 45 },
  ];

  const recentFiles = [
    { name: 'Zuma_vs_FGN_Expert_Report.pdf', size: '4.2 MB', type: 'PDF', modified: '2h ago', security: 'LEVEL 1' },
    { name: 'Acme_Corp_Patent_Registry.docx', size: '1.8 MB', type: 'DOCX', modified: '5h ago', security: 'LEVEL 2' },
    { name: 'Audit_Compliance_Matrix_2026.xlsx', size: '12.4 MB', type: 'XLSX', modified: 'Yesterday', security: 'LEVEL 3' },
    { name: 'Supreme_Court_Judgment_Draft_A.pdf', size: '8.5 MB', type: 'PDF', modified: '2 days ago', security: 'LEVEL 1' },
    { name: 'Maritime_Jurisdiction_Memo.pdf', size: '1.1 MB', type: 'PDF', modified: '3 days ago', security: 'LEVEL 2' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Document Intelligence</h1>
          <p className="text-gray-400 text-sm font-inter">Secure, enterprise-grade repository with automated vault intelligence.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline px-6 py-3 flex items-center gap-2 text-xs">
            <Lock size={16} className="text-gold-primary" /> Encrypted Transfer
          </button>
          <button className="btn-luxury px-6 py-3 flex items-center gap-2 text-xs font-bold">
             <Upload size={18} /> Upload Documents
          </button>
        </div>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {folders.map((f, i) => (
          <FolderCard key={i} {...f} delay={0.1 * i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Browser */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold text-white font-playfair">Terminal <span className="gold-text">File Browser</span></h3>
             <div className="flex gap-3">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                 <input 
                  type="text" 
                  placeholder="Filter vault..." 
                  className="bg-white/5 border border-gold-dark/10 rounded-md py-2 pl-10 pr-4 text-[10px] text-white outline-none focus:border-gold-primary w-48 font-inter uppercase font-bold tracking-widest"
                 />
               </div>
               <button className="p-2 border border-gold-dark/10 text-gray-500 hover:text-gold-primary transition-colors"><Filter size={18} /></button>
               <div className="flex rounded-md border border-gold-dark/10 overflow-hidden">
                  <button className="p-2 bg-gold-primary text-black"><ListIcon size={18} /></button>
                  <button className="p-2 hover:bg-white/5 text-gray-500"><Grid size={18} /></button>
               </div>
             </div>
          </div>

          <div className="space-y-4">
             {recentFiles.map((f, i) => (
                <FileItem key={i} {...f} delay={0.2 + (i * 0.05)} />
             ))}
          </div>

          <div className="p-6 border-2 border-dashed border-gold-dark/20 rounded-xl flex flex-col items-center justify-center text-center bg-white/[0.01]">
             <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center mb-4">
               <CheckCircle className="text-gold-primary" size={24} />
             </div>
             <p className="text-sm text-gray-300 font-inter font-medium mb-1">Your local vault is synchronized.</p>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Last backup verified at 19:42 (WAT)</p>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
           <section className="glass-card p-6 border-red-500/20 bg-red-500/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-red-500" size={20} />
                <h4 className="text-white font-playfair font-bold">Security Monitor</h4>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-black/40 rounded border border-red-500/10">
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Unauthorized Access Attempt</p>
                  <p className="text-xs text-gray-400 font-inter">Level 1 Brief "Zuma vs FGN" accessed from unknown IP in Lagos.</p>
                  <button className="mt-3 text-[10px] text-white font-bold underline">Block IP</button>
                </div>
              </div>
           </section>

           <section className="glass-card p-8">
              <h4 className="text-gold-primary font-inter font-bold text-[10px] tracking-widest uppercase mb-6">Vault Classification</h4>
              <div className="space-y-6">
                {[
                  { label: 'Briefs & Pleadings', val: 1242, color: 'bg-blue-500' },
                  { label: 'Evidence & Exhibits', val: 894, color: 'bg-amber-500' },
                  { label: 'Correspondence', val: 450, color: 'bg-green-500' },
                  { label: 'Administrative', val: 180, color: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                      <span className="text-xs text-gray-400 font-inter group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-white font-inter">{item.val}</span>
                  </div>
                ))}
              </div>
           </section>

           <div className="glass-card p-6 bg-gold-primary/5 flex flex-col items-center text-center">
             <FileBadge size={32} className="text-gold-primary mb-4" />
             <h4 className="text-white font-playfair font-bold text-lg mb-2">Legal AI Assistant</h4>
             <p className="text-xs text-gray-400 font-inter mb-6">Automate document summaries and conflict checks across the vault.</p>
             <button className="w-full py-3 bg-gold-primary text-black font-bold text-[10px] tracking-widest uppercase rounded">Activate Intelligence</button>
           </div>
        </div>
      </div>
    </div>
  );
}
