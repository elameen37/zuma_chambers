'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Award, Users, ChevronRight } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ValueCard = ({ icon: Icon, title, description, delay }: { icon: React.ElementType, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="glass-panel p-10 border-l-4 border-l-brand-primary rounded-3xl"
  >
    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-8">
      <Icon className="w-7 h-7 text-brand-primary" />
    </div>
    <h3 className="text-xl font-bold mb-4 text-white font-playfair">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-inter font-medium">
      {description}
    </p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-onyx selection:bg-brand-primary selection:text-onyx">
      <Navbar />

      {/* Header Section */}
      <section className="pt-52 pb-32 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        
        <div className="section-responsive relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-brand-primary" />
              <h2 className="text-brand-primary text-[10px] font-bold tracking-[0.5em] uppercase font-inter">
                Legacy of Excellence
              </h2>
              <div className="w-12 h-[1px] bg-brand-primary" />
            </div>
            
            <h1 className="heading-premium text-6xl md:text-8xl font-bold mb-10 text-white leading-tight">
              About <span className="italic bg-luxury-gradient bg-clip-text text-transparent">Zuma Chambers</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-inter font-medium max-w-3xl mx-auto">
              A premier Nigerian law firm dedicated to providing sophisticated legal solutions through a combination of traditional wisdom and modern innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History & Culture */}
      <section className="py-40 relative">
        <div className="section-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-primary mb-8 font-inter">
                Our Journey
              </h3>
              <h2 className="heading-premium text-5xl md:text-6xl text-white mb-10 leading-tight">
                Founded on <span className="italic text-brand-primary">Integrity</span> & Legal Mastery
              </h2>
              <div className="space-y-8 text-gray-400 font-inter font-medium leading-relaxed text-lg">
                <p>
                  Established in 1999, Zuma Chambers emerged with a clear vision: to redefine legal practice in Nigeria. What began as a boutique litigation firm has evolved into a full-service enterprise legal powerhouse, advising multi-national corporations, government entities, and private clients.
                </p>
                <p>
                  Our culture is rooted in the &quot;Zuma Philosophy&quot;&mdash;a belief that strength comes from meticulous preparation and justice is driven by relentless advocacy.
                </p>
              </div>
              
              <div className="mt-14 flex flex-wrap gap-16">
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-bold text-white font-playfair bg-luxury-gradient bg-clip-text text-transparent">1999</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-inter">Inception</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-bold text-white font-playfair bg-luxury-gradient bg-clip-text text-transparent">150+</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-inter">Staff</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-bold text-white font-playfair bg-luxury-gradient bg-clip-text text-transparent">5</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 font-inter">Global Offices</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] glass-panel rounded-[3rem] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/5 shimmer" />
                <Shield className="w-48 h-48 text-brand-primary/10" />
                <div className="absolute bottom-10 left-10 right-10 p-10 glass-panel rounded-3xl border-brand-primary/20">
                  <p className="text-sm text-brand-primary italic font-inter font-bold leading-relaxed">
                    &quot;Justice is not just a destination, but the path we walk every day.&quot;
                  </p>
                  <p className="text-[10px] text-gray-500 mt-4 tracking-[0.2em] uppercase font-bold">
                    — Senior Partner, Zuma Chambers
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-40 bg-slate-grey/30 border-y border-white/5">
        <div className="section-responsive">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="heading-premium text-5xl md:text-6xl text-white mb-8">The Core of Our <span className="italic text-brand-primary">Identity</span></h2>
            <p className="text-gray-500 text-lg font-inter font-medium leading-relaxed">
              We operate at the intersection of traditional legal ethics and 21st-century technological innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <ValueCard 
              icon={Target}
              title="Strategic Vision"
              description="We look beyond immediate legal hurdles to identify long-term opportunities and risks for our clients."
              delay={0.1}
            />
            <ValueCard 
              icon={Award}
              title="Legal Excellence"
              description="Our attorneys are recognized leaders in their fields, contributing significantly to Nigerian legal reforms."
              delay={0.2}
            />
            <ValueCard 
              icon={Users}
              title="Client Collaboration"
              description="We treat every engagement as a partnership, ensuring deep alignment with client business objectives."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-40 section-responsive text-center">
        <h2 className="heading-premium text-4xl md:text-6xl text-white mb-12">Ready to meet our <span className="italic bg-luxury-gradient bg-clip-text text-transparent">Legal Specialists</span>?</h2>
        <button className="btn-modern !py-6 !px-16 !text-[12px] mx-auto">
          View Attorney Profiles <ChevronRight size={20} />
        </button>
      </section>

      <Footer />
    </main>
  );
}
