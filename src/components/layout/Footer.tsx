'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from '@/components/shared/Icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Practice Areas',
      links: [
        { name: 'Litigation', href: '#' },
        { name: 'Corporate Law', href: '#' },
        { name: 'Property Law', href: '#' },
        { name: 'Criminal Defense', href: '#' },
        { name: 'IP Law', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Attorneys', href: '/attorneys' },
        { name: 'Insights', href: '/insights' },
        { name: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Contact', href: '/contact' },
        { name: 'FAQ', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
      ],
    },
  ];

  return (
    <footer className="pt-32 pb-16 border-t border-white/5 bg-onyx relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full" />
      
      <div className="section-responsive relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12 mb-24">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 flex items-center justify-center border border-brand-primary rounded-full bg-brand-primary/5">
                <Gavel className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-widest text-white uppercase font-playfair">[COMPANY_NAME]</span>
                <span className="text-[10px] text-brand-primary tracking-[0.4em] uppercase font-bold">Elite Legal Counsel</span>
              </div>
            </Link>
            <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-sm font-inter font-medium">
              Providing world-class legal excellence with a commitment to justice. [COMPANY_NAME] is at the forefront of Nigerian legal reforms and enterprise legal operations.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:border-brand-primary hover:text-brand-primary hover:scale-110 transition-all duration-500">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (group && group.title && (
            <div key={group.title}>
              <h4 className="text-[11px] font-bold tracking-[0.3em] uppercase text-white mb-10 font-inter">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] text-gray-500 hover:text-brand-primary transition-all font-inter font-bold hover:translate-x-2 inline-block duration-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )))}
        </div>

        <div className="border-t border-white/5 pt-16 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row gap-12 items-center text-gray-400 text-[13px] font-inter font-bold">
            <a href="mailto:office@company.law" className="flex items-center gap-3 hover:text-brand-primary transition-colors">
              <Mail size={16} className="text-brand-primary" /> office@company.law
            </a>
            <a href="tel:+234800ZUMALAW" className="flex items-center gap-3 hover:text-brand-primary transition-colors">
              <Phone size={16} className="text-brand-primary" /> +234 (0) 800-ZUMA-LAW
            </a>
            <span className="flex items-center gap-3">
              <MapPin size={16} className="text-brand-primary" /> Abuja, Nigeria
            </span>
          </div>
          <div className="flex flex-col items-center lg:items-end gap-2">
            <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-bold">
              &copy; {currentYear} [COMPANY_NAME]. All Rights Reserved.
            </p>
            <p className="text-[9px] text-gray-700 tracking-widest uppercase">
              Designed by Craftwave Systems
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
