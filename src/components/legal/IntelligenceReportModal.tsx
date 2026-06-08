'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Sparkles, Clock, Gavel, FileText, AlertTriangle, UserCheck } from 'lucide-react';
import { useMatterStore } from '@/lib/matter-service';

interface IntelligenceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export default function IntelligenceReportModal({ isOpen, onClose, date }: IntelligenceReportModalProps) {
  const matters = useMatterStore((state) => state.matters);

  // Extract all events for the date
  const todaysEvents = matters.flatMap(m => 
    m.events
      .filter(e => e.date === date)
      .map(e => ({ ...e, matter: m }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  const todaysHearings = todaysEvents.filter(e => e.type === 'Hearing');
  const todaysDeadlines = todaysEvents.filter(e => e.type === 'Deadline');

  // Find high risk matters for today
  const criticalMatters = todaysEvents.filter(e => ['High', 'Critical'].includes(e.matter.riskLevel));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl my-auto rounded-2xl overflow-hidden border border-gold-primary/30 bg-onyx shadow-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-luxury-gradient" />

            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gold-primary/10 rounded-xl border border-gold-primary/20">
                  <Sparkles size={24} className="text-gold-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-playfair">Tactical Intelligence Report</h3>
                  <p className="text-xs text-gold-primary/70 font-bold uppercase tracking-[0.2em] mt-1">Generated for • {date}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* Executive Summary */}
              <section className="p-6 rounded-xl bg-gradient-to-br from-gold-primary/10 to-transparent border border-gold-primary/20">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                  <ShieldAlert size={16} className="text-gold-primary" /> Executive Threat Assessment
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed font-inter">
                  Today's schedule involves <strong className="text-white">{todaysHearings.length} court appearances</strong> and <strong className="text-white">{todaysDeadlines.length} critical deadlines</strong>. 
                  {criticalMatters.length > 0 ? (
                    <span className="text-red-400"> Heightened risk detected in {criticalMatters.length} matter(s) requiring senior partner oversight.</span>
                  ) : (
                    <span className="text-green-400"> All listed matters are currently within acceptable risk parameters.</span>
                  )}
                  {" "}Ensure all supporting documentation for today's hearings are digitally verified and physical copies are bound.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timeline / Logistics */}
                <section className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/10">
                    <Clock size={16} className="text-gold-primary" /> Logistics & Timeline
                  </h4>
                  {todaysEvents.length === 0 ? (
                    <p className="text-sm text-gray-500">No events scheduled.</p>
                  ) : (
                    <div className="space-y-4">
                      {todaysEvents.map((event, idx) => (
                        <div key={idx} className="relative pl-6 border-l border-gold-dark/20">
                          <div className="absolute w-2 h-2 rounded-full bg-gold-primary -left-[4.5px] top-1.5 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-gold-primary font-mono font-bold">
                              {event.type === 'Hearing' ? '09:00 AM' : 'EOD'}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider bg-black/30 px-2 py-0.5 rounded border border-white/5">
                              {event.type}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-white font-playfair mb-1">{event.matter.title}</h5>
                          <div className="flex flex-col gap-1 mt-2">
                            {event.courtroom && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <Gavel size={12} className="text-gold-dark" /> {event.matter.court} ({event.courtroom})
                              </div>
                            )}
                            {event.assignedCounsel && event.assignedCounsel.length > 0 && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <UserCheck size={12} className="text-gold-dark" /> Counsel: {event.assignedCounsel.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Risk & Compliance Watchlist */}
                <section className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/10">
                    <AlertTriangle size={16} className="text-red-500" /> Watchlist & Compliance
                  </h4>
                  {criticalMatters.length === 0 ? (
                    <div className="p-4 rounded border border-white/5 bg-white/[0.02] text-center">
                      <p className="text-sm text-gray-500 font-inter">No high-risk matters flagged for today.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {criticalMatters.map((event, idx) => (
                        <div key={idx} className="p-4 rounded border border-red-500/20 bg-red-500/5">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">{event.matter.suitNumber}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-bold tracking-widest">
                              {event.matter.riskLevel} Risk
                            </span>
                          </div>
                          <h5 className="text-sm text-white font-bold mb-2">{event.matter.title}</h5>
                          <p className="text-[10px] text-gray-400 leading-relaxed">
                            {event.type === 'Hearing' ? 
                              'Critical hearing today. Opposing counsel history suggests procedural objections. Ensure all authorities are bookmarked.' : 
                              'Critical deadline approaching. Missing this deadline carries high compliance and financial risk for the client.'
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Required Documentation */}
                  <div className="mt-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-white/10 mb-4">
                      <FileText size={16} className="text-gold-primary" /> Documentation Required
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded bg-white/[0.02] border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs text-gray-300">Final Written Address (Draft verification)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded bg-white/[0.02] border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs text-gray-300">Witness Statements on Oath (Ready)</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

            </div>

            <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                Close Report
              </button>
              <button
                className="btn-luxury px-6 py-2.5 text-xs font-bold uppercase tracking-widest"
              >
                Export as PDF
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
