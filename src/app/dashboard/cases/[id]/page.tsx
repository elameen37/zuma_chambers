'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Scale, Clock, Users, Database,
  FileText, ShieldAlert, ArrowLeft, MoreVertical,
  Calendar, MapPin, Gavel, UserCheck,
  Copy, Printer, Archive, X, Check, UserPlus, ChevronDown
} from 'lucide-react';
import { useMatterStore, Matter, Participant } from '@/lib/matter-service';
import { useHRStore } from '@/lib/hr-service';
import MatterTimeline from '@/components/legal/MatterTimeline';
import EvidenceTracker from '@/components/legal/EvidenceTracker';
import IntelligencePanel from '@/components/legal/IntelligencePanel';

// ── Options Dropdown ───────────────────────────────────────────────────────
function OptionsDropdown({ matter, onArchive }: { matter: Matter; onArchive: () => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopySuitNumber = () => {
    navigator.clipboard.writeText(matter.suitNumber);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  };

  const handlePrint = () => {
    setOpen(false);
    window.print();
  };

  const handleArchive = () => {
    setOpen(false);
    onArchive();
  };

  const menuItems = [
    {
      label: copied ? 'Copied!' : 'Copy Suit Number',
      icon: copied ? Check : Copy,
      color: copied ? 'text-green-400' : 'text-gray-300',
      onClick: handleCopySuitNumber,
    },
    {
      label: 'Print Summary',
      icon: Printer,
      color: 'text-gray-300',
      onClick: handlePrint,
    },
    {
      label: 'Archive Matter',
      icon: Archive,
      color: 'text-amber-400',
      onClick: handleArchive,
      divider: true,
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        id="options-dropdown-btn"
        onClick={() => setOpen((v) => !v)}
        className="btn-outline py-2.5 px-6 text-xs flex items-center gap-2 hover:border-gold-primary/40 transition-all"
      >
        <MoreVertical size={14} />
        Options
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 z-50 glass-panel border border-white/10 rounded-2xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0c0c0c]/90 backdrop-blur-2xl"
          >
            {menuItems.map((item, i) => (
              <React.Fragment key={i}>
                {item.divider && <div className="my-2 border-t border-white/5" />}
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold hover:bg-white/5 transition-colors ${item.color}`}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Assign Team Modal ──────────────────────────────────────────────────────
function AssignTeamModal({ matter, onClose, onAssign }: { matter: Matter; onClose: () => void; onAssign: (name: string, role: string) => void }) {
  const staff = useHRStore((state) => state.staff);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    matter.team.map((m) => m.id)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const selected = staff.filter((s) => selectedIds.includes(s.id));
      selected.forEach((s) => onAssign(s.name, s.role));
      setSaving(false);
      setSaved(true);
      setTimeout(onClose, 800);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)] bg-[#0c0c0c]/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-primary/10 flex items-center justify-center">
              <UserPlus size={16} className="text-gold-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-playfair">Assign Legal Team</h3>
              <p className="text-[10px] text-gray-500 font-inter">{matter.suitNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Staff List */}
        <div className="px-6 py-4 max-h-[320px] overflow-y-auto no-scrollbar space-y-2">
          {staff.map((member) => {
            const isSelected = selectedIds.includes(member.id);
            return (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => toggle(member.id)}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gold-primary/5 border-gold-primary/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isSelected ? 'bg-gold-primary text-black' : 'bg-white/10 text-gray-300'
                }`}>
                  {member.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-bold truncate">{member.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{member.role} · {member.department}</p>
                </div>
                {/* Workload badge */}
                <div className="text-right shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    member.workload > 80 ? 'bg-red-500/10 text-red-400' :
                    member.workload > 60 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>
                    {member.workload}% load
                  </span>
                  {/* Check indicator */}
                  <div className={`mt-1.5 w-4 h-4 rounded-full border flex items-center justify-center ml-auto transition-all ${
                    isSelected ? 'bg-gold-primary border-gold-primary' : 'border-white/20'
                  }`}>
                    {isSelected && <Check size={10} className="text-black" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
          <span className="text-[10px] text-gray-500 font-inter">
            {selectedIds.length} member{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline py-2 px-5 text-xs">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="btn-luxury py-2 px-6 text-xs flex items-center gap-2 disabled:opacity-70"
            >
              {saved ? (
                <><Check size={12} /> Assigned!</>
              ) : saving ? (
                <><span className="w-3 h-3 rounded-full border border-black border-t-transparent animate-spin" /> Saving...</>
              ) : (
                <><UserCheck size={12} /> Confirm Assignment</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MatterDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const matter = useMatterStore((state) => state.getMatter(id as string));
  const updateMatter = useMatterStore((state) => state.updateMatter);
  const subscribeToRealtime = useMatterStore((state) => state.subscribeToRealtime);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'evidence' | 'intelligence'>('overview');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [archiveToast, setArchiveToast] = useState(false);

  useEffect(() => {
    if (subscribeToRealtime) {
      const unsubscribe = subscribeToRealtime();
      return () => unsubscribe();
    }
  }, [subscribeToRealtime]);

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

  const handleArchive = () => {
    updateMatter(matter.id, { stage: 'Closed' });
    setArchiveToast(true);
    setTimeout(() => setArchiveToast(false), 3000);
  };

  const handleAssignMember = (name: string, role: string) => {
    const existing = matter.team.some((m) => m.name === name);
    if (!existing) {
      updateMatter(matter.id, {
        team: [...matter.team, { id: `t-${Date.now()}`, name, role: role as Participant['role'] }],
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'timeline', label: 'Timeline & Events', icon: Calendar },
    { id: 'evidence', label: 'Evidence Vault', icon: Database },
    { id: 'intelligence', label: 'Case Intelligence', icon: Scale },
  ];

  return (
    <>
      {/* Archive Toast */}
      <AnimatePresence>
        {archiveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-[100] bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-6 py-3 rounded-xl backdrop-blur-lg flex items-center gap-3 shadow-[0_8px_32px_rgba(245,158,11,0.15)]"
          >
            <Archive size={14} />
            Matter archived — stage set to Closed
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Team Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <AssignTeamModal
            matter={matter}
            onClose={() => setShowAssignModal(false)}
            onAssign={handleAssignMember}
          />
        )}
      </AnimatePresence>

      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-gold-primary transition-colors">
                <ArrowLeft size={16} />
              </button>
              <span className="text-xs font-bold tracking-widest uppercase font-mono text-gold-primary">{matter.suitNumber}</span>
              <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border ${
                matter.stage === 'Closed' ? 'border-gray-500/30 text-gray-500' : 'border-gold-dark/20 text-gray-400'
              }`}>
                {matter.stage}
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[8px] font-bold tracking-widest uppercase text-green-400 select-none shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
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
            <OptionsDropdown matter={matter} onArchive={handleArchive} />
            <button
              id="assign-team-btn"
              onClick={() => setShowAssignModal(true)}
              className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all"
            >
              <UserCheck size={14} /> Assign Team
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b border-gold-dark/10 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
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
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
                          <Users className="text-gold-primary" size={20} /> Assigned Legal Team
                        </h3>
                        <button
                          onClick={() => setShowAssignModal(true)}
                          className="text-[10px] font-bold uppercase tracking-widest text-gold-primary hover:text-white transition-colors flex items-center gap-1"
                        >
                          <UserPlus size={12} /> Add Member
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matter.team.length === 0 ? (
                          <div className="col-span-2 text-center py-8 text-gray-500 text-sm font-inter">
                            No team members assigned.{' '}
                            <button onClick={() => setShowAssignModal(true)} className="text-gold-primary hover:underline">
                              Assign now
                            </button>
                          </div>
                        ) : (
                          matter.team.map((member) => (
                            <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors border border-gold-dark/5">
                              <div className="w-10 h-10 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary font-bold">
                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm text-white font-bold">{member.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{member.role}</p>
                              </div>
                            </div>
                          ))
                        )}
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
                        <div
                          className="flex justify-between items-center text-xs cursor-pointer hover:text-gold-primary transition-colors group"
                          onClick={() => setActiveTab('evidence')}
                        >
                          <span className="text-gray-500 group-hover:text-gold-primary transition-colors">Evidence Admitted</span>
                          <span className="text-white font-bold">{matter.evidence.length}</span>
                        </div>
                        <div
                          className="flex justify-between items-center text-xs cursor-pointer hover:text-gold-primary transition-colors group"
                          onClick={() => setActiveTab('timeline')}
                        >
                          <span className="text-gray-500 group-hover:text-gold-primary transition-colors">Upcoming Hearings</span>
                          <span className="text-amber-500 font-bold">{matter.events.filter((e) => e.type === 'Hearing' && !e.isCompleted).length}</span>
                        </div>
                        <div
                          className="flex justify-between items-center text-xs cursor-pointer hover:text-gold-primary transition-colors group"
                          onClick={() => setActiveTab('intelligence')}
                        >
                          <span className="text-gray-500 group-hover:text-gold-primary transition-colors">Risk Exposure</span>
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
    </>
  );
}
