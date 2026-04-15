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
    className="glass-card flex flex-col group cursor-pointer"
  >
    <div className="aspect-video bg-gold-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <span className="text-[10px] font-bold tracking-widest uppercase bg-gold-primary text-black px-3 py-1 rounded-sm">
          {category}
        </span>
      </div>
       <Newspaper className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-gold-primary/10 group-hover:scale-125 transition-transform duration-700" />
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex items-center gap-3 text-gray-500 text-[10px] uppercase tracking-widest mb-4 font-inter">
        <Calendar size={12} className="text-gold-primary" /> {date}
      </div>
      <h3 className="text-xl font-bold text-white font-playfair mb-4 group-hover:gold-text transition-all leading-snug">
        {title}
      </h3>
      <p className="text-gray-400 text-sm font-inter leading-relaxed mb-8 flex-1">
        {excerpt}
      </p>
      <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold-primary group-hover:gap-4 transition-all">
        Read Full Article <ArrowRight size={14} />
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
      excerpt: "Detailed breakdown of the National Information Technology Development Agency&apos;s latest directive."
    },
    {
      title: "Family Office Structuring in an Evolving Economic Climate",
      category: "Policy Updates",
      date: "February 5, 2026",
      excerpt: "Best practices for asset protection and succession planning for high-net-worth Nigerian families."
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 relative border-b border-gold-dark/10">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-gold-primary text-xs font-bold tracking-[0.4em] uppercase mb-6 font-inter underline underline-offset-8 decoration-gold-primary">
                Legal Intelligence
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 font-playfair">
                Insights & <span className="gold-text italic">Perspectives</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed font-inter">
                Depth of thought meets legal precision. Explore our analysis of the evolving Nigerian legal landscape and global regulatory trends.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="glass-card p-1 bg-gold-gradient rounded-xl"
            >
              <div className="bg-background rounded-lg p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <BookMarked className="text-gold-primary/20 w-16 h-16" />
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-gold-primary mb-4 block font-inter">Featured Insight</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-playfair mb-6 leading-tight">
                  Navigating the Pre-Action Protocol in High-Stakes Commercial Disputes
                </h3>
                <p className="text-gray-400 text-sm mb-8 font-inter">
                  An essential guide for corporate legal departments on minimizing litigation risk through effective engagement strategies.
                </p>
                <button className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-gold-primary group">
                  Read Article <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="py-12 border-b border-gold-dark/10 sticky top-20 z-40 bg-background/80 backdrop-blur-md">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase font-inter transition-all ${
                  activeTab === tab 
                    ? 'bg-gold-primary text-black' 
                    : 'border border-gold-dark/20 text-gray-500 hover:border-gold-primary hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full bg-accent-gray border border-gold-dark/20 rounded-md py-3 pl-12 pr-4 text-white text-xs font-inter focus:border-gold-primary outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-24 section-container">
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
      <section className="py-32 bg-[#020202]">
        <div className="section-container text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 font-playfair">Stay Ahead of the <span className="gold-text">Curve</span></h2>
            <p className="text-gray-400 font-inter mb-10 text-sm">
              Receive monthly executive summaries of Nigerian legal breakthroughs directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-accent-gray border border-gold-dark/20 rounded-md px-6 py-4 text-white text-sm font-inter focus:border-gold-primary outline-none"
              />
              <button className="btn-luxury px-10">
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
