'use client';

import React, { useEffect } from 'react';
import DraftingLibrary from '@/components/legal/DraftingLibrary';
import DocumentVault from '@/components/legal/DocumentVault';
import UploadDocumentModal from '@/components/legal/UploadDocumentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FileStack, Plus, Zap } from 'lucide-react';
import { useDocumentStore } from '@/lib/document-service';

export default function DocumentsIntelligencePage() {
  const [activeTab, setActiveTab] = React.useState<'library' | 'vault'>('library');
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const syncWithSupabase = useDocumentStore((s) => s.syncWithSupabase);
  const subscribeToRealtime = useDocumentStore((s) => s.subscribeToRealtime);

  // Bootstrap once at page level (DocumentVault also does this, but this ensures
  // the count in the tab label stays accurate even on the library tab)
  useEffect(() => {
    syncWithSupabase();
    const unsub = subscribeToRealtime();
    return unsub;
  }, [syncWithSupabase, subscribeToRealtime]);

  const documents = useDocumentStore((s) => s.documents);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Document Intelligence</h1>
          <p className="text-gray-400 text-sm font-inter">Automated legal drafting, version control, and secure archive management.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          <Plus size={16} /> Upload New File
        </button>
      </div>

      <div className="flex gap-2 border-b border-gold-dark/10">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'library' ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Zap size={14} /> Drafting Intelligence
          {activeTab === 'library' && (
            <motion.div layoutId="docTabLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex items-center gap-2 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
            activeTab === 'vault' ? 'text-gold-primary' : 'text-gray-500 hover:text-white'
          }`}
        >
          <FileStack size={14} /> Document Vault
          {documents.length > 0 && (
            <span className="ml-2 bg-gold-primary text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full">{documents.length}</span>
          )}
          {activeTab === 'vault' && (
            <motion.div layoutId="docTabLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-primary" />
          )}
        </button>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'library' ? <DraftingLibrary /> : <DocumentVault />}
          </motion.div>
        </AnimatePresence>
      </div>

      <UploadDocumentModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}

