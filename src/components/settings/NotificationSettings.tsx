'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Mail, MessageSquare, Smartphone, 
  Check, X, Zap, ShieldCheck, Activity,
  Send, ChevronRight
} from 'lucide-react';
import { sendHearingReminder, sendDeadlineAlert } from '@/lib/notification-service';

interface Channel {
  id: 'email' | 'sms' | 'whatsapp';
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const CHANNELS: Channel[] = [
  { id: 'email', label: 'Email', icon: Mail, description: 'Branded HTML emails via Resend', color: 'text-blue-400' },
  { id: 'sms', label: 'SMS', icon: Smartphone, description: 'Instant SMS via Termii Nigeria', color: 'text-green-400' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, description: 'WhatsApp Business via Meta Cloud API', color: 'text-emerald-400' },
];

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState({ email: true, sms: true, whatsapp: false });
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ channel: string; success: boolean } | null>(null);

  const handleTestNotification = async (channelId: 'email' | 'sms' | 'whatsapp') => {
    setTesting(channelId);
    setTestResult(null);

    try {
      const results = await sendHearingReminder({
        counselName: 'Chief Elameen SAN',
        clientName: 'Test Client',
        suitNumber: 'TEST/001/2026',
        hearingDate: new Date().toLocaleDateString('en-NG', { dateStyle: 'full' }),
        court: 'Federal High Court, Abuja',
        counselEmail: 'test@zumachambers.ng',
        counselPhone: '+2348000000000',
      });

      const result = results.find(r => r.channel === channelId);
      setTestResult({ channel: channelId, success: result?.success ?? false });
    } catch {
      setTestResult({ channel: channelId, success: false });
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white font-playfair flex items-center gap-3 mb-2">
          <Bell className="text-gold-primary" size={24} /> Notification Intelligence
        </h3>
        <p className="text-gray-400 text-sm font-inter">
          Configure multi-channel delivery for hearing reminders, deadline alerts, and invoice notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHANNELS.map((channel) => (
          <div key={channel.id} className={`glass-card p-6 transition-all ${enabled[channel.id] ? 'border-gold-primary/30' : 'border-white/5'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-white/5 rounded-xl ${channel.color}`}>
                <channel.icon size={24} />
              </div>
              <button
                onClick={() => setEnabled(prev => ({ ...prev, [channel.id]: !prev[channel.id] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${enabled[channel.id] ? 'bg-gold-primary' : 'bg-white/10'}`}
              >
                <motion.div
                  animate={{ x: enabled[channel.id] ? 22 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
            </div>

            <h4 className="text-lg font-bold text-white font-playfair mb-1">{channel.label}</h4>
            <p className="text-gray-500 text-xs font-inter mb-6">{channel.description}</p>

            <div className="flex flex-col gap-2">
              <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded text-center ${enabled[channel.id] ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'}`}>
                {enabled[channel.id] ? '● Active' : '○ Inactive'}
              </div>
              <button
                onClick={() => handleTestNotification(channel.id)}
                disabled={!enabled[channel.id] || testing === channel.id}
                className="w-full py-2 bg-white/5 border border-gold-dark/10 rounded text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gold-primary hover:border-gold-primary/30 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {testing === channel.id ? <Activity size={12} className="animate-spin" /> : <Send size={12} />}
                {testing === channel.id ? 'Sending...' : 'Send Test'}
              </button>
            </div>

            <AnimatePresence>
              {testResult?.channel === channel.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 p-3 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${testResult.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                >
                  {testResult.success ? <Check size={12} /> : <X size={12} />}
                  {testResult.success ? 'Test Delivered' : 'Delivery Failed'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Event Trigger Config */}
      <div className="glass-card p-8">
        <h4 className="text-lg font-bold text-white font-playfair mb-6 flex items-center gap-3">
          <Zap size={20} className="text-gold-primary" /> Trigger Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Hearing Reminder', desc: '24 hours before court date' },
            { label: 'Deadline Alert', desc: 'When 72h window detected by AI' },
            { label: 'Invoice Generated', desc: 'On new invoice creation' },
            { label: 'Leave Approved', desc: 'On HR leave status change' },
            { label: 'New Case Assigned', desc: 'On matter assignment' },
            { label: 'Document Filed', desc: 'On successful court filing log' },
          ].map((trigger) => (
            <div key={trigger.label} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-gold-dark/5 hover:border-gold-primary/20 transition-all">
              <div>
                <p className="text-xs font-bold text-white">{trigger.label}</p>
                <p className="text-[10px] text-gray-500 mt-1">{trigger.desc}</p>
              </div>
              <div className="w-7 h-4 rounded-full bg-gold-primary relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
