'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, ShieldCheck, ShieldAlert, Clock, 
  Download, Eye, Filter, Plus, Database, Lock
} from 'lucide-react';
import { Evidence } from '@/lib/matter-service';

export default function EvidenceTracker({ evidence }: { evidence: Evidence[] }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white font-playfair flex items-center gap-3">
            <Database className="text-gold-primary" size={20} /> Exhibit Repository
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Classified Case Evidence & Discovery</p>
        </div>
        <button className="btn-luxury py-2 px-4 text-[10px] flex items-center gap-2">
          <Plus size={14} /> Log Exhibit
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidence.length === 0 ? (
          <div className="col-span-2 glass-card p-12 border-dashed border-gold-dark/20 flex flex-col items-center justify-center text-center">
            <Lock size={40} className="text-gold-dark/40 mb-4" />
            <p className="text-gray-500 text-sm font-inter">No evidence files have been admitted to the vault for this matter.</p>
          </div>
        ) : (
          evidence.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-4 group hover:border-gold-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded border border-gold-dark/10 group-hover:border-gold-primary/30 transition-colors">
                  <FileText className="text-gold-primary" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-white font-playfair font-bold text-sm mb-1">{item.title}</h4>
                    <span className={`text-[8px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded border ${
                      item.status === 'Admitted' ? 'text-green-500 border-green-500/20 bg-green-500/10' : 
                      item.status === 'Contested' ? 'text-red-500 border-red-500/20 bg-red-500/10' : 
                      'text-amber-500 border-amber-500/20 bg-amber-500/10'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-inter">
                    <span className="flex items-center gap-1"><Database size={10} /> {item.type}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {item.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gold-dark/5 flex justify-end gap-4">
                <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gold-primary flex items-center gap-1 transition-colors">
                  <Eye size={12} /> Preview
                </button>
                <button className="text-[10px] font-bold uppercase tracking-widest text-gold-primary hover:text-white flex items-center gap-1 transition-colors">
                  <Download size={12} /> Download
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
