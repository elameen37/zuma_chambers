'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Briefcase, Home, ShieldAlert, Users2, Landmark, ShieldCheck, LandmarkIcon, Cpu, BookOpen, ChevronRight } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PracticeCard = ({ icon: Icon, title, description, delay }: { icon: React.ElementType, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="glass-panel p-10 group cursor-pointer hover:border-brand-primary transition-all duration-500 rounded-3xl"
  >
    <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center mb-8 group-hover:bg-brand-primary/20 transition-all duration-500">
      <Icon className="w-8 h-8 text-brand-primary" />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white font-playfair group-hover:text-brand-primary transition-all">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-inter font-medium mb-8">
      {description}
    </p>
    <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary group-hover:gap-4 transition-all">
      Full Detail <ChevronRight size={14} />
    </div>
  </motion.div>
);

export default function PracticeAreasPage() {
  const practices = [
    {
      icon: Gavel,
      title: "Litigation",
      description: "Aggressive and strategic representation in all tiers of Nigerian courts, handling complex commercial disputes and civil actions."
    },
    {
      icon: Briefcase,
      title: "Corporate Law",
      description: "Advising on mergers, acquisitions, venture capital, and day-to-day corporate governance for multi-national enterprises."
    },
    {
      icon: Home,
      title: "Property Law",
      description: "Sophisticated real estate transactions, documentation, and dispute resolution for high-value Nigerian property portfolios."
    },
    {
      icon: ShieldAlert,
      title: "Criminal Defense",
      description: "White-collar crime defense and protection of constitutional rights for high-profile individuals and organizations."
    },
    {
      icon: Users2,
      title: "Family Law",
      description: "Discreet and professional handling of matrimonial causes, succession planning, and estate administration."
    },
    {
      icon: Landmark,
      title: "Arbitration",
      description: "Alternative dispute resolution services led by certified arbitrators to ensure efficient and private legal outcomes."
    },
    {
      icon: ShieldCheck,
      title: "Compliance",
      description: "Ensuring your enterprise meets all regulatory requirements including AML, KYC, and sector-specific Nigerian mandates."
    },
    {
      icon: LandmarkIcon,
      title: "Gov Advisory",
      description: "Bridging the gap between the private sector and government entities with policy analysis and regulatory advocacy."
    },
    {
      icon: Cpu,
      title: "Tech & IP Law",
      description: "Safeguarding innovations and navigating the legal complexities of fintech, cybersecurity, and intellectual property."
    }
  ];

  return (
    <main className="min-h-screen bg-onyx selection:bg-brand-primary selection:text-onyx">
      <Navbar />

      {/* Header */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-[120px] -z-10" />
        <div className="section-responsive relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-brand-primary" />
              <h2 className="text-brand-primary text-[10px] font-bold tracking-[0.5em] uppercase font-inter">
                Our Expertise
              </h2>
            </div>
            <h1 className="heading-premium text-5xl md:text-7xl font-bold mb-8 text-white">
              Practice <span className="italic bg-luxury-gradient bg-clip-text text-transparent">Specializations</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-inter font-medium max-w-2xl">
              We provide a comprehensive suite of legal services tailored to the unique complexities of the Nigerian and global markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 section-responsive">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practices.map((practice, index) => (
            <PracticeCard 
              key={index}
              icon={practice.icon}
              title={practice.title}
              description={practice.description}
              delay={0.1 * (index % 3)}
            />
          ))}
        </div>
      </section>

      {/* Expertise Statement */}
      <section className="py-24 bg-slate-grey/30 border-y border-white/5">
        <div className="section-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-10">
              <BookOpen className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="heading-premium text-3xl md:text-5xl text-white mb-8">Bespoke Legal Strategy</h2>
            <p className="text-gray-400 text-lg font-inter font-medium leading-relaxed mb-12">
              Don&apos;t see your specific legal need? Our interdisciplinary approach allows us to assemble custom legal teams for unique challenges.
            </p>
            <button className="btn-modern !py-5 !px-12 !text-[11px] mx-auto">
              Request Custom Consultation
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
