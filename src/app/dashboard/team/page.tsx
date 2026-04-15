'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Circle,
  MessageSquare,
  Calendar,
  MoreVertical
} from '@/components/shared/Icons';

const TeamMemberCard = ({ name, role, dept, status, delay }: { name: string, role: string, dept: string, status: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 group hover:border-gold-primary/30 transition-all cursor-pointer"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gold-primary/10 p-[1px] group-hover:bg-gold-primary transition-colors">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
             <span className="text-xl font-bold font-playfair text-gold-primary group-hover:text-white transition-colors">
               {name.split(' ').map(n => n[0]).join('')}
             </span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-full">
          <Circle size={12} className={status === 'Available' ? 'fill-green-500 text-green-500' : status === 'In Court' ? 'fill-amber-500 text-amber-500' : 'fill-red-500 text-red-500'} />
        </div>
      </div>
      <button className="text-gray-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
    </div>
    
    <h3 className="text-lg font-bold text-white font-playfair mb-1 group-hover:text-gold-primary transition-colors">{name}</h3>
    <p className="text-[10px] font-bold text-gold-primary uppercase tracking-[0.2em] mb-4 font-inter">{role}</p>
    
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-3 text-xs text-gray-500 font-inter">
        <Briefcase size={14} className="text-gold-primary/50" />
        {dept}
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500 font-inter">
        <MapPin size={14} className="text-gold-primary/50" />
        Abuja Head Office
      </div>
    </div>

    <div className="flex gap-2 pt-4 border-t border-gold-dark/5">
       <button className="flex-1 py-2 flex justify-center bg-white/5 hover:bg-gold-primary hover:text-black transition-all rounded text-gray-400">
         <Mail size={16} />
       </button>
       <button className="flex-1 py-2 flex justify-center bg-white/5 hover:bg-gold-primary hover:text-black transition-all rounded text-gray-400">
         <MessageSquare size={16} />
       </button>
       <button className="flex-1 py-2 flex justify-center bg-white/5 hover:bg-gold-primary hover:text-black transition-all rounded text-gray-400">
         <Calendar size={16} />
       </button>
    </div>
  </motion.div>
);

export default function TeamPage() {
  const staff = [
    { name: 'Olumide Zuma', role: 'Senior Advocate (SAN)', dept: 'LITIGATION', status: 'Available' },
    { name: 'Sarah Nwosu', role: 'Managing Partner', dept: 'CORPORATE', status: 'In Meeting' },
    { name: 'Adeyemi Cole', role: 'Senior Associate', dept: 'IP & TECH', status: 'In Court' },
    { name: 'Ibrahim Musa', role: 'Associate Attorney', dept: 'COMMERCIAL', status: 'Available' },
    { name: 'Chidi Okoro', role: 'Litigation Clerk', dept: 'LITIGATION', status: 'In Court' },
    { name: 'Zainab Bello', role: 'Finance Officer', dept: 'FINANCE & ADMIN', status: 'Available' },
    { name: 'David Jones', role: 'Junior Associate', dept: 'ENERGY', status: 'Available' },
    { name: 'Mary Udoh', role: 'Executive Secretary', dept: 'ADMINISTRATION', status: 'In Meeting' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Chamber Personnel</h1>
          <p className="text-gray-400 text-sm font-inter">Internal directory and collaboration hub for Zuma Chambers professionals.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline px-6 py-3 flex items-center gap-2 text-xs">
            <Users size={16} /> Organizational Chart
          </button>
          <button className="btn-luxury px-6 py-3 flex items-center gap-2 text-xs font-bold">
             Invite Member
          </button>
        </div>
      </div>

      {/* Tools */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary" />
           <input 
            type="text" 
            placeholder="Search by name, role, or department..." 
            className="w-full bg-white/5 border border-gold-dark/10 rounded-lg py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-gold-primary transition-all font-inter"
           />
        </div>
        <div className="flex gap-4">
          <select className="bg-white/5 border border-gold-dark/10 rounded-lg py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-white outline-none appearance-none cursor-pointer">
            <option>All Departments</option>
            <option>Litigation</option>
            <option>Corporate</option>
            <option>Finance</option>
          </select>
          <button className="p-3 bg-white/5 border border-gold-dark/10 rounded-lg text-gray-400 hover:text-gold-primary transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((member, i) => (
          <TeamMemberCard key={i} {...member} delay={0.05 * i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <section className="lg:col-span-2 glass-card p-8 bg-[#0a0a0a]">
           <div className="flex items-center gap-3 mb-8">
             <MessageSquare className="text-gold-primary" size={20} />
             <h3 className="text-xl font-bold text-white font-playfair">Internal <span className="gold-text">Bulletins</span></h3>
           </div>
           
           <div className="space-y-6">
              {[
                { title: 'New Litigation Guidelines for Supreme Court Appearances', author: 'Olumide Zuma (SAN)', date: 'Today, 10:45 AM', type: 'Policy' },
                { title: 'Easter Vacation Office Closures & Emergency Contacts', author: 'Admin Dept', date: 'Yesterday', type: 'Announcement' },
                { title: 'Quarterly Performance Reviews - Q2 Schedule', author: 'Sarah Nwosu', date: 'Oct 12, 2026', type: 'HR' },
              ].map((post, i) => (
                <div key={i} className="flex flex-col p-4 bg-white/[0.02] border border-gold-dark/5 rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer">
                   <div className="flex justify-between items-start mb-2">
                     <h4 className="text-white font-inter font-bold text-sm">{post.title}</h4>
                     <span className="text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 border border-gold-dark/20 text-gold-primary rounded-sm">
                       {post.type}
                     </span>
                   </div>
                   <div className="flex items-center gap-4 text-[10px] text-gray-500 font-inter">
                     <span>By {post.author}</span>
                     <span>•</span>
                     <span>{post.date}</span>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <section className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <Award size={48} className="text-gold-primary/20 mb-6" />
            <h4 className="text-white font-playfair font-bold text-lg mb-2">Excellence Spotlight</h4>
            <div className="w-16 h-16 rounded-full bg-gold-gradient p-[1px] mb-4">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                 <span className="text-xl font-bold font-playfair text-gold-primary">AC</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 font-inter font-bold mb-1">Adeyemi Cole</p>
            <p className="text-[10px] text-gold-primary uppercase tracking-[0.2em] font-bold mb-6">Secured Landmark IP Judgment</p>
            <p className="text-xs text-gray-500 font-inter leading-relaxed">
              Recognized for outstanding legal research and primary advocacy in the SC/CV dispute.
            </p>
        </section>
      </div>
    </div>
  );
}
