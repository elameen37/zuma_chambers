'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, ChevronLeft, ChevronRight, Map, 
  Clock, UserCheck, Briefcase, Plus, Filter, AlertCircle, FileText
} from '@/components/shared/Icons';
import Link from 'next/link';

// Mock Data for Calendar and Daily Cause List
const CAUSE_LIST = [
  { id: '1', time: '09:00 AM', suit: 'FHC/ABJ/CS/120/24', title: 'Zuma vs FGN', court: 'Court 1 (Justice Adegoke)', type: 'Hearing', counsel: 'Olumide Zuma (SAN)', status: 'Pending' },
  { id: '2', time: '11:00 AM', suit: 'LD/1024/GCM/24', title: 'Acme Corp vs First Bank', court: 'Court 4 (Justice Odunsi)', type: 'Pre-Trial', counsel: 'Adeyemi Cole', status: 'In Session' },
  { id: '3', time: '01:30 PM', suit: 'NICN/LA/334/23', title: 'Aviation Union Injunction', court: 'Industrial Court (Justice Peters)', type: 'Ruling', counsel: 'Ibrahim Musa', status: 'Concluded' },
];

const DEADLINES = [
  { id: '1', date: 'Tomorrow', title: 'File Counter-Affidavit: Pan-African Bank', urgency: 'high' },
  { id: '2', date: 'May 16', title: 'Submit Written Address: Global Tech', urgency: 'medium' },
];

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState('May 13 - May 19, 2026');
  const [selectedDay, setSelectedDay] = useState(1); // 1 = Tuesday (Today)

  const WEEK_DAYS = ['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2 mt-4 flex items-center gap-3">
            <span className="p-3 bg-gold-primary/10 rounded-lg"><CalendarDays size={24} className="text-gold-primary" /></span> 
            Court Calendar & Cause List
          </h1>
          <p className="text-gray-400 text-sm font-inter mt-3">Daily synchronization of appearances, deadlines, and clerk assignments.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline px-4 py-2 flex items-center gap-2 text-xs">
            Export Roster
          </button>
          <button className="btn-luxury px-6 py-2 flex items-center gap-2 text-xs font-bold">
            <Plus size={16} /> Schedule Appearance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Main Calendar View */}
         <div className="xl:col-span-2 space-y-6">
            <div className="glass-card p-6">
               {/* Controls */}
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                     <button className="p-2 border border-gold-dark/20 rounded hover:bg-gold-primary/10 hover:text-gold-primary transition-colors text-gray-400">
                        <ChevronLeft size={18} />
                     </button>
                     <h3 className="text-white font-playfair font-bold text-lg">{currentWeek}</h3>
                     <button className="p-2 border border-gold-dark/20 rounded hover:bg-gold-primary/10 hover:text-gold-primary transition-colors text-gray-400">
                        <ChevronRight size={18} />
                     </button>
                  </div>
                  <div className="flex bg-black border border-gold-dark/20 rounded-lg p-1">
                     <button className="px-4 py-1.5 rounded bg-gold-primary/20 text-gold-primary text-xs font-bold transition-all">Week</button>
                     <button className="px-4 py-1.5 rounded text-gray-500 hover:text-white text-xs font-bold transition-all">Month</button>
                  </div>
               </div>

               {/* Week Grid Header */}
               <div className="grid grid-cols-5 gap-4 mb-4">
                  {WEEK_DAYS.map((day, i) => (
                    <button 
                      key={day}
                      onClick={() => setSelectedDay(i)}
                      className={`text-center py-3 rounded-lg border transition-all ${
                        selectedDay === i 
                          ? 'border-gold-primary bg-gold-primary/5 text-gold-primary' 
                          : 'border-gold-dark/10 bg-white/[0.02] text-gray-400 hover:border-gold-primary/30 hover:text-white'
                      }`}
                    >
                       <span className="text-xs uppercase tracking-widest font-bold">{day.split(' ')[0]}</span>
                       <span className="block text-2xl font-playfair font-bold mt-1">{day.split(' ')[1]}</span>
                    </button>
                  ))}
               </div>

               {/* Time Blocks Simulation */}
               <div className="mt-8 space-y-4 relative">
                  <div className="absolute left-16 top-0 bottom-0 w-px bg-gold-dark/10" />
                  
                  {['09:00', '11:00', '13:00', '15:00'].map((time, i) => (
                     <div key={time} className="flex gap-6 relative">
                        <div className="w-10 text-right shrink-0 py-4">
                           <span className="text-[10px] text-gray-500 font-bold tracking-widest">{time}</span>
                        </div>
                        
                        {/* Render active item if selected day matches mock logic */}
                        <div className="flex-1 py-2">
                           {i === 0 && selectedDay === 1 && (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-lg p-4 cursor-pointer hover:border-amber-500/40 transition-all"
                              >
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-sm">Hearing</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">FHC/ABJ/CS/120/24</span>
                                 </div>
                                 <h4 className="text-white font-inter font-bold text-sm mb-3">Zuma vs FGN Admiralty Dispute</h4>
                                 <div className="flex items-center gap-4 text-xs text-gray-400 font-inter">
                                    <span className="flex items-center gap-1"><Map size={12} className="text-gold-primary/50" /> Court 1</span>
                                    <span className="flex items-center gap-1"><Briefcase size={12} className="text-gold-primary/50" /> O. Zuma (SAN)</span>
                                 </div>
                              </motion.div>
                           )}
                           
                           {i === 1 && selectedDay === 1 && (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-lg p-4 cursor-pointer hover:border-blue-500/40 transition-all mt-4"
                              >
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-sm">Pre-Trial</span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">LD/1024/GCM/24</span>
                                 </div>
                                 <h4 className="text-white font-inter font-bold text-sm mb-3">Acme Corp vs First Bank</h4>
                                 <div className="flex items-center gap-4 text-xs text-gray-400 font-inter">
                                    <span className="flex items-center gap-1"><Map size={12} className="text-gold-primary/50" /> Court 4</span>
                                    <span className="flex items-center gap-1"><Briefcase size={12} className="text-gold-primary/50" /> A. Cole</span>
                                 </div>
                              </motion.div>
                           )}

                           {i !== 0 && i !== 1 && (
                              <div className="h-20 border-t border-dashed border-gold-dark/10 group flex items-center pl-4 cursor-pointer">
                                 <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                   + Schedule
                                 </span>
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Side Panels */}
         <div className="space-y-8">
            {/* Daily Cause List Panel */}
            <div className="glass-card p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-playfair font-bold text-lg flex items-center gap-2">
                    <UserCheck size={18} className="text-gold-primary" /> Daily Cause List
                  </h3>
                  <button className="text-gold-primary text-[10px] font-bold tracking-widest uppercase hover:text-white transition-colors">
                    Print List
                  </button>
               </div>
               
               <p className="text-xs text-gray-400 font-inter mb-6">Tuesday, May 13th, 2026. Official roster for appearances and updates.</p>
               
               <div className="space-y-4">
                  <AnimatePresence>
                    {CAUSE_LIST.map((cause, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={cause.id} 
                        className="bg-white/[0.02] border border-gold-dark/10 rounded-lg p-4 group"
                      >
                         <div className="flex justify-between items-start mb-3">
                            <span className="flex items-center gap-1 text-[10px] text-gold-primary font-bold uppercase tracking-widest">
                              <Clock size={12} /> {cause.time}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                              cause.status === 'Concluded' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 
                              cause.status === 'In Session' ? 'border-amber-500/20 text-amber-500 bg-amber-500/10 animate-pulse' :
                              'border-gray-500/20 text-gray-400 bg-white/5'
                            }`}>
                               {cause.status}
                            </span>
                         </div>
                         <Link href={`/dashboard/cases/${cause.id}`} className="block">
                           <h4 className="text-white font-inter font-bold text-sm mb-1 group-hover:text-gold-primary transition-colors underline-offset-4 group-hover:underline">
                             {cause.title}
                           </h4>
                         </Link>
                         <p className="text-[10px] text-gray-500 font-inter uppercase tracking-widest font-bold mb-3">{cause.suit}</p>
                         <div className="flex flex-col gap-2 pt-3 border-t border-gold-dark/10">
                            <span className="text-[10px] text-gray-400 flex items-center gap-2 font-inter"><Map size={12} /> {cause.court}</span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-2 font-inter"><UserCheck size={12} /> Counsel: {cause.counsel}</span>
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>

            {/* Deadline Alerts Panel */}
            <div className="glass-card p-6 bg-gradient-to-b from-[#0a0a0a] to-black border-red-500/10">
               <h3 className="text-white font-playfair font-bold text-lg flex items-center gap-2 mb-6">
                  <AlertCircle size={18} className="text-red-500" /> Critical Deadlines
               </h3>
               <div className="space-y-4">
                  {DEADLINES.map((deadline) => (
                    <div key={deadline.id} className="flex gap-4">
                       <div className="flex-1">
                          <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${deadline.urgency === 'high' ? 'text-red-500' : 'text-amber-500'}`}>
                             {deadline.date}
                          </p>
                          <p className="text-xs text-white font-inter">{deadline.title}</p>
                       </div>
                       <button className="text-gray-500 hover:text-white transition-colors shrink-0">
                         <FileText size={16} />
                       </button>
                    </div>
                  ))}
               </div>
               <button className="w-full py-3 mt-6 border border-gold-dark/20 rounded text-xs text-gold-primary hover:bg-gold-primary hover:text-black transition-colors uppercase tracking-widest font-bold">
                 View All Deadlines
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
