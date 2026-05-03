'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Truck, Bell, Calendar, ShieldCheck, 
  Activity, Settings, ClipboardList
} from 'lucide-react';
import StaffDirectory from '@/components/legal/StaffDirectory';
import OperationsManager from '@/components/legal/OperationsManager';
import AdminNoticeBoard from '@/components/legal/AdminNoticeBoard';
import LeaveRequests from '@/components/legal/LeaveRequests';

export default function HRAdminPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'ops' | 'leave' | 'notices'>('staff');

  const tabs = [
    { id: 'staff', label: 'Staff & Workloads', icon: Users },
    { id: 'ops', label: 'Chamber Operations', icon: Truck },
    { id: 'leave', label: 'Leave & Attendance', icon: Calendar },
    { id: 'notices', label: 'Admin Notices', icon: Bell },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 text-gold-primary mb-2">
            <div className="p-2 bg-gold-primary/10 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase font-inter">Chambers Secretariat</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-playfair tracking-tight">HR & Chamber <span className="gold-text italic">Administration</span></h1>
          <p className="text-gray-400 text-sm font-inter max-w-2xl leading-relaxed mt-2">
            Manage the operational pulse of the chambers, from associate workloads and clerk dispatches to office assets and stationery logistics.
          </p>
        </div>

        <div className="flex gap-4">
           <div className="bg-white/5 border border-gold-dark/10 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none mb-1">Personnel Active</p>
                <p className="text-[11px] text-gray-500">14 Associates / 6 Clerks</p>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gold-dark/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'staff' | 'ops' | 'leave' | 'notices')}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="hr-tab-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'staff' && <StaffDirectory />}
          {activeTab === 'ops' && <OperationsManager />}
          {activeTab === 'leave' && <LeaveRequests />}
          {activeTab === 'notices' && <AdminNoticeBoard />}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions Footer Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl border border-gold-primary/20 rounded-2xl px-8 py-4 shadow-2xl flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-gold-primary uppercase tracking-widest">Secretariat Quick Actions</span>
          <span className="text-[10px] text-gray-500 italic">Central Admin Control</span>
        </div>
        <div className="h-8 w-[1px] bg-gold-dark/20" />
        <div className="flex gap-4">
           <button className="p-2 hover:bg-gold-primary/10 rounded-lg text-gray-400 hover:text-gold-primary transition-all flex flex-col items-center gap-1 group">
             <ClipboardList size={18} />
             <span className="text-[8px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Forms</span>
           </button>
           <button className="p-2 hover:bg-gold-primary/10 rounded-lg text-gray-400 hover:text-gold-primary transition-all flex flex-col items-center gap-1 group">
             <Settings size={18} />
             <span className="text-[8px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Setup</span>
           </button>
        </div>
        <button className="btn-luxury px-6 py-2 text-[10px]">Print Daily Roster</button>
      </div>
    </div>
  );
}
