'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Users, Scale, Calendar, CheckCircle2, 
  ChevronRight, ChevronLeft, Save, Briefcase, Gavel
} from 'lucide-react';
import { useMatterStore, MatterStage, RiskLevel } from '@/lib/matter-service';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 'basic', title: 'Basic Information', icon: FileText },
  { id: 'parties', title: 'Parties & Counsel', icon: Users },
  { id: 'jurisdiction', title: 'Jurisdiction & Court', icon: Scale },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle2 },
];

export default function MatterIntakeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    suitNumber: '',
    client: '',
    opposingParty: '',
    opposingCounsel: '',
    jurisdiction: '',
    court: '',
    judge: '',
    stage: 'Intake' as MatterStage,
    riskLevel: 'Low' as RiskLevel,
  });

  const addMatter = useMatterStore((state) => state.addMatter);
  const router = useRouter();

  const handleNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    addMatter(formData);
    router.push('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Matter Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors"
                  placeholder="e.g. Zuma vs Federal Govt"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Suit Number</label>
                <input 
                  type="text" 
                  value={formData.suitNumber}
                  onChange={(e) => setFormData({...formData, suitNumber: e.target.value})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors font-mono"
                  placeholder="FHC/ABJ/CS/..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Initial Stage</label>
                <select 
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value as MatterStage})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors appearance-none"
                >
                  <option value="Intake">Intake</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Hearing">Hearing</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Risk Level</label>
                <select 
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({...formData, riskLevel: e.target.value as RiskLevel})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors appearance-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Client Name</label>
              <input 
                type="text" 
                value={formData.client}
                onChange={(e) => setFormData({...formData, client: e.target.value})}
                className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors"
                placeholder="Individual or Corporate Entity"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Opposing Party</label>
                <input 
                  type="text" 
                  value={formData.opposingParty}
                  onChange={(e) => setFormData({...formData, opposingParty: e.target.value})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Opposing Counsel</label>
                <input 
                  type="text" 
                  value={formData.opposingCounsel}
                  onChange={(e) => setFormData({...formData, opposingCounsel: e.target.value})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Jurisdiction</label>
              <input 
                type="text" 
                value={formData.jurisdiction}
                onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors"
                placeholder="e.g. Abuja FCT, Lagos State"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Court</label>
                <input 
                  type="text" 
                  value={formData.court}
                  onChange={(e) => setFormData({...formData, court: e.target.value})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors"
                  placeholder="e.g. Federal High Court 4"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2 tracking-widest">Presiding Judge</label>
                <input 
                  type="text" 
                  value={formData.judge}
                  onChange={(e) => setFormData({...formData, judge: e.target.value})}
                  className="w-full bg-white/5 border border-gold-dark/20 rounded p-3 text-white focus:border-gold-primary outline-none transition-colors"
                  placeholder="Hon. Justice ..."
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="glass-card p-6 bg-gold-primary/5 border-gold-primary/20">
              <h4 className="text-gold-primary font-playfair font-bold text-lg mb-4">Summary of Matter Intake</h4>
              <dl className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <dt className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Title</dt>
                  <dd className="text-white font-medium">{formData.title || 'Untitled Matter'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Suit Number</dt>
                  <dd className="text-white font-mono">{formData.suitNumber || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Client</dt>
                  <dd className="text-white">{formData.client || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Court</dt>
                  <dd className="text-white">{formData.court || 'N/A'}</dd>
                </div>
              </dl>
            </div>
            <p className="text-gray-400 text-xs italic">By submitting, this matter will be officially docketed in the Chamber Intelligence system.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gold-dark/20 -z-10" />
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              idx <= currentStep ? 'bg-gold-primary text-black' : 'bg-black border border-gold-dark/20 text-gray-500'
            }`}>
              <step.icon size={18} />
            </div>
            <span className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${
              idx <= currentStep ? 'text-gold-primary' : 'text-gray-500'
            }`}>{step.title}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-card p-8 mb-8 min-h-[400px]"
      >
        <h2 className="text-2xl font-bold text-white font-playfair mb-8">{steps[currentStep].title}</h2>
        {renderStep()}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button 
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
            currentStep === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-white hover:text-gold-primary'
          }`}
        >
          <ChevronLeft size={16} /> Back
        </button>
        
        {currentStep === steps.length - 1 ? (
          <button 
            onClick={handleSubmit}
            className="btn-luxury px-10 py-3 text-xs font-bold flex items-center gap-2"
          >
            <Save size={16} /> Docket Matter
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="btn-luxury px-10 py-3 text-xs font-bold flex items-center gap-2"
          >
            Continue <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
