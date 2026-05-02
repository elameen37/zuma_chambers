'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { ROLE_LABELS, ROLE_COLORS, Role } from '@/lib/permissions';
import { User, Lock, Key, Fingerprint, ShieldCheck, Globe, Eye, Clock, Activity, CheckCircle } from '@/components/shared/Icons';
import Badge from '@/components/shared/Badge';
import NotificationSettings from '@/components/settings/NotificationSettings';

export default function SettingsPage() {
  const { user, switchRole } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  if (!user) return null;

  const roles: Role[] = ['partner', 'associate', 'admin', 'clerk', 'finance', 'client'];

  const mockSessions = [
    { device: 'Chrome (Windows)', ip: '102.89.45.121', location: 'Lagos, Nigeria', lastActive: '2 min ago', current: true },
    { device: 'Safari (iPhone)', ip: '102.89.45.134', location: 'Lagos, Nigeria', lastActive: '1 hour ago', current: false },
    { device: 'Firefox (macOS)', ip: '197.210.64.22', location: 'Abuja, Nigeria', lastActive: '3 days ago', current: false },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-playfair mb-2">Security &amp; Settings</h1>
        <p className="text-gray-400 text-sm font-inter">Manage your profile, security preferences, and active sessions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gold-gradient p-[2px] mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <span className="text-2xl font-bold text-gold-primary font-playfair">{user.initials}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white font-playfair mb-1">{user.name}</h3>
            <p className="text-xs text-gray-400 font-inter mb-2">{user.title}</p>
            <div className="mb-4">
              <span className={`inline-flex px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border ${ROLE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
            <p className="text-[10px] text-gray-600 font-inter">{user.email}</p>
            <p className="text-[10px] text-gray-600 font-inter">{user.department}</p>
          </motion.div>

          {/* Role Switcher (Demo) */}
          <div className="glass-card p-6 border-amber-500/20 bg-amber-500/[0.02]">
            <h4 className="text-sm font-bold text-white font-playfair mb-1">Demo Role Switcher</h4>
            <p className="text-[10px] text-gray-500 font-inter mb-4">Switch roles to preview different permission levels.</p>
            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all text-xs font-inter ${
                    user.role === role ? 'bg-gold-primary/10 border border-gold-primary/30' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border ${ROLE_COLORS[role]}`}>
                    {role}
                  </span>
                  <span className="text-gray-300">{ROLE_LABELS[role]}</span>
                  {user.role === role && <CheckCircle size={14} className="text-gold-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Panels */}
        <div className="lg:col-span-2 space-y-8">
          {/* Security Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
              <ShieldCheck className="text-gold-primary" size={20} /> Security Configuration
            </h3>
            <div className="space-y-6">
              {/* 2FA Toggle */}
              <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-lg border border-gold-dark/10">
                <div className="flex items-center gap-4">
                  <Key size={20} className="text-gold-primary" />
                  <div>
                    <p className="text-sm font-bold text-white font-inter">Two-Factor Authentication</p>
                    <p className="text-[10px] text-gray-500 font-inter">TOTP authenticator app required for login</p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${twoFactorEnabled ? 'bg-gold-primary' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${twoFactorEnabled ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Biometric */}
              <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-lg border border-gold-dark/10">
                <div className="flex items-center gap-4">
                  <Fingerprint size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-bold text-white font-inter">Biometric Authentication</p>
                    <p className="text-[10px] text-gray-500 font-inter">WebAuthn / FIDO2 fingerprint or face recognition</p>
                  </div>
                </div>
                <Badge variant="gray" size="md">Coming Soon</Badge>
              </div>

              {/* Session Timeout */}
              <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-lg border border-gold-dark/10">
                <div className="flex items-center gap-4">
                  <Clock size={20} className="text-gold-primary" />
                  <div>
                    <p className="text-sm font-bold text-white font-inter">Session Timeout</p>
                    <p className="text-[10px] text-gray-500 font-inter">Auto-lock after inactivity period</p>
                  </div>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(e.target.value)}
                  className="bg-white/5 border border-gold-dark/20 rounded-lg py-2 px-3 text-[10px] text-white outline-none appearance-none cursor-pointer font-inter font-bold"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              {/* Encryption */}
              <div className="flex justify-between items-center p-4 bg-green-500/[0.02] rounded-lg border border-green-500/10">
                <div className="flex items-center gap-4">
                  <Lock size={20} className="text-green-500" />
                  <div>
                    <p className="text-sm font-bold text-white font-inter">Encryption at Rest</p>
                    <p className="text-[10px] text-gray-500 font-inter">All data encrypted with AES-256-GCM</p>
                  </div>
                </div>
                <Badge variant="green" size="md">Active</Badge>
              </div>
            </div>
          </motion.div>

          {/* Active Sessions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
              <Activity className="text-gold-primary" size={20} /> Active Sessions
            </h3>
            <div className="space-y-4">
              {mockSessions.map((session, i) => (
                <div key={i} className={`flex justify-between items-center p-4 rounded-lg border transition-colors ${
                  session.current ? 'bg-gold-primary/[0.03] border-gold-primary/20' : 'bg-white/[0.02] border-gold-dark/10'
                }`}>
                  <div className="flex items-center gap-4">
                    <Globe size={18} className={session.current ? 'text-gold-primary' : 'text-gray-500'} />
                    <div>
                      <p className="text-sm font-bold text-white font-inter flex items-center gap-2">
                        {session.device}
                        {session.current && <Badge variant="gold" size="sm">Current</Badge>}
                      </p>
                      <p className="text-[10px] text-gray-500 font-inter">
                        {session.ip} &bull; {session.location} &bull; {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider font-inter">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* IP Whitelist */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
              <Eye className="text-gold-primary" size={20} /> IP Monitoring &amp; Whitelist
            </h3>
            <div className="space-y-3">
              {[
                { ip: '102.89.45.0/24', label: 'Zuma Chambers HQ (Lagos)', status: 'whitelisted' },
                { ip: '102.89.46.0/24', label: 'Zuma Chambers (Abuja)', status: 'whitelisted' },
                { ip: '41.203.67.89', label: 'Blocked — Brute force', status: 'blocked' },
              ].map((entry, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-lg border border-gold-dark/10">
                  <div>
                    <p className="text-xs font-bold text-white font-mono">{entry.ip}</p>
                    <p className="text-[10px] text-gray-500 font-inter">{entry.label}</p>
                  </div>
                  <Badge variant={entry.status === 'whitelisted' ? 'green' : 'red'} size="sm">
                    {entry.status}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      {/* Notification Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <NotificationSettings />
      </motion.div>
    </div>
  );
}
