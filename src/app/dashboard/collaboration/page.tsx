'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Hash, Users, Shield, Pin, 
  Send, Plus, MoreVertical, Search, Reply, 
  CheckCircle2, Clock, AlertCircle, FileSignature, 
  Gavel, BookOpen, Sparkles, ChevronRight
} from '@/components/shared/Icons';

// Mock Data
const CHANNELS = [
  { id: '1', name: 'general-chambers', count: 12 },
  { id: '2', name: 'litigation-strategy', count: 5, active: true },
  { id: '3', name: 'corporate-briefs', count: 3 },
  { id: '4', name: 'clerk-assignments', count: 8 },
];

const DIRECT_MESSAGES = [
  { id: 'u1', name: 'Olumide Zuma (Partner)', status: 'Online' },
  { id: 'u2', name: 'Sarah Nwosu', status: 'Away' },
  { id: 'u3', name: 'Adeyemi Cole', status: 'Offline' },
];

const WORKFLOW_ITEMS = [
  { id: 'w1', title: 'Review: Shell Settlement Draft', type: 'Partner Review', priority: 'High', due: '2h' },
  { id: 'w2', title: 'Research: Maritime Lien Precedents', type: 'Legal Research', priority: 'Medium', due: 'Tomorrow' },
  { id: 'w3', title: 'Approve: Expense Claims (Q1)', type: 'Financial Approval', priority: 'Low', due: '3 days' },
];

const MESSAGES = [
  { id: 'm1', sender: 'Olumide Zuma', content: 'Has the reply to the counter-affidavit in the Dangote matter been drafted?', time: '10:30 AM', role: 'Partner' },
  { id: 'm2', sender: 'Adeyemi Cole', content: 'Yes, I am finalizing the citations. Will upload to the strategy room by noon.', time: '10:35 AM', role: 'Associate' },
  { id: 'm3', sender: 'Olumide Zuma', content: 'Excellent. Please ensure the cross-references to the 2023 Supreme Court ruling are precise.', time: '10:38 AM', role: 'Partner' },
];

