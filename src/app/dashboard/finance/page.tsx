'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  BarChart4, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileCheck, 
  Clock, 
  CreditCard,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';

const FinanceCard = ({ label, value, trend, trendType, icon: Icon, delay }: { label: string, value: string, trend: string, trendType: 'up' | 'down', icon: React.ElementType, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gold-primary/10 rounded-lg">
        <Icon size={20} className="text-gold-primary" />
      </div>
       <div className={`flex items-center gap-1 text-[10px] font-bold ${trendType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
    <h3 className="text-gray-500 text-[10px] tracking-widest uppercase mb-1 font-inter font-bold">{label}</h3>
    <p className="text-3xl font-bold text-white font-playfair">{value}</p>
  </motion.div>
);

const InvoiceRow = ({ invoice, index }: { invoice: { id: string, client: string, matter: string, date: string, amount: string, status: string }, index: number }) => (
  <motion.tr 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + (index * 0.05) }}
    className="hover:bg-white/[0.02] border-b border-gold-dark/5 transition-colors group cursor-pointer"
  >
    <td className="p-4 text-xs font-bold text-white font-inter">{invoice.id}</td>
    <td className="p-4">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-200 font-playfair group-hover:text-gold-primary transition-colors">{invoice.client}</span>
        <span className="text-[10px] text-gray-500 font-inter">{invoice.matter}</span>
      </div>
    </td>
    <td className="p-4 text-xs text-gray-300 font-inter">{invoice.date}</td>
    <td className="p-4 text-sm font-bold text-white font-inter">{invoice.amount}</td>
    <td className="p-4">
      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${
        invoice.status === 'Paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
        invoice.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
        'bg-amber-500/10 text-amber-500 border-amber-500/20'
      }`}>
        {invoice.status}
      </span>
    </td>
    <td className="p-4 text-right">
      <button className="text-gray-500 hover:text-gold-primary transition-colors">
        <Download size={16} />
      </button>
    </td>
  </motion.tr>
);

export default function FinancePage() {
  const invoices = [
    { id: 'INV-2026-0012', client: 'Zuma Energy Ltd', matter: 'Federal Litigation (FHC/ABJ/CS/120/24)', date: 'Apr 12, 2026', amount: '₦4,500,000', status: 'Paid' },
    { id: 'INV-2026-0013', client: 'Acme International', matter: 'IP Dispute Recovery', date: 'Apr 14, 2026', amount: '₦2,850,000', status: 'Pending' },
    { id: 'INV-2026-0014', client: 'Lagos Maritime Board', matter: 'Jurisdiction Challenge', date: 'Mar 28, 2026', amount: '₦12,400,000', status: 'Overdue' },
    { id: 'INV-2026-0015', client: 'Global Tech Inc', matter: 'Compliance Audit Fee', date: 'Apr 02, 2026', amount: '₦1,200,000', status: 'Paid' },
    { id: 'INV-2026-0016', client: 'First National Bank', matter: 'Retail Debt Recovery', date: 'Apr 15, 2026', amount: '₦850,000', status: 'Pending' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Financial Intelligence</h1>
          <p className="text-gray-400 text-sm font-inter">Monitor revenue cycle, clerk billables, and chamber profitability.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline px-6 py-3 flex items-center gap-2 text-xs">
            <Download size={16} /> Export Reports
          </button>
          <button className="btn-luxury px-6 py-3 flex items-center gap-2 text-xs font-bold">
             Generate Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceCard 
          label="Total Revenue (Q2)" 
          value="₦84.2M" 
          trend="+14.5%" 
          trendType="up"
          icon={DollarSign}
          delay={0.1}
        />
        <FinanceCard 
          label="Pending Receivables" 
          value="₦18.4M" 
          trend="+2.1%" 
          trendType="up"
          icon={Clock}
          delay={0.2}
        />
        <FinanceCard 
          label="Realized Profit" 
          value="₦32.1M" 
          trend="+6.4%" 
          trendType="up"
          icon={BarChart4}
          delay={0.3}
        />
        <FinanceCard 
          label="Unbilled Hours" 
          value="₦4.2M" 
          trend="-8.2%" 
          trendType="down"
          icon={PieChart}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center bg-white/[0.02]">
               <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
                <FileCheck className="text-gold-primary" size={20} /> Latest Invoices
              </h3>
              <div className="flex gap-2">
                <button className="p-2 border border-gold-dark/20 text-gray-500 hover:text-gold-primary transition-colors cursor-pointer"><Filter size={16} /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Inv ID</th>
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Client & Matter</th>
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Issue Date</th>
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Amount</th>
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
                    <th className="p-4 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <InvoiceRow key={i} invoice={inv} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center border-t border-gold-dark/5 bg-white/[0.01]">
               <button className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold-primary hover:underline">View All Billing Cycles</button>
            </div>
          </div>

          {/* Simulated Chart Area */}
          <div className="glass-card p-8 bg-black">
             <div className="flex justify-between items-end mb-10">
               <div>
                  <h4 className="text-white font-playfair font-bold text-xl mb-1">Fee Realization</h4>
                  <p className="text-gray-500 text-xs">Revenue vs Net Realized Cash (Monthly)</p>
               </div>
               <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gold-primary rounded-full"></div> <span className="text-gray-400">Projected</span></div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-full"></div> <span className="text-gray-300">Actual</span></div>
               </div>
             </div>
             
             <div className="h-64 flex items-end justify-between gap-4 px-4">
                {[45, 78, 56, 92, 65, 88, 70, 95, 82, 60, 75, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-white/5 rounded-t-sm relative group">
                       <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.5 + (i * 0.05), duration: 0.8 }}
                        className="w-full bg-gold-primary rounded-t-sm group-hover:bg-gold-light transition-colors"
                       />
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold-primary text-black text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         ₦{h/10}M
                       </div>
                    </div>
                    <span className="text-[8px] text-gray-600 uppercase font-inter">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Clerk Activity / Ledger */}
        <div className="space-y-8">
           <section className="glass-card p-6">
              <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
                <CreditCard className="text-gold-primary" size={20} /> Departmental ROI
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Litigation (Commercial)', val: '₦42.1M', perc: 48 },
                  { label: 'Energy & Natural Resources', val: '₦28.4M', perc: 32 },
                  { label: 'Intellectual Property', val: '₦9.2M', perc: 12 },
                  { label: 'Compliance Advisory', val: '₦4.5M', perc: 8 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-gray-400 font-inter font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="text-xs text-white font-bold">{item.val}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.perc}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="h-full bg-gold-gradient"
                      />
                    </div>
                  </div>
                ))}
              </div>
           </section>

           <section className="glass-card p-6 border-gold-primary/20 bg-gold-primary/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-gold-primary" size={18} />
                <h4 className="text-white font-playfair font-bold">Billable Leakage</h4>
              </div>
              <p className="text-[10px] text-gray-500 font-inter leading-relaxed mb-6">
                You have **₦1,420,000** in unbilled expenses from completed court filings in Lagos.
              </p>
              <button className="w-full py-3 bg-gold-primary text-black font-bold text-[10px] tracking-widest uppercase rounded hover:bg-gold-light transition-all">
                Reconcile Now
              </button>
           </section>

           <div className="p-6 glass-card bg-black border-dashed border-gold-dark/30 flex flex-col items-center justify-center text-center">
             <BarChart4 size={32} className="text-gold-primary/20 mb-4" />
             <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">Integrate Accounting</p>
             <button className="text-[10px] text-gold-primary font-bold hover:underline">Link Bank Account</button>
           </div>
        </div>
      </div>
    </div>
  );
}
