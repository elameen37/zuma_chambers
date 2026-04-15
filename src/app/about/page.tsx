'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Award, Users, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ValueCard = ({ icon: Icon, title, description, delay }: { icon: React.ElementType, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="glass-card p-10 border-l-4 border-l-gold-primary"
  >
    <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-gold-primary" />
    </div>
    <h3 className="text-xl font-bold mb-4 text-white font-playfair">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-inter">
      {description}
    </p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="pt-40 pb-20 border-b border-gold-dark/10">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-gold-primary text-xs font-bold tracking-[0.4em] uppercase mb-6 font-inter">
              Legacy of Excellence
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 font-playfair">
              About <span className="gold-text italic">Zuma Chambers</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-inter">
              A premier Nigerian law firm dedicated to providing sophisticated legal solutions through a combination of traditional wisdom and modern innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History & Culture */}
      <section className="py-32 section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-primary mb-6 font-inter underline underline-offset-8 decoration-gold-primary">
              Our Journey
            </h3>
            <h2 className="text-4xl font-bold mb-8 font-playfair leading-tight">
              Founded on the Principles of <span className="gold-text">Unyielding Integrity</span> and Legal Mastery
            </h2>
            <div className="space-y-6 text-gray-400 font-inter leading-relaxed">
              <p>
                Established in 1999, Zuma Chambers emerged with a clear vision: to redefine legal practice in Nigeria. What began as a boutique litigation firm has evolved into a full-service enterprise legal powerhouse, advising multi-national corporations, government entities, and private clients.
              </p>
              <p>
                Our culture is rooted in the "Zuma Philosophy"—a belief that strength comes from meticulous preparation and justice is driven by relentless advocacy. Every case we handle is treated as a landmark, every client as a partner in progress.
              </p>
            </div>
            <div className="mt-10 flex gap-12">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white font-playfair">1999</span>
                <span className="text-[10px] uppercase tracking-widest text-gold-primary font-inter">Inception</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white font-playfair">150+</span>
                <span className="text-[10px] uppercase tracking-widest text-gold-primary font-inter">Staff</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white font-playfair">5</span>
                <span className="text-[10px] uppercase tracking-widest text-gold-primary font-inter">Global Offices</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
             {/* Abstract legal imagery placeholder or decorative element */}
            <div className="aspect-[4/5] glass-card flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gold-primary/5 shimmer" />
               <Shield className="w-40 h-40 text-gold-primary/20" />
               <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/80 backdrop-blur-md border border-gold-primary/30 rounded-lg">
                 <p className="text-xs text-gold-primary italic font-inter leading-relaxed">
                   "Justice is not just a destination, but the path we walk every day."
                 </p>
                 <p className="text-[10px] text-gray-500 mt-2 tracking-widest uppercase font-bold">
                   — Senior Partner, Zuma Chambers
                 </p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 bg-[#020202]">
        <div className="section-container">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-playfair">The Core of Our <span className="gold-text">Identity</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-inter">
              We operate at the intersection of traditional legal ethics and 21st-century technological innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-32 section-container text-center">
        <h2 className="text-3xl font-bold mb-8 font-playfair">Ready to meet our <span className="gold-text">Legal Specialists</span>?</h2>
        <button className="btn-luxury px-12 py-5 flex items-center justify-center gap-3 mx-auto">
          View Attorney Profiles <ChevronRight size={18} />
        </button>
      </section>

      <Footer />
    </main>
  );
}
