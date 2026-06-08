'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, Users, MapPin, AlignLeft } from 'lucide-react';
import { useMatterStore, EventType, MatterEvent } from '@/lib/matter-service';

interface ScheduleEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleEventModal({ isOpen, onClose }: ScheduleEventModalProps) {
  const matters = useMatterStore((state) => state.matters);
  const addMatterEvent = useMatterStore((state) => state.addMatterEvent);

  const [selectedMatterId, setSelectedMatterId] = useState('');
  const [formData, setFormData] = useState<Partial<MatterEvent>>({
    type: 'Hearing',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    courtroom: '',
    assignedCounsel: [],
    assignedClerk: '',
  });

  // Simple state for multiple counsel selection
  const [counselInput, setCounselInput] = useState('');

  const handleAddCounsel = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && counselInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        assignedCounsel: [...(prev.assignedCounsel || []), counselInput.trim()]
      }));
      setCounselInput('');
    }
  };

  const handleRemoveCounsel = (name: string) => {
    setFormData(prev => ({
      ...prev,
      assignedCounsel: (prev.assignedCounsel || []).filter(c => c !== name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatterId || !formData.title || !formData.date) return;

    await addMatterEvent(selectedMatterId, formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-gold-primary/20 bg-onyx shadow-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-luxury-gradient" />

            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-primary/10 rounded-lg">
                  <CalendarIcon size={20} className="text-gold-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-playfair">Schedule Event</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Calendar & Logistics</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Matter Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Select Matter</label>
                <select
                  required
                  value={selectedMatterId}
                  onChange={(e) => setSelectedMatterId(e.target.value)}
                  className="w-full bg-black/40 border border-gold-dark/20 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-primary transition-colors appearance-none"
                >
                  <option value="" disabled>-- Select a Matter --</option>
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.suitNumber} - {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Event Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-primary transition-colors appearance-none"
                  >
                    <option value="Hearing">Hearing</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Filing">Filing</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Milestone">Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Event Date</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-black/40 border border-gold-dark/20 rounded pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold-primary transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Event Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Substantive Hearing, Motion on Notice"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black/40 border border-gold-dark/20 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Description</label>
                <div className="relative">
                  <AlignLeft size={16} className="absolute left-3 top-3.5 text-gray-500" />
                  <textarea
                    placeholder="Provide briefing details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-gold-primary transition-colors min-h-[80px]"
                  />
                </div>
              </div>

              <div className="p-4 rounded border border-white/5 bg-white/[0.02] space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                  <MapPin size={14} className="text-gold-primary" /> Court Logistics
                </h4>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Courtroom</label>
                  <input
                    type="text"
                    placeholder="e.g. Courtroom 4A"
                    value={formData.courtroom}
                    onChange={(e) => setFormData({ ...formData, courtroom: e.target.value })}
                    className="w-full bg-black/40 border border-gold-dark/20 rounded px-4 py-2 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Assigned Counsel</label>
                    <div className="relative">
                      <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Type name & press Enter"
                        value={counselInput}
                        onChange={(e) => setCounselInput(e.target.value)}
                        onKeyDown={handleAddCounsel}
                        className="w-full bg-black/40 border border-gold-dark/20 rounded pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                      />
                    </div>
                    {formData.assignedCounsel && formData.assignedCounsel.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.assignedCounsel.map((counsel, idx) => (
                          <span key={idx} className="flex items-center gap-1 bg-gold-primary/10 border border-gold-primary/30 text-gold-primary text-[9px] font-bold px-2 py-1 rounded">
                            {counsel}
                            <button type="button" onClick={() => handleRemoveCounsel(counsel)} className="hover:text-white ml-1">
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Assigned Clerk</label>
                    <input
                      type="text"
                      placeholder="Clerk name"
                      value={formData.assignedClerk}
                      onChange={(e) => setFormData({ ...formData, assignedClerk: e.target.value })}
                      className="w-full bg-black/40 border border-gold-dark/20 rounded px-4 py-2 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gold-dark/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedMatterId || !formData.title || !formData.date}
                  className="btn-luxury px-6 py-2.5 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
