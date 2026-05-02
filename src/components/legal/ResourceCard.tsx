import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Scale, Gavel, FileText, Bookmark, Share2, ArrowRight } from 'lucide-react';
import { LegalResource, useResearchStore } from '@/lib/research-service';

interface ResourceCardProps {
  resource: LegalResource;
  index: number;
  onView: (resource: LegalResource) => void;
}

export default function ResourceCard({ resource, index, onView }: ResourceCardProps) {
  const { savedAuthorities, toggleSave } = useResearchStore();
  const isSaved = savedAuthorities.includes(resource.id);

  const getIcon = () => {
    switch (resource.type) {
      case 'Statute': return <Scale size={20} className="text-gold-primary" />;
      case 'CaseLaw': return <Gavel size={20} className="text-blue-400" />;
      case 'Precedent': return <FileText size={20} className="text-purple-400" />;
      default: return <BookOpen size={20} className="text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card group hover:border-gold-primary/40 transition-all p-6 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white/5 rounded-lg border border-gold-dark/10 group-hover:border-gold-primary/30 transition-colors">
          {getIcon()}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleSave(resource.id); }}
          className={`p-2 rounded-full transition-all ${isSaved ? 'text-gold-primary bg-gold-primary/10' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{resource.type}</span>
          {resource.year && <span className="text-[10px] text-gold-primary/60 font-mono">• {resource.year}</span>}
        </div>
        
        <h3 className="text-lg font-bold text-white font-playfair mb-2 group-hover:text-gold-primary transition-colors leading-snug">
          {resource.title}
        </h3>
        
        {resource.citation && (
          <p className="text-[11px] font-mono text-gray-400 mb-4 bg-black/30 px-2 py-1 rounded inline-block">
            {resource.citation}
          </p>
        )}
        
        <p className="text-gray-400 text-xs font-inter line-clamp-3 mb-6 leading-relaxed italic">
          &quot;{resource.content}&quot;
        </p>
      </div>

      <div className="pt-4 border-t border-gold-dark/10 flex items-center justify-between">
        <div className="flex gap-2">
          {resource.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/5">
              {tag}
            </span>
          ))}
        </div>
        
        <button 
          onClick={() => onView(resource)}
          className="text-gold-primary hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all group/btn"
        >
          Explore <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
