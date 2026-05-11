'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Calendar, ArrowRight, Newspaper, Search } from '@/components/shared/Icons';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ArticleCard = ({ title, category, date, excerpt, delay }: { title: string, category: string, date: string, excerpt: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="glass-panel flex flex-col group cursor-pointer rounded-[2rem] overflow-hidden"
  >
    <div className="aspect-video bg-brand-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 to-transparent" />
      <div className="absolute bottom-6 left-6 flex gap-2">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-brand-primary text-onyx px-4 py-1.5 rounded-full">
          {category}
        </span>
      </div>
      <Newspaper className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-brand-primary/10 group-hover:scale-125 transition-transform duration-1000" />
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex items-center gap-3 text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-4 font-inter font-bold">
        <Calendar size={14} className="text-brand-primary" /> {date}
      </div>
      <h3 className="text-xl font-bold text-white font-playfair mb-6 group-hover:text-brand-primary transition-all leading-snug">
        {title}
      </h3>
      <p className="text-gray-400 text-sm font-inter font-medium leading-relaxed mb-8 flex-1">
        {excerpt}
      </p>
      <button className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-brand-primary group-hover:gap-4 transition-all">
        Full Analysis <ArrowRight size={14} />
      </button>
    </div>
  </motion.div>
);

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Nigerian Reforms', 'Policy Updates', 'Case Reviews', 'Newsletters'];

  const articles = [
    {
      title: "The Impact of Artificial Intelligence on Nigerian Intellectual Property Law",
      category: "Nigerian Reforms",
      date: "April 10, 2026",
      excerpt: "Exploring the regulatory gaps and opportunities as generative AI begins to reshape the landscape of creative ownership in Nigeria."
    },
    {
      title: "Analyzing the 2026 Petroleum Industry Act Amendments",
      category: "Policy Updates",
      date: "March 28, 2026",
      excerpt: "Key takeaways for multi-national energy firms operating within the Niger Delta and new tax incentive frameworks."
    },
    {
      title: "Supreme Court Ruling on Digital Currency Enforcement",
      category: "Case Reviews",
      date: "March 15, 2026",
      excerpt: "A landmark judgment regarding jurisdictional challenges in decentralized finance litigation."
    },
    {
      title: "Zuma Chambers Quarterly Legal Excellence Newsletter",
      category: "Newsletters",
      date: "March 1, 2026",
      excerpt: "Inside our recent successful interventions and a look ahead at the Nigerian constitutional reform movement."
    },
    {
      title: "Cybersecurity Compliance: New Mandates for Fintech Labs",
      category: "Nigerian Reforms",
      date: "February 20, 2026",
      excerpt: "Detailed breakdown of the National Information Technology Development Agency's latest directive."
    },
    {
      title: "Family Office Structuring in an Evolving Economic Climate",
      category: "Policy Updates",
      date: "February 5, 2026",
      excerpt: "Best practices for asset protection and succession planning for high-net-worth Nigerian families."
    }
  ];

  return (
    <main className="min-h-screen bg-onyx selection:bg-brand-primary selection:text-onyx">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 blur-[120px] rounded-full" />
        <div className="section-responsive relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-brand-primary" />
                <h2 className="text-brand-primary text-[10px] font-bold tracking-[0.5em] uppercase font-inter">
                  Legal Intelligence
                </h2>
              </div>
              <h1 className="heading-premium text-5xl md:text-7xl text-white mb-8">
                Insights & <span className="italic bg-luxury-gradient bg-clip-text text-transparent">Perspectives</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed font-inter font-medium max-w-xl">
                Depth of thought meets legal precision. Explore our analysis of the evolving Nigerian legal landscape and global regulatory trends.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="glass-panel p-10 relative overflow-hidden rounded-[2.5rem]"
            >
              <div className="absolute top-0 right-0 p-8">
                <BookMarked className="text-brand-primary/10 w-24 h-24" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-primary mb-6 block font-inter">Featured Insight</span>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-playfair mb-8 leading-tight">
                Navigating the Pre-Action Protocol in High-Stakes Commercial Disputes
              </h3>
              <p className="text-gray-400 text-sm mb-10 font-inter font-medium leading-relaxed">
                An essential guide for corporate legal departments on minimizing litigation risk through effective engagement strategies.
              </p>
              <button className="flex items-center gap-4 text-[11px] font-bold tracking-[0.2em] uppercase text-brand-primary group">
                Read Full Article <ArrowRight size={14} className="group-hover:translate-x-3 transition-transform duration-500" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-8 border-b border-white/5 sticky top-20 z-40 bg-onyx/80 backdrop-blur-xl">
        <div className="section-responsive flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex gap-4 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-8 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase font-inter transition-all ${
                  activeTab === tab 
                    ? 'bg-brand-primary text-onyx' 
                    : 'glass-panel border-white/10 text-gray-500 hover:border-brand-primary hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary w-4 h-4 group-focus-within:scale-110 transition-transform" />
            <input 
              type="text" 
              placeholder="Search intelligence..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-[13px] font-inter font-bold focus:border-brand-primary outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-20 section-responsive">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <ArticleCard 
              key={index}
              {...article}
              delay={0.1 * (index % 3)}
            />
          ))}
        </div>
      </section>

      {/* Subscription */}
      <section className="py-24 bg-slate-grey/30 border-y border-white/5">
        <div className="section-responsive text-center">
          <div className="max-w-2xl mx-auto glass-panel p-12 md:p-20 rounded-[3rem]">
            <h2 className="heading-premium text-3xl md:text-5xl text-white mb-8">Stay Ahead of the <span className="italic text-brand-primary">Curve</span></h2>
            <p className="text-gray-400 font-inter font-medium mb-12 text-lg leading-relaxed">
              Receive monthly executive summaries of Nigerian legal breakthroughs directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Executive email address" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white text-[13px] font-inter font-bold focus:border-brand-primary outline-none transition-all"
              />
              <button className="btn-modern !px-12 !py-5">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
