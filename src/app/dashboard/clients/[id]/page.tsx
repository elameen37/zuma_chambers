'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, Building2, ShieldCheck, Mail, Phone, MapPin, 
  BarChart3, FileSignature, Handshake, History, FileText,
  ChevronRight, Clock, AlertCircle, Coins, Banknote,
  MoreVertical, ArrowUpRight, CheckCircle2, Building, Users, Plus, Activity
} from '@/components/shared/Icons';
import Link from 'next/link';

// Mock Client Data
const CLIENT_DATA = {
  id: '1',
  name: 'Dangote Group',
  type: 'Corporate',
  industry: 'Conglomerate',
  kycStatus: 'Verified',
  riskLevel: 'Low',
  onboardedDate: 'Jan 15, 2022',
  totalBilled: '₦45M',
  outstandings: '₦2.1M',
  contactEmail: 'legal@dangote.com',
  contactPhone: '+234 1 234 5678',
  address: 'Union Marble House, 1 Alfred Rewane Rd, Ikoyi, Lagos',
  cacDetails: {
    registrationNumber: 'RC 123456',
    dateOfInc: 'May 17, 1981',
    tin: '00123456-0001',
    taxCompliance: 'Good'
  },
  directors: [
    { name: 'Aliko Dangote', role: 'Chairman/CEO', ownership: '80%' },
    { name: 'Olakunle Alake', role: 'Group Managing Director', ownership: '5%' },
    { name: 'Halima Dangote', role: 'Director', ownership: '2%' }
  ],
  matters: [
    { id: 'M1', title: 'Admiralty Suit vs FGN', status: 'Hearing', lead: 'O. Zuma' },
    { id: 'M2', title: 'Industrial Court Injunction', status: 'Settled', lead: 'A. Cole' }
  ],
  agreements: [
    { id: 'A1', type: 'Annual Retainer', status: 'Active', expiry: 'Jan 2027' },
    { id: 'A2', type: 'Engagement Letter (Litigation)', status: 'Signed', date: 'Feb 2024' }
  ]
};

