'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Role, ROLE_LABELS, ROLE_COLORS } from '@/lib/permissions';
import { Gavel, Lock, Key, ShieldCheck, ChevronDown, Eye, EyeOff, User, CheckCircle, X } from '@/components/shared/Icons';

// ─── Token Reveal Modal ──────────────────────────────────────────────
function TokenModal({
  pin,
  successMsg,
  onClose,
}: {
  pin: string;
  successMsg: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pin).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(24px)', background: 'rgba(10,10,11,0.75)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-brand-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div
          className="relative rounded-[2rem] overflow-hidden border border-brand-primary/20"
          style={{
            background: 'linear-gradient(145deg, rgba(22,22,24,0.95) 0%, rgba(10,10,11,0.98) 100%)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,160,89,0.08), inset 0 1px 0 rgba(197,160,89,0.1)',
          }}
        >
          {/* Top gold stripe */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #8E7341 0%, #C5A059 40%, #E5D5B3 60%, #C5A059 80%, #8E7341 100%)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>

          <div className="p-10 pt-8">
            {/* Success badge */}
            <div className="flex flex-col items-center text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 300, delay: 0.15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'radial-gradient(circle, rgba(197,160,89,0.2) 0%, rgba(197,160,89,0.05) 70%)',
                  border: '1.5px solid rgba(197,160,89,0.3)',
                  boxShadow: '0 0 40px rgba(197,160,89,0.15)',
                }}
              >
                <ShieldCheck className="w-9 h-9 text-brand-primary" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white font-playfair mb-2">
                Access <span className="text-brand-primary italic">Granted</span>
              </h2>
              <p className="text-sm text-gray-400 font-inter leading-relaxed max-w-xs">
                {successMsg}
              </p>
            </div>

            {/* PIN Display */}
            {pin && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-8"
              >
                <p className="text-[10px] text-brand-primary font-bold tracking-[0.4em] uppercase text-center mb-4 font-inter">
                  Your 2FA Access PIN
                </p>

                {/* PIN digits */}
                <div className="flex justify-center gap-3 mb-4">
                  {pin.split('').map((digit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-brand-primary font-playfair"
                      style={{
                        background: 'rgba(197,160,89,0.07)',
                        border: '1px solid rgba(197,160,89,0.25)',
                        boxShadow: 'inset 0 1px 0 rgba(197,160,89,0.1)',
                      }}
                    >
                      {digit}
                    </motion.div>
                  ))}
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold tracking-widest uppercase font-inter transition-all duration-300"
                  style={{
                    background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(197,160,89,0.08)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(197,160,89,0.2)'}`,
                    color: copied ? '#22c55e' : '#C5A059',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle size={14} /> PIN Copied to Clipboard
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2"
                      >
                        <Key size={14} /> Copy PIN
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <p className="text-[10px] text-red-400/80 mt-3 text-center font-inter italic">
                  ⚠ Save this PIN securely — it will not be shown again.
                </p>
              </motion.div>
            )}

            {/* CTA */}
            <Link
              href="/login"
              className="btn-modern w-full !py-3.5 !text-[11px]"
              onClick={onClose}
            >
              Proceed to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Sign Up Form ────────────────────────────────────────────────────
function SignUpContent() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('associate');
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { success, error: signUpError, message, pin: generatedPin } = await signUp(email, password, name, selectedRole);
    setLoading(false);

    if (success) {
      // Clear form fields
      setName('');
      setEmail('');
      setPassword('');
      setSelectedRole('associate');

      if (generatedPin) setPin(generatedPin);
      if (message) {
        setSuccessMsg(message);
        setShowModal(true);
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(signUpError || 'Failed to register account.');
    }
  };

  const roles: Role[] = ['partner', 'associate', 'admin', 'clerk', 'finance', 'client'];

  return (
    <>
      {/* Token reveal popup */}
      <AnimatePresence>
        {showModal && (
          <TokenModal
            pin={pin}
            successMsg={successMsg}
            onClose={() => {
              setShowModal(false);
              router.push('/login');
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-black flex">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-bg.png')", filter: 'brightness(0.3) contrast(1.2)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="relative z-10 max-w-md px-12">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 flex items-center justify-center border-2 border-brand-primary rounded-full">
                <Gavel className="w-7 h-7 text-brand-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-playfair tracking-wider">XYZ Chambers</h1>
                <p className="text-[9px] text-brand-primary tracking-[0.3em] uppercase font-inter font-bold">Enterprise Legal Workspace</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white font-playfair leading-tight mb-6">
              Join the <span className="text-brand-primary italic">Chambers Network</span>
            </h2>
            <p className="text-gray-400 text-sm font-inter leading-relaxed mb-10">
              Request access to the secure enterprise resource planning system. Your role will be verified by the system administrator.
            </p>
            <div className="flex gap-6 text-[9px] text-gray-500 uppercase tracking-widest font-bold font-inter">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-green-500" /> Identity Verified
              </div>
              <div className="flex items-center gap-2">
                <Key size={12} className="text-brand-primary" /> Role Based Access
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 flex items-center justify-center border border-brand-primary rounded-full">
                <Gavel className="w-5 h-5 text-brand-primary" />
              </div>
              <span className="text-lg font-bold tracking-widest text-white uppercase font-playfair">XYZ ERP</span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white font-playfair mb-2">Create Account</h2>
              <p className="text-gray-400 text-sm font-inter mb-8">Register for secure chamber workspace access.</p>

              <form onSubmit={handleSignUp} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 font-inter">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white/5 border border-brand-dark/20 rounded-lg py-3 px-4 pl-10 text-sm text-white outline-none focus:border-brand-primary transition-colors font-inter"
                      placeholder="e.g. Adeyemi Cole"
                      required
                    />
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 font-inter">
                    Requested Role
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowRoleSelect(!showRoleSelect)}
                      className="w-full bg-white/5 border border-brand-dark/20 rounded-lg py-3 px-4 text-sm text-white text-left flex justify-between items-center hover:border-brand-primary/40 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border ${ROLE_COLORS[selectedRole]}`}>
                          {selectedRole}
                        </span>
                        <span className="font-inter">{ROLE_LABELS[selectedRole]}</span>
                      </span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    {showRoleSelect && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-brand-primary/20 rounded-lg overflow-hidden z-50 shadow-2xl">
                        {roles.map(role => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => { setSelectedRole(role); setShowRoleSelect(false); }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors group ${
                              selectedRole === role ? 'bg-brand-primary text-black' : 'hover:bg-brand-primary/5'
                            }`}
                          >
                            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border ${
                              selectedRole === role ? 'border-black/20 bg-black/5 text-black' : ROLE_COLORS[role]
                            }`}>
                              {role}
                            </span>
                            <span className={`text-sm font-bold font-inter transition-colors ${
                              selectedRole === role ? 'text-black' : 'text-white group-hover:text-brand-primary'
                            }`}>
                              {ROLE_LABELS[role]}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 font-inter">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-brand-dark/20 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-brand-primary transition-colors font-inter"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 font-inter">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-brand-dark/20 rounded-lg py-3 px-4 pr-12 text-sm text-white outline-none focus:border-brand-primary transition-colors font-inter"
                      placeholder="Create a strong password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs font-inter p-2 bg-red-400/10 rounded-md border border-red-400/20">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxury w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Registering...
                    </span>
                  ) : 'Request Access'}
                </button>

                <div className="text-center pt-6 border-t border-white/5 mt-6">
                  <p className="text-xs text-gray-500 font-inter">
                    Already have an account?{' '}
                    <Link href="/login" className="text-brand-primary hover:text-brand-secondary transition-colors font-bold">
                      Sign In Here
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
        </div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
