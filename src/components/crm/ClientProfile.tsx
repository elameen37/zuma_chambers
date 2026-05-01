'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Building2, ShieldCheck, ShieldAlert, 
  MapPin, Phone, Mail, FileText, PieChart,
  UserCheck, History, Landmark, Briefcase
} from 'lucide-react';
import { Client } from '@/lib/client-service';

export default function ClientProfile({ client }: { client: Client }) {
  const isCompany = client.type === 'Company';
  const kycColor = client.kycStatus === 'Verified' ? 'text-green-500 border-green-500/20 bg-green-500/10' : 'text-amber-500 border-amber-500/20 bg-amber-500/10';

  return (
    <div className="space-y-8">
      {/* Client Identity Header */}
      <section className="glass-card p-8 bg-gradient-to-br from-gold-primary/5 to-transparent flex flex-col md:flex-row gap-8 items-start">
        <div className="w-24 h-24 rounded-2xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0">
          {isCompany ? <Building2 size={48} className="text-gold-primary" /> : <User size={48} className="text-gold-primary" />}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white font-playfair">{client.name}</h2>
            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${kycColor}`}>
              KYC {client.kycStatus}
            </span>
            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-gold-dark/20 text-gray-400`}>
              {client.type}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-6 text-xs text-gray-400 font-inter font-medium mt-4">
            <span className="flex items-center gap-2"><Mail size={14} className="text-gold-primary" /> {client.email}</span>
            <span className="flex items-center gap-2"><Phone size={14} className="text-gold-primary" /> {client.phone}</span>
            <span className="flex items-center gap-2"><MapPin size={14} className="text-gold-primary" /> {client.address}</span>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-3">
          <div className="glass-card p-4 bg-white/5 border-gold-dark/10 flex flex-col items-end">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Risk Profile</span>
            <div className={`flex items-center gap-2 text-sm font-bold ${
              client.riskProfile === 'Low' ? 'text-green-500' : 
              client.riskProfile === 'Medium' ? 'text-amber-500' : 'text-red-500'
            }`}>
              <ShieldCheck size={16} /> {client.riskProfile} Exposure
            </div>
          </div>
          <button className="btn-luxury py-2 px-6 text-[10px] font-bold uppercase tracking-widest">
            Edit Profile
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core CRM Info */}
        <div className="lg:col-span-2 space-y-8">
          {isCompany && client.companyDetails && (
            <section className="glass-card p-6">
              <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
                <Landmark className="text-gold-primary" size={20} /> Corporate Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">CAC Number</span>
                    <p className="text-sm text-white font-mono font-bold tracking-wider">{client.companyDetails.cacNumber}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Industry</span>
                    <p className="text-sm text-white font-medium">{client.companyDetails.industry}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-3">Board of Directors</span>
                  <div className="flex flex-wrap gap-2">
                    {client.companyDetails.directors.map((director, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-gold-dark/10 rounded-full text-[10px] text-gray-300 font-medium">
                        {director}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="glass-card p-6">
            <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
              <History className="text-gold-primary" size={20} /> Engagement History
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-gold-dark/5 hover:border-gold-primary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gold-primary/10 rounded text-gold-primary"><Briefcase size={16} /></div>
                  <div>
                    <p className="text-sm text-white font-bold">Zuma vs FGN</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Ongoing Litigation</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">May 2024 - Present</span>
              </div>
              {/* More history items... */}
            </div>
          </section>
        </div>

        {/* Sidebar CRM Info */}
        <div className="space-y-8">
          <section className="glass-card p-6 border-gold-primary/20 bg-gold-primary/5">
            <h3 className="text-sm font-bold text-gold-primary font-inter uppercase tracking-widest mb-4">Financial Overview</h3>
            <div className="space-y-6">
              <div>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Retainer Balance</span>
                <p className="text-2xl font-bold text-white font-playfair">₦{(client.retainerBalance / 1000000).toFixed(1)}M</p>
              </div>
              <div className="pt-4 border-t border-gold-dark/10 space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400">Engagement Letters</span>
                  <span className="text-green-500 font-bold">Signed</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400">Outstanding Invoices</span>
                  <span className="text-white font-bold">0</span>
                </div>
              </div>
              <button className="w-full btn-luxury py-2 text-[10px] font-bold">View Statements</button>
            </div>
          </section>

          <section className="glass-card p-6">
            <h3 className="text-sm font-bold text-white font-inter uppercase tracking-widest mb-4">KYC Documents</h3>
            <div className="space-y-3">
              {['Certificate of Inc', 'Memorandum of Association', 'Director IDs'].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded border border-gold-dark/10 text-[10px]">
                  <span className="text-gray-300 font-medium">{doc}</span>
                  <ShieldCheck size={14} className="text-green-500" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
