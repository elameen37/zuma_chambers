'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Gavel
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, href, active }: { icon: React.ElementType, label: string, href: string, active: boolean }) => (
  <Link href={href}>
    <motion.div 
      whileHover={{ x: 5 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        active 
          ? 'bg-gold-primary text-black shadow-lg shadow-gold-primary/20' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium font-inter">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-pill" 
          className="ml-auto w-1 h-4 bg-black rounded-full" 
        />
      )}
    </motion.div>
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Briefcase, label: 'Matters', href: '/dashboard/matters' },
    { icon: FileText, label: 'Documents', href: '/dashboard/documents' },
    { icon: BarChart3, label: 'Financials', href: '/dashboard/finance' },
    { icon: ShieldCheck, label: 'Compliance', href: '/dashboard/compliance' },
    { icon: Users, label: 'Team', href: '/dashboard/team' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-black border-r border-gold-dark/10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 flex items-center justify-center border border-gold-primary rounded-full">
              <Gavel className="w-5 h-5 text-gold-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-widest text-white uppercase font-playfair">Zuma ERP</span>
              <span className="text-[8px] text-gold-primary tracking-[0.2em] uppercase font-inter leading-tight font-bold">Workspace v1.0</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.href}
                {...item}
                active={pathname === item.href}
              />
            ))}
          </nav>

          <div className="pt-6 border-t border-gold-dark/10 space-y-2">
            <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" active={pathname === '/dashboard/settings'} />
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all font-inter text-sm">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-black/50 backdrop-blur-md border-b border-gold-dark/10 px-8 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-400 p-2"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-gold-dark/10 rounded-full px-4 py-2 w-80">
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search matters, documents..." 
                className="bg-transparent border-none outline-none text-xs text-white w-full font-inter"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-gold-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-gold-primary rounded-full border border-black" />
            </button>
            <div className="h-8 w-[1px] bg-gold-dark/10" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-white font-inter">Chief Olumide Zuma</span>
                <span className="text-[10px] text-gold-primary font-bold tracking-widest font-inter uppercase">Senior Advocate</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gold-gradient p-[1px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <span className="text-sm font-bold text-gold-primary font-playfair">OZ</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
