'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { ScrollText, Search, Filter, ShieldAlert, CheckCircle, AlertCircle, Globe } from '@/components/shared/Icons';
import Badge from '@/components/shared/Badge';

export default function AuditLogsPage() {
  const { auditLog } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = auditLog.filter(entry => {
    const matchesSearch = 
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="green" size="sm">Success</Badge>;
      case 'denied': return <Badge variant="red" size="sm">Denied</Badge>;
      case 'warning': return <Badge variant="amber" size="sm">Warning</Badge>;
      default: return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-NG', {
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Security Audit Trail</h1>
          <p className="text-gray-400 text-sm font-inter">Real-time monitoring of all system access and operational events.</p>
        </div>
        <button className="btn-outline px-6 py-3 flex items-center gap-2 text-xs">
          <ScrollText size={16} /> Export Log
        </button>
      </div>

      {/* Security Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: auditLog.length.toString(), icon: ScrollText, color: 'text-gold-primary', bg: 'bg-gold-primary/10' },
          { label: 'Access Denied', value: auditLog.filter(e => e.status === 'denied').length.toString(), icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Successful Ops', value: auditLog.filter(e => e.status === 'success').length.toString(), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Escalation Alerts', value: auditLog.filter(e => e.status === 'warning').length.toString(), icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className={`p-2 rounded-lg ${card.bg} inline-block mb-3`}>
              <card.icon size={18} className={card.color} />
            </div>
            <h4 className="text-gray-500 text-[10px] tracking-widest uppercase font-bold font-inter mb-1">{card.label}</h4>
            <p className="text-2xl font-bold text-white font-playfair">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search by user, action, or resource..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-gold-primary transition-all font-inter"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-gold-dark/20 rounded-lg py-3 pl-12 pr-8 text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="denied">Denied</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-gold-dark/10 bg-white/[0.02] flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-primary">{filtered.length} Events</span>
          <div className="flex items-center gap-2 text-[9px] text-gray-600 font-inter">
            <Globe size={10} /> Real-time monitoring active
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Timestamp</th>
                <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">User</th>
                <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Action</th>
                <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Resource</th>
                <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">IP Address</th>
                <th className="p-4 text-[10px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-dark/5">
              {filtered.map((entry, i) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`hover:bg-white/[0.02] transition-colors ${entry.status === 'denied' ? 'bg-red-500/[0.02]' : entry.status === 'warning' ? 'bg-amber-500/[0.02]' : ''}`}
                >
                  <td className="p-4 text-xs text-gray-400 font-inter whitespace-nowrap">{formatTime(entry.timestamp)}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-white font-inter">{entry.userName}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 font-inter">{entry.action.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-400 font-inter">{entry.resource}</span>
                    {entry.details && (
                      <p className="text-[9px] text-gray-600 mt-1 font-inter">{entry.details}</p>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-500 font-mono">{entry.ip}</td>
                  <td className="p-4">{statusBadge(entry.status)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
