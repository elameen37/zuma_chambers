'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, BarChart4, PieChart, ArrowUpRight, ArrowDownRight,
  Clock, Wallet, ReceiptSquare, Users, Activity, Download,
  Plus, Gavel, ArrowRight, ShieldCheck, Building, AlertCircle,
  Search
} from '@/components/shared/Icons';

const FinanceCard = ({ label, value, trend, trendType, icon: Icon, delay }: { label: string, value: string, trend?: string, trendType?: 'up' | 'down', icon: React.ElementType, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 border-gold-dark/10"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gold-primary/10 rounded-lg">
        <Icon size={20} className="text-gold-primary" />
      </div>
       {trend && (
         <div className={`flex items-center gap-1 text-[10px] font-bold ${trendType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
       )}
    </div>
    <h3 className="text-gray-500 text-[10px] tracking-widest uppercase mb-1 font-inter font-bold">{label}</h3>
    <p className="text-3xl font-bold text-white font-playfair">{value}</p>
  </motion.div>
);

const TabButton = ({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: React.ElementType }) => (
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
        layoutId="finance-tab-bg"
        className="absolute inset-0 bg-gold-primary/5 border-b-2 border-gold-primary z-10"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
  </button>
);

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  const symbol = currency === 'NGN' ? '₦' : '$';

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2 mt-4 flex items-center gap-3">
             <span className="p-3 bg-gold-primary/10 rounded-lg"><DollarSign size={24} className="text-gold-primary" /></span>
             Finance & Billing Center
          </h1>
          <p className="text-gray-400 text-sm font-inter mt-3">Enterprise-grade legal accounting with multi-currency trust ledgers and revenue analytics.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black border border-gold-dark/20 rounded-lg p-1">
            <button 
              onClick={() => setCurrency('NGN')}
              className={`px-4 py-1.5 rounded text-[9px] font-bold transition-all ${currency === 'NGN' ? 'bg-gold-primary text-black' : 'text-gray-500'}`}
            >
              NGN
            </button>
            <button 
              onClick={() => setCurrency('USD')}
              className={`px-4 py-1.5 rounded text-[9px] font-bold transition-all ${currency === 'USD' ? 'bg-gold-primary text-black' : 'text-gray-500'}`}
            >
              USD
            </button>
          </div>
          <button className="btn-luxury px-6 py-3 flex items-center gap-2 text-xs font-bold">
            <Plus size={18} /> New Billable Entry
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gold-dark/10 flex overflow-x-auto bg-black/40 backdrop-blur-sm sticky top-20 z-10">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={Activity} />
        <TabButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} label="Invoices & Fees" icon={ReceiptSquare} />
        <TabButton active={activeTab === 'trust'} onClick={() => setActiveTab('trust')} label="Trust Account Ledger" icon={ShieldCheck} />
        <TabButton active={activeTab === 'reporting'} onClick={() => setActiveTab('reporting')} label="Chamber Reports" icon={BarChart4} />
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
            <div className="space-y-8">
               {/* KPI Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FinanceCard label="Total Realized Revenue" value={`${symbol}${currency === 'NGN' ? '142.5M' : '185K'}`} trend="+12%" trendType="up" icon={DollarSign} delay={0.1} />
                  <FinanceCard label="Trust Account Balance" value={`${symbol}${currency === 'NGN' ? '28.1M' : '36.5K'}`} icon={Wallet} delay={0.2} />
                  <FinanceCard label="Unbilled WIP" value={`${symbol}${currency === 'NGN' ? '12.4M' : '16K'}`} trend="+5%" trendType="up" icon={Clock} delay={0.3} />
                  <FinanceCard label="Overdue Invoices" value={`${symbol}${currency === 'NGN' ? '5.8M' : '7.5K'}`} trend="+2%" trendType="down" icon={AlertCircle} delay={0.4} />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Distribution Chart */}
                  <div className="lg:col-span-2 glass-card p-8 aspect-video flex flex-col">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                           <h3 className="text-white font-playfair font-bold text-xl">Monthly Fee Realization</h3>
                           <p className="text-xs text-gray-500">Comparing billable hours vs collections.</p>
                        </div>
                        <div className="flex gap-4 items-center">
                           <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gold-primary rounded-full" /> <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Invoiced</span></div>
                           <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/20 rounded-full" /> <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">WIP</span></div>
                        </div>
                     </div>
                     <div className="flex-1 flex items-end gap-3 px-2">
                        {[35, 65, 45, 85, 75, 95, 60, 40, 80, 55, 70, 90].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-3">
                             <div className="w-full relative group">
                                <motion.div 
                                   initial={{ height: 0 }}
                                   animate={{ height: `${h}%` }}
                                   transition={{ delay: i * 0.05, duration: 1 }}
                                   className="w-full bg-gold-primary/80 hover:bg-gold-primary rounded-t-sm transition-all"
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gold-primary text-black text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                   {symbol}{h * (currency === 'NGN' ? 100 : 0.1)}k
                                </div>
                             </div>
                             <span className="text-[8px] text-gray-600 font-bold uppercase">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Revenue Splits */}
                  <div className="space-y-6">
                     <div className="glass-card p-6">
                        <h3 className="text-white font-playfair font-bold text-sm mb-6 uppercase tracking-widest flex items-center justify-between">
                           Partner Splits <PieChart size={16} className="text-gold-primary" />
                        </h3>
                        <div className="space-y-4">
                           {[
                             { name: 'Olumide Zuma', role: 'Principal', share: '45%', amount: '₦64M' },
                             { name: 'Sarah Nwosu', role: 'Managing Partner', share: '30%', amount: '₦42M' },
                             { name: 'Adeyemi Cole', role: 'Partner', share: '25%', amount: '₦35M' },
                           ].map(partner => (
                             <div key={partner.name} className="flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                   <span className="text-xs text-white font-bold">{partner.name}</span>
                                   <span className="text-[10px] text-gold-primary font-bold">{partner.share}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-gold-gradient" style={{ width: partner.share }} />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="glass-card p-6 border-gold-primary/20 bg-gold-primary/[0.02]">
                        <h3 className="text-white font-playfair font-bold text-sm mb-2">VAT & Compliance</h3>
                        <p className="text-[10px] text-gray-500 leading-relaxed mb-4">Firm is currently up-to-date with FIRS returns. Estimated VAT payable for Q2: **₦4,120,400**.</p>
                        <button className="w-full py-2 bg-white/5 border border-gold-dark/10 rounded text-[9px] font-bold uppercase tracking-widest text-gold-primary hover:bg-gold-primary hover:text-black transition-all">Submit Returns</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'billing' && (
             <div className="space-y-8">
                {/* Advanced Invoice Filter */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4">
                   <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gold-primary text-black text-[10px] font-bold uppercase tracking-widest rounded">All Fees</button>
                      <button className="px-4 py-2 bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded hover:text-white transition-colors">Success Fee</button>
                      <button className="px-4 py-2 bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded hover:text-white transition-colors">Fixed Fee</button>
                   </div>
                   <div className="relative flex-1 max-w-sm">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-primary" />
                      <input type="text" placeholder="Search invoices, clients..." className="w-full bg-black/40 border border-gold-dark/10 rounded-lg py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-gold-primary" />
                   </div>
                </div>

                {/* Ledger Table */}
                <div className="glass-card overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-white/5 border-b border-gold-dark/10">
                            <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Reference No.</th>
                            <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Client Entity</th>
                            <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Type</th>
                            <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Due Date</th>
                            <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter text-right">Amount Due</th>
                            <th className="p-5 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
                            <th className="p-5"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {[
                           { ref: 'ZC/2026/040', client: 'Lagos Maritime Board', type: 'Success Fee', due: 'May 10, 2026', amount: '12,500,000', status: 'Pending' },
                           { ref: 'ZC/2026/038', client: 'Dangote Group', type: 'Retainer', due: 'Apr 28, 2026', amount: '4,500,000', status: 'Paid' },
                           { ref: 'ZC/2026/035', client: 'Acme Int.', type: 'Fixed Fee', due: 'Apr 15, 2026', amount: '2,100,000', status: 'Overdue' },
                           { ref: 'ZC/2026/032', client: 'Shell Petroleum', type: 'Hourly', due: 'May 02, 2026', amount: '8,420,000', status: 'Pending' },
                         ].map((inv, i) => (
                           <tr key={i} className="hover:bg-white/[0.02] group transition-colors">
                              <td className="p-5 text-xs text-gray-400 font-mono">{inv.ref}</td>
                              <td className="p-5 text-sm font-bold text-white font-playfair">{inv.client}</td>
                              <td className="p-5 text-[10px] text-gray-500 uppercase font-bold tracking-widest">{inv.type}</td>
                              <td className="p-5 text-xs text-gray-400 font-inter">{inv.due}</td>
                              <td className="p-5 text-right font-bold text-white font-inter">{symbol}{currency === 'NGN' ? inv.amount : (parseInt(inv.amount.replace(/,/g, '')) / 1200).toLocaleString()}</td>
                              <td className="p-5">
                                 <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                   inv.status === 'Paid' ? 'border-green-500/20 text-green-500' : 
                                   inv.status === 'Overdue' ? 'border-red-500/20 text-red-500 animate-pulse' : 
                                   'border-amber-500/20 text-amber-500'
                                 }`}>
                                    {inv.status}
                                 </span>
                              </td>
                              <td className="p-5 text-right">
                                 <button className="text-gray-500 hover:text-gold-primary transition-colors"><Download size={16} /></button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === 'trust' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                   <div className="glass-card p-6">
                      <div className="flex justify-between items-center mb-10">
                         <h3 className="text-xl font-bold text-white font-playfair">Trust Account Ledger</h3>
                         <button className="flex items-center gap-2 text-gold-primary text-[10px] font-bold uppercase tracking-widest hover:underline">
                            <Plus size={14} /> Record Entry
                         </button>
                      </div>
                      <div className="space-y-1">
                         {[
                           { date: 'May 02, 2026', ref: 'TR-1022', client: 'Shell Petroleum', desc: 'Filing fees deposit for Suit ABJ/120', credit: '+₦500,000' },
                           { date: 'Apr 28, 2026', ref: 'TR-1018', client: 'Global Tech', desc: 'Trust disbursement for Arbitration costs', debit: '-₦1,250,500' },
                           { date: 'Apr 25, 2026', ref: 'TR-1015', client: 'Zuma Energy', desc: 'Refund of excess research fees', debit: '-₦45,000' },
                           { date: 'Apr 20, 2026', ref: 'TR-1012', client: 'First Bank', desc: 'Lien recovery trust deposit', credit: '+₦14,200,000' },
                         ].map((entry, i) => (
                           <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                              <div className="flex flex-col gap-1 mb-3 md:mb-0">
                                 <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{entry.date} • {entry.ref}</span>
                                 <span className="text-sm font-bold text-white font-playfair">{entry.client}</span>
                                 <p className="text-xs text-gray-500 font-inter">{entry.desc}</p>
                              </div>
                              <div className="text-right">
                                 <span className={`text-lg font-bold font-mono ${entry.credit ? 'text-green-500' : 'text-gray-400'}`}>
                                    {entry.credit || entry.debit}
                                 </span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="glass-card p-6 border-l-4 border-l-gold-primary">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Account Integrity</h4>
                      <p className="text-xs text-gray-400 font-inter mb-6 leading-relaxed">
                         The Trust Account is currently **reconciled** with bank statements as of **Yesterday**. All client funds are strictly segregated.
                      </p>
                      <div className="flex items-center gap-3 text-green-500 font-bold text-[10px] uppercase tracking-widest">
                         <ShieldCheck size={18} /> Verified Auditor Check
                      </div>
                   </div>

                   <div className="glass-card p-6">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pending Requests</h4>
                      <div className="space-y-4">
                         <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                            <span className="text-white font-bold text-[11px] block mb-1">Unallocated Funds Recovery</span>
                            <span className="text-[10px] text-gray-500">₦245K from POS transaction ID 44521</span>
                            <button className="mt-3 text-[9px] text-gold-primary font-bold hover:underline">Resolve Now</button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'reporting' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: 'Chamber Overhead Report', desc: 'Detailed breakdown of office rentals, software, and administrative costs.', icon: Building },
                  { title: 'Clerk Productivity Analysis', desc: 'Billable efficiency tracking across the entire clerk pool.', icon: Users },
                  { title: 'Tax & VAT Projections', desc: 'Forward-looking tax liability planning for the next fiscal year.', icon: ReceiptSquare },
                  { title: 'Success Fee Analytics', desc: 'Correlation between high-stakes litigation outcomes and firm growth.', icon: Gavel },
                  { title: 'Multi-Currency Exposure', desc: 'Risk tracking for USD denominated contracts vs Naira volatility.', icon: DollarSign },
                  { title: 'Payroll Support Summary', desc: 'Monthly disbursement breakdown and statutory contribution logs.', icon: Wallet },
                ].map((report, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 flex items-start gap-4 cursor-pointer border-white/5 hover:border-gold-primary/30 transition-all"
                  >
                    <div className="p-3 bg-white/5 text-gold-primary rounded-xl">
                       <report.icon size={24} />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-sm mb-2 font-playfair">{report.title}</h4>
                       <p className="text-[11px] text-gray-500 font-inter leading-relaxed">{report.desc}</p>
                       <button className="mt-4 flex items-center gap-2 text-[10px] text-gold-primary font-bold uppercase tracking-widest hover:gap-3 transition-all">
                          Generate <ArrowRight size={14} />
                       </button>
                    </div>
                  </motion.div>
                ))}
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
