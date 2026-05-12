'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, ShieldCheck, Globe } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ContactInfo = ({ icon: Icon, title, detail, subdetail }: { icon: React.ElementType, title: string, detail: string, subdetail?: string }) => (
  <div className="flex gap-8 items-start group">
    <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10 transition-colors duration-500">
      <Icon className="w-6 h-6 text-brand-primary" />
    </div>
    <div>
      <h4 className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2 font-inter">{title}</h4>
      <p className="text-white text-xl font-playfair font-bold group-hover:text-brand-primary transition-colors">{detail}</p>
      {subdetail && <p className="text-gray-400 text-sm font-inter font-medium mt-1.5 leading-relaxed">{subdetail}</p>}
    </div>
  </div>
);

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-onyx selection:bg-brand-primary selection:text-onyx">
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 blur-[120px] rounded-full" />
        <div className="section-responsive text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-brand-primary" />
              <h2 className="text-brand-primary text-[10px] font-bold tracking-[0.5em] uppercase font-inter">
                Connect With Excellence
              </h2>
              <div className="w-12 h-[1px] bg-brand-primary" />
            </div>
            <h1 className="heading-premium text-5xl md:text-7xl text-white mb-8">
              Consultation & <span className="italic bg-luxury-gradient bg-clip-text text-transparent">Booking</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-inter font-medium max-w-2xl mx-auto">
              Secure your legal representation. Our intake team is prepared to process your inquiry with absolute discretion and efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 section-responsive">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-panel p-10 md:p-16 rounded-[3rem]">
              <div className="flex items-center gap-4 mb-12 text-brand-primary">
                <ShieldCheck size={24} />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase font-inter">Secure Encrypted Intake</span>
              </div>
              
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 font-inter">Full Name / Entity</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-[13px] font-inter font-bold focus:border-brand-primary outline-none transition-all" placeholder="John Doe / Acme Corp" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 font-inter">Email Address</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-[13px] font-inter font-bold focus:border-brand-primary outline-none transition-all" placeholder="exec@example.com" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 font-inter">Practice Area</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-[13px] font-inter font-bold focus:border-brand-primary outline-none transition-all appearance-none cursor-pointer">
                    <option className="bg-onyx">Select Legal Practice Area</option>
                    <option className="bg-onyx">High-Stakes Litigation</option>
                    <option className="bg-onyx">Corporate M&A</option>
                    <option className="bg-onyx">Tech & Intelligence</option>
                    <option className="bg-onyx">Property & Maritime</option>
                    <option className="bg-onyx">Other Complex Matter</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 font-inter">Case Overview</label>
                  <textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-[13px] font-inter font-bold focus:border-brand-primary outline-none transition-all resize-none" placeholder="Provide a brief summary of your legal requirements..."></textarea>
                </div>

                <button type="submit" className="btn-modern w-full !py-6 flex items-center justify-center gap-4">
                  Initiate Secure Booking <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col gap-16 justify-center"
          >
            <div>
              <h3 className="heading-premium text-4xl font-bold mb-12 text-white">Direct <span className="italic text-brand-primary">Channels</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12">
                <ContactInfo 
                  icon={Mail} 
                  title="Official Intake" 
                  detail="intake@zumachambers.law" 
                  subdetail="Monitored 24/7 for urgent high-stakes matters"
                />
                <ContactInfo 
                  icon={Phone} 
                  title="Global Head Office" 
                  detail="+234 (0) 800 ZUMA LAW" 
                  subdetail="Extensions available for all senior advocates"
                />
                <ContactInfo 
                  icon={MapPin} 
                  title="Abuja Headquarters" 
                  detail="Zuma Crescent, Central Area, Abuja" 
                  subdetail="Located in Nigeria's premier legal district"
                />
                <ContactInfo 
                  icon={MessageCircle} 
                  title="Secure WhatsApp" 
                  detail="+234 901 234 5678" 
                  subdetail="Encrypted messaging for initial triage"
                />
              </div>
            </div>

            <div className="glass-panel p-12 bg-slate-grey/30 rounded-[2.5rem]">
              <h4 className="text-white font-playfair font-bold text-2xl mb-8 flex items-center gap-4">
                <Clock className="text-brand-primary" /> Active Workspace
              </h4>
              <div className="space-y-5 text-sm font-inter font-bold">
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-gray-500 uppercase tracking-widest text-[11px]">Mon — Fri</span>
                  <span className="text-white">08:00 — 18:00 (WAT)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <span className="text-gray-500 uppercase tracking-widest text-[11px]">Sat</span>
                  <span className="text-white">10:00 — 14:00 (WAT)</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500 uppercase tracking-widest text-[11px]">Emergency Support</span>
                  <span className="text-brand-primary">Available 24/7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-24 bg-slate-grey/30 border-y border-white/5">
        <div className="section-responsive text-center">
          <Globe className="w-16 h-16 text-brand-primary/20 mx-auto mb-10" />
          <h2 className="text-[11px] font-bold tracking-[0.5em] uppercase text-brand-primary mb-6 font-inter">International Desk</h2>
          <h3 className="heading-premium text-4xl md:text-5xl text-white mb-10">Coordinating <span className="italic text-brand-primary">Global Integrity</span></h3>
          <p className="text-gray-400 max-w-2xl mx-auto font-inter font-medium text-lg mb-16 leading-relaxed">
            [COMPANY_NAME] maintains strategic partnerships in London, New York, and Dubai to facilitate cross-border legal operations and multi-jurisdictional compliance.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {['Abuja', 'Lagos', 'London', 'New York'].map((city) => (
               <div key={city} className="py-6 glass-panel border-white/5 rounded-2xl hover:border-brand-primary hover:scale-105 transition-all duration-500 cursor-default">
                 <span className="text-white font-playfair font-bold tracking-[0.2em] uppercase text-sm">{city}</span>
               </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
