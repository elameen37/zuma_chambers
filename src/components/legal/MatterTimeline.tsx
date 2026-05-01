'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, Briefcase, Gavel } from 'lucide-react';
import { MatterEvent, EventType } from '@/lib/matter-service';

const getEventIcon = (type: EventType) => {
  switch (type) {
    case 'Hearing': return Gavel;
    case 'Filing': return Briefcase;
    case 'Deadline': return AlertCircle;
    case 'Milestone': return CheckCircle2;
    default: return Calendar;
  }
};

const getEventColor = (type: EventType, isCompleted: boolean) => {
  if (isCompleted) return 'text-green-500 bg-green-500/10 border-green-500/20';
  switch (type) {
    case 'Hearing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'Deadline': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'Filing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

export default function MatterTimeline({ events }: { events: MatterEvent[] }) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="relative py-4">
      {/* Vertical Line */}
      <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-gold-dark/20" />

      <div className="space-y-8">
        {sortedEvents.length === 0 ? (
          <div className="pl-12 py-8 text-gray-500 text-sm italic font-inter">
            No events or milestones recorded for this matter.
          </div>
        ) : (
          sortedEvents.map((event, idx) => {
            const Icon = getEventIcon(event.type);
            const colorClasses = getEventColor(event.type, event.isCompleted);
            const isFuture = new Date(event.date) > new Date();

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-12"
              >
                {/* Dot */}
                <div className={`absolute left-0 top-1 w-10 h-10 rounded-full border flex items-center justify-center z-10 ${colorClasses} ${event.isCompleted ? 'bg-green-500/20' : 'bg-black'}`}>
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="glass-card p-5 hover:border-gold-primary/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${event.isCompleted ? 'text-green-500' : 'text-gold-primary'}`}>
                        {event.type} {event.isCompleted && '• Completed'}
                      </span>
                      <h4 className="text-white font-playfair font-bold text-lg mt-1 group-hover:text-gold-primary transition-colors">{event.title}</h4>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300 font-mono">
                        <Calendar size={14} className="text-gold-primary" /> {event.date}
                      </div>
                      {isFuture && !event.isCompleted && (
                        <span className="text-[9px] text-amber-500 font-bold uppercase tracking-tighter animate-pulse">Upcoming</span>
                      )}
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-gray-400 text-xs font-inter leading-relaxed mt-2 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
