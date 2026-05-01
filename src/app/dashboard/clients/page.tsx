'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, 
  Building2, User, ChevronRight, ShieldCheck, 
  Globe, Mail, Phone, MoreVertical
} from 'lucide-react';
import { useClientStore } from '@/lib/client-service';
import Link from 'next/link';

export default function ClientsPage() {
  const clients = useClientStore((state) => state.clients);
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Client Command Center</h1>
          <p className="text-gray-400 text-sm font-inter">Manage comprehensive client profiles, KYC compliance, and interaction history.</p>
        </div>
        <button className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2">
          <UserPlus size={16} /> New Client
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white/[0.02] p-4 rounded-xl border border-gold-dark/10">
        <div className="flex-1 relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
           <input 
            type="text" 
            placeholder="Search by name, email, or company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-gold-dark/20 rounded-lg py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-gold-primary transition-all font-inter"
           />
        </div>
        <button className="btn-outline px-6 py-2 flex items-center gap-2 text-xs">
          <Filter size={14} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-6 group hover:border-gold-primary/30 transition-all relative overflow-hidden"
          >
            {/* Background Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              {client.type === 'Company' ? <Building2 size={120} /> : <User size={120} />}
            </div>

            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-gold-dark/10 flex items-center justify-center text-gold-primary">
                {client.type === 'Company' ? <Building2 size={24} /> : <User size={24} />}
              </div>
              <div className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest border ${
                client.kycStatus === 'Verified' ? 'text-green-500 border-green-500/20' : 'text-amber-500 border-amber-500/20'
              }`}>
                {client.kycStatus}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white font-playfair mb-1 group-hover:text-gold-primary transition-colors">{client.name}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">{client.type}</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-xs text-gray-400 font-inter">
                <Mail size={14} className="text-gold-primary/60" /> {client.email}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-inter">
                <Phone size={14} className="text-gold-primary/60" /> {client.phone}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gold-dark/5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-500">
                <ShieldCheck size={14} className={client.riskProfile === 'Low' ? 'text-green-500' : 'text-amber-500'} />
                {client.riskProfile} Risk
              </div>
              <Link 
                href={`/dashboard/clients/${client.id}`}
                className="text-gold-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Profile <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
