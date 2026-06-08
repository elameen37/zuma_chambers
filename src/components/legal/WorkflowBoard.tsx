'use client';

import React, { useState, useEffect } from 'react';
import { useMatterStore, MatterStage } from '@/lib/matter-service';
import MatterCard from './MatterCard';
import { Filter, LayoutGrid } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

const stages: MatterStage[] = ['Intake', 'Discovery', 'Pre-Trial', 'Hearing', 'Judgment', 'Closed'];

export default function WorkflowBoard() {
  const matters = useMatterStore((state) => state.matters);
  const updateMatter = useMatterStore((state) => state.updateMatter);
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getMattersByStage = (stage: MatterStage) => {
    return matters.filter((m) => m.stage === stage);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      updateMatter(draggableId, { stage: destination.droppableId as MatterStage });
    }
  };

  if (!isMounted) return null;

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
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 min-w-max h-full">
            {stages.map((stage) => {
              const stageMatters = getMattersByStage(stage);
              return (
                <div key={stage} className="w-80 flex flex-col">
                  {/* Column header */}
                  <div className="flex justify-between items-center mb-4 px-2 pb-3 border-b-2 transition-colors duration-200 border-gold-primary/20">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-200 text-gold-primary/80">
                      {stage}
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] transition-colors duration-200 bg-white/5 text-gray-400">
                        {stageMatters.length}
                      </span>
                    </h3>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 border rounded-lg p-4 space-y-4 overflow-y-auto custom-scrollbar min-h-[500px] transition-all duration-200 ${
                          snapshot.isDraggingOver
                            ? 'bg-gold-primary/5 border-gold-primary/40 shadow-[0_0_24px_rgba(212,175,55,0.12)]'
                            : 'bg-white/[0.02] border-gold-dark/10'
                        }`}
                      >
                        {stageMatters.map((matter, index) => (
                          <Draggable key={matter.id} draggableId={matter.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transition-all duration-200 ${snapshot.isDragging ? 'opacity-80 scale-105 z-50' : 'opacity-100'}`}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <MatterCard matter={matter} delay={0} compact />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {stageMatters.length === 0 && !snapshot.isDraggingOver && (
                          <div className="h-32 border border-dashed rounded flex items-center justify-center transition-colors duration-200 border-gold-dark/10">
                            <span className="text-[10px] uppercase font-bold tracking-widest transition-colors duration-200 text-gray-600">
                              Empty Stage
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
