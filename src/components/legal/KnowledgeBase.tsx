import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, BookOpen, Scale, Gavel, 
  FileText, Bookmark, Sparkles, Copy, Share2,
  X, History, MessageSquare, Plus, Download
} from 'lucide-react';
import { useResearchStore, LegalResource } from '@/lib/research-service';
import ResourceCard from './ResourceCard';
import MemoStorage from './MemoStorage';

export default function KnowledgeBase() {
  const { resources, searchResources, savedAuthorities } = useResearchStore();
  const [activeTab, setActiveTab] = useState<'all' | 'statutes' | 'cases' | 'precedents'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<LegalResource | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.citation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'statutes' && r.type === 'Statute') ||
                       (activeTab === 'cases' && r.type === 'CaseLaw') ||
                       (activeTab === 'precedents' && r.type === 'Precedent');
    
    const matchesSaved = !showSavedOnly || savedAuthorities.includes(r.id);
    
    return matchesSearch && matchesTab && matchesSaved;
  });

  const generateCitation = (resource: LegalResource) => {
    if (resource.type === 'CaseLaw') {
      return `${resource.title} ${resource.citation}`;
    }
    return `${resource.title} (${resource.year})`;
  };

  return (
    <div className="space-y-8 min-h-screen pb-20">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex-1 w-full relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary/60" />
          <input 
            type="text"
            placeholder="Search by citation, keyword, or statute section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-gold-dark/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-gold-primary/50 transition-all font-inter"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
              showSavedOnly ? 'bg-gold-primary text-black border-gold-primary shadow-lg shadow-gold-primary/20' : 'bg-white/5 border-gold-dark/10 text-gray-400 hover:border-gold-primary/30'
            }`}
          >
            <Bookmark size={14} fill={showSavedOnly ? "black" : "none"} /> Saved Authorities
          </button>
          <button className="btn-luxury px-6 py-4 text-[10px] flex items-center gap-2">
             <Plus size={16} /> New Memo
          </button>
        </div>
      </div>

      {/* Resource Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gold-dark/10">
        {[
          { id: 'all', label: 'All Resources', icon: BookOpen },
          { id: 'statutes', label: 'Statutes & Acts', icon: Scale },
          { id: 'cases', label: 'Case Law Repository', icon: Gavel },
          { id: 'precedents', label: 'Precedents & Memos', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'all' | 'statutes' | 'cases' | 'precedents')}
            className={`flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="kb-tab-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="space-y-12">
        {activeTab === 'precedents' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MemoStorage />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource, i) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                index={i} 
                onView={setSelectedResource}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {filteredResources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Sparkles size={48} className="text-gold-dark/20 mb-4" />
          <h3 className="text-xl font-bold text-white font-playfair mb-2">No results matching your query</h3>
          <p className="text-gray-500 text-sm font-inter max-w-md">Try searching for broader terms or specific citations like &quot;NWLR&quot; or &quot;CAMA&quot;.</p>
        </div>
      )}

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-[#0a0a0a] border border-gold-primary/20 rounded-2xl shadow-2xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gold-dark/10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-gold-primary/10 text-gold-primary rounded-full text-[9px] font-bold uppercase tracking-widest border border-gold-primary/20">
                      {selectedResource.type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono tracking-tighter italic">
                      UID: {selectedResource.id.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white font-playfair">{selectedResource.title}</h2>
                  {selectedResource.citation && (
                    <p className="text-gold-primary/80 font-mono text-sm mt-2">{selectedResource.citation}</p>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-primary mb-4 flex items-center gap-2">
                         <FileText size={14} /> Full Content / Ratio Decidendi
                      </h4>
                      <div className="bg-white/[0.02] border border-gold-dark/10 rounded-xl p-8 text-gray-300 font-inter leading-relaxed whitespace-pre-wrap text-sm italic">
                        {selectedResource.content}
                      </div>
                    </section>
                    
                    <section>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-primary mb-4 flex items-center gap-2">
                         <History size={14} /> Partner Insights & Notes
                      </h4>
                      <div className="bg-gold-primary/5 border border-gold-primary/10 rounded-xl p-6 text-xs text-gold-primary/80 leading-relaxed">
                        &quot;Critical authority for jurisdictional challenges involving multi-national energy contracts. Ensure strict compliance with the notice period defined in Section 12.&quot;
                        <p className="mt-4 text-[9px] font-bold uppercase tracking-tighter opacity-60">— Added by Chief Elameen SAN</p>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <div className="glass-card p-6 border-gold-primary/20 bg-gold-primary/5">
                      <h4 className="text-[10px] font-bold text-gold-primary uppercase tracking-widest mb-4">Citation Generator</h4>
                      <div className="bg-black/40 p-4 rounded border border-gold-dark/20 text-[11px] font-mono text-white mb-4 break-words">
                        {generateCitation(selectedResource)}
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generateCitation(selectedResource));
                          // Add toast notification here if available
                        }}
                        className="w-full py-2 bg-gold-primary text-black text-[9px] font-bold uppercase tracking-widest rounded hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                      >
                        <Copy size={12} /> Copy Citation
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metadata</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">Year</span>
                          <span className="text-white font-mono">{selectedResource.year}</span>
                        </div>
                        {selectedResource.court && (
                          <div className="flex justify-between text-[11px]">
                            <span className="text-gray-500">Court</span>
                            <span className="text-white">{selectedResource.court}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">Access</span>
                          <span className="text-green-500 font-bold uppercase tracking-tighter">Enterprise Full</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gold-dark/10 bg-white/[0.02] flex justify-between items-center">
                <div className="flex gap-4">
                  <button className="text-gray-400 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all">
                    <Share2 size={14} /> Share Link
                  </button>
                  <button className="text-gray-400 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all">
                    <Download size={14} /> Export PDF
                  </button>
                </div>
                <button className="btn-luxury px-8 py-3 text-[10px]">
                  Open in Workspace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
