'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  Calendar,
  CheckCircle,
  FileText,
  Globe,
  Lock,
  ArrowRight,
  TrendingUp,
  Activity,
  Filter,
  BarChart
} from '@/components/shared/Icons';

const ComplianceMetric = ({ label, value, color, delay }: { label: string, value: string, color: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 flex flex-col items-center text-center group"
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 relative ${color} shadow-lg shadow-black/20`}>
       <div className="absolute inset-0 rounded-full border-2 border-white/10 group-hover:scale-125 transition-transform" />
       <span className="text-xl font-bold font-inter text-white">{value}</span>
    </div>
    <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 font-inter mb-1">{label}</h4>
    <div className="flex items-center gap-2 text-xs text-green-500 font-bold">
      <TrendingUp size={12} /> +2.4%
    </div>
  </motion.div>
);

const ComplianceRequirement = ({ title, status, deadline, dept, delay }: { title: string, status: string, deadline: string, dept: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 border-gold-dark/5 hover:border-gold-primary/20 transition-all group"
  >
    <div className="flex justify-between items-start">
      <div className="flex gap-5">
        <div className={`p-4 rounded-xl ${status === 'Valid' ? 'bg-green-500/10 text-green-500' : status === 'Expiring' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h5 className="text-white font-playfair font-bold text-lg mb-1 group-hover:text-gold-primary transition-colors">{title}</h5>
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider text-gray-500 font-inter">
            <span className="flex items-center gap-1"><Globe size={12} /> {dept}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> Due: {deadline}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <span className={`px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${
          status === 'Valid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
          status === 'Expiring' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
          'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {status}
        </span>
        <button className="text-gold-primary text-[10px] font-bold uppercase underline underline-offset-4 decoration-gold-primary/30 hover:decoration-gold-primary transition-all">
          Upload Evidence
        </button>
      </div>
    </div>
  </motion.div>
);

export default function CompliancePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Compliance Governance</h1>
          <p className="text-gray-400 text-sm font-inter">Automated regulatory tracking and statutory obligation enforcement.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline px-6 py-3 flex items-center gap-2 text-xs">
            <BarChart size={16} /> Audit Trail
          </button>
          <button className="btn-luxury px-6 py-3 flex items-center gap-2 text-xs font-bold">
             <AlertTriangle size={18} /> Emergency Disclosure
          </button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ComplianceMetric label="Global Health Score" value="94%" color="bg-green-500" delay={0.1} />
        <ComplianceMetric label="Active Obligations" value="28" color="bg-blue-500" delay={0.2} />
        <ComplianceMetric label="Critical Filings" value="03" color="bg-red-500" delay={0.3} />
        <ComplianceMetric label="Document Hygiene" value="98%" color="bg-amber-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-bold text-white font-playfair">Statutory <span className="gold-text">Registry</span></h3>
            <button className="flex items-center gap-2 text-gold-primary text-[10px] font-bold tracking-widest uppercase">
              Download Full Matrix <Filter size={14} />
            </button>
          </div>

          <div className="space-y-4">
            <ComplianceRequirement 
              title="CAC Annual Returns Filing (Energy Sub-Division)" 
              status="Valid" 
              deadline="Nov 30, 2026" 
              dept="CORPORATE" 
              delay={0.2}
            />
            <ComplianceRequirement 
              title="Anti-Money Laundering (AML) Compliance Certificate" 
              status="Expiring" 
              deadline="Apr 25, 2026" 
              dept="RISK MGMT" 
              delay={0.3}
            />
            <ComplianceRequirement 
              title="Professional Indemnity Insurance Renewal" 
              status="Expiring" 
              deadline="Apr 22, 2026" 
              dept="HR & OPS" 
              delay={0.4}
            />
            <ComplianceRequirement 
              title="State Bar Association Regulatory Audit" 
              status="Overdue" 
              deadline="Mar 31, 2026" 
              dept="LEGAL ETHICS" 
              delay={0.5}
            />
          </div>
        </div>

        {/* Audit & Intelligence Sidebar */}
        <div className="space-y-8">
           <section className="glass-card p-6">
              <h3 className="text-lg font-bold text-white font-playfair mb-8 flex items-center gap-3">
                <Activity className="text-gold-primary" size={20} /> Integrity Stream
              </h3>
              <div className="space-y-6">
                {[
                  { text: 'Know Your Client (KYC) verified for Delta Oil Corp.', time: '12m ago', icon: CheckCircle },
                  { text: 'New policy update detected from Nigerian Bar.', time: '3h ago', icon: FileText },
                  { text: 'Conflict search completed for Pan-African Bank.', time: '6h ago', icon: ShieldCheck },
                  { text: 'Secure backup of Client Discovery data.', time: 'Yesterday', icon: Lock },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="shrink-0 p-2 bg-white/5 rounded-lg group-hover:text-gold-primary transition-colors">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-inter leading-relaxed">{item.text}</p>
                      <span className="text-[10px] text-gray-600 font-bold uppercase mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
           </section>

           <div className="glass-card p-8 bg-gradient-to-br from-[#0a0a0a] to-[#010101] border-gold-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldCheck size={120} className="text-gold-primary" />
              </div>
              <h4 className="text-white font-playfair font-bold text-xl mb-4 leading-tight">Zuma Integrity Engine™</h4>
              <p className="text-xs text-gray-400 font-inter leading-relaxed mb-8">
                Your chambers is currently performing at the top **2%** of Nigerian law firms in regulatory transparency and ethical reporting.
              </p>
              <button className="flex items-center gap-2 text-gold-primary text-[10px] font-bold tracking-[0.2em] uppercase group">
                Full Ethics Report <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
