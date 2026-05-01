'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { hasPermission, PERMISSIONS, ROLE_LABELS, ROLE_COLORS } from '@/lib/permissions';
import RouteGuard from '@/components/guards/RouteGuard';
import {
  LayoutDashboard, Briefcase, FileText, BarChart3, ShieldCheck, Users,
  Settings, LogOut, Menu, X, Bell, Search, Gavel, ScrollText, CalendarDays,
  MessageSquare
} from '@/components/shared/Icons';

const SidebarItem = ({ icon: Icon, label, href, active, locked }: { icon: React.ElementType, label: string, href: string, active: boolean, locked?: boolean }) => (
  <Link href={locked ? '#' : href} className="relative block">
    <motion.div
      whileHover={locked ? {} : { x: 5 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group z-10 ${
        locked
          ? 'text-gray-700 cursor-not-allowed'
          : active
            ? 'text-black font-bold'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} className="relative z-20" />
      <span className="text-sm font-medium font-inter relative z-20">{label}</span>
      
      {active && (
        <motion.div 
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-gold-primary rounded-lg shadow-lg shadow-gold-primary/20 z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      {active && (
        <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 bg-black/40 rounded-full relative z-20" />
      )}
      
      {locked && (
        <span className="ml-auto text-[7px] tracking-widest uppercase text-gray-700 font-bold relative z-20">Locked</span>
      )}
    </motion.div>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Build navigation based on role permissions
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', permission: null },
    { icon: Users, label: 'Clients', href: '/dashboard/clients', permission: PERMISSIONS.VIEW_CLIENTS },
    { icon: Briefcase, label: 'Cases', href: '/dashboard/cases', permission: PERMISSIONS.VIEW_CASES },
    { icon: LayoutDashboard, label: 'Workflow Board', href: '/dashboard/workflow', permission: PERMISSIONS.VIEW_CASES },
    { icon: CalendarDays, label: 'Court Calendar', href: '/dashboard/calendar', permission: PERMISSIONS.VIEW_CALENDAR },
    { icon: FileText, label: 'Documents', href: '/dashboard/documents', permission: PERMISSIONS.VIEW_DOCUMENTS },
    { icon: BarChart3, label: 'Financials', href: '/dashboard/finance', permission: PERMISSIONS.VIEW_FINANCE },
    { icon: ShieldCheck, label: 'Compliance', href: '/dashboard/compliance', permission: PERMISSIONS.VIEW_COMPLIANCE },
    { icon: Users, label: 'Team', href: '/dashboard/team', permission: PERMISSIONS.VIEW_TEAM },
    { icon: MessageSquare, label: 'Collaborate', href: '/dashboard/collaboration', permission: PERMISSIONS.VIEW_COLLABORATION },
    { icon: ScrollText, label: 'Audit Logs', href: '/dashboard/audit-logs', permission: PERMISSIONS.VIEW_AUDIT_LOGS },
  ];

  const menuItems = allMenuItems.map(item => ({
    ...item,
    locked: item.permission ? !hasPermission(user?.role ?? 'client', item.permission) : false,
  }));

  return (
    <RouteGuard>
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
                <span className="text-[8px] text-gold-primary tracking-[0.2em] uppercase font-inter leading-tight font-bold">Workspace v2.0</span>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  locked={item.locked}
                />
              ))}
            </nav>

            <div className="pt-6 border-t border-gold-dark/10 space-y-2">
              <SidebarItem
                icon={Settings}
                label="Settings"
                href="/dashboard/settings"
                active={pathname === '/dashboard/settings'}
                locked={!hasPermission(user?.role ?? 'client', PERMISSIONS.MANAGE_SETTINGS)}
              />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all font-inter text-sm"
              >
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
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-white font-inter">{user?.name ?? 'Guest'}</span>
                  <span className={`text-[9px] font-bold tracking-widest font-inter uppercase px-1.5 py-0.5 rounded-sm border ${ROLE_COLORS[user?.role ?? 'client']}`}>
                    {ROLE_LABELS[user?.role ?? 'client']}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold-gradient p-[1px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    <span className="text-sm font-bold text-gold-primary font-playfair">{user?.initials ?? '??'}</span>
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
    </RouteGuard>
  );
}
