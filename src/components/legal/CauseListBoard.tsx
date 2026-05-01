'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Gavel, Clock, MapPin, Users, UserCheck, 
  ChevronRight, AlertCircle, Calendar, Briefcase
} from 'lucide-react';
import { useMatterStore, MatterEvent, Matter } from '@/lib/matter-service';
import Link from 'next/link';

export default function CauseListBoard({ date }: { date: string }) {
  const matters = useMatterStore((state) => state.matters);

  // Extract all hearings for the given date
  const todaysHearings = matters.flatMap(m => 
    m.events
      .filter(e => e.date === date && e.type === 'Hearing')
      .map(e => ({ ...e, matter: m }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white font-playfair flex items-center gap-3">
            <Gavel className="text-gold-primary" size={24} /> Daily Cause List
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Court Appearance Schedule • {date}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline py-2 px-4 text-[10px] flex items-center gap-2">
            <Calendar size={14} /> Change Date
          </button>
          <button className="btn-luxury py-2 px-4 text-[10px] flex items-center gap-2">
            Download List
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {todaysHearings.length === 0 ? (
          <div className="glass-card p-12 text-center flex flex-col items-center justify-center">
            <Clock size={40} className="text-gold-dark/20 mb-4" />
            <p className="text-gray-500 text-sm font-inter">No matters listed for court appearance today.</p>
          </div>
        ) : (
          todaysHearings.map((hearing, idx) => (
            <motion.div
              key={hearing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 hover:border-gold-primary/40 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Time & Logistics */}
                <div className="lg:w-48 shrink-0 flex flex-col justify-center border-r border-gold-dark/10 pr-6">
                  <div className="flex items-center gap-2 text-gold-primary mb-2">
                    <Clock size={16} />
                    <span className="text-lg font-bold font-mono">09:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                    <MapPin size={12} /> {hearing.courtroom || 'N/A'}
                  </div>
                  <div className="text-[9px] text-gray-500 font-inter line-clamp-1">
                    {hearing.matter.court}
                  </div>
                </div>

                {/* Matter Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-primary/60 font-mono">{hearing.matter.suitNumber}</span>
                      <h4 className="text-xl font-bold text-white font-playfair group-hover:text-gold-primary transition-colors">{hearing.matter.title}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      hearing.attendanceStatus === 'Attended' ? 'text-green-500 border-green-500/20 bg-green-500/10' : 
                      hearing.attendanceStatus === 'Missed' ? 'text-red-500 border-red-500/20 bg-red-500/10' : 
                      'text-amber-500 border-amber-500/20 bg-amber-500/10'
                    }`}>
                      {hearing.attendanceStatus}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-gold-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Assigned Counsel</span>
                        <span className="text-[10px] text-white font-medium">{hearing.assignedCounsel?.join(', ') || 'Unassigned'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-l border-gold-dark/10 pl-6">
                      <Briefcase size={14} className="text-gold-primary" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Chamber Clerk</span>
                        <span className="text-[10px] text-white font-medium">{hearing.assignedClerk || 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="lg:w-32 shrink-0 flex items-center justify-end">
                  <Link 
                    href={`/dashboard/cases/${hearing.matter.id}`}
                    className="p-3 rounded-full border border-gold-dark/20 text-gray-500 hover:text-gold-primary hover:border-gold-primary transition-all"
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
