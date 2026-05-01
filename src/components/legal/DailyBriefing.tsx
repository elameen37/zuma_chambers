'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, AlertCircle, CheckCircle2, Users, 
  ChevronRight, ArrowUpRight, Megaphone, Info
} from 'lucide-react';
import { useMatterStore } from '@/lib/matter-service';

export default function DailyBriefing({ date }: { date: string }) {
  const matters = useMatterStore((state) => state.matters);
  
  const todaysHearings = matters.flatMap(m => m.events.filter(e => e.date === date && e.type === 'Hearing'));
  const todaysDeadlines = matters.flatMap(m => m.events.filter(e => e.date === date && e.type === 'Deadline'));
  
  const stats = [
    { label: 'Court Appearances', val: todaysHearings.length, icon: Users, color: 'text-gold-primary' },
    { label: 'Critical Deadlines', val: todaysDeadlines.length, icon: AlertCircle, color: 'text-red-500' },
    { label: 'Filings Required', val: 3, icon: CheckCircle2, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-card p-6 bg-gold-primary/5 border-gold-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gold-primary rounded-lg text-black">
            <Megaphone size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-playfair uppercase tracking-wide">Daily Chamber Briefing</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{date}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 bg-black/40 rounded border border-gold-dark/10 flex items-center justify-between group hover:border-gold-primary/30 transition-all">
              <div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                <p className={`text-2xl font-bold font-playfair ${stat.color}`}>{stat.val}</p>
              </div>
              <stat.icon size={24} className={`${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded border border-gold-dark/10">
            <Zap size={16} className="text-gold-primary mt-1 shrink-0" />
            <div>
              <p className="text-xs text-white font-bold font-inter mb-1">Strategic Advisory</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Focus for today is the {todaysHearings[0]?.title || 'Constitutional Appeal'}. 
                Ensure all exhibit tags for OPL 245 are verified by 8:30 AM before departure to Federal High Court.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded border border-gold-dark/10">
            <Info size={16} className="text-blue-400 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-white font-bold font-inter mb-1">Logistics Note</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Chamber vehicles 1 and 3 are assigned for Lagos State hearings. Usman Ali (Senior Clerk) will coordinate courtroom allocations for the Abuja team.
              </p>
            </div>
          </div>
        </div>

        <button className="w-full mt-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-primary border border-gold-primary/30 rounded hover:bg-gold-primary hover:text-black transition-all flex items-center justify-center gap-2">
          View Full Intelligence Report <ArrowUpRight size={14} />
        </button>
      </section>
    </div>
  );
}
