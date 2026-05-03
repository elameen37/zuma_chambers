'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Role, ROLE_LABELS, ROLE_COLORS } from '@/lib/permissions';
import { Gavel, Lock, Key, Fingerprint, Eye, EyeOff, ShieldCheck, Globe, ChevronDown } from '@/components/shared/Icons';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, verify2FA, isAuthenticated, is2FAVerified } = useAuth();

  const initialStep = searchParams.get('step') === '2fa' ? 2 : 1;
  const [step, setStep] = useState(initialStep);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already fully authenticated
  React.useEffect(() => {
    if (isAuthenticated && is2FAVerified) {
      router.replace('/dashboard');
    } else if (isAuthenticated && !is2FAVerified) {
      setStep(2);
    }
  }, [isAuthenticated, is2FAVerified, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      setStep(2);
    } else {
      setError('Invalid credentials. Please verify your email and password.');
    }
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verify2FA(twoFactorCode)) {
      router.replace('/dashboard');
    } else {
      setError('Invalid verification code. Enter any 6 digits.');
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
            Secure Access to Your <span className="gold-text italic">Legal Operations</span>
          </h2>
          <p className="text-gray-400 text-sm font-inter leading-relaxed mb-10">
            Zero-trust authentication with multi-factor verification, biometric readiness, and enterprise-grade encryption protects every session.
          </p>
          <div className="flex gap-6 text-[9px] text-gray-500 uppercase tracking-widest font-bold font-inter">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-green-500" /> AES-256 Encryption
            </div>
            <div className="flex items-center gap-2">
              <Key size={12} className="text-gold-primary" /> 2FA Protected
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

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-white font-playfair mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm font-inter mb-10">Sign in to your secure chamber workspace.</p>

                <form onSubmit={handleLogin} className="space-y-6">
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
                        placeholder="Enter password"
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
                    <p className="text-red-400 text-xs font-inter">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-luxury w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Authenticating...' : 'Sign In Securely'}
                  </button>

                  {/* Biometric Placeholder */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="h-[1px] flex-1 bg-gold-dark/10" />
                    <span className="text-[9px] text-gray-600 tracking-widest uppercase font-bold">or</span>
                    <div className="h-[1px] flex-1 bg-gold-dark/10" />
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 border border-gold-dark/20 rounded-lg flex items-center justify-center gap-3 text-gray-400 hover:text-gold-primary hover:border-gold-primary/30 transition-all text-xs font-inter font-bold tracking-wider"
                  >
                    <Fingerprint size={18} /> Biometric Login (Coming Soon)
                  </button>

                  <div className="text-center pt-6 border-t border-white/5 mt-6">
                    <p className="text-xs text-gray-500 font-inter">
                      Don't have an account?{' '}
                      <Link href="/signup" className="text-gold-primary hover:text-white transition-colors font-bold">
                        Sign Up Here
                      </Link>
                    </p>
                  </div>
                </form>

                {/* Session Info */}
                <div className="mt-8 p-4 rounded-lg bg-white/[0.02] border border-gold-dark/10">
                  <div className="flex items-center gap-2 text-[9px] text-gray-600 font-inter">
                    <Globe size={10} /> Session IP: 102.89.45.121 &bull; TLS 1.3 &bull; Lagos, NG
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center mb-8 mx-auto">
                  <Lock className="text-gold-primary" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-white font-playfair mb-2 text-center">Two-Factor<br />Verification</h2>
                <p className="text-gray-400 text-sm font-inter mb-10 text-center">
                  Enter the 6-digit code from your authenticator app.<br />
                  <span className="text-[10px] text-gold-primary">(Demo: enter any 6 digits)</span>
                </p>

                <form onSubmit={handle2FA} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={twoFactorCode[i] || ''}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newCode = twoFactorCode.split('');
                          newCode[i] = val;
                          setTwoFactorCode(newCode.join(''));
                          if (val && i < 5) {
                            const next = e.target.nextElementSibling as HTMLInputElement;
                            next?.focus();
                          }
                        }}
                        className="w-12 h-14 bg-white/5 border border-gold-dark/20 rounded-lg text-center text-xl text-white font-bold outline-none focus:border-gold-primary transition-colors font-inter"
                      />
                    ))}
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-inter text-center">{error}</p>
                  )}

                  <button type="submit" className="btn-luxury w-full py-4 text-sm">
                    Verify &amp; Enter Workspace
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep(1); setTwoFactorCode(''); }}
                    className="w-full text-center text-xs text-gray-500 hover:text-gold-primary transition-colors font-inter"
                  >
                    Back to Sign In
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gold-primary/10 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-gold-primary border-t-transparent animate-spin" />
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
