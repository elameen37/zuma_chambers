'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, UploadCloud, Download, 
  History, Sparkles, MoreVertical, FileCheck, ShieldCheck
} from '@/components/shared/Icons';

type DocTab = 'All' | 'Pleadings' | 'Motions' | 'Affidavits' | 'Briefs';

const MOCK_DOCS = [
  { id: '1', name: 'Zuma v FGN - Writ of Summons', suit: 'FHC/ABJ/CS/120/24', type: 'Pleadings', date: 'May 12, 2026', version: 'v1.0', author: 'Olumide Zuma', status: 'E-Filed', size: '2.4 MB' },
  { id: '2', name: 'Motion Ex-Parte (Injunction)', suit: 'LD/1024/GCM/24', type: 'Motions', date: 'May 10, 2026', version: 'v2.1', author: 'Adeyemi Cole', status: 'Draft', size: '1.1 MB' },
  { id: '3', name: 'Applicant Affidavit of Urgency', suit: 'FHC/ABJ/CS/120/24', type: 'Affidavits', date: 'May 11, 2026', version: 'v1.4', author: 'Sarah Nwosu', status: 'Approved', size: '840 KB' },
  { id: '4', name: 'Appellant Final Written Address', suit: 'SC/CV/245/2023', type: 'Briefs', date: 'Apr 28, 2026', version: 'v3.0', author: 'Olumide Zuma', status: 'E-Filed', size: '4.2 MB' },
  { id: '5', name: 'Defense Statement of Claim', suit: 'NICN/LA/334/23', type: 'Pleadings', date: 'Mar 15, 2026', version: 'v1.0', author: 'Ibrahim Musa', status: 'Sealed', size: '3.5 MB' },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = MOCK_DOCS.filter(doc => {
    const matchesTab = activeTab === 'All' || doc.type === activeTab;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.suit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2 mt-4 flex items-center gap-3">
            <span className="p-3 bg-gold-primary/10 rounded-lg"><FileText size={24} className="text-gold-primary" /></span> 
            Document Intelligence
          </h1>
          <p className="text-gray-400 text-sm font-inter mt-3">Draft, version, and manage critical legal artifacts with military-grade encryption.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline px-6 py-3 flex items-center gap-2 text-xs">
            <History size={16} /> Audit Trail
          </button>
          <button className="btn-luxury px-6 py-3 flex items-center gap-2 text-xs font-bold">
            <UploadCloud size={18} /> Upload securely
          </button>
        </div>
      </div>

      {/* Intelligence Search Bar */}
      <div className="glass-card p-6 bg-gradient-to-r from-black via-[#0a0a0a] to-black border-gold-dark/10">
         <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-gold-primary" />
            <h3 className="text-white font-bold font-inter text-sm tracking-widest uppercase">Zuma AI Discovery</h3>
         </div>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary" />
               <input 
                type="text" 
                placeholder="Search across pleading contents, exhibit metadata, or authors (OCR Enabled)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-gold-primary/50 transition-all font-inter shadow-inner"
               />
            </div>
            <button className="px-6 py-4 bg-white/5 border border-gold-dark/20 rounded-lg text-gray-400 hover:text-gold-primary transition-all flex items-center gap-2 font-bold tracking-widest text-xs uppercase">
              <Filter size={16} /> Advanced Filter
            </button>
         </div>
      </div>

      {/* Document Vault Core */}
      <div className="glass-card overflow-hidden">
         {/* Tabs */}
         <div className="flex overflow-x-auto border-b border-gold-dark/20">
            {(['All', 'Pleadings', 'Motions', 'Affidavits', 'Briefs'] as DocTab[]).map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap relative ${
                    activeTab === tab ? 'text-gold-primary bg-white/[0.02]' : 'text-gray-500 hover:text-white hover:bg-white/[0.01]'
                  }`}
               >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="doc-tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary" />
                  )}
               </button>
            ))}
         </div>

         {/* Data Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                 <tr className="bg-black/50 border-b border-gold-dark/10">
                   <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Document Name & Suit</th>
                   <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Author</th>
                   <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Version</th>
                   <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
                   <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gold-dark/5">
                 <AnimatePresence>
                   {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-600 font-inter text-sm">
                           No documents found matching "{searchQuery}" in {activeTab}.
                        </td>
                      </tr>
                   ) : (
                     filteredDocs.map((doc, i) => (
                       <motion.tr 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.05 }}
                         key={doc.id} 
                         className="hover:bg-white/[0.02] transition-colors group"
                       >
                          <td className="p-5">
                             <div className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-gold-dark/10 group-hover:border-gold-primary/30 group-hover:text-gold-primary transition-colors">
                                   <FileText size={20} />
                                </div>
                                <div>
                                   <h4 className="text-white font-inter font-bold text-sm mb-1">{doc.name}</h4>
                                   <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                      <span>{doc.suit}</span>
                                      <span className="w-1 h-1 rounded-full bg-gold-dark/50" />
                                      <span>{doc.date}</span>
                                      <span className="w-1 h-1 rounded-full bg-gold-dark/50" />
                                      <span>{doc.size}</span>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-5">
                             <span className="text-xs text-gray-300 font-inter">{doc.author}</span>
                          </td>
                          <td className="p-5">
                             <div className="flex items-center gap-2">
                                <History size={14} className="text-gold-primary/50" />
                                <span className="text-xs text-gray-400 font-mono tracking-widest">{doc.version}</span>
                             </div>
                          </td>
                          <td className="p-5">
                             <span className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase border rounded-sm flex items-center gap-2 w-max ${
                               doc.status === 'E-Filed' ? 'border-green-500/20 text-green-500 bg-green-500/10' :
                               doc.status === 'Approved' ? 'border-blue-500/20 text-blue-500 bg-blue-500/10' :
                               doc.status === 'Sealed' ? 'border-amber-500/20 text-amber-500 bg-amber-500/10' :
                               'border-gray-500/20 text-gray-400 bg-white/5'
                             }`}>
                               {doc.status === 'E-Filed' && <FileCheck size={10} />}
                               {doc.status === 'Sealed' && <ShieldCheck size={10} />}
                               {doc.status}
                             </span>
                          </td>
                          <td className="p-5 text-right">
                             <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-gold-primary/20 hover:text-gold-primary rounded transition-all">
                                   <Download size={16} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded transition-all">
                                   <MoreVertical size={16} />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                     ))
                   )}
                 </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
