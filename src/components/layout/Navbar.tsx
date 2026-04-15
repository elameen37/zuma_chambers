'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gavel } from '@/components/shared/Icons';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Practice Areas', href: '/practice-areas' },
    { name: 'Attorneys', href: '/attorneys' },
    { name: 'Insights', href: '/insights' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 glass-card luxury-glow rounded-none' : 'py-8 bg-transparent'
      }`}
    >
      <div className="section-container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 flex items-center justify-center border border-gold-primary rounded-full group-hover:bg-gold-primary transition-all duration-300">
            <Gavel className="w-6 h-6 text-gold-primary group-hover:text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-widest text-white uppercase font-playfair">Zuma Chambers</span>
            <span className="text-[10px] text-gold-primary tracking-[0.2em] font-medium uppercase font-inter leading-tight">Rooted in Strength</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium tracking-wide uppercase hover:text-gold-primary transition-colors font-inter"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/login" className="btn-outline text-xs">
            Legal Workspace
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-gold-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass-card rounded-none border-t border-gold-dark/20 p-8 flex flex-col gap-6 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-lg font-medium tracking-widest uppercase hover:text-gold-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/login" 
              className="btn-luxury text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Client Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
