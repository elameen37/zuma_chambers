'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Award, BookOpen, Clock, Linkedin, Mail, Search } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const AttorneyCard = ({ name, rank, specialization, years, wins, delay }: { name: string, rank: string, specialization: string, years: number, wins: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="glass-panel group flex flex-col h-full rounded-[2rem] overflow-hidden"
  >
    <div className="aspect-[4/5] bg-brand-primary/5 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent opacity-80" />
      <div className="absolute top-6 right-6 glass-panel !bg-brand-primary/10 border-brand-primary/20 px-4 py-1.5 rounded-full flex items-center gap-2">
        <Award className="w-3 h-3 text-brand-primary" />
        <span className="text-[10px] font-bold tracking-[0.1em] text-white uppercase font-inter">{rank}</span>
      </div>
      <Scale className="w-24 h-24 text-brand-primary/10 group-hover:scale-110 transition-transform duration-1000" />
    </div>
    
    <div className="p-8 flex-1 flex flex-col">
      <h3 className="text-2xl font-bold text-white font-playfair mb-1 group-hover:text-brand-primary transition-all">{name}</h3>
      <p className="text-brand-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6 font-inter">
        {specialization}
      </p>
      
      <div className="grid grid-cols-2 gap-6 mb-8 border-y border-white/5 py-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-inter font-bold uppercase tracking-widest">Years of Call</span>
          <span className="text-xl font-bold text-white font-playfair">{years}+</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-inter font-bold uppercase tracking-widest">Case Wins</span>
          <span className="text-xl font-bold text-white font-playfair">{wins}</span>
        </div>
      </div>
      
      <div className="mt-auto flex justify-between items-center">
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 glass-panel flex items-center justify-center rounded-xl text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all">
            <Linkedin size={16} />
          </a>
          <a href="#" className="w-10 h-10 glass-panel flex items-center justify-center rounded-xl text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all">
            <Mail size={16} />
          </a>
        </div>
        <button className="text-[11px] font-bold tracking-[0.2em] uppercase text-white hover:text-brand-primary transition-colors flex items-center gap-3">
          Profile <BookOpen size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function AttorneysPage() {
  const attorneys = [
    {
      name: "Chief Olumide Zuma",
      rank: "Senior Advocate (SAN)",
      specialization: "Constitutional & Enterprise Law",
      years: 30,
      wins: "98%",
    },
    {
      name: "Barr. Aisha Yakubu",
      rank: "Managing Partner",
      specialization: "Corporate M&A & Tech Law",
      years: 18,
      wins: "150+ Transactions",
    },
    {
      name: "Dr. Emeka Okafor",
      rank: "Lead Litigator",
      specialization: "High-Stakes Commercial Litigation",
      years: 22,
      wins: "450+ Judgments",
    },
    {
      name: "Sarah Adebayo",
      rank: "Senior Associate",
      specialization: "Property & Maritime Law",
      years: 12,
      wins: "85%",
    },
    {
      name: "Ahmed Ibrahim",
      rank: "Senior Associate",
      specialization: "Arbitration & ADR",
      years: 10,
      wins: "Certified FCIArb",
    },
    {
      name: "Chioma Nelson",
      rank: "Senior Associate",
      specialization: "Government & Regulatory",
      years: 15,
      wins: "Policy Architect",
    }
  ];

  return (
    <main className="min-h-screen bg-onyx selection:bg-brand-primary selection:text-onyx">
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-primary/5 blur-[120px] rounded-full" />
        <div className="section-responsive relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-brand-primary" />
                <h2 className="text-brand-primary text-[10px] font-bold tracking-[0.5em] uppercase font-inter">
                  Legal Command
                </h2>
              </div>
              <h1 className="heading-premium text-5xl md:text-7xl text-white mb-8">
                Meet the <span className="italic bg-luxury-gradient bg-clip-text text-transparent">Guardians</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed font-inter font-medium max-w-xl">
                Our team is composed of the finest legal minds in the country, dedicated to delivering precision, integrity, and absolute legal dominance.
              </p>
            </motion.div>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary w-4 h-4 group-focus-within:scale-110 transition-transform" />
              <input 
                type="text" 
                placeholder="Search by legal specialty..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-[13px] font-inter font-bold focus:border-brand-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 section-responsive">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {attorneys.map((attorney, index) => (
            <AttorneyCard 
              key={index}
              {...attorney}
              delay={0.1 * (index % 3)}
            />
          ))}
        </div>
      </section>

      {/* Availability check */}
      <section className="py-24 bg-slate-grey/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-brand-primary/5 blur-[100px] rounded-full" />
        <div className="section-responsive text-center relative z-10">
          <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-10">
            <Clock className="text-brand-primary w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase font-inter">Instant conflict check available</span>
          </div>
          <h2 className="heading-premium text-4xl md:text-6xl text-white mb-10">Expert Counsel, <span className="italic text-brand-primary">Always Ready</span></h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-inter font-medium mb-12 leading-relaxed">
            [COMPANY_NAME] maintains a rapid-response team for emergency legal interventions and time-sensitive corporate transactions.
          </p>
          <button className="btn-modern !py-5 !px-12 !text-[11px] mx-auto">
            Book Priority Access
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
