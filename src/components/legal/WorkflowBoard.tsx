'use client';

import React, { useState, useRef } from 'react';
import { useMatterStore, MatterStage } from '@/lib/matter-service';
import MatterCard from './MatterCard';
import { Filter, LayoutGrid } from 'lucide-react';

const stages: MatterStage[] = ['Intake', 'Discovery', 'Pre-Trial', 'Hearing', 'Judgment', 'Closed'];

export default function WorkflowBoard() {
  const matters = useMatterStore((state) => state.matters);
  const updateMatter = useMatterStore((state) => state.updateMatter);
  const [activeDropStage, setActiveDropStage] = useState<MatterStage | null>(null);
  const dragMatterId = useRef<string | null>(null);

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
          {stages.map((stage) => {
            const stageMatters = getMattersByStage(stage);
            const isDropTarget = activeDropStage === stage;
            return (
              <div key={stage} className="w-80 flex flex-col">
                {/* Column header */}
                <div className={`flex justify-between items-center mb-4 px-2 pb-3 border-b-2 transition-colors duration-200 ${
                  isDropTarget ? 'border-gold-primary' : 'border-gold-primary/20'
                }`}>
                  <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-200 ${
                    isDropTarget ? 'text-gold-primary' : 'text-gold-primary/80'
                  }`}>
                    {stage}
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] transition-colors duration-200 ${
                      isDropTarget ? 'bg-gold-primary/25 text-gold-primary' : 'bg-white/5 text-gray-400'
                    }`}>
                      {stageMatters.length}
                    </span>
                  </h3>
                </div>

                {/* Drop zone */}
                <div
                  className={`flex-1 border rounded-lg p-4 space-y-4 overflow-y-auto custom-scrollbar min-h-[500px] transition-all duration-200 ${
                    isDropTarget
                      ? 'bg-gold-primary/5 border-gold-primary/40 shadow-[0_0_24px_rgba(212,175,55,0.12)]'
                      : 'bg-white/[0.02] border-gold-dark/10'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    setActiveDropStage(stage);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setActiveDropStage(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData('text/plain') || dragMatterId.current;
                    if (id && id !== '' ) handleMove(id, stage);
                    setActiveDropStage(null);
                    dragMatterId.current = null;
                  }}
                >
                  {stageMatters.length === 0 ? (
                    <div className={`h-32 border border-dashed rounded flex items-center justify-center transition-colors duration-200 ${
                      isDropTarget ? 'border-gold-primary/50' : 'border-gold-dark/10'
                    }`}>
                      <span className={`text-[10px] uppercase font-bold tracking-widest transition-colors duration-200 ${
                        isDropTarget ? 'text-gold-primary/70' : 'text-gray-600'
                      }`}>
                        {isDropTarget ? 'Drop Here' : 'Empty Stage'}
                      </span>
                    </div>
                  ) : (
                    stageMatters.map((matter, idx) => (
                      <div
                        key={matter.id}
                        draggable
                        onDragStart={(e) => {
                          dragMatterId.current = matter.id;
                          e.dataTransfer.setData('text/plain', matter.id);
                          e.dataTransfer.effectAllowed = 'move';
                          (e.currentTarget as HTMLElement).style.opacity = '0.4';
                        }}
                        onDragEnd={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                          dragMatterId.current = null;
                          setActiveDropStage(null);
                        }}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <MatterCard matter={matter} delay={idx * 0.05} compact />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
