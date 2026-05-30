'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import {
  Briefcase, TrendingUp, Clock, Users, Scale, FileText, AlertCircle,
  ChevronRight, ArrowUpRight, ArrowDownRight, Download
} from '@/components/shared/Icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMatterStore } from '@/lib/matter-service';
import { supabase } from '@/lib/supabase';

const DashboardStat = ({ icon: Icon, label, value, trend, trendType, delay, onClick }: { icon: React.ElementType, label: string, value: string, trend: string, trendType: 'up' | 'down', delay: number, onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    onClick={onClick}
    className={`glass-card p-6 ${onClick ? 'cursor-pointer hover:border-gold-primary/30 transition-all' : ''}`}
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

const ActivityItem = ({ title, time, type, onClick }: { title: string, time: string, type: string, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
  >
    <div className="w-2 h-2 rounded-full bg-gold-primary mt-2 group-hover:scale-150 transition-transform" />
    <div className="flex-1">
      <p className="text-sm text-white font-inter font-medium">{title}</p>
      <div className="flex justify-between items-center mt-1">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{type}</span>
        <span className="text-[10px] text-gray-400 italic">{time}</span>
      </div>
    </div>
    <ChevronRight size={12} className="text-gray-600 group-hover:text-gold-primary transition-colors mt-1 shrink-0" />
  </div>
);

export default function DashboardPage() {
  const { user, auditLog } = useAuth();
  const router = useRouter();
  const matters = useMatterStore((state) => state.matters) || [];
  const syncWithSupabase = useMatterStore((state) => state.syncWithSupabase);
  const subscribeToRealtime = useMatterStore((state) => state.subscribeToRealtime);
  const [mounted, setMounted] = React.useState(false);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [isLiveConnected, setIsLiveConnected] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportToast, setExportToast] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync matters from Supabase on mount
  React.useEffect(() => {
    if (syncWithSupabase) {
      syncWithSupabase();
    }
  }, [syncWithSupabase]);

  // Subscribe to matters real-time changes
  React.useEffect(() => {
    if (subscribeToRealtime) {
      const unsubscribe = subscribeToRealtime();
      setIsLiveConnected(true);
      return () => {
        unsubscribe();
      };
    }
  }, [subscribeToRealtime]);

  // Sync activities from local auditLog and subscribe to Supabase audit_logs real-time inserts
  React.useEffect(() => {
    const initialActivities = (auditLog || []).slice(0, 5).map((entry) => ({
      id: entry.id,
      title: entry.details ? `${entry.action.replace(/_/g, ' ')}: ${entry.details}` : entry.action.replace(/_/g, ' '),
      time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: entry.resource,
    }));
    setActivities(initialActivities);

    const channel = supabase
      .channel('dashboard-audit-logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        (payload: any) => {
          const newRow = payload.new;
          const newActivity = {
            id: newRow.id,
            title: newRow.details ? `${newRow.action.replace(/_/g, ' ')}: ${newRow.details}` : newRow.action.replace(/_/g, ' '),
            time: new Date(newRow.created_at || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: newRow.resource_type || 'System',
          };
          setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auditLog]);

  // Stats logic
  const activeMatters = (matters || []).filter(m => m && m.stage !== 'Closed').length;

  // ── Export Report as CSV ──────────────────────────────────────────────
  const handleExportReport = () => {
    if (isExporting || !matters.length) return;
    setIsExporting(true);

    try {
      const headers = ['Suit Number', 'Title', 'Client', 'Stage', 'Risk Level', 'Risk Score', 'Court', 'Judge', 'Lead Counsel', 'Last Updated', 'Created At'];
      const rows = matters.map(m => [
        m.suitNumber,
        `"${m.title}"`,
        `"${m.client}"`,
        m.stage,
        m.riskLevel,
        m.riskScore,
        `"${m.court}"`,
        `"${m.judge}"`,
        `"${m.leadCounsel}"`,
        m.lastUpdated,
        m.createdAt,
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chamber-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportToast(true);
      setTimeout(() => setExportToast(false), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-10 h-10 rounded-full border-2 border-gold-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Export Success Toast */}
      <AnimatePresence>
        {exportToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-[100] bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-6 py-3 rounded-xl backdrop-blur-lg flex items-center gap-3 shadow-[0_8px_32px_rgba(34,197,94,0.15)]"
          >
            <Download size={14} />
            Chamber report exported successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-playfair">Chamber Intelligence</h1>
            {isLiveConnected && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[8px] font-bold tracking-widest uppercase text-green-400 select-none shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Connected
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs sm:text-sm font-inter">Welcome back, {user?.name ?? 'Counsellor'}. Here is an overview of today&apos;s legal pulse.</p>
        </div>
        <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            id="export-report-btn"
            onClick={handleExportReport}
            disabled={isExporting}
            className="flex-1 sm:flex-none btn-outline py-2 px-4 sm:px-6 text-[10px] sm:text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <span className="w-3 h-3 rounded-full border border-gold-primary border-t-transparent animate-spin" />
            ) : (
              <Download size={12} />
            )}
            Export Report
          </button>
          <Link href="/dashboard/cases/new" className="flex-1 sm:flex-none btn-luxury py-2 px-4 sm:px-6 text-[10px] sm:text-xs font-bold text-center">New Matter</Link>
        </div>
      </div>

      {/* Stats Grid — each card navigates to relevant module */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardStat
          icon={Briefcase} label="Active Matters" value={activeMatters.toString()}
          trend="+12%" trendType="up" delay={0.1}
          onClick={() => router.push('/dashboard/cases')}
        />
        <DashboardStat
          icon={TrendingUp} label="Revenue MTD" value="₦24.8M"
          trend="+8.2%" trendType="up" delay={0.2}
          onClick={() => router.push('/dashboard/finance')}
        />
        <DashboardStat
          icon={Clock} label="Billable Hours" value="1,240"
          trend="-2.4%" trendType="down" delay={0.3}
          onClick={() => router.push('/dashboard/finance')}
        />
        <DashboardStat
          icon={Users} label="Client Retention" value="98.5%"
          trend="+0.5%" trendType="up" delay={0.4}
          onClick={() => router.push('/dashboard/clients')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card overflow-hidden">
            <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
                <Scale className="text-gold-primary" size={20} /> High-Priority Suits
              </h3>
              <Link href="/dashboard/cases" className="text-gold-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:gap-3 transition-all">
                Full Docket <ChevronRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="p-3 sm:p-4 text-[9px] sm:text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Suit Number</th>
                    <th className="p-3 sm:p-4 text-[9px] sm:text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Matter Name</th>
                    <th className="p-3 sm:p-4 text-[9px] sm:text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
                    <th className="p-3 sm:p-4 text-[9px] sm:text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Team</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-dark/5">
                  {(matters || []).slice(0, 4).map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => router.push(`/dashboard/cases/${row.id}`)}
                    >
                      <td className="p-3 sm:p-4 text-[10px] sm:text-xs text-white font-inter font-medium">{row.suitNumber}</td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-300 font-playfair font-bold whitespace-nowrap sm:whitespace-normal group-hover:text-gold-primary transition-colors">{row.title}</td>
                      <td className={`p-3 sm:p-4 text-[9px] sm:text-[10px] font-bold uppercase ${
                        row.stage === 'Hearing' ? 'text-amber-500' :
                        row.stage === 'Judgment' ? 'text-green-500' : 'text-blue-500'
                      }`}>{row.stage}</td>
                      <td className="p-3 sm:p-4">
                        <div className="flex -space-x-2">
                          {(row.team || []).map((m, j) => (
                            <div key={j} title={m.name} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black bg-gray-800 flex items-center justify-center text-[7px] sm:text-[8px] text-gold-primary font-bold">
                              {m.name.split(' ').map(n => n[0]).join('')}
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
            {/* Document Intelligence Card */}
            <div className="glass-card p-6 relative overflow-hidden group hover:border-gold-primary/20 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText size={80} className="text-gold-primary" />
              </div>
              <h4 className="text-white font-playfair font-bold text-xl mb-2">Document Intelligence</h4>
              <p className="text-gray-400 text-xs font-inter mb-6">4 new evidence files pending AI classification.</p>
              <button
                id="access-vault-btn"
                onClick={() => router.push('/dashboard/documents')}
                className="btn-luxury py-2 px-6 text-[10px] w-full flex items-center justify-center gap-2"
              >
                <FileText size={12} />
                Access Vault
              </button>
            </div>

            {/* Compliance Alert Card */}
            <div className="glass-card p-6 bg-gold-primary/5 group hover:border-red-500/20 transition-all">
              <h4 className="text-white font-playfair font-bold text-xl mb-2">Compliance Alert</h4>
              <p className="text-gray-400 text-xs font-inter mb-6">Regulatory filing for Nigerian Gas Co. due in 48h.</p>
              <button
                id="compliance-action-btn"
                onClick={() => router.push('/dashboard/compliance')}
                className="btn-outline py-2 px-6 text-[10px] w-full border-red-500/50 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
              >
                <AlertCircle size={12} />
                Action Required
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Feed */}
        <div className="space-y-8">
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white font-playfair flex items-center gap-3">
                <AlertCircle className="text-gold-primary" size={20} /> Real-time Activity
              </h3>
              <button
                onClick={() => router.push('/dashboard/audit-logs')}
                className="text-[10px] font-bold uppercase tracking-widest text-gold-primary hover:text-white transition-colors flex items-center gap-1"
              >
                All Logs <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {activities.map((act) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ActivityItem
                      title={act.title}
                      time={act.time}
                      type={act.type}
                      onClick={() => router.push('/dashboard/audit-logs')}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {activities.length === 0 && (
                <p className="text-xs text-gray-500 italic text-center py-4">No recent activity detected.</p>
              )}
            </div>
          </section>

          <section className="glass-card p-8 bg-gradient-to-br from-gold-primary/10 to-transparent border-gold-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gold-primary font-inter font-bold text-[10px] tracking-widest uppercase">Chamber Capacity</h4>
              <button
                onClick={() => router.push('/dashboard/team')}
                className="text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-gold-primary transition-colors flex items-center gap-1"
              >
                Manage <ChevronRight size={10} />
              </button>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Litigation Dept', val: 85, href: '/dashboard/cases?filter=litigation' },
                { label: 'Corporate Desk', val: 62, href: '/dashboard/cases?filter=corporate' },
                { label: 'Intellectual Prop', val: 40, href: '/dashboard/cases?filter=ip' },
              ].map((bar, i) => (
                <div
                  key={i}
                  className="space-y-2 cursor-pointer group/bar"
                  onClick={() => router.push('/dashboard/team')}
                >
                  <div className="flex justify-between text-[10px] uppercase font-inter text-gray-400 group-hover/bar:text-gold-primary transition-colors">
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
