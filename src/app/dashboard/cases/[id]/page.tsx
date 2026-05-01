'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Scale, Clock, Users, Database, 
  FileText, ShieldAlert, ArrowLeft, MoreVertical,
  Calendar, MapPin, Gavel, UserCheck
} from 'lucide-react';
import { useMatterStore } from '@/lib/matter-service';
import MatterTimeline from '@/components/legal/MatterTimeline';
import EvidenceTracker from '@/components/legal/EvidenceTracker';
import IntelligencePanel from '@/components/legal/IntelligencePanel';

export default function MatterDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const matter = useMatterStore((state) => state.getMatter(id as string));
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'evidence' | 'intelligence'>('overview');

  if (!matter) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert size={60} className="text-gold-dark/20 mb-6" />
        <h2 className="text-2xl font-bold text-white font-playfair mb-2">Matter Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">The suit you are looking for does not exist or you do not have permission to access it.</p>
        <button onClick={() => router.push('/dashboard')} className="btn-luxury px-8 py-3 text-xs font-bold">Return to Dashboard</button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'timeline', label: 'Timeline & Events', icon: Calendar },
    { id: 'evidence', label: 'Evidence Vault', icon: Database },
    { id: 'intelligence', label: 'Case Intelligence', icon: Scale },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-gold-primary transition-colors">
              <ArrowLeft size={16} />
            </button>
            <span className="text-xs font-bold tracking-widest uppercase font-mono text-gold-primary">{matter.suitNumber}</span>
            <span className="px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border border-gold-dark/20 text-gray-400">
              {matter.stage}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white font-playfair mb-2 leading-tight">{matter.title}</h1>
          <div className="flex flex-wrap gap-6 mt-4 text-xs text-gray-400 font-inter font-medium">
            <span className="flex items-center gap-2"><Users size={14} className="text-gold-primary" /> Client: <span className="text-white">{matter.client}</span></span>
            <span className="flex items-center gap-2"><Gavel size={14} className="text-gold-primary" /> Court: <span className="text-white">{matter.court}</span></span>
            <span className="flex items-center gap-2"><Clock size={14} className="text-gold-primary" /> Updated {matter.lastUpdated}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline py-2.5 px-6 text-xs flex items-center gap-2">
            <MoreVertical size={14} /> Options
          </button>
          <button className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <UserCheck size={14} /> Assign Team
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gold-dark/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <section className="glass-card p-8">
                    <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
                      <FileText className="text-gold-primary" size={20} /> Executive Summary
                    </h3>
                    <p className="text-gray-400 text-sm font-inter leading-relaxed mb-6">
                      This matter involves a high-stakes litigation regarding the {matter.title}. 
                      The case is currently in the <span className="text-gold-primary font-bold">{matter.stage}</span> stage. 
                      Strategic objectives include securing a stay of execution and challenging the jurisdiction of the {matter.court}.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-4 bg-white/5 rounded border border-gold-dark/5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Presiding Judge</span>
                        <span className="text-sm text-white font-playfair font-bold">{matter.judge}</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded border border-gold-dark/5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Jurisdiction</span>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gold-primary" />
                          <span className="text-sm text-white font-inter font-medium">{matter.jurisdiction}</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="glass-card p-8">
                    <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
                      <Users className="text-gold-primary" size={20} /> Assigned Legal Team
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {matter.team.map((member) => (
                        <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors border border-gold-dark/5">
                          <div className="w-10 h-10 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm text-white font-bold">{member.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section className="glass-card p-6 border-gold-primary/20 bg-gold-primary/5">
                    <h3 className="text-sm font-bold text-gold-primary font-inter uppercase tracking-widest mb-4">Opposing Counsel</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Counsel Firm</span>
                        <p className="text-sm text-white font-medium">{matter.opposingCounsel}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Opposing Party</span>
                        <p className="text-sm text-white font-medium">{matter.opposingParty}</p>
                      </div>
                    </div>
                  </section>

                  <section className="glass-card p-6">
                    <h3 className="text-sm font-bold text-white font-inter uppercase tracking-widest mb-4">Case Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Evidence Admitted</span>
                        <span className="text-white font-bold">{matter.evidence.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Upcoming Hearings</span>
                        <span className="text-amber-500 font-bold">{matter.events.filter(e => e.type === 'Hearing' && !e.isCompleted).length}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Risk Exposure</span>
                        <span className={`font-bold ${matter.riskScore > 70 ? 'text-red-500' : 'text-green-500'}`}>{matter.riskScore}%</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && <MatterTimeline events={matter.events} />}
            {activeTab === 'evidence' && <EvidenceTracker evidence={matter.evidence} />}
            {activeTab === 'intelligence' && <IntelligencePanel riskScore={matter.riskScore} riskLevel={matter.riskLevel} statutes={matter.statutes} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
