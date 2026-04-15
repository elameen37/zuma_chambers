'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import {
  Briefcase, TrendingUp, Clock, Users, Scale, FileText, AlertCircle,
  ChevronRight, ArrowUpRight, ArrowDownRight
} from '@/components/shared/Icons';

const DashboardStat = ({ icon: Icon, label, value, trend, trendType, delay }: { icon: React.ElementType, label: string, value: string, trend: string, trendType: 'up' | 'down', delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gold-primary/10 rounded-lg">
        <Icon className="text-gold-primary" size={20} />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold ${trendType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {trend}
      </div>
    </div>
    <h3 className="text-gray-500 text-[10px] tracking-widest uppercase mb-1 font-inter font-bold">{label}</h3>
    <p className="text-2xl font-bold text-white font-playfair">{value}</p>
  </motion.div>
);

const ActivityItem = ({ title, time, type }: { title: string, time: string, type: string }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
    <div className="w-2 h-2 rounded-full bg-gold-primary mt-2 group-hover:scale-150 transition-transform" />
    <div className="flex-1">
      <p className="text-sm text-white font-inter font-medium">{title}</p>
      <div className="flex justify-between items-center mt-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{type}</span>
        <span className="text-[10px] text-gray-400 italic">{time}</span>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Chamber Intelligence</h1>
          <p className="text-gray-400 text-sm font-inter">Welcome back, {user?.name ?? 'Counsellor'}. Here is an overview of today&apos;s legal pulse.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline py-2 px-6 text-xs">Export Report</button>
          <button className="btn-luxury py-2 px-6 text-xs">New Matter</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStat icon={Briefcase} label="Active Matters" value="142" trend="+12%" trendType="up" delay={0.1} />
        <DashboardStat icon={TrendingUp} label="Revenue MTD" value="₦24.8M" trend="+8.2%" trendType="up" delay={0.2} />
        <DashboardStat icon={Clock} label="Billable Hours" value="1,240" trend="-2.4%" trendType="down" delay={0.3} />
        <DashboardStat icon={Users} label="Client Retention" value="98.5%" trend="+0.5%" trendType="up" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card overflow-hidden">
            <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
                <Scale className="text-gold-primary" size={20} /> High-Priority Suits
              </h3>
              <button className="text-gold-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all">
                Full Docket <ChevronRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Suit Number</th>
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Matter Name</th>
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
                    <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Team</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-dark/5">
                  {[
                    { id: 'FHC/ABJ/CS/120/24', title: 'Zuma vs Federal Govt of Nigeria', status: 'Hearing', color: 'text-amber-500' },
                    { id: 'SC/CV/245/2023', title: 'Acme Corp Intellectual Property', status: 'Judgment', color: 'text-green-500' },
                    { id: 'LD/1024/GCM/24', title: 'State Maritime Jurisdiction', status: 'Discovery', color: 'text-blue-500' },
                    { id: 'FCT/HC/CV/09/24', title: 'Global Tech Compliance Audit', status: 'Closed', color: 'text-gray-500' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-xs text-white font-inter font-medium">{row.id}</td>
                      <td className="p-4 text-sm text-gray-300 font-playfair font-bold">{row.title}</td>
                      <td className={`p-4 text-[10px] font-bold uppercase ${row.color}`}>{row.status}</td>
                      <td className="p-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(j => (
                            <div key={j} className="w-6 h-6 rounded-full border border-black bg-gray-800 flex items-center justify-center text-[8px] text-gold-primary font-bold">
                              JD
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText size={80} className="text-gold-primary" />
              </div>
              <h4 className="text-white font-playfair font-bold text-xl mb-2">Document Intelligence</h4>
              <p className="text-gray-400 text-xs font-inter mb-6">4 new evidence files pending AI classification.</p>
              <button className="btn-luxury py-2 px-6 text-[10px] w-full">Access Vault</button>
            </div>
            <div className="glass-card p-6 bg-gold-primary/5 group">
              <h4 className="text-white font-playfair font-bold text-xl mb-2">Compliance Alert</h4>
              <p className="text-gray-400 text-xs font-inter mb-6">Regulatory filing for Nigerian Gas Co. due in 48h.</p>
              <button className="btn-outline py-2 px-6 text-[10px] w-full border-red-500/50 text-red-400 hover:bg-red-500/10">Action Required</button>
            </div>
          </div>
        </div>

        {/* Sidebar Feed */}
        <div className="space-y-8">
          <section className="glass-card p-6">
            <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
              <AlertCircle className="text-gold-primary" size={20} /> Real-time Activity
            </h3>
            <div className="space-y-2">
              <ActivityItem title="Motion for Stay of Execution Filed" time="15m ago" type="Litigation" />
              <ActivityItem title="New Client: Pan-African Bank" time="1h ago" type="Corporate" />
              <ActivityItem title="Internal Meeting: IP Reform Advisory" time="3h ago" type="Meeting" />
              <ActivityItem title="Invoice #8849 Generated" time="5h ago" type="Billing" />
              <ActivityItem title="Court Appearance Logged" time="Yesterday" type="Clerk" />
            </div>
          </section>

          <section className="glass-card p-8 bg-gradient-to-br from-gold-primary/10 to-transparent border-gold-primary/20">
            <h4 className="text-gold-primary font-inter font-bold text-[10px] tracking-widest uppercase mb-4">Chamber Capacity</h4>
            <div className="space-y-6">
              {[
                { label: 'Litigation Dept', val: 85 },
                { label: 'Corporate Desk', val: 62 },
                { label: 'Intellectual Prop', val: 40 },
              ].map((bar, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-inter text-gray-400">
                    <span>{bar.label}</span>
                    <span>{bar.val}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.val}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                      className="h-full bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
