'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, Clock, History,
  Download, Eye, Filter, Lock, FileStack, X, Search,
  ChevronDown, BrainCircuit, RefreshCw, CheckCircle2, AlertTriangle, Info
} from 'lucide-react';
import { useDocumentStore, LegalDocument, TemplateCategory } from '@/lib/document-service';

export default function DocumentVault() {
  const documents = useDocumentStore((state) => state.documents);
  const syncWithSupabase = useDocumentStore((s) => s.syncWithSupabase);
  const subscribeToRealtime = useDocumentStore((s) => s.subscribeToRealtime);

  const analyzeDocument = useDocumentStore((s) => s.analyzeDocument);

  // Bootstrap: sync once then subscribe for live updates
  useEffect(() => {
    syncWithSupabase();
    const unsub = subscribeToRealtime();
    return unsub;
  }, [syncWithSupabase, subscribeToRealtime]);

  // ── Filters ─────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<LegalDocument['status'] | 'All'>('All');
  const [filterCategory, setFilterCategory] = useState<TemplateCategory | 'All'>('All');
  const [filterPrivilege, setFilterPrivilege] = useState<LegalDocument['privilege'] | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  // ── Preview + History ────────────────────────────────────────
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const previewDoc = documents.find(d => d.id === previewDocId) || null;
  const [showHistory, setShowHistory] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filtered = documents.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    const matchCat = filterCategory === 'All' || d.category === filterCategory;
    const matchPriv = filterPrivilege === 'All' || d.privilege === filterPrivilege;
    return matchSearch && matchStatus && matchCat && matchPriv;
  });

  const handleDownloadCSV = () => {
    const headers = ['Title', 'Category', 'Status', 'Version', 'Privilege', 'Expiry', 'Created'];
    const rows = filtered.map((d) => [
      d.title, d.category, d.status, `v${d.currentVersion}.0`,
      d.privilege, d.expiryDate ?? 'N/A', new Date(d.createdAt).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Document_Vault_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColors: Record<string, string> = {
    Signed: 'text-green-500 border-green-500/20 bg-green-500/10',
    Review: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
    Draft: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
    Archived: 'text-gray-500 border-gray-500/20 bg-gray-500/10',
  };

  return (
    <div className="space-y-6">
      {/* Header + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white font-playfair flex items-center gap-3">
            <FileStack className="text-gold-primary" size={24} /> Document Intelligence Vault
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Version Control • Privilege Management • Archive Retention •{' '}
            <span className="text-gold-primary/60">{documents.length} docs</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-outline py-2 px-4 text-[10px] flex items-center gap-2 ${showFilters ? 'border-gold-primary text-gold-primary' : ''}`}>
            <Filter size={14} /> Filter <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={handleDownloadCSV} className="btn-luxury py-2 px-4 text-[10px] flex items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Search + Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-white/[0.02] border border-gold-dark/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/40 border border-gold-dark/20 rounded pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                />
              </div>
              {[
                { label: 'Status', value: filterStatus, setter: setFilterStatus, options: ['All', 'Draft', 'Review', 'Signed', 'Archived'] },
                { label: 'Category', value: filterCategory, setter: setFilterCategory, options: ['All', 'Contracts', 'Pleadings', 'Motions', 'Opinions', 'Affidavits'] },
                { label: 'Privilege', value: filterPrivilege, setter: setFilterPrivilege, options: ['All', 'Public', 'Confidential', 'Privileged'] },
              ].map(({ label, value, setter, options }) => (
                <div key={label}>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</label>
                  <select
                    value={value}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) => (setter as any)(e.target.value)}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-gold-primary appearance-none"
                  >
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {(search || filterStatus !== 'All' || filterCategory !== 'All' || filterPrivilege !== 'All') && (
              <p className="text-[10px] text-gold-primary mb-4">Showing {filtered.length} of {documents.length} documents</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Main Table */}
        <div className={`overflow-x-auto custom-scrollbar transition-all ${previewDoc ? 'flex-1' : 'w-full'}`}>
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white/5 border-b border-gold-dark/10">
                {['Document Title', 'Status', 'Version', 'Privilege', 'Expiry/Review', 'Actions'].map((h, i) => (
                  <th key={h} className={`p-4 text-[9px] font-bold uppercase text-gray-500 tracking-widest font-inter ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-dark/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-inter italic">
                    {documents.length === 0 ? 'No documents in the intelligence vault yet.' : 'No documents match your filters.'}
                  </td>
                </tr>
              ) : (
                filtered.map((doc, idx) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${previewDocId === doc.id ? 'bg-gold-primary/5' : ''}`}
                    onClick={() => { setPreviewDocId(previewDocId === doc.id ? null : doc.id); setShowHistory(false); }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold-primary/5 rounded border border-gold-primary/10 text-gold-primary shrink-0">
                          <FileStack size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold font-playfair group-hover:text-gold-primary transition-colors">{doc.title}</p>
                          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">{doc.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${statusColors[doc.status] ?? 'text-gray-400 border-gray-600 bg-gray-500/10'}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-white">
                        <History size={12} className="text-gold-primary" /> v{doc.currentVersion}.0
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${doc.privilege === 'Privileged' ? 'text-red-500' : doc.privilege === 'Confidential' ? 'text-amber-500' : 'text-gray-400'}`}>
                        {doc.privilege === 'Privileged' ? <Lock size={12} /> : <ShieldAlert size={12} />}
                        {doc.privilege}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-inter">
                        <Clock size={12} className="text-gold-primary" /> {doc.expiryDate || 'No Expiry'}
                      </div>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => { setPreviewDocId(previewDocId === doc.id ? null : doc.id); setShowHistory(true); }}
                          className="p-2 hover:text-gold-primary transition-colors text-gray-500" title="Version History"
                        ><History size={14} /></button>
                        <button
                          onClick={handleDownloadCSV}
                          className="p-2 hover:text-gold-primary transition-colors text-gray-500" title="Download"
                        ><Download size={14} /></button>
                        <button
                          onClick={() => { setPreviewDocId(previewDocId === doc.id ? null : doc.id); setShowHistory(false); }}
                          className={`p-2 transition-colors ${previewDocId === doc.id ? 'text-gold-primary' : 'text-gray-500 hover:text-gold-primary'}`} title="Preview"
                        ><Eye size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Preview / History Panel */}
        <AnimatePresence>
          {previewDoc && (
            <motion.div
              initial={{ opacity: 0, x: 40, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: 40, width: 0 }}
              className="shrink-0 rounded-xl border border-gold-primary/20 bg-black/40 overflow-hidden flex flex-col"
              style={{ minWidth: 280 }}
            >
              {/* Panel header */}
              <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-2">
                  <button onClick={() => setShowHistory(false)} className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-colors ${!showHistory ? 'bg-gold-primary text-black' : 'text-gray-400 hover:text-white'}`}>Preview</button>
                  <button onClick={() => setShowHistory(true)} className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-colors ${showHistory ? 'bg-gold-primary text-black' : 'text-gray-400 hover:text-white'}`}>History</button>
                </div>
                <button onClick={() => setPreviewDocId(null)} className="text-gray-500 hover:text-white transition-colors"><X size={14} /></button>
              </div>

              {/* Panel body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {!showHistory ? (
                  <>
                    <div>
                      <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Document</p>
                      <h4 className="text-base font-bold text-white font-playfair leading-snug">{previewDoc.title}</h4>
                    </div>
                    {[
                      { label: 'Category', val: previewDoc.category },
                      { label: 'Status', val: previewDoc.status },
                      { label: 'Version', val: `v${previewDoc.currentVersion}.0` },
                      { label: 'Privilege', val: previewDoc.privilege },
                      { label: 'Expiry', val: previewDoc.expiryDate || 'No Expiry' },
                      { label: 'Created', val: new Date(previewDoc.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
                        <span className="text-xs text-white font-medium">{val}</span>
                      </div>
                    ))}

                    {/* Intelligence Section */}
                    <div className="pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                          <BrainCircuit size={14} className="text-gold-primary" /> Document Intelligence
                        </h4>
                        {!previewDoc.analysis && (
                          <button
                            onClick={async () => {
                              setIsAnalyzing(true);
                              await analyzeDocument(previewDoc.id);
                              setIsAnalyzing(false);
                            }}
                            disabled={isAnalyzing}
                            className="text-[9px] font-bold uppercase tracking-widest bg-gold-primary/10 text-gold-primary hover:bg-gold-primary/20 transition-colors px-2 py-1 rounded border border-gold-primary/20 disabled:opacity-50 flex items-center gap-1"
                          >
                            {isAnalyzing ? <><RefreshCw size={10} className="animate-spin" /> Analyzing...</> : 'Analyze Document'}
                          </button>
                        )}
                      </div>

                      {previewDoc.analysis ? (
                        <div className="space-y-3">
                          <div className="p-3 rounded bg-black/40 border border-white/5">
                            <p className="text-xs text-gray-300 leading-relaxed font-inter">{previewDoc.analysis.summary}</p>
                          </div>
                          
                          <div className="flex justify-between gap-3">
                            <div className="flex-1 p-3 rounded bg-black/40 border border-white/5">
                              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Risk Level</span>
                              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                                previewDoc.analysis.riskLevel === 'Low' ? 'text-green-500' :
                                previewDoc.analysis.riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'
                              }`}>
                                {previewDoc.analysis.riskLevel === 'Low' ? <CheckCircle2 size={14} /> :
                                 previewDoc.analysis.riskLevel === 'Medium' ? <Info size={14} /> : <AlertTriangle size={14} />}
                                {previewDoc.analysis.riskLevel}
                              </div>
                            </div>
                            <div className="flex-1 p-3 rounded bg-black/40 border border-white/5">
                              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest block mb-2">Key Terms</span>
                              <div className="flex flex-wrap gap-1">
                                {previewDoc.analysis.keyTerms.map((term, i) => (
                                  <span key={i} className="text-[8px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {previewDoc.analysis.clauses.map((clause, i) => (
                            <div key={i} className="p-3 rounded bg-gold-primary/5 border border-gold-primary/10">
                              <span className="text-[10px] text-gold-primary uppercase font-bold tracking-widest block mb-1">{clause.title}</span>
                              <p className="text-[10px] text-gray-400 font-inter leading-relaxed">{clause.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                          <BrainCircuit size={24} className="text-gold-dark/30 mx-auto mb-2" />
                          <p className="text-[10px] text-gray-500">Run document analysis to extract insights, key terms, and risk levels automatically.</p>
                        </div>
                      )}
                    </div>

                    {/* Preview Section */}
                    {previewDoc.versions[0]?.fileUrl ? (
                      <div className="pt-4 border-t border-white/5">
                        <h4 className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 flex items-center gap-1.5">
                          <Eye size={14} className="text-gold-primary" /> File Preview
                        </h4>
                        <div className="rounded-lg overflow-hidden border border-white/5 bg-black/60 h-64 relative">
                           {previewDoc.versions[0].fileUrl.toLowerCase().endsWith('.pdf') ? (
                             <iframe src={previewDoc.versions[0].fileUrl} className="w-full h-full border-none" />
                           ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <FileStack size={32} className="text-gold-primary/50 mb-3" />
                                <p className="text-xs text-white mb-2">Document is available</p>
                                <a href={previewDoc.versions[0].fileUrl} target="_blank" rel="noreferrer" className="btn-outline px-4 py-1.5 text-[10px]">
                                  Download / Open File
                                </a>
                             </div>
                           )}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t border-white/5">
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                          <FileStack size={24} className="text-gold-dark/30 mx-auto mb-2" />
                          <p className="text-[10px] text-gray-500">No file uploaded for this document.</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                      <History size={14} className="text-gold-primary" /> Version History
                    </h4>
                    {previewDoc.versions.length === 0 ? (
                      <div className="text-center py-8">
                        <History size={28} className="text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No version history yet.<br />This is v{previewDoc.currentVersion}.0</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {previewDoc.versions.map((v) => (
                          <div key={v.id} className="relative pl-5 border-l border-gold-dark/20">
                            <div className="absolute w-2 h-2 rounded-full bg-gold-primary -left-[4.5px] top-1 shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                            <p className="text-xs font-bold text-white">v{v.version}.0</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{v.changes}</p>
                            <p className="text-[9px] text-gray-600 mt-1">by {v.author} • {new Date(v.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

