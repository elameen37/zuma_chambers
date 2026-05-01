'use client';

import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { useMatterStore, MatterStage, Matter } from '@/lib/matter-service';
import MatterCard from './MatterCard';
import { ChevronRight, Filter, LayoutGrid } from 'lucide-react';

const stages: MatterStage[] = ['Intake', 'Discovery', 'Pre-Trial', 'Hearing', 'Judgment', 'Closed'];

export default function WorkflowBoard() {
  const matters = useMatterStore((state) => state.matters);
  const updateMatter = useMatterStore((state) => state.updateMatter);

  const getMattersByStage = (stage: MatterStage) => {
    return matters.filter((m) => m.stage === stage);
  };

  const handleMove = (id: string, newStage: MatterStage) => {
    updateMatter(id, { stage: newStage });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Board Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-playfair mb-1 flex items-center gap-3">
            <LayoutGrid className="text-gold-primary" size={24} /> Workflow Pipeline
          </h2>
          <p className="text-gray-400 text-xs font-inter uppercase tracking-widest">Case Status Board & Kanban Workflow</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline py-2 px-4 text-[10px] flex items-center gap-2">
            <Filter size={14} /> Filter Board
          </button>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex gap-6 min-w-max h-full">
          {stages.map((stage) => (
            <div key={stage} className="w-80 flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-primary/80 flex items-center gap-2">
                  {stage} <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[8px] text-gray-400">{getMattersByStage(stage).length}</span>
                </h3>
              </div>
              
              <div className="flex-1 bg-white/[0.02] border border-gold-dark/10 rounded-lg p-4 space-y-4 overflow-y-auto custom-scrollbar min-h-[500px]">
                {getMattersByStage(stage).length === 0 ? (
                  <div className="h-32 border border-dashed border-gold-dark/10 rounded flex items-center justify-center">
                    <span className="text-[10px] uppercase text-gray-600 font-bold tracking-widest">Empty Stage</span>
                  </div>
                ) : (
                  getMattersByStage(stage).map((matter, idx) => (
                    <div key={matter.id} className="relative group">
                      <MatterCard matter={matter as any} delay={idx * 0.05} compact />
                      
                      {/* Move Stage Overlay (Mini) */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        {idx > 0 && stages.indexOf(stage) > 0 && (
                          <button 
                            onClick={() => handleMove(matter.id, stages[stages.indexOf(stage) - 1])}
                            className="p-1 bg-black/80 text-gray-400 hover:text-gold-primary rounded border border-gold-dark/20"
                          >
                            <ChevronRight size={12} className="rotate-180" />
                          </button>
                        )}
                        {stages.indexOf(stage) < stages.length - 1 && (
                          <button 
                            onClick={() => handleMove(matter.id, stages[stages.indexOf(stage) + 1])}
                            className="p-1 bg-black/80 text-gray-400 hover:text-gold-primary rounded border border-gold-dark/20"
                          >
                            <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
