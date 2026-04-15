'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Scale, Briefcase, Clock, ShieldAlert,
  User, Gavel, Calendar, FileText, CheckCircle, Plus,
  MoreVertical, FileCheck, Folder, AlertCircle
} from '@/components/shared/Icons';

export default function CaseDetailsPage() {
  const params = useParams();
  const caseId = params.id as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'timeline'>('overview');

  // Extended mock data specific to a case profile
  const matter = {
    id: caseId,
    suitNumber: 'FHC/ABJ/CS/120/24',
    title: 'Zuma vs Federal Govt of Nigeria - Admiralty Dispute',
    type: 'Litigation',
    stage: 'Hearing',
    riskLevel: 'Critical',
    client: 'Zuma Oil & Gas',
    leadCounsel: 'Olumide Zuma (SAN)',
    lastUpdated: '2 hours ago',
    nextHearing: 'May 14, 2026',
    jurisdiction: 'Federal High Court, Abuja',
    presidingJudge: 'Hon. Justice T. B. Adegoke',
    opposingCounsel: 'Ministry of Justice (FGN)',
    synopsis: 'A high-stakes admiralty dispute concerning the alleged illegal detention of oil vessels within territorial waters, challenging the regulatory overreach of the maritime authority.',
    financialValue: '₦4.5 Billion',
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-500 font-inter">
        <Link href="/dashboard" className="hover:text-gold-primary transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/cases" className="hover:text-gold-primary transition-colors">Cases</Link>
        <ChevronRight size={12} />
        <span className="text-gold-primary">{matter.suitNumber}</span>
      </div>

      {/* Main Header Card */}
      <div className="glass-card p-8 border-t-4 border-t-amber-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Scale size={180} className="text-gold-primary" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                   {matter.stage}
                 </span>
                 <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                   <ShieldAlert size={14} /> {matter.riskLevel} Risk
                 </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white font-playfair mb-3 leading-tight">{matter.title}</h1>
              <p className="text-sm text-gray-400 font-inter leading-relaxed max-w-3xl mb-6">
                 {matter.synopsis}
              </p>
              
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                 <div>
                   <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Lead Counsel</p>
                   <p className="text-sm text-white font-medium font-inter flex items-center gap-2">
                     <User size={14} className="text-gold-primary" /> {matter.leadCounsel}
                   </p>
                 </div>
                 <div>
                   <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Opposing Party/Counsel</p>
                   <p className="text-sm text-white font-medium font-inter">{matter.opposingCounsel}</p>
                 </div>
                 <div>
                   <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Financial Exposure</p>
                   <p className="text-sm text-amber-500 font-bold font-inter">{matter.financialValue}</p>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col gap-4 min-w-[250px]">
              <button className="btn-luxury w-full py-3 text-xs">Update Status</button>
              <button className="btn-outline w-full py-3 text-xs">Upload Document</button>
              
              <div className="mt-auto p-4 bg-white/5 rounded-lg border border-gold-dark/10">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Next Hearing</p>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gold-primary/10 flex items-center justify-center text-gold-primary">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{matter.nextHearing}</p>
                      <p className="text-[10px] text-gray-400">Motion for Injunction</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold-dark/20">
         {[
           { id: 'overview', label: 'Case Overview' },
           { id: 'evidence', label: 'Evidence & Documents', count: 14 },
           { id: 'timeline', label: 'Milestone Timeline' },
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all relative ${
               activeTab === tab.id ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
             }`}
           >
             {tab.label} {tab.count && <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-white/10 text-[9px] text-white">{tab.count}</span>}
             {activeTab === tab.id && (
               <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-primary" />
             )}
           </button>
         ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="glass-card p-6">
                 <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-2">
                   <Gavel className="text-gold-primary" size={20} /> Court Details
                 </h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Jurisdiction</p>
                       <p className="text-sm text-white font-inter">{matter.jurisdiction}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Presiding Judge</p>
                       <p className="text-sm text-white font-inter">{matter.presidingJudge}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Date Filed</p>
                       <p className="text-sm text-white font-inter">February 12, 2024</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Last Updated</p>
                       <p className="text-sm text-white font-inter">{matter.lastUpdated}</p>
                    </div>
                 </div>
               </div>
            </div>
            <div className="space-y-6">
               <div className="glass-card p-6">
                 <h3 className="text-lg font-bold text-white font-playfair mb-4 flex items-center gap-2">
                   <User className="text-gold-primary" size={20} /> Legal Team
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gold-gradient p-[1px]">
                         <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-gold-primary">OZ</div>
                       </div>
                       <div>
                         <p className="text-xs text-white font-bold">{matter.leadCounsel}</p>
                         <p className="text-[9px] text-gray-500 uppercase tracking-widest">Lead Partner</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-300">AC</div>
                       <div>
                         <p className="text-xs text-white font-bold">Adeyemi Cole</p>
                         <p className="text-[9px] text-gray-500 uppercase tracking-widest">Associate</p>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'evidence' && (
          <motion.div key="evidence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
             <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-gold-dark/10">
               <h3 className="text-white font-playfair font-bold text-lg">Case Vault</h3>
               <button className="text-xs text-gold-primary hover:text-white uppercase font-bold tracking-widest">Upload New</button>
             </div>
             
             <div className="glass-card overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Document Name</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Type</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Date Added</th>
                      <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-dark/5">
                    {[
                      { name: 'Plaintiff Writ of Summons', type: 'Pleading', date: 'Feb 12, 2024' },
                      { name: 'Motion Ex-Parte for Injunction', type: 'Motion', date: 'Feb 15, 2024' },
                      { name: 'Exhibit A - Vessel GPS Logs', type: 'Evidence', date: 'Feb 16, 2024' },
                      { name: 'Respondent Counter-Affidavit', type: 'Defense', date: 'Mar 02, 2024' },
                    ].map((doc, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                         <td className="p-4 flex items-center gap-3">
                           <FileText size={16} className="text-gold-primary/50 group-hover:text-gold-primary" />
                           <span className="text-sm text-gray-300 group-hover:text-white font-inter transition-colors">{doc.name}</span>
                         </td>
                         <td className="p-4 text-xs text-gray-400">{doc.type}</td>
                         <td className="p-4 text-xs text-gray-500">{doc.date}</td>
                         <td className="p-4 text-right">
                           <button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-8">
             <div className="relative border-l-2 border-gold-dark/20 ml-4 space-y-8 pb-4">
                {[
                  { date: 'Today, 2 hours ago', title: 'Hearing Adjourned', desc: 'Judge adjourned hearing to May 14 due to late submission of counter-affidavit by opposing counsel.', type: 'alert' },
                  { date: 'Mar 02, 2024', title: 'Defense Filed Counter-Affidavit', desc: 'Received FGN counter-affidavit challenging jurisdiction.', type: 'doc' },
                  { date: 'Feb 12, 2024', title: 'Suit Commenced', desc: 'Writ of summons and statement of claim filed at FHC Abuja.', type: 'milestone' },
                ].map((event, i) => (
                  <div key={i} className="relative pl-8">
                     <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-black border-2 border-gold-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                     </span>
                     <p className="text-[10px] text-gold-primary uppercase tracking-widest font-bold mb-1">{event.date}</p>
                     <h4 className="text-white font-playfair font-bold text-lg mb-1">{event.title}</h4>
                     <p className="text-sm text-gray-400 font-inter leading-relaxed">{event.desc}</p>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
