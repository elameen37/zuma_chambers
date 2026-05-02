import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Briefcase, Activity, MoreVertical, ShieldCheck } from 'lucide-react';
import { useHRStore, StaffMember } from '@/lib/hr-service';

export default function StaffDirectory() {
  const { staff } = useHRStore();

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'On Leave': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Field': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white font-playfair">Staff Directory & Roster</h3>
          <p className="text-gray-500 text-xs mt-1">Manage chamber counsel, clerks, and administrative personnel.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-gold-dark/10 rounded text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-gold-primary transition-all">Export Roster</button>
          <button className="btn-luxury px-4 py-2 text-[10px]">Add Personnel</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {staff.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 group hover:border-gold-primary/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <MoreVertical size={16} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary font-bold text-lg font-playfair">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-playfair group-hover:text-gold-primary transition-colors">{member.name}</h4>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{member.role} • {member.department}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-500 uppercase tracking-tighter">Current Status</span>
                <span className={`px-2 py-0.5 rounded-sm border font-bold uppercase tracking-widest text-[8px] ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-inter">Workload Capacity</span>
                  <span className={`font-bold font-mono ${member.workload > 80 ? 'text-red-500' : 'text-gold-primary'}`}>{member.workload}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${member.workload}%` }}
                    className={`h-full rounded-full ${member.workload > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]'}`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gold-dark/5 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <Mail size={12} className="text-gold-primary/40" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <Phone size={12} className="text-gold-primary/40" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 bg-white/5 border border-gold-dark/5 rounded text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-gold-primary transition-all">View Files</button>
              <button className="p-2 bg-white/5 border border-gold-dark/5 rounded text-gray-500 hover:text-gold-primary hover:border-gold-primary transition-all">
                <Activity size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
