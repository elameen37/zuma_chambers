import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, Calendar, ArrowRight, Megaphone } from 'lucide-react';
import { useHRStore } from '@/lib/hr-service';

export default function AdminNoticeBoard() {
  const { notices } = useHRStore();

  return (
    <div className="glass-card p-8 border-gold-primary/20 relative overflow-hidden bg-gold-primary/5">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Megaphone size={120} className="text-gold-primary -rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-primary text-black rounded-xl shadow-lg shadow-gold-primary/20">
              <Bell size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white font-playfair">Administrative Notices</h3>
              <p className="text-gold-primary/60 text-xs font-inter uppercase tracking-[0.2em] font-bold">Chambers Communications</p>
            </div>
          </div>
          <button className="btn-luxury px-6 py-3 text-[10px] flex items-center gap-2">
             New Announcement
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((notice, i) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/40 border border-gold-dark/10 rounded-2xl p-6 hover:border-gold-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${notice.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gold-primary/10 text-gold-primary border border-gold-primary/20'}`}>
                  {notice.priority === 'High' ? <AlertTriangle size={18} /> : <Info size={18} />}
                </div>
                <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                   <Calendar size={12} /> {notice.date}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white font-playfair mb-3 group-hover:text-gold-primary transition-colors">{notice.title}</h4>
              <p className="text-gray-400 text-sm font-inter leading-relaxed mb-6 italic">
                &quot;{notice.content}&quot;
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gold-dark/5">
                 <span className={`text-[9px] font-bold uppercase tracking-widest ${notice.priority === 'High' ? 'text-red-500' : 'text-gold-primary'}`}>
                   {notice.priority} Priority
                 </span>
                 <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white hover:text-gold-primary transition-all group/btn">
                   Acknowledge <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
