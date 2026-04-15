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
    className="glass-card group flex flex-col h-full"
  >
    <div className="aspect-[4/5] bg-gold-primary/5 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
      <div className="absolute top-4 right-4 bg-gold-primary/10 border border-gold-primary/30 px-3 py-1 rounded-full flex items-center gap-2">
        <Award className="w-3 h-3 text-gold-primary" />
        <span className="text-[10px] font-bold tracking-[0.1em] text-white uppercase font-inter">{rank}</span>
      </div>
      <Scale className="w-24 h-24 text-gold-primary/10 group-hover:scale-110 transition-transform duration-700" />
    </div>
    
    <div className="p-8 flex-1 flex flex-col">
      <h3 className="text-2xl font-bold text-white font-playfair mb-1 group-hover:gold-text transition-all">{name}</h3>
      <p className="text-gold-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-4 font-inter">
        {specialization}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6 border-y border-gold-dark/10 py-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-inter uppercase">Years of Call</span>
          <span className="text-lg font-bold text-white font-playfair">{years}+</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-inter uppercase">Case Wins</span>
          <span className="text-lg font-bold text-white font-playfair">{wins}</span>
        </div>
      </div>
      
      <div className="mt-auto flex justify-between items-center">
        <div className="flex gap-4">
          <a href="#" className="p-2 border border-gray-800 rounded-md hover:border-gold-primary hover:text-gold-primary transition-all">
            <Linkedin size={14} />
          </a>
          <a href="#" className="p-2 border border-gray-800 rounded-md hover:border-gold-primary hover:text-gold-primary transition-all">
            <Mail size={14} />
          </a>
        </div>
        <button className="text-[10px] font-bold tracking-widest uppercase text-white hover:text-gold-primary transition-colors flex items-center gap-2">
          View Profile <BookOpen size={12} />
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
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-20 border-b border-gold-dark/10">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h2 className="text-gold-primary text-xs font-bold tracking-[0.4em] uppercase mb-6 font-inter">
                Legal Command
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 font-playfair">
                Meet the <span className="gold-text italic">Guardians</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed font-inter">
                Our team is composed of the finest legal minds in the country, dedicated to delivering precision, integrity, and absolute legal dominance.
              </p>
            </motion.div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by specialty..." 
                className="w-full bg-accent-gray border border-gold-dark/20 rounded-md py-4 pl-12 pr-4 text-white text-xs font-inter focus:border-gold-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 section-container">
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
      <section className="py-32 bg-[#020202]">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-gold-primary/20 mb-8">
            <Clock className="text-gold-primary w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest text-gold-primary uppercase font-inter">Instant conflict check available via dashboard</span>
          </div>
          <h2 className="text-4xl font-bold mb-8 font-playfair">Expert Counsel, <span className="gold-text">Always Ready</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto font-inter mb-12">
            Zuma Chambers maintains a rapid-response team for emergency legal interventions and time-sensitive corporate transactions.
          </p>
          <button className="btn-luxury px-12 py-5">
            Book Priority Access
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
