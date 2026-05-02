import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Plus, Search, Calendar, User, ArrowRight } from 'lucide-react';
import { useResearchStore, LegalMemo } from '@/lib/research-service';

export default function MemoStorage() {
  const { memos } = useResearchStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMemos = memos.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white font-playfair">Internal Legal Memos</h3>
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-primary/60" />
          <input 
            type="text"
            placeholder="Search memos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-gold-dark/10 rounded-lg py-2 pl-10 pr-4 text-[11px] text-white outline-none focus:border-gold-primary/40 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMemos.map((memo, i) => (
          <motion.div
            key={memo.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-gold-primary/30 transition-all"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-primary/10 rounded text-gold-primary">
                  <FileText size={18} />
                </div>
                <h4 className="text-lg font-bold text-white font-playfair group-hover:text-gold-primary transition-colors">{memo.title}</h4>
              </div>
              <p className="text-gray-400 text-xs font-inter line-clamp-1">{memo.summary}</p>
              <div className="flex gap-4 text-[10px] text-gray-500 font-inter font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1"><User size={12} /> {memo.author}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {memo.date}</span>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-primary hover:text-white transition-all group/btn">
              View Memo <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
