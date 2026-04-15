'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

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
    <footer className="pt-20 pb-10 border-t border-gold-dark/20 bg-[#020202]">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center border border-gold-primary rounded-full">
                <Gavel className="w-5 h-5 text-gold-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-widest text-white uppercase font-playfair">Zuma Chambers</span>
                <span className="text-[10px] text-gold-primary tracking-[0.2em] uppercase font-inter">Rooted in Strength</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm font-inter">
              Providing world-class legal excellence with a commitment to justice. Zuma Chambers is at the forefront of Nigerian legal reforms and enterprise legal operations.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:border-gold-primary hover:text-gold-primary transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (group && group.title && (
            <div key={group.title}>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-6 font-inter underline decoration-gold-primary decoration-2 underline-offset-8">
                {group.title}
              </h4>
              <ul className="flex flex-col gap-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-gold-primary transition-colors font-inter">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )))}
        </div>

        <div className="border-t border-gray-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row gap-8 items-center text-gray-400 text-xs font-inter">
            <span className="flex items-center gap-2">
              <Mail size={14} className="text-gold-primary" /> office@zumachambers.law
            </span>
            <span className="flex items-center gap-2">
              <Phone size={14} className="text-gold-primary" /> +234 (0) 800-ZUMA-LAW
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-gold-primary" /> Abuja, Nigeria
            </span>
          </div>
          <p className="text-gray-500 text-[10px] tracking-widest uppercase font-inter">
            &copy; {currentYear} Zuma Chambers. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
