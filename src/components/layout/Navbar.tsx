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
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-4 md:px-8">
      <div className={`max-w-7xl mx-auto transition-all duration-500 rounded-full pl-3 pr-6 md:pl-6 md:pr-10 py-4 flex justify-between items-center ${
        isScrolled ? 'glass-panel shadow-premium' : 'bg-transparent border border-transparent'
      }`}>
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 flex items-center justify-center border border-brand-primary rounded-full group-hover:bg-brand-primary transition-all duration-500">
            <Gavel className="w-5 h-5 text-brand-primary group-hover:text-onyx" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-widest text-white uppercase font-playfair">XYZ Chambers</span>
            <span className="text-[8px] text-brand-primary tracking-[0.3em] font-bold uppercase font-inter leading-tight">Elite Legal Counsel</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all font-inter relative ${
                    isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-brand-primary rounded-full"
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
              <button className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all font-inter flex items-center gap-2 ${
                isMoreActive || isMoreOpen ? 'text-brand-primary' : 'text-gray-400 hover:text-white'
              }`}>
                More <ChevronDown size={12} className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-6 w-52 glass-panel rounded-2xl overflow-hidden z-50 p-2"
                  >
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          className={`block px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl ${
                            isActive ? 'bg-brand-primary text-onyx' : 'text-white hover:bg-brand-primary/10 hover:text-brand-primary'
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
          </div>

          <Link href="/login" className="btn-modern !py-2.5 !px-6 !text-[10px]">
            Legal Workspace
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-brand-primary p-2 bg-brand-primary/5 hover:bg-brand-primary/10 rounded-lg transition-all border border-brand-primary/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-onyx/98 backdrop-blur-2xl z-[60] lg:hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold tracking-widest text-white uppercase font-playfair">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link 
                      href={link.href}
                      className={`text-2xl font-bold uppercase tracking-tighter transition-all ${
                        isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-white'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-auto pt-10 border-t border-white/5">
              <Link 
                href="/login" 
                className="btn-modern w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Legal Workspace
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