export default function CollaborationPage() {
  const [activeChannel, setActiveChannel] = useState('litigation-strategy');
  const [message, setMessage] = useState('');

  return (
    <div className="flex bg-[#050505] rounded-2xl border border-gold-dark/10 overflow-hidden h-[calc(100vh-160px)]">
      {/* Collaboration Sidebar */}
      <aside className="w-64 bg-black border-r border-gold-dark/10 flex flex-col">
        <div className="p-6">
          <h2 className="text-white font-playfair font-bold text-lg mb-6 flex items-center gap-2">
            <MessageSquare className="text-gold-primary" size={20} /> Intercom
          </h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Channels</span>
                <Plus size={14} className="text-gray-500 hover:text-white cursor-pointer" />
              </div>
              <div className="space-y-1">
                {CHANNELS.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.name)}
                    className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all z-10 ${
                      activeChannel === channel.name ? 'text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 relative z-20">
                      <Hash size={14} />
                      <span>{channel.name}</span>
                    </div>
                    {channel.active && <span className="relative z-20 w-1.5 h-1.5 bg-gold-primary rounded-full" />}
                    
                    {activeChannel === channel.name && (
                      <motion.div 
                        layoutId="collab-channel-bg"
                        className="absolute inset-0 bg-gold-primary rounded-lg z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Direct Messages</span>
                <Plus size={14} className="text-gray-500 hover:text-white cursor-pointer" />
              </div>
              <div className="space-y-1">
                {DIRECT_MESSAGES.map(user => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-gold-dark/20 flex items-center justify-center text-[10px] font-bold font-playfair">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${
                        user.status === 'Online' ? 'bg-green-500' : user.status === 'Away' ? 'bg-amber-500' : 'bg-gray-600'
                      }`} />
                    </div>
                    <span>{user.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Messaging Area */}
      <main className="flex-1 flex flex-col bg-black/40">
        {/* Chat Header */}
        <header className="p-4 border-b border-gold-dark/10 flex justify-between items-center bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gold-primary/10 text-gold-primary rounded-lg">
              <Hash size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">#{activeChannel}</h3>
              <p className="text-[10px] text-gray-500">Coordination and tactical debate for active litigation matters.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gold-dark/20 flex items-center justify-center text-[10px] font-bold">U{i}</div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-black bg-gold-primary text-black flex items-center justify-center text-[10px] font-bold">+5</div>
            </div>
            <button className="text-gray-500 hover:text-white"><Pin size={18} /></button>
            <button className="text-gray-500 hover:text-white"><Search size={18} /></button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {MESSAGES.map((msg, i) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-primary/10 to-transparent border border-gold-dark/10 flex items-center justify-center text-sm font-bold font-playfair text-gold-primary shrink-0">
                {msg.sender.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-white font-inter">{msg.sender}</span>
                  <span className="text-[8px] font-bold text-gold-primary/60 uppercase tracking-widest">{msg.role}</span>
                  <span className="text-[10px] text-gray-600 font-inter">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-400 font-inter leading-relaxed max-w-2xl">{msg.content}</p>
                <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[9px] font-bold text-gray-600 uppercase tracking-widest hover:text-gold-primary flex items-center gap-1">
                    <Reply size={12} /> Reply
                  </button>
                  <button className="text-[9px] font-bold text-gray-600 uppercase tracking-widest hover:text-gold-primary flex items-center gap-1">
                    <Pin size={12} /> Pin
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gold-dark/10">
          <div className="bg-white/5 border border-gold-dark/20 rounded-xl p-2 flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-gold-primary transition-colors">
              <Plus size={20} />
            </button>
            <input 
              type="text" 
              placeholder={`Message #${activeChannel}`} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white py-2"
            />
            <div className="flex items-center gap-2 pr-2">
              <button className="p-2 text-gold-primary/40 hover:text-gold-primary transition-colors">
                <Sparkles size={18} />
              </button>
              <button className="p-3 bg-gold-primary text-black rounded-lg hover:bg-gold-light transition-all shadow-lg shadow-gold-primary/20">
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 mt-2 ml-2">Press Enter to send. Use @ to mention firm members.</p>
        </div>
      </main>

      {/* Collaboration Sidepanel (Workflow) */}
      <aside className="w-80 bg-black border-l border-gold-dark/10 p-6 hidden xl:block overflow-y-auto">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
          <Clock className="text-gold-primary" size={16} /> Partner Review Queue
        </h3>
        
        <div className="space-y-4">
          {WORKFLOW_ITEMS.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white/5 border border-gold-dark/10 rounded-xl hover:border-gold-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                  item.priority === 'High' ? 'border-red-500/20 text-red-500' : 'border-gray-500/20 text-gray-500'
                }`}>
                  {item.priority}
                </span>
                <span className="text-[10px] text-gold-primary font-bold">{item.due} left</span>
              </div>
              <h4 className="text-white font-bold text-xs mb-3 font-inter leading-relaxed">{item.title}</h4>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.type}</span>
                <button className="p-1 text-gray-600 group-hover:text-gold-primary transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gold-gradient p-[1px] rounded-xl">
          <div className="bg-black p-6 rounded-[11px]">
             <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                <AlertCircle size={14} className="text-gold-primary" /> Strategy Briefing
             </h4>
             <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
               General Partner meeting in **Room 4** at 2:00 PM today. Review the latest appellate filings beforehand.
             </p>
             <button className="w-full py-2 bg-gold-primary text-black rounded font-bold text-[9px] uppercase tracking-widest hover:bg-gold-light transition-all">
                Join Briefing
             </button>
          </div>
        </div>

        <div className="mt-8">
           <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
             <BookOpen className="text-gold-primary" size={16} /> Legal Research
           </h3>
           <div className="p-4 border border-gold-dark/5 rounded-xl bg-white/[0.02]">
             <p className="text-[10px] text-gray-500 italic">&quot;Can anyone pull the recent ECOWAS court ruling on transnational debt enforcement?&quot;</p>
             <div className="mt-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gold-dark/20 text-[8px] flex items-center justify-center">NM</div>
                <span className="text-[9px] text-gray-400">Requested by Nkechi M.</span>
             </div>
           </div>
        </div>
      </aside>
    </div>
  );
}
