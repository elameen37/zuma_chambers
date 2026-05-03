'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Role, ROLE_LABELS, ROLE_COLORS } from '@/lib/permissions';
import { Gavel, Lock, Key, ShieldCheck, ChevronDown, Eye, EyeOff, User } from '@/components/shared/Icons';

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
  const [successMsg, setSuccessMsg] = useState('');

  const [pin, setPin] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setPin('');
    setLoading(true);

    const { success, error: signUpError, message, pin: generatedPin } = await signUp(email, password, name, selectedRole);
    setLoading(false);

    if (success) {
      if (generatedPin) setPin(generatedPin);
      if (message) {
        setSuccessMsg(message);
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(signUpError || 'Failed to register account.');
    }
  };

  const roles: Role[] = ['partner', 'associate', 'admin', 'clerk', 'finance', 'client'];

  return (
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
            <div className="w-14 h-14 flex items-center justify-center border-2 border-gold-primary rounded-full">
              <Gavel className="w-7 h-7 text-gold-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-playfair tracking-wider">ZUMA CHAMBERS</h1>
              <p className="text-[9px] text-gold-primary tracking-[0.3em] uppercase font-inter font-bold">Enterprise Legal Workspace</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white font-playfair leading-tight mb-6">
            Join the <span className="gold-text italic">Chambers Network</span>
          </h2>
          <p className="text-gray-400 text-sm font-inter leading-relaxed mb-10">
            Request access to the secure enterprise resource planning system. Your role will be verified by the system administrator.
          </p>
          <div className="flex gap-6 text-[9px] text-gray-500 uppercase tracking-widest font-bold font-inter">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-green-500" /> Identity Verified
            </div>
            <div className="flex items-center gap-2">
              <Key size={12} className="text-gold-primary" /> Role Based Access
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 flex items-center justify-center border border-gold-primary rounded-full">
              <Gavel className="w-5 h-5 text-gold-primary" />
            </div>
            <span className="text-lg font-bold tracking-widest text-white uppercase font-playfair">Zuma ERP</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white font-playfair mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm font-inter mb-8">Register for secure chamber workspace access.</p>

            {successMsg ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <ShieldCheck className="text-green-500 w-6 h-6" />
                </div>
                <h3 className="text-white font-bold font-playfair text-xl">Registration Successful</h3>
                <p className="text-gray-400 text-sm font-inter">{successMsg}</p>
                
                {pin && (
                  <div className="mt-6 p-4 bg-black/40 border border-gold-primary/30 rounded-lg">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Your 2FA Access PIN</p>
                    <p className="text-3xl font-bold text-gold-primary tracking-[0.2em]">{pin}</p>
                    <p className="text-xs text-red-400 mt-2 font-inter italic">Please save this PIN securely. You will need it to log in.</p>
                  </div>
                )}

                <Link href="/login" className="btn-luxury block w-full py-3 text-sm mt-4">
                  Return to Sign In
                </Link>
              </div>
            ) : (
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
                      className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 px-4 pl-10 text-sm text-white outline-none focus:border-gold-primary transition-colors font-inter"
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
                      className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 px-4 text-sm text-white text-left flex justify-between items-center hover:border-gold-primary/40 transition-colors"
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
                      <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gold-dark/20 rounded-lg overflow-hidden z-50 shadow-2xl">
                        {roles.map(role => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => { setSelectedRole(role); setShowRoleSelect(false); }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${selectedRole === role ? 'bg-gold-primary/5' : ''}`}
                          >
                            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest uppercase border ${ROLE_COLORS[role]}`}>
                              {role}
                            </span>
                            <span className="text-sm text-gray-300 font-inter">{ROLE_LABELS[role]}</span>
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
                    className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 px-4 text-sm text-white outline-none focus:border-gold-primary transition-colors font-inter"
                    placeholder="you@zumachambers.com"
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
                      className="w-full bg-white/5 border border-gold-dark/20 rounded-lg py-3 px-4 pr-12 text-sm text-white outline-none focus:border-gold-primary transition-colors font-inter"
                      placeholder="Create a strong password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-primary transition-colors"
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
                  {loading ? 'Registering...' : 'Request Access'}
                </button>

                <div className="text-center pt-6 border-t border-white/5 mt-6">
                  <p className="text-xs text-gray-500 font-inter">
                    Already have an account?{' '}
                    <Link href="/login" className="text-gold-primary hover:text-white transition-colors font-bold">
                      Sign In Here
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-gold-primary border-t-transparent animate-spin" />
        </div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
