'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, Search, Filter, 
  ChevronRight, ArrowUpRight, Zap, BookOpen,
  Gavel, ScrollText, Scale
} from 'lucide-react';
import { useDocumentStore, TemplateCategory } from '@/lib/document-service';

export default function DraftingLibrary() {
  const templates = useDocumentStore((state) => state.templates);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredTemplates = templates.filter(t => 
    (selectedCategory === 'All' || t.category === selectedCategory) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  );

  const categories: (TemplateCategory | 'All')[] = ['All', 'Pleadings', 'Motions', 'Contracts', 'Opinions', 'Affidavits'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white font-playfair flex items-center gap-3">
            <Zap className="text-gold-primary" size={24} /> Drafting Intelligence
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Automated Legal Document Templates & Generation</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-gold-dark/20 rounded-lg py-2 pl-12 pr-4 text-xs text-white focus:border-gold-primary outline-none transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
              selectedCategory === cat ? 'bg-gold-primary text-black border-gold-primary' : 'text-gray-500 border-gold-dark/20 hover:border-gold-primary/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-6 group hover:border-gold-primary/30 transition-all flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gold-primary/10 rounded-lg border border-gold-primary/20 text-gold-primary">
                  {template.category === 'Contracts' ? <ScrollText size={18} /> : 
                   template.category === 'Motions' ? <Gavel size={18} /> : 
                   template.category === 'Pleadings' ? <Scale size={18} /> : <FileText size={18} />}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gold-primary/40 px-2 py-0.5 rounded border border-gold-primary/10">
                  {template.category}
                </span>
              </div>
              <h4 className="text-white font-playfair font-bold text-lg mb-2 group-hover:text-gold-primary transition-colors line-clamp-1">{template.title}</h4>
              <p className="text-[10px] text-gray-500 font-inter line-clamp-2 leading-relaxed">{template.description}</p>
            </div>
            
            <button className="w-full mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gold-primary border-t border-gold-dark/10 pt-4 hover:gap-2 transition-all">
              Launch Generator <ArrowUpRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
