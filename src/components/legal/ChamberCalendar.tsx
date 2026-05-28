'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Gavel, AlertCircle, FileText, X 
} from 'lucide-react';
import { useMatterStore, EventType } from '@/lib/matter-service';

export default function ChamberCalendar() {
  const matters = useMatterStore((state) => state.matters);
  
  // Track currently viewed month
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 4, 1)); // Starts at May 2026 for demo events
  // Track selected day for rich event detail modal
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const monthName = `${monthNames[month]} ${year}`;
  
  // Calculate days in the current month dynamically
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Calculate starting day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const startDay = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: startDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
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

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => {
    const events = getEventsForDay(day);
    if (events.length > 0) {
      setSelectedDay(day);
    }
  };

  const today = new Date();
  const isActualTodayMonth = today.getFullYear() === year && today.getMonth() === month;

  const selectedDateStr = selectedDay 
    ? `${monthNames[month]} ${selectedDay.toString().padStart(2, '0')}, ${year}` 
    : '';
  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="glass-card overflow-hidden relative">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <CalendarIcon size={20} className="text-gold-primary" />
          <h3 className="text-xl font-bold text-white font-playfair">{monthName}</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black border border-gold-dark/20 rounded p-1">
            <button 
              onClick={handlePrevMonth} 
              className="p-1.5 hover:text-gold-primary transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextMonth} 
              className="p-1.5 hover:text-gold-primary transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button 
            onClick={handleToday}
            className="btn-luxury py-2 px-4 text-[10px] font-bold uppercase transition-all cursor-pointer"
          >
            Today
          </button>
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
          const isToday = isActualTodayMonth && day === today.getDate();

          return (
            <div 
              key={day} 
              onClick={() => handleDayClick(day)}
              className={`border-r border-b border-gold-dark/5 p-2 flex flex-col gap-1 transition-all hover:bg-white/[0.04] cursor-pointer group relative ${
                isToday ? 'bg-gold-primary/5 border-double border border-gold-primary/30' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold font-mono ${isToday ? 'text-gold-primary font-extrabold' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {day.toString().padStart(2, '0')}
                </span>
                {events.length > 0 && (
                  <span className="text-[8px] font-extrabold text-gold-primary uppercase">{events.length} Event{events.length > 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar pr-1 flex-1">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center gap-1.5 p-1 rounded bg-white/5 border border-white/5 hover:border-gold-primary/30 transition-all">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getEventColor(event.type)}`} />
                    <span className="text-[8px] text-gray-300 font-medium truncate font-inter">{event.title}</span>
                  </div>
                ))}
                {events.length > 3 && (
                  <span className="text-[7px] text-gold-primary text-center font-bold uppercase mt-1">+{events.length - 3} more</span>
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

      {/* Event Details Overlay Modal */}
      <AnimatePresence>
        {selectedDay !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 30 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-lg rounded-[1.5rem] overflow-hidden border border-gold-primary/20 bg-onyx/98 backdrop-blur-2xl shadow-premium"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-1.5 w-full bg-luxury-gradient" />
              
              <div className="p-6 border-b border-gold-dark/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <h4 className="text-xl font-bold text-white font-playfair">{selectedDateStr}</h4>
                  <p className="text-[9px] text-gold-primary uppercase font-bold tracking-[0.2em] mt-0.5">Court Schedule & Event Briefing</p>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 max-h-[450px] overflow-y-auto space-y-4 no-scrollbar">
                {selectedEvents.map(event => (
                  <div 
                    key={event.id}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-gold-primary/25 transition-all space-y-3 shadow-premium"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest border ${
                        event.type === 'Hearing' ? 'bg-gold-primary/10 border-gold-primary/30 text-gold-primary' :
                        event.type === 'Deadline' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                        'bg-blue-500/10 border-blue-500/30 text-blue-500'
                      }`}>
                        {event.type}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        event.isCompleted 
                          ? 'text-green-500 bg-green-500/10 border-green-500/20' 
                          : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {event.isCompleted ? 'Completed' : 'Pending Action'}
                      </span>
                    </div>

                    <h5 className="text-base font-bold text-white font-playfair">{event.title}</h5>
                    
                    {event.description && (
                      <p className="text-xs text-gray-400 font-inter leading-relaxed">{event.description}</p>
                    )}

                    {/* Logistics details */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                      {event.courtroom && (
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Courtroom</span>
                          <span className="text-xs text-white font-semibold font-inter mt-0.5">{event.courtroom}</span>
                        </div>
                      )}
                      {event.assignedClerk && (
                        <div className="flex flex-col">
                          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Assigned Clerk</span>
                          <span className="text-xs text-white font-semibold font-inter mt-0.5">{event.assignedClerk}</span>
                        </div>
                      )}
                      {event.assignedCounsel && event.assignedCounsel.length > 0 && (
                        <div className="flex flex-col col-span-2">
                          <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Assigned Counsel</span>
                          <span className="text-xs text-gold-primary font-bold font-inter mt-0.5">{event.assignedCounsel.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
