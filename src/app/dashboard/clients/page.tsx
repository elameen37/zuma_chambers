'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, 
  Building2, User, ChevronRight, ShieldCheck, 
  Globe, Mail, Phone, X, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useClientStore, ClientType, KYCStatus } from '@/lib/client-service';
import Link from 'next/link';

interface FormData {
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  address: string;
  kycStatus: KYCStatus;
  riskProfile: 'Low' | 'Medium' | 'High';
  retainerBalance: string;
  // Company-specific
  cacNumber: string;
  directors: string;
  dateOfIncorporation: string;
  industry: string;
}

const emptyForm: FormData = {
  name: '',
  type: 'Individual',
  email: '',
  phone: '',
  address: '',
  kycStatus: 'Pending',
  riskProfile: 'Low',
  retainerBalance: '0',
  cacNumber: '',
  directors: '',
  dateOfIncorporation: '',
  industry: '',
};

export default function ClientsPage() {
  const { clients, addClient } = useClientStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [success, setSuccess] = useState(false);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (form.type === 'Company' && !form.cacNumber.trim()) newErrors.cacNumber = 'CAC number is required for companies';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addClient({
      name: form.name,
      type: form.type,
      email: form.email,
      phone: form.phone,
      address: form.address,
      kycStatus: form.kycStatus,
      riskProfile: form.riskProfile,
      retainerBalance: parseFloat(form.retainerBalance) || 0,
      lastInteraction: 'Never',
      ...(form.type === 'Company' && {
        companyDetails: {
          cacNumber: form.cacNumber,
          directors: form.directors.split(',').map(d => d.trim()).filter(Boolean),
          dateOfIncorporation: form.dateOfIncorporation,
          industry: form.industry,
        }
      }),
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowModal(false);
      setForm(emptyForm);
      setErrors({});
    }, 1500);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(emptyForm);
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Client Command Center</h1>
          <p className="text-gray-400 text-sm font-inter">Manage comprehensive client profiles, KYC compliance, and interaction history.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2">
          <UserPlus size={16} /> New Client
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white/[0.02] p-4 rounded-xl border border-gold-dark/10">
        <div className="flex-1 relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
           <input 
            type="text" 
            placeholder="Search by name, email, or company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-gold-dark/20 rounded-lg py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-gold-primary transition-all font-inter"
           />
        </div>
        <button className="btn-outline px-6 py-2 flex items-center gap-2 text-xs">
          <Filter size={14} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-6 group hover:border-gold-primary/30 transition-all relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              {client.type === 'Company' ? <Building2 size={120} /> : <User size={120} />}
            </div>

            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-gold-dark/10 flex items-center justify-center text-gold-primary">
                {client.type === 'Company' ? <Building2 size={24} /> : <User size={24} />}
              </div>
              <div className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest border ${
                client.kycStatus === 'Verified' ? 'text-green-500 border-green-500/20' : 'text-amber-500 border-amber-500/20'
              }`}>
                {client.kycStatus}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white font-playfair mb-1 group-hover:text-gold-primary transition-colors">{client.name}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">{client.type}</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-xs text-gray-400 font-inter">
                <Mail size={14} className="text-gold-primary/60" /> {client.email}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-inter">
                <Phone size={14} className="text-gold-primary/60" /> {client.phone}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gold-dark/5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-500">
                <ShieldCheck size={14} className={client.riskProfile === 'Low' ? 'text-green-500' : 'text-amber-500'} />
                {client.riskProfile} Risk
              </div>
              <Link 
                href={`/dashboard/clients/${client.id}`}
                className="text-gold-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Profile <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── New Client Modal ─────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 w-full max-w-xl h-screen bg-[#0d0d0f] border-l border-gold-primary/15 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gold-dark/10">
                <div>
                  <h2 className="text-xl font-bold text-white font-playfair">New Client Profile</h2>
                  <p className="text-xs text-gray-500 mt-0.5 font-inter">Register a new client in the Zuma Chambers system</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">

                {/* Success State */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                    >
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                      <p className="text-sm text-green-400 font-inter font-medium">Client registered successfully!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Client Type */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Client Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Individual', 'Company', 'Government'] as ClientType[]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, type: t }))}
                        className={`py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          form.type === t
                            ? 'bg-brand-primary/15 border-brand-primary text-brand-primary'
                            : 'bg-white/[0.02] border-white/8 text-gray-500 hover:border-brand-primary/30'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <Field label="Full Name / Company Name" error={errors.name} required>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={form.type === 'Company' ? 'e.g. Acme Petroleum Ltd' : 'e.g. Chief Bola Adewale'}
                    className="form-input"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <Field label="Email Address" error={errors.email} required>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="client@example.com" className="form-input" />
                  </Field>
                  {/* Phone */}
                  <Field label="Phone Number" error={errors.phone} required>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" className="form-input" />
                  </Field>
                </div>

                {/* Address */}
                <Field label="Physical Address" error={errors.address} required>
                  <textarea name="address" value={form.address} onChange={handleChange} placeholder="Street, City, State" rows={2} className="form-input resize-none" />
                </Field>

                {/* Company-specific fields */}
                <AnimatePresence>
                  {form.type === 'Company' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="border-t border-gold-dark/10 pt-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-brand-primary mb-4">Company Details</p>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="CAC Number" error={errors.cacNumber} required>
                            <input name="cacNumber" type="text" value={form.cacNumber} onChange={handleChange} placeholder="RC123456" className="form-input" />
                          </Field>
                          <Field label="Date of Incorporation" error={errors.dateOfIncorporation}>
                            <input name="dateOfIncorporation" type="date" value={form.dateOfIncorporation} onChange={handleChange} className="form-input" />
                          </Field>
                        </div>
                        <Field label="Industry / Sector" error={errors.industry} className="mt-4">
                          <input name="industry" type="text" value={form.industry} onChange={handleChange} placeholder="e.g. Oil & Gas, Banking, Real Estate" className="form-input" />
                        </Field>
                        <Field label="Directors (comma-separated)" error={errors.directors} className="mt-4">
                          <input name="directors" type="text" value={form.directors} onChange={handleChange} placeholder="e.g. Aliko Bello, Sade Fashola" className="form-input" />
                        </Field>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  {/* KYC Status */}
                  <Field label="KYC Status" error={errors.kycStatus}>
                    <select name="kycStatus" value={form.kycStatus} onChange={handleChange} className="form-input appearance-none">
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </Field>
                  {/* Risk Profile */}
                  <Field label="Risk Profile" error={errors.riskProfile}>
                    <select name="riskProfile" value={form.riskProfile} onChange={handleChange} className="form-input appearance-none">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </Field>
                </div>

                {/* Retainer Balance */}
                <Field label="Initial Retainer Balance (₦)" error={errors.retainerBalance}>
                  <input name="retainerBalance" type="number" min="0" value={form.retainerBalance} onChange={handleChange} placeholder="0.00" className="form-input" />
                </Field>

              </form>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-gold-dark/10 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-outline flex-1 py-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn-luxury flex-1 py-3 text-xs flex items-center justify-center gap-2"
                >
                  <UserPlus size={15} />
                  Register Client
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Helper Field Component ─── */
function Field({
  label,
  children,
  error,
  required,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        {label}{required && <span className="text-brand-primary ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle size={11} className="text-red-400 shrink-0" />
          <p className="text-[10px] text-red-400 font-inter">{error}</p>
        </div>
      )}
    </div>
  );
}
