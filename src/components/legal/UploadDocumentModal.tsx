'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText } from 'lucide-react';
import { useDocumentStore, TemplateCategory } from '@/lib/document-service';
import { useMatterStore } from '@/lib/matter-service';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadDocumentModal({ isOpen, onClose }: UploadDocumentModalProps) {
  const addDocument = useDocumentStore((s) => s.addDocument);
  const matters = useMatterStore((s) => s.matters);

  const [form, setForm] = useState({
    title: '',
    category: 'Contracts' as TemplateCategory,
    status: 'Draft' as 'Draft' | 'Review' | 'Signed' | 'Archived',
    privilege: 'Confidential' as 'Public' | 'Confidential' | 'Privileged',
    expiryDate: '',
    matterId: '',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!form.title) setForm((f) => ({ ...f, title: file.name.replace(/\.[^.]+$/, '') }));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!form.title) setForm((f) => ({ ...f, title: file.name.replace(/\.[^.]+$/, '') }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setIsSubmitting(true);
    try {
      await addDocument({
        title: form.title,
        category: form.category,
        status: form.status,
        privilege: form.privilege,
        expiryDate: form.expiryDate || undefined,
        matterId: form.matterId || undefined,
        currentVersion: 1,
        versions: [],
      });
      onClose();
      setForm({ title: '', category: 'Contracts', status: 'Draft', privilege: 'Confidential', expiryDate: '', matterId: '' });
      setSelectedFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-gold-primary/20 bg-onyx shadow-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-luxury-gradient" />

            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-primary/10 rounded-lg"><Upload size={20} className="text-gold-primary" /></div>
                <div>
                  <h3 className="text-xl font-bold text-white font-playfair">Upload Document</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Intelligence Vault</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-gold-primary bg-gold-primary/5' : 'border-gold-dark/30 hover:border-gold-primary/40'}`}
              >
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileInput} />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-gold-primary" />
                    <p className="text-sm text-white font-bold">{selectedFile.name}</p>
                    <p className="text-[10px] text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-600" />
                    <p className="text-sm text-gray-400">Drag & drop or <span className="text-gold-primary cursor-pointer">browse files</span></p>
                    <p className="text-[10px] text-gray-600">PDF, DOC, DOCX, TXT</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">Document Title</label>
                <input required type="text" placeholder="e.g. Deed of Assignment — Okoro v. Federal Republic" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-black/40 border border-gold-dark/20 rounded px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-primary transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TemplateCategory })}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-gold-primary appearance-none">
                    {['Contracts', 'Pleadings', 'Motions', 'Opinions', 'Affidavits'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-gold-primary appearance-none">
                    {['Draft', 'Review', 'Signed', 'Archived'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">Privilege Level</label>
                  <select value={form.privilege} onChange={(e) => setForm({ ...form, privilege: e.target.value as typeof form.privilege })}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-gold-primary appearance-none">
                    {['Public', 'Confidential', 'Privileged'].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-gold-primary [color-scheme:dark]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">Link to Matter (Optional)</label>
                <select value={form.matterId} onChange={(e) => setForm({ ...form, matterId: e.target.value })}
                  className="w-full bg-black/40 border border-gold-dark/20 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-gold-primary appearance-none">
                  <option value="">-- None --</option>
                  {matters.map((m) => <option key={m.id} value={m.id}>{m.suitNumber} – {m.title}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gold-dark/10">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting || !form.title} className="btn-luxury px-6 py-2.5 text-xs font-bold uppercase tracking-widest disabled:opacity-50">
                  {isSubmitting ? 'Uploading…' : 'Upload Document'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
