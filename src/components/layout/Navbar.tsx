'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Gavel, ChevronDown } from '@/components/shared/Icons';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const pathname = usePathname();

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

  const visibleLinks = navLinks.slice(0, 3);
  const moreLinks = navLinks.slice(3);
  const isMoreActive = moreLinks.some(link => pathname === link.href);

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
        <div className="hidden lg:flex items-center gap-8 relative">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors font-inter relative ${
                  isActive ? 'text-gold-primary' : 'hover:text-gold-primary text-gray-300'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gold-primary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsMoreOpen(true)}
            onMouseLeave={() => setIsMoreOpen(false)}
          >
            <button 
              className={`text-sm font-medium tracking-wide uppercase transition-colors font-inter flex items-center gap-2 relative ${
                isMoreActive || isMoreOpen ? 'text-gold-primary' : 'text-gray-300 hover:text-gold-primary'
              }`}
            >
              More <ChevronDown size={14} className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
              {(isMoreActive) && (
                <motion.div 
                  layoutId="navbar-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gold-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-48 bg-gold-primary border border-gold-light/20 rounded-lg overflow-hidden shadow-2xl z-50"
                >
                  {moreLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link 
                        key={link.name} 
                        href={link.href}
                        className={`block px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                          isActive ? 'bg-black text-gold-primary' : 'text-black hover:bg-black/10'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/login" className="btn-outline text-xs ml-4">
            Legal Workspace
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-gold-primary p-2 bg-gold-primary/5 hover:bg-gold-primary/10 rounded-lg transition-all border border-gold-primary/10"
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
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-lg font-medium tracking-widest uppercase transition-colors relative ${
                    isActive ? 'text-gold-primary font-bold' : 'hover:text-gold-primary text-gray-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="mobile-navbar-indicator"
                      className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
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
