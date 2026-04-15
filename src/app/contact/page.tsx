'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, ShieldCheck, Globe } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ContactInfo = ({ icon: Icon, title, detail, subdetail }: { icon: React.ElementType, title: string, detail: string, subdetail?: string }) => (
  <div className="flex gap-6 items-start">
    <div className="w-12 h-12 rounded-lg bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0">
      <Icon className="w-6 h-6 text-gold-primary" />
    </div>
    <div>
      <h4 className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-1 font-inter">{title}</h4>
      <p className="text-white text-lg font-playfair font-bold">{detail}</p>
      {subdetail && <p className="text-gray-400 text-xs font-inter mt-1">{subdetail}</p>}
    </div>
  </div>
);

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-20 border-b border-gold-dark/10">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-gold-primary text-xs font-bold tracking-[0.4em] uppercase mb-6 font-inter underline underline-offset-8 decoration-gold-primary">
              Connect With Excellence
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 font-playfair">
              Consultation & <span className="gold-text italic">Booking</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-inter">
              Secure your legal representation. Our intake team is prepared to process your inquiry with absolute discretion and efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-10 md:p-14">
              <div className="flex items-center gap-3 mb-10 text-gold-primary">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-bold tracking-widest uppercase font-inter">Encrypted Conflict Check Intake</span>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 font-inter">Full Name / Entity Name</label>
                    <input type="text" className="w-full bg-accent-gray border border-gold-dark/20 rounded-md p-4 text-white text-sm font-inter focus:border-gold-primary outline-none transition-all" placeholder="John Doe / Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 font-inter">Email Address</label>
                    <input type="email" className="w-full bg-accent-gray border border-gold-dark/20 rounded-md p-4 text-white text-sm font-inter focus:border-gold-primary outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 font-inter">Legal Practice Area</label>
                  <select className="w-full bg-accent-gray border border-gold-dark/20 rounded-md p-4 text-white text-sm font-inter focus:border-gold-primary outline-none transition-all appearance-none cursor-pointer">
                    <option>Select Practice Area</option>
                    <option>Litigation</option>
                    <option>Corporate Law</option>
                    <option>Tech & IP</option>
                    <option>Property Law</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500 font-inter">Message / Case Overview</label>
                  <textarea rows={6} className="w-full bg-accent-gray border border-gold-dark/20 rounded-md p-4 text-white text-sm font-inter focus:border-gold-primary outline-none transition-all" placeholder="Provide a brief summary of your legal requirements..."></textarea>
                </div>

                <button type="submit" className="btn-luxury w-full py-5 flex items-center justify-center gap-3">
                  Initiate Secure Booking <Send size={18} />
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
            className="space-y-16"
          >
            <div>
              <h3 className="text-3xl font-bold mb-10 font-playfair text-white">Direct <span className="gold-text">Chamber Channels</span></h3>
              <div className="space-y-8">
                <ContactInfo 
                  icon={Mail} 
                  title="Official Email" 
                  detail="intake@zumachambers.law" 
                  subdetail="Monitored 24/7 for urgent legal matters"
                />
                <ContactInfo 
                  icon={Phone} 
                  title="Global Head Office" 
                  detail="+234 (0) 800 ZUMA LAW" 
                  subdetail="Extensions available for all senior partners"
                />
                <ContactInfo 
                  icon={MapPin} 
                  title="Main Address" 
                  detail="Zuma Crescent, Central Area, Abuja" 
                  subdetail="Nigeria's premier legal district"
                />
                <ContactInfo 
                  icon={MessageCircle} 
                  title="WhatsApp Connect" 
                  detail="+234 901 234 5678" 
                  subdetail="Secure messaging for initial triage"
                />
              </div>
            </div>

            <div className="glass-card p-10 bg-[#020202]">
              <h4 className="text-white font-playfair font-bold text-xl mb-6 flex items-center gap-3">
                <Clock className="text-gold-primary" /> Active Hours
              </h4>
              <div className="space-y-4 text-sm font-inter">
                <div className="flex justify-between border-b border-gray-900 pb-2">
                  <span className="text-gray-500">Monday — Friday</span>
                  <span className="text-white">08:00 — 18:00 (WAT)</span>
                </div>
                <div className="flex justify-between border-b border-gray-900 pb-2">
                  <span className="text-gray-500">Saturday</span>
                  <span className="text-white">10:00 — 14:00 (WAT)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Emergency Support</span>
                  <span className="text-gold-primary font-bold">Available 24/7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-32 bg-[#020202]">
        <div className="section-container text-center">
          <Globe className="w-16 h-16 text-gold-primary mx-auto mb-10 opacity-50" />
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-gold-primary mb-6 font-inter">International Desk</h2>
          <h3 className="text-4xl font-bold font-playfair mb-10">Coordinating <span className="gold-text italic">Global Integrity</span></h3>
          <p className="text-gray-400 max-w-2xl mx-auto font-inter text-sm mb-16 leading-relaxed">
            Zuma Chambers maintains strategic partnerships in London, New York, and Dubai to facilitate cross-border legal operations and multi-jurisdictional compliance.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Abuja', 'Lagos', 'London', 'New York'].map((city) => (
               <div key={city} className="py-4 border border-gold-dark/10 rounded-lg hover:border-gold-primary transition-all cursor-default">
                 <span className="text-white font-playfair font-bold tracking-widest">{city}</span>
               </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
