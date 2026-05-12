'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Scale, Shield, Briefcase, ArrowRight } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: React.ElementType, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="glass-panel p-8 group rounded-3xl"
  >
    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
      <Icon className="w-7 h-7 text-brand-primary" />
    </div>
    <h3 className="text-xl font-bold mb-4 text-white font-playfair">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-inter mb-8">
      {description}
    </p>
    <button className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary hover:text-brand-secondary transition-colors">
      Explore Details <ArrowRight size={14} />
    </button>
  </motion.div>
);

const StatItem = ({ label, value, prefix = "", suffix = "" }: { label: string, value: string, prefix?: string, suffix?: string }) => {
  const numericValue = parseInt(value.replace(/,/g, ''), 10);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const animateCount = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutQuart)
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(numericValue * easeProgress));

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setCount(numericValue);
        }
      };

      requestAnimationFrame(animateCount);
    }
  }, [isInView, numericValue]);

  const formattedCount = count.toLocaleString();

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair bg-luxury-gradient bg-clip-text text-transparent mb-3">
        {prefix}{formattedCount}{suffix}
      </div>
      <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-gray-500 font-inter">
        {label}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-onyx selection:bg-brand-primary selection:text-onyx">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Modern Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ 
              backgroundImage: "url('/hero-bg.png')",
              filter: "brightness(0.4) contrast(1.2)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/50 via-onyx/80 to-onyx" />
          <div className="absolute inset-0 bg-dark-gradient opacity-80" />
        </div>
        
        <div className="section-responsive relative z-10 w-full pt-28 pb-16">
          <div className="max-w-5xl mt-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-brand-primary" />
                <h2 className="text-brand-primary text-[10px] font-bold tracking-[0.5em] uppercase font-inter">
                  The Future of Legal Excellence
                </h2>
              </div>
              
              <h1 className="heading-premium text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-[0.95]">
                Rooted in <span className="text-brand-primary italic">Strength</span>.<br />
                Driven by <span className="bg-luxury-gradient bg-clip-text text-transparent italic">Justice</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed font-inter font-medium">
                Zuma Chambers provides premier legal counsel and sophisticated operational solutions for high-stakes litigation, corporate complexities, and global regulatory compliance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/login" className="btn-modern !py-4 !px-10 !text-[11px] inline-flex items-center justify-center">
                  Secure a Consultation
                </Link>
                <button className="btn-modern-outline !py-4 !px-10 !text-[11px]">
                  Our Practice Areas <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-16 bg-gradient-to-b from-brand-primary to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-slate-grey/30">
        <div className="section-responsive">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <StatItem label="Years of Excellence" value="25" suffix="+" />
            <StatItem label="Successful Cases" value="1,200" suffix="+" />
            <StatItem label="Senior Advocates" value="12" />
            <StatItem label="Global Partners" value="45" suffix="+" />
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-24 relative">
        <div className="section-responsive">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-primary mb-4 font-inter">
                Areas of Expertise
              </h2>
              <h3 className="heading-premium text-4xl md:text-5xl text-white">
                Specialized Solutions for <span className="italic bg-luxury-gradient bg-clip-text text-transparent">Modern Challenges</span>
              </h3>
            </div>
            <button className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-primary hover:text-white transition-all flex items-center gap-4 group">
              View All Areas <div className="w-12 h-[1px] bg-brand-primary group-hover:w-20 transition-all duration-500" />
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
      <section className="py-24 section-responsive">
        <div className="glass-panel p-12 md:p-20 text-center relative overflow-hidden group rounded-[2.5rem]">
          <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10">
            <h2 className="heading-premium text-3xl md:text-5xl mb-8 max-w-3xl mx-auto">
              Ready to Secure Your <span className="bg-luxury-gradient bg-clip-text text-transparent italic">Legal Future</span>?
            </h2>
            <p className="text-base text-gray-400 mb-12 max-w-xl mx-auto font-inter font-medium leading-relaxed">
              Experience the pinnacle of legal operations. Join Zuma Chambers and transform how your organization handles legal complexity.
            </p>
            <Link href="/login" className="btn-modern !py-5 !px-12 !text-[11px] inline-flex items-center justify-center mx-auto w-fit">
              Secure Your Consultation
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
