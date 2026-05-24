'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { hasPermission, PERMISSIONS, ROLE_LABELS, ROLE_COLORS } from '@/lib/permissions';
import RouteGuard from '@/components/guards/RouteGuard';
import { useTheme } from '@/components/layout/ThemeProvider';
import {
  LayoutDashboard, Briefcase, FileText, BarChart3, ShieldCheck, Users,
  Settings, LogOut, Menu, Bell, Search, Gavel, ScrollText, CalendarDays,
  MessageSquare, BookOpen, Sparkles, ChevronLeft, ChevronRight, Sun, Moon, X
} from '@/components/shared/Icons';


const SidebarItem = ({ icon: Icon, label, href, active, locked, collapsed }: { icon: React.ElementType, label: string, href: string, active: boolean, locked?: boolean, collapsed?: boolean }) => (
  <Link href={locked ? '#' : href} className="relative block px-3">
    <motion.div
      whileHover={locked ? {} : { x: collapsed ? 0 : 4 }}
      className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3.5 rounded-2xl transition-all duration-500 relative group z-10 ${
        locked
          ? 'text-gray-700 cursor-not-allowed opacity-50'
          : active
            ? 'bg-brand-primary text-onyx font-bold shadow-gold-glow'
            : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} className="relative z-20 shrink-0" />
      
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-[13px] font-bold tracking-tight font-inter relative z-20 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {locked && !collapsed && (
        <span className="ml-auto text-[8px] tracking-[0.2em] uppercase text-brand-primary font-bold relative z-20">Locked</span>
      )}
    </motion.div>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    // RouteGuard detects isAuthenticated=false and fires router.replace('/login') instantly
  };

  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', permission: null },
    { icon: Users, label: 'Clients', href: '/dashboard/clients', permission: PERMISSIONS.VIEW_CLIENTS },
    { icon: Briefcase, label: 'Cases', href: '/dashboard/cases', permission: PERMISSIONS.VIEW_CASES },
    { icon: LayoutDashboard, label: 'Kanban Board', href: '/dashboard/workflow', permission: PERMISSIONS.VIEW_CASES },
    { icon: CalendarDays, label: 'Court Calendar', href: '/dashboard/calendar', permission: PERMISSIONS.VIEW_CALENDAR },
    { icon: FileText, label: 'Documents', href: '/dashboard/documents', permission: PERMISSIONS.VIEW_DOCUMENTS },
    { icon: BarChart3, label: 'Financials', href: '/dashboard/finance', permission: PERMISSIONS.VIEW_FINANCE },
    { icon: ShieldCheck, label: 'Compliance', href: '/dashboard/compliance', permission: PERMISSIONS.VIEW_COMPLIANCE },
    { icon: Users, label: 'Team', href: '/dashboard/team', permission: PERMISSIONS.VIEW_TEAM },
    { icon: MessageSquare, label: 'Collaborate', href: '/dashboard/collaboration', permission: PERMISSIONS.VIEW_COLLABORATION },
    { icon: BookOpen, label: 'Law Library', href: '/dashboard/research', permission: PERMISSIONS.VIEW_RESEARCH },
    { icon: ShieldCheck, label: 'Chamber Admin', href: '/dashboard/hr', permission: PERMISSIONS.VIEW_HR },
    { icon: BarChart3, label: 'Executive Insights', href: '/dashboard/insights', permission: PERMISSIONS.VIEW_ANALYTICS },
    { icon: Sparkles, label: 'AI Intelligence', href: '/dashboard/ai', permission: PERMISSIONS.VIEW_AI },
    { icon: ScrollText, label: 'Audit Logs', href: '/dashboard/audit-logs', permission: PERMISSIONS.VIEW_AUDIT_LOGS },
  ];

  const menuItems = allMenuItems.map(item => ({
    ...item,
    locked: item.permission ? !hasPermission(user?.role ?? 'client', item.permission) : false,
  }));

  return (
    <RouteGuard>
      <div className="min-h-screen bg-onyx flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(isSidebarOpen || !isDesktopCollapsed) && (
            <motion.aside
              initial={false}
              animate={{ 
                width: isDesktopCollapsed ? 100 : 300,
                x: 0
              }}
              className={`fixed lg:relative inset-y-0 left-0 z-50 glass-panel border-r border-white/5 flex flex-col transition-all duration-500 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="p-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-brand-primary rounded-full shrink-0">
                    <Gavel size={20} className="text-brand-primary" />
                  </div>
                  {(!isDesktopCollapsed || isSidebarOpen) && (
                    <div className="flex flex-col">
                      <span className="text-lg font-bold tracking-tight text-white uppercase font-playfair">XYZ ERP</span>
                      <span className="text-[9px] text-brand-primary tracking-[0.2em] uppercase font-bold">Workspace 2.0</span>
                    </div>
                  )}
                </div>
                {isSidebarOpen && (
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden text-gray-500 hover:text-white p-1 hover:bg-brand-primary/10 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>


              <nav className="flex-1 space-y-1.5 py-4 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    locked={item.locked}
                    collapsed={isDesktopCollapsed}
                  />
                ))}
              </nav>

              <div className="p-6 border-t border-white/5 space-y-1.5">
                <SidebarItem
                  icon={Settings}
                  label="Settings"
                  href="/dashboard/settings"
                  active={pathname === '/dashboard/settings'}
                  locked={!hasPermission(user?.role ?? 'client', PERMISSIONS.MANAGE_SETTINGS)}
                  collapsed={isDesktopCollapsed}
                />
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3.5 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all font-inter text-[13px] font-bold`}
                >
                  <LogOut size={20} className="shrink-0" />
                  {!isDesktopCollapsed && <span className="whitespace-nowrap">Logout</span>}
                </button>
              </div>

              {/* Collapse Toggle */}
              <button
                onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                className="hidden lg:flex absolute top-10 -right-3 w-6 h-6 bg-brand-primary rounded-full items-center justify-center text-onyx shadow-premium hover:scale-110 transition-transform z-50"
              >
                {isDesktopCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Header */}
          <header className="h-20 px-4 sm:px-8 flex justify-between items-center bg-onyx/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-white p-1"
              >
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-6 py-2.5 w-96 transition-all hover:bg-white/10 group">
                <Search size={16} className="text-gray-500 group-hover:text-brand-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search legal intelligence..."
                  className="bg-transparent border-none outline-none text-xs text-white w-full font-inter"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative text-gray-500 hover:text-brand-primary transition-colors cursor-pointer p-1"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="relative text-gray-500 hover:text-white transition-colors p-1">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-onyx" />
              </button>
              
              <div className="h-8 w-px bg-white/5 hidden xs:block" />
              
              <div className="relative">
                <div 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 sm:gap-4 group cursor-pointer select-none"
                >
                  <div className="flex flex-col items-end hidden xs:flex">
                    <span className="text-[13px] font-bold text-white group-hover:text-brand-primary transition-colors">{user?.name}</span>
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${ROLE_COLORS[user?.role ?? 'client']}`}>
                      {ROLE_LABELS[user?.role ?? 'client']}
                    </span>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full p-[1px] bg-luxury-gradient shrink-0">
                    <div className="w-full h-full rounded-full bg-onyx flex items-center justify-center overflow-hidden">
                      <span className="text-xs sm:text-sm font-bold text-brand-primary font-playfair">{user?.initials}</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <>
                      {/* Invisible backdrop to detect clicks outside dropdown */}
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-60 z-50 glass-panel border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-onyx/95 backdrop-blur-2xl"
                      >
                        <div className="pb-3 border-b border-white/5 mb-3">
                          <p className="text-[10px] text-gray-500 font-inter font-bold uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold text-white truncate font-inter mt-0.5">{user?.name}</p>
                          <p className="text-[10px] text-brand-primary font-bold truncate mt-0.5 font-inter">{user?.email}</p>
                        </div>
                        
                        <Link 
                          href="/dashboard/settings" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-bold font-inter text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Settings size={15} />
                          Account Settings
                        </Link>
                        
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 mt-1 text-xs font-bold font-inter text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-left"
                        >
                          <LogOut size={15} />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-dark-gradient no-scrollbar">
            {children}
          </main>

        </div>
      </div>
    </RouteGuard>
  );
}
