'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Shield, Briefcase, ArrowRight } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: React.ElementType, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="glass-card p-8 group"
  >
    <div className="w-14 h-14 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
      <Icon className="w-7 h-7 text-gold-primary" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white font-playfair">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-inter mb-6">
      {description}
    </p>
    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-primary hover:text-gold-light transition-colors">
      Learn More <ArrowRight size={14} />
    </button>
  </motion.div>
);

const StatItem = ({ label, value, prefix = "", suffix = "" }: { label: string, value: string, prefix?: string, suffix?: string }) => (
  <div className="flex flex-col items-center">
    <div className="text-4xl md:text-5xl font-bold font-playfair gold-text mb-2">
      {prefix}{value}{suffix}
    </div>
    <div className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-gray-500 font-inter">
      {label}
    </div>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Professional Background Image with Sophisticated Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ 
              backgroundImage: "url('/hero-bg.png')",
              filter: "brightness(0.7) contrast(1.1)"
            }}
          />
          {/* Multi-layered gradient for depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        
        <div className="section-container relative z-10 w-full pt-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-gold-primary text-xs font-bold tracking-[0.4em] uppercase mb-6 font-inter border-l-2 border-gold-primary pl-4">
                Elite Legal Excellence
              </h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 font-playfair leading-[1.1]">
                Rooted in <span className="gold-text italic">Strength</span>.<br />
                Driven by <span className="gold-text italic">Justice</span>.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-inter">
                Zuma Chambers provides premier legal counsel and sophisticated operational solutions for high-stakes litigation, corporate complexitites, and global regulatory compliance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="btn-luxury px-10 py-5">
                  Book a Consultation
                </button>
                <button className="btn-outline px-10 py-5 flex items-center justify-center gap-3">
                  Our Practice Areas <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Stats or Scroll Indicator placeholder */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold-primary to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-gold-dark/10 bg-[#020202]">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <StatItem label="Years of Excellence" value="25" suffix="+" />
            <StatItem label="Successful Cases" value="1,200" suffix="+" />
            <StatItem label="Senior Advocates" value="12" />
            <StatItem label="Global Partners" value="45" suffix="+" />
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-32 relative">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-primary mb-4 font-inter">
                Areas of Expertise
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white font-playfair">
                Specialized Legal Solutions for <span className="gold-text italic">Modern Challenges</span>
              </h3>
            </div>
            <button className="text-sm font-bold tracking-widest uppercase text-gold-primary hover:text-gold-light transition-all flex items-center gap-3 group">
              View All Areas <div className="w-10 h-[1px] bg-gold-primary group-hover:w-16 transition-all" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Scale} 
              title="Litigation & Dispute" 
              description="Navigating complex courtroom battles with strategic precision and unwavering advocacy for our clients."
              delay={0.1}
            />
            <FeatureCard 
              icon={Briefcase} 
              title="Corporate & Commercial" 
              description="Structuring high-value transactions and providing robust governance frameworks for enterprise growth."
              delay={0.2}
            />
            <FeatureCard 
              icon={Shield} 
              title="Tech & Compliance" 
              description="Safeguarding digital assets and ensuring multi-jurisdictional regulatory alignment for global tech firms."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-32 section-container">
        <div className="glass-card p-12 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gold-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-playfair max-w-2xl mx-auto">
              Ready to Secure Your <span className="gold-text">Legal Future</span>?
            </h2>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto font-inter">
              Experience the pinnacle of legal operations. Join Zuma Chambers and transform how your organization handles legal complexity.
            </p>
            <button className="btn-luxury px-12 py-5">
              Secure Consultation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
