'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ChevronRight, Copy, Check } from 'lucide-react';
import { useDocumentStore, DocumentTemplate } from '@/lib/document-service';
import { useMatterStore } from '@/lib/matter-service';

interface TemplateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate | null;
}

export default function TemplateGeneratorModal({ isOpen, onClose, template }: TemplateGeneratorModalProps) {
  const addDocument = useDocumentStore((s) => s.addDocument);
  const matters = useMatterStore((s) => s.matters);
  const [step, setStep] = useState<'fill' | 'preview'>('fill');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [matterId, setMatterId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const previewText = template?.variables.reduce((text, varName) => {
    return text.replace(new RegExp(`\\[${varName}\\]`, 'gi'), variables[varName] || `[${varName}]`);
  }, `LEGAL DOCUMENT: ${template?.title}\n\n${template?.variables.map(v => `[${v}]: ${variables[v] || '___'}`).join('\n')}`) ?? '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!template) return;
    setIsSaving(true);
    try {
      const matter = matters.find(m => m.id === matterId);
      
      const file = new File([previewText], `${template.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`, { type: 'text/plain' });

      await addDocument({
        title: `${template.title}${matter ? ` — ${matter.title}` : ''}`,
        category: template.category,
        status: 'Draft',
        privilege: 'Confidential',
        matterId: matterId || undefined,
        currentVersion: 1,
        versions: [],
      }, file);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!template) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl my-auto rounded-2xl overflow-hidden border border-gold-primary/20 bg-onyx shadow-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-luxury-gradient" />

            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-primary/10 rounded-lg"><Zap size={20} className="text-gold-primary" /></div>
                <div>
                  <h3 className="text-xl font-bold text-white font-playfair">{template.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{template.category} Template Generator</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
            </div>

            {/* Step Tabs */}
            <div className="flex border-b border-white/5">
              {(['fill', 'preview'] as const).map((s) => (
                <button key={s} onClick={() => setStep(s)}
                  className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors relative ${step === s ? 'text-gold-primary' : 'text-gray-500 hover:text-white'}`}>
                  {s === 'fill' ? '1. Fill Variables' : '2. Preview & Save'}
                  {step === s && <motion.div layoutId="genTabLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary" />}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
              {step === 'fill' ? (
                <>
                  <p className="text-xs text-gray-400 font-inter leading-relaxed">{template.description}</p>

                  <div className="space-y-4">
                    {template.variables.map((varName) => (
                      <div key={varName}>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">
                          {varName.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="text"
                          placeholder={`Enter ${varName}`}
                          value={variables[varName] ?? ''}
                          onChange={(e) => setVariables({ ...variables, [varName]: e.target.value })}
                          className="w-full bg-black/40 border border-gold-dark/20 rounded px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold-primary transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5 tracking-widest">Link to Matter (Optional)</label>
                    <select value={matterId} onChange={(e) => setMatterId(e.target.value)}
                      className="w-full bg-black/40 border border-gold-dark/20 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-gold-primary appearance-none">
                      <option value="">-- None --</option>
                      {matters.map((m) => <option key={m.id} value={m.id}>{m.suitNumber} – {m.title}</option>)}
                    </select>
                  </div>

                  <button onClick={() => setStep('preview')} className="w-full btn-luxury py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    Preview Document <ChevronRight size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Document Preview</h4>
                    <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] text-gold-primary border border-gold-primary/30 px-3 py-1.5 rounded hover:bg-gold-primary/10 transition-all">
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                  <pre className="p-6 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {previewText}
                  </pre>
                </>
              )}
            </div>

            {step === 'preview' && (
              <div className="p-6 border-t border-white/5 bg-black/30 flex justify-between gap-4">
                <button onClick={() => setStep('fill')} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">← Edit Variables</button>
                <button onClick={handleSave} disabled={isSaving} className="btn-luxury px-6 py-2.5 text-xs font-bold uppercase tracking-widest disabled:opacity-50">
                  {isSaving ? 'Saving…' : 'Save to Vault'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
