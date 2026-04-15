'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Building2, User, Search, Filter, Plus, 
  MoreVertical, ShieldCheck, AlertCircle, FileSignature, 
  Handshake, Clock, ChevronRight, Activity, Building
} from '@/components/shared/Icons';
import Link from 'next/link';

// Mock Data for CRM
const MOCK_CLIENTS = [
  { 
    id: '1', 
    name: 'Dangote Group', 
    type: 'Corporate', 
    industry: 'Conglomerate', 
    kycStatus: 'Verified', 
    riskLevel: 'Low',
    activeMatters: 4,
    totalBilled: '₦45M',
    lastInteraction: '2 days ago',
    directors: ['Aliko Dangote', 'Olaken Dangote'],
    cacNumber: 'RC 123456'
  },
  { 
    id: '2', 
    name: 'Shell Petroleum Development Company', 
    type: 'Corporate', 
    industry: 'Oil & Gas', 
    kycStatus: 'Pending', 
    riskLevel: 'Medium',
    activeMatters: 12,
    totalBilled: '₦120M',
    lastInteraction: '5 hours ago',
    directors: ['Osagie Okunbor'],
    cacNumber: 'RC 789012'
  },
  { 
    id: '3', 
    name: 'Chief Olumide Benson', 
    type: 'Individual', 
    industry: 'Private Sector', 
    kycStatus: 'Verified', 
    riskLevel: 'Low',
    activeMatters: 1,
    totalBilled: '₦5.5M',
    lastInteraction: '1 week ago',
    directors: null,
    cacNumber: null
  },
  { 
    id: '4', 
    name: 'First Bank of Nigeria', 
    type: 'Corporate', 
    industry: 'Banking', 
    kycStatus: 'Flagged', 
    riskLevel: 'High',
    activeMatters: 8,
    totalBilled: '₦88M',
    lastInteraction: '1 day ago',
    directors: ['Sola Adeduntan'],
    cacNumber: 'RC 345678'
  },
];

const ClientCard = ({ client }: { client: typeof MOCK_CLIENTS[0] }) => {
  const isCorporate = client.type === 'Corporate';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card group hover:border-gold-primary/30 transition-all duration-500 overflow-hidden relative"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-xl ${isCorporate ? 'bg-blue-500/10 text-blue-500' : 'bg-gold-primary/10 text-gold-primary'}`}>
            {isCorporate ? <Building2 size={24} /> : <User size={24} />}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
              client.kycStatus === 'Verified' ? 'border-green-500/20 text-green-500 bg-green-500/10' :
              client.kycStatus === 'Pending' ? 'border-amber-500/20 text-amber-500 bg-amber-500/10' :
              'border-red-500/20 text-red-500 bg-red-500/10 animate-pulse'
            }`}>
              {client.kycStatus}
            </span>
            <button className="text-gray-500 hover:text-white transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <Link href={`/dashboard/clients/${client.id}`} className="block">
          <h3 className="text-white font-playfair font-bold text-lg mb-1 group-hover:text-gold-primary transition-colors">
            {client.name}
          </h3>
        </Link>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">
          {client.type} • {client.industry}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/40 rounded-lg p-3 border border-gold-dark/5">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Active Matters</span>
            <span className="text-white font-bold text-sm">{client.activeMatters}</span>
          </div>
          <div className="bg-black/40 rounded-lg p-3 border border-gold-dark/5">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Total Billed</span>
            <span className="text-gold-primary font-bold text-sm">{client.totalBilled}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] pt-4 border-t border-gold-dark/10">
          <div className="flex items-center gap-2 text-gray-500">
            <ShieldCheck size={14} className={client.riskLevel === 'Low' ? 'text-green-500' : client.riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'} />
            <span className="font-bold uppercase tracking-widest">{client.riskLevel} Risk</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest">
            <Clock size={14} /> {client.lastInteraction}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ClientsPage() {
  const [activeType, setActiveType] = useState<'All' | 'Corporate' | 'Individual'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = MOCK_CLIENTS.filter(client => {
    const matchesType = activeType === 'All' || client.type === activeType;
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2 mt-4 flex items-center gap-3">
            <span className="p-3 bg-gold-primary/10 rounded-lg"><Users size={24} className="text-gold-primary" /></span> 
            Client & CRM Management
          </h1>
          <p className="text-gray-400 text-sm font-inter mt-3">Enterprise client database with integrated KYC and conflict analysis.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline px-6 py-3 flex items-center gap-2 text-xs">
            Conflict Search
          </button>
          <button className="btn-luxury px-6 py-3 flex items-center gap-2 text-xs font-bold">
            <Plus size={18} /> Onboard Client
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Clients', value: '142', icon: Users, color: 'text-blue-500' },
          { label: 'Corporate Entities', value: '58', icon: Building, color: 'text-gold-primary' },
          { label: 'Avg Matter Load', value: '3.4', icon: Activity, color: 'text-purple-500' },
          { label: 'KYC Pending', value: '12', icon: AlertCircle, color: 'text-amber-500' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-gold-dark/5"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <span className="text-2xl font-bold text-white font-playfair">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-black/40 p-4 border border-gold-dark/10 rounded-xl backdrop-blur-sm">
        <div className="flex bg-black border border-gold-dark/20 rounded-lg p-1 relative">
          {['All', 'Corporate', 'Individual'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type as any)}
              className={`relative px-6 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all z-10 ${
                activeType === type ? 'text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              <span className="relative z-20">{type}</span>
              {activeType === type && (
                <motion.div 
                  layoutId="client-type-bg"
                  className="absolute inset-0 bg-gold-primary rounded z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
        
        <div className="flex-1 max-w-md w-full relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary" />
          <input 
            type="text" 
            placeholder="Search by name, industry, or CAC number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-gold-primary/50 transition-all font-inter"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-gold-dark/20 rounded-lg text-gray-400 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