const TabButton = ({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: any }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-6 py-4 text-xs font-bold tracking-widest uppercase transition-all z-10 ${
      active ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
    }`}
  >
    <Icon size={16} className="relative z-20" />
    <span className="relative z-20">{label}</span>
    {active && (
      <motion.div 
        layoutId="client-detail-tab-bg"
        className="absolute inset-0 bg-gold-primary/5 border-b-2 border-gold-primary z-10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </button>
);

export default function ClientDetailsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const params = useParams();
  const router = useRouter();

  const client = CLIENT_DATA; // In reality, fetch by params.id
  const isCorporate = client.type === 'Corporate';

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500">
          <Link href="/dashboard/clients" className="hover:text-gold-primary">Clients</Link>
          <ChevronRight size={14} />
          <span className="text-white">{client.name}</span>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline px-4 py-2 text-xs">Generate Invoice</button>
          <button className="btn-luxury px-6 py-2 text-xs font-bold">Edit Profile</button>
        </div>
      </div>

      {/* Header Profile Section */}
      <div className="glass-card p-8 border-gold-dark/10 bg-gradient-to-r from-black via-[#0a0a0a] to-black">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shrink-0 border border-gold-primary/20 bg-gold-primary/5 ${isCorporate ? 'text-blue-500' : 'text-gold-primary'}`}>
            {isCorporate ? <Building2 size={48} /> : <User size={48} />}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white font-playfair">{client.name}</h1>
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
                client.kycStatus === 'Verified' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-amber-500/20 text-amber-500 bg-amber-500/10'
              }`}>
                {client.kycStatus}
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">
                {client.type}
              </span>
            </div>
            <p className="text-gray-400 font-inter mb-6">{client.industry} • Onboarded {client.onboardedDate}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-gold-primary"><Mail size={18} /></div>
                <div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Email Address</span>
                  <span className="text-sm text-gray-300 font-inter">{client.contactEmail}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-gold-primary"><Phone size={18} /></div>
                <div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Contact Number</span>
                  <span className="text-sm text-gray-300 font-inter">{client.contactPhone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-gold-primary"><MapPin size={18} /></div>
                <div>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold">Headquarters</span>
                  <span className="text-sm text-gray-300 font-inter truncate max-w-[200px]">{client.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gold-dark/10 flex overflow-x-auto bg-black/40 backdrop-blur-sm sticky top-20 z-10">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview & KYC" icon={ShieldCheck} />
        <TabButton active={activeTab === 'agreements'} onClick={() => setActiveTab('agreements')} label="Retainers & Agreements" icon={FileSignature} />
        <TabButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} label="Financial Ledger" icon={Coins} />
        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Matter History" icon={History} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* CAC Details */}
                {isCorporate && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-2">
                      <Building2 size={20} className="text-gold-primary" /> Corporate CAC Registration
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: 'RC Number', value: client.cacDetails.registrationNumber },
                        { label: 'Date of Inc.', value: client.cacDetails.dateOfInc },
                        { label: 'Tax ID (TIN)', value: client.cacDetails.tin },
                        { label: 'Tax Status', value: client.cacDetails.taxCompliance, highlight: true },
                      ].map(item => (
                        <div key={item.label}>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1 font-bold">{item.label}</span>
                          <span className={`text-sm font-bold font-inter ${item.highlight ? 'text-green-500' : 'text-gray-300'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Directors Section */}
                {isCorporate && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-2">
                       <Users size={20} className="text-gold-primary" /> Board of Directors
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="border-b border-gold-dark/10">
                             <th className="py-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter">Director Name</th>
                             <th className="py-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter">Designation</th>
                             <th className="py-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter text-right">Equity Share</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                           {client.directors.map(director => (
                             <tr key={director.name} className="group hover:bg-white/5 transition-colors">
                               <td className="py-4 text-sm font-bold text-gray-300 font-inter">{director.name}</td>
                               <td className="py-4 text-xs text-gray-500 font-inter">{director.role}</td>
                               <td className="py-4 text-sm font-bold text-gold-primary font-mono text-right">{director.ownership}</td>
                             </tr>
                           ))}
                         </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                 {/* Risk Card */}
                 <div className={`glass-card p-6 border-l-4 ${client.riskLevel === 'Low' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Conflict Risk Analysis</h4>
                    <div className="flex items-center gap-4 mb-4">
                       <span className={`text-3xl font-bold font-playfair ${client.riskLevel === 'Low' ? 'text-green-500' : 'text-red-500'}`}>
                          {client.riskLevel}
                       </span>
                       <Activity size={24} className="text-gray-700" />
                    </div>
                    <p className="text-xs text-gray-400 font-inter mb-6 leading-relaxed">
                       Last conflict of interest search conducted on **May 10th, 2026**. No direct or indirect adverse linkages found.
                    </p>
                    <button className="w-full py-3 bg-white/5 border border-gold-dark/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gold-primary hover:bg-gold-primary hover:text-black transition-all">
                       Redo Analysis
                    </button>
                 </div>

                 {/* Portals Access */}
                 <div className="glass-card p-6">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Client Portal Activation</h4>
                    <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/10 rounded-lg mb-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-green-500" />
                          <span className="text-xs text-green-500 font-bold">Portal Access Active</span>
                       </div>
                       <button className="text-[10px] text-gray-500 hover:text-white transition-colors">Revoke</button>
                    </div>
                    <p className="text-[10px] text-gray-500 font-inter">Last logged in from IP **192.168.1.1** (Lagos, NG) on May 12, 2026.</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'agreements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {client.agreements.map(agr => (
                 <div key={agr.id} className="glass-card p-6 group hover:border-gold-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <div className="p-3 bg-gold-primary/10 text-gold-primary rounded-xl">
                          <FileSignature size={24} />
                       </div>
                       <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-green-500/20 text-green-500 bg-green-500/10 rounded-sm">
                          {agr.status}
                       </span>
                    </div>
                    <h4 className="text-white font-bold font-playfair text-lg mb-2">{agr.type}</h4>
                    <p className="text-xs text-gray-500 font-inter mb-6">
                       {agr.expiry ? `Expires: ${agr.expiry}` : `Signed: ${agr.date}`}
                    </p>
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-white/5 border border-gold-dark/10 rounded text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gold-primary/10 transition-all">View Agreement</button>
                       <button className="p-2 bg-white/5 border border-gold-dark/10 rounded text-gray-400 hover:text-gold-primary"><Handshake size={16} /></button>
                    </div>
                 </div>
               ))}
               <div className="glass-card border-dashed border-2 border-gold-dark/20 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-gold-primary/40 group transition-all">
                  <Plus size={32} className="text-gold-dark/40 group-hover:text-gold-primary mb-4 transition-all" />
                  <span className="text-xs font-bold text-gold-dark/60 uppercase tracking-widest group-hover:text-gold-primary transition-all">Upload New Engagement</span>
               </div>
            </div>
          )}

          {activeTab === 'finance' && (
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="glass-card p-6 bg-gradient-to-br from-gold-primary/10 to-transparent">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-4 font-bold">Client Trust Balance</span>
                      <span className="text-4xl font-bold text-white font-playfair">₦1.4M</span>
                      <div className="mt-4 flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                         <Banknote size={14} /> Available Funds
                      </div>
                   </div>
                   <div className="glass-card p-6 border-gold-primary/20">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-4 font-bold">Lifetime Billing</span>
                      <span className="text-4xl font-bold text-gold-primary font-playfair">{client.totalBilled}</span>
                      <div className="mt-4 flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                         <History size={14} /> Since 2022
                      </div>
                   </div>
                   <div className="glass-card p-6 border-red-500/20">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-4 font-bold">Unpaid Receivables</span>
                      <span className="text-4xl font-bold text-red-500 font-playfair">{client.outstandings}</span>
                      <div className="mt-4 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                         <AlertCircle size={14} /> Overdue 14 Days
                      </div>
                   </div>
                </div>

                {/* Ledger Mockup */}
                <div className="glass-card p-6">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white font-bold font-playfair text-lg">Financial Ledger History</h3>
                      <button className="text-gold-primary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Download Report</button>
                   </div>
                   <div className="space-y-1">
                      {[
                        { date: 'May 10', desc: 'Retainer Deposit', amount: '+₦2M', type: 'credit' },
                        { date: 'May 08', desc: 'Filing Fees Reimbursable', amount: '-₦120K', type: 'debit' },
                        { date: 'May 05', desc: 'Court Appearance Professional Fees', amount: '-₦450K', type: 'debit' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                           <div className="flex items-center gap-6">
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest w-12">{item.date}</span>
                              <span className="text-sm text-white font-inter">{item.desc}</span>
                           </div>
                           <span className={`text-sm font-bold font-mono ${item.type === 'credit' ? 'text-green-500' : 'text-gray-400'}`}>
                              {item.amount}
                           </span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'history' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                   <h3 className="text-white font-bold font-playfair text-lg mb-6">Ongoing Litigation Matters</h3>
                   <div className="space-y-4">
                      {client.matters.filter(m => m.status !== 'Settled').map(matter => (
                        <Link href={`/dashboard/cases/${matter.id}`} key={matter.id} className="block group">
                           <div className="p-4 border border-gold-dark/10 hover:border-gold-primary/30 rounded-lg transition-all">
                              <div className="flex justify-between items-start mb-2">
                                 <h4 className="text-white font-bold text-sm group-hover:text-gold-primary">{matter.title}</h4>
                                 <ArrowUpRight size={16} className="text-gray-700 group-hover:text-gold-primary transition-all" />
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className="text-[9px] text-gold-primary font-bold uppercase tracking-widest bg-gold-primary/10 px-2 py-0.5 rounded-sm">{matter.status}</span>
                                 <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic">Lead: {matter.lead}</span>
                              </div>
                           </div>
                        </Link>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-6">
                   <h3 className="text-white font-bold font-playfair text-lg mb-6">Archived / Concluded Matters</h3>
                   <div className="space-y-4 opacity-70">
                      {client.matters.filter(m => m.status === 'Settled').map(matter => (
                        <div key={matter.id} className="p-4 border border-gold-dark/5 rounded-lg bg-black/20">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="text-gray-300 font-bold text-sm">{matter.title}</h4>
                              <CheckCircle2 size={16} className="text-green-500" />
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-sm">Concluded</span>
                              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Settled - June 2023</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
