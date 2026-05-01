'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Clock, History, 
  Download, Eye, Filter, Lock, FileStack, 
  ChevronRight, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useDocumentStore, LegalDocument } from '@/lib/document-service';

export default function DocumentVault() {
  const documents = useDocumentStore((state) => state.documents);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white font-playfair flex items-center gap-3">
            <FileStack className="text-gold-primary" size={24} /> Document Intelligence Vault
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Version Control • Privilege Management • Archive Retention</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-outline py-2 px-4 text-[10px] flex items-center gap-2">
            <Filter size={14} /> Filter Vault
          </button>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white/5 border-b border-gold-dark/10">
              <th className="p-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter">Document Title</th>
              <th className="p-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter">Status</th>
              <th className="p-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter">Version</th>
              <th className="p-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter">Privilege</th>
              <th className="p-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter">Expiry/Review</th>
              <th className="p-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold-dark/5">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500 font-inter italic">No documents in the intelligence vault yet.</td>
              </tr>
            ) : (
              documents.map((doc, idx) => (
                <motion.tr 
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gold-primary/5 rounded border border-gold-primary/10 text-gold-primary">
                        <FileStack size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-white font-bold font-playfair group-hover:text-gold-primary transition-colors">{doc.title}</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">{doc.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                      doc.status === 'Signed' ? 'text-green-500 border-green-500/20 bg-green-500/10' : 
                      doc.status === 'Review' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' : 
                      'text-blue-500 border-blue-500/20 bg-blue-500/10'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-white">
                      <History size={12} className="text-gold-primary" /> v{doc.currentVersion}.0
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${
                      doc.privilege === 'Privileged' ? 'text-red-500' : 'text-amber-500'
                    }`}>
                      {doc.privilege === 'Privileged' ? <Lock size={12} /> : <ShieldAlert size={12} />}
                      {doc.privilege}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-inter">
                      <Clock size={12} className="text-gold-primary" /> {doc.expiryDate || 'No Expiry'}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="p-2 hover:text-gold-primary transition-colors" title="Compare Versions"><History size={14} /></button>
                      <button className="p-2 hover:text-gold-primary transition-colors" title="Download"><Download size={14} /></button>
                      <button className="p-2 hover:text-gold-primary transition-colors" title="Preview"><Eye size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
