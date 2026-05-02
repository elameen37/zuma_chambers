import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Copy, Download, Wand2, 
  MessageSquare, Sparkles, BookOpen, Search,
  History, Eye, ShieldCheck, Cpu, Lightbulb
} from 'lucide-react';
import { useAIStore } from '@/lib/ai-service';

export default function AIWorkbench() {
  const { generateDraft, isAnalyzing } = useAIStore();
  const [draftType, setDraftType] = useState('Statement of Claim');
  const [context, setContext] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');

  const handleGenerate = async () => {
    const draft = await generateDraft(draftType, context);
    setGeneratedDraft(draft);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Configuration Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-8 border-gold-primary/20 bg-gold-primary/5">
          <h3 className="text-xl font-bold text-white font-playfair flex items-center gap-3 mb-6">
            <Cpu size={20} className="text-gold-primary" /> Intelligence <span className="gold-text">Config</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Intelligence Task</label>
              <select 
                value={draftType}
                onChange={(e) => setDraftType(e.target.value)}
                className="w-full bg-black/40 border border-gold-dark/20 rounded-xl px-4 py-3 text-sm text-white focus:border-gold-primary transition-all outline-none"
              >
                <option>Statement of Claim</option>
                <option>Motion for Injunction</option>
                <option>Retainer Agreement</option>
                <option>Memorandum of Appearance</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Strategic Context</label>
              <textarea 
                placeholder="E.g. Breach of contract for oil block supply, defendant failed to deliver within 90 days..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={5}
                className="w-full bg-black/40 border border-gold-dark/20 rounded-xl px-4 py-3 text-sm text-white focus:border-gold-primary transition-all outline-none resize-none font-inter leading-relaxed"
              />
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full btn-luxury py-4 text-[10px] flex items-center justify-center gap-2"
            >
              <Wand2 size={16} /> Synthesis Legal Draft
            </button>
          </div>
        </div>

        <div className="glass-card p-6 border-white/5 space-y-4">
           <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
             <History size={14} /> Recent AI Operations
           </h4>
           <div className="space-y-2">
              <div className="p-3 bg-white/5 rounded border border-white/5 text-[10px] text-gray-400 flex justify-between">
                <span>Clause Extraction: Case #884</span>
                <span className="text-gold-primary">Complete</span>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5 text-[10px] text-gray-400 flex justify-between">
                <span>Precedent Scan: Suit #12</span>
                <span className="text-gold-primary">Complete</span>
              </div>
           </div>
        </div>
      </div>

      {/* Workspace Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-0 overflow-hidden min-h-[600px] flex flex-col relative">
          <div className="p-4 bg-white/5 border-b border-gold-dark/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Neural Draft Output</span>
            </div>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-white/10 rounded transition-all text-gray-400 hover:text-white" title="Copy to Clipboard">
                 <Copy size={16} />
               </button>
               <button className="p-2 hover:bg-white/10 rounded transition-all text-gray-400 hover:text-white" title="Download PDF">
                 <Download size={16} />
               </button>
            </div>
          </div>

          <div className="flex-1 p-8 font-mono text-sm leading-relaxed text-gray-300 overflow-y-auto custom-scrollbar">
            {generatedDraft ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-pre-wrap"
              >
                {generatedDraft}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 italic space-y-4">
                <Sparkles size={48} className="text-gold-primary" />
                <p>Synthesis engine waiting for strategic context...</p>
              </div>
            )}
          </div>

          {/* AI Suggestions Footer */}
          {generatedDraft && (
            <div className="p-6 bg-gold-primary/5 border-t border-gold-primary/10">
              <h5 className="text-[10px] font-bold text-gold-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                <Lightbulb size={14} /> AI Optimization Suggestions
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-black/40 rounded border border-gold-primary/20 text-[10px] text-gray-400 italic">
                  &quot;Consider citing Section 25 of the CAMA 2020 for corporate personality clarification.&quot;
                </div>
                <div className="p-3 bg-black/40 rounded border border-gold-primary/20 text-[10px] text-gray-400 italic">
                  &quot;Add a clause for alternative dispute resolution (ADR) to align with Lagos High Court rules.&quot;
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
