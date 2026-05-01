'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  MoreVertical, Gavel, AlertCircle, FileText 
} from 'lucide-react';
import { useMatterStore, EventType } from '@/lib/matter-service';

export default function ChamberCalendar() {
  const matters = useMatterStore((state) => state.matters);
  
  // Static month for demo: May 2026
  const monthName = "May 2026";
  const daysInMonth = 31;
  const startDay = 5; // Friday (0-6)
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: startDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
    return matters.flatMap(m => 
      m.events.filter(e => e.date === dateStr)
    );
  };

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'Hearing': return 'bg-gold-primary';
      case 'Deadline': return 'bg-red-500';
      case 'Filing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <CalendarIcon size={20} className="text-gold-primary" />
          <h3 className="text-xl font-bold text-white font-playfair">{monthName}</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black border border-gold-dark/20 rounded p-1">
            <button className="p-1.5 hover:text-gold-primary transition-colors"><ChevronLeft size={16} /></button>
            <button className="p-1.5 hover:text-gold-primary transition-colors"><ChevronRight size={16} /></button>
          </div>
          <button className="btn-luxury py-2 px-4 text-[10px] font-bold uppercase">Today</button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-gold-dark/10 bg-white/[0.01]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 h-[600px]">
        {padding.map(i => (
          <div key={`p-${i}`} className="border-r border-b border-gold-dark/5 bg-black/20" />
        ))}
        {days.map(day => {
          const events = getEventsForDay(day);
          const isToday = day === new Date().getDate();

          return (
            <div key={day} className={`border-r border-b border-gold-dark/5 p-2 flex flex-col gap-1 transition-colors hover:bg-white/[0.02] cursor-pointer group ${isToday ? 'bg-gold-primary/5' : ''}`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold font-mono ${isToday ? 'text-gold-primary' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {day.toString().padStart(2, '0')}
                </span>
                {events.length > 0 && (
                  <span className="text-[8px] font-bold text-gold-primary/60 uppercase">{events.length} Events</span>
                )}
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center gap-1.5 p-1 rounded bg-white/5 border border-white/5 hover:border-gold-primary/30 transition-all">
                    <div className={`w-1 h-1 rounded-full ${getEventColor(event.type)}`} />
                    <span className="text-[8px] text-gray-300 font-medium truncate font-inter">{event.title}</span>
                  </div>
                ))}
                {events.length > 3 && (
                  <span className="text-[7px] text-gray-500 text-center font-bold uppercase mt-1">+{events.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 bg-white/[0.02] border-t border-gold-dark/10 flex gap-6 justify-center">
        {[
          { label: 'Hearings', color: 'bg-gold-primary' },
          { label: 'Deadlines', color: 'bg-red-500' },
          { label: 'Filings', color: 'bg-blue-500' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
