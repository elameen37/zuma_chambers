'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { hasPermission, PERMISSIONS, ROLE_LABELS, ROLE_COLORS } from '@/lib/permissions';
import RouteGuard from '@/components/guards/RouteGuard';
import { useTheme } from '@/components/layout/ThemeProvider';
import { useMatterStore } from '@/lib/matter-service';
import { useClientStore } from '@/lib/client-service';
import { useHRStore } from '@/lib/hr-service';
import { useDocumentStore } from '@/lib/document-service';
import { useResearchStore } from '@/lib/research-service';
import {
  LayoutDashboard, Briefcase, FileText, BarChart3, ShieldCheck, Users,
  Settings, LogOut, Menu, Bell, Search, Gavel, ScrollText, CalendarDays,
  MessageSquare, BookOpen, Sparkles, ChevronLeft, ChevronRight, Sun, Moon, X,
  PanelLeftOpen, PanelLeftClose, ArrowRight, Command
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

// ─── Search Result Types ────────────────────────────────────────────────────
interface SearchResult {
  id: string;
  label: string;
  sub: string;
  href: string;
  category: 'Matters' | 'Clients' | 'Staff' | 'Documents' | 'Research';
  icon: React.ElementType;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // ── Global Search State ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // ── Store Data ──────────────────────────────────────────────────────────
  const { matters } = useMatterStore();
  const { clients } = useClientStore();
  const { staff } = useHRStore();
  const { documents } = useDocumentStore();
  const { resources } = useResearchStore();

  // ── Real-time Search Computation ────────────────────────────────────────
  const computeResults = useCallback((q: string): SearchResult[] => {
    if (!q.trim()) return [];
    const lq = q.toLowerCase();
    const results: SearchResult[] = [];

    // Matters
    matters
      .filter(m =>
        m.suitNumber.toLowerCase().includes(lq) ||
        m.title.toLowerCase().includes(lq) ||
        m.client.toLowerCase().includes(lq) ||
        m.judge.toLowerCase().includes(lq)
      )
      .slice(0, 4)
      .forEach(m =>
        results.push({
          id: `m-${m.id}`,
          label: m.title,
          sub: `${m.suitNumber} · ${m.stage}`,
          href: `/dashboard/cases/${m.id}`,
          category: 'Matters',
          icon: Briefcase,
        })
      );

    // Clients
    clients
      .filter(c =>
        c.name.toLowerCase().includes(lq) ||
        c.email.toLowerCase().includes(lq) ||
        (c.companyDetails?.industry ?? '').toLowerCase().includes(lq)
      )
      .slice(0, 3)
      .forEach(c =>
        results.push({
          id: `c-${c.id}`,
          label: c.name,
          sub: `${c.type} · ${c.kycStatus}`,
          href: `/dashboard/clients`,
          category: 'Clients',
          icon: Users,
        })
      );

    // Staff
    staff
      .filter(s =>
        s.name.toLowerCase().includes(lq) ||
        s.role.toLowerCase().includes(lq) ||
        s.department.toLowerCase().includes(lq)
      )
      .slice(0, 3)
      .forEach(s =>
        results.push({
          id: `s-${s.id}`,
          label: s.name,
          sub: `${s.role} · ${s.department}`,
          href: `/dashboard/team`,
          category: 'Staff',
          icon: Users,
        })
      );

    // Documents
    documents
      .filter(d =>
        d.title.toLowerCase().includes(lq) ||
        d.category.toLowerCase().includes(lq) ||
        d.status.toLowerCase().includes(lq)
      )
      .slice(0, 3)
      .forEach(d =>
        results.push({
          id: `d-${d.id}`,
          label: d.title,
          sub: `${d.category} · ${d.status}`,
          href: `/dashboard/documents`,
          category: 'Documents',
          icon: FileText,
        })
      );

    // Research
    resources
      .filter(r =>
        r.title.toLowerCase().includes(lq) ||
        (r.citation ?? '').toLowerCase().includes(lq) ||
        r.type.toLowerCase().includes(lq)
      )
      .slice(0, 3)
      .forEach(r =>
        results.push({
          id: `r-${r.id}`,
          label: r.title,
          sub: `${r.type} · ${r.year}`,
          href: `/dashboard/research`,
          category: 'Research',
          icon: BookOpen,
        })
      );

    return results;
  }, [matters, clients, staff, documents, resources]);

  useEffect(() => {
    setSearchResults(computeResults(searchQuery));
  }, [searchQuery, computeResults]);

  // ── Keyboard Shortcut Listener (Ctrl+K / ⌘K / /) ────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key === 'k';
      if (isSlash || isCmdK) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setIsSearchFocused(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Click-outside closes dropdown ───────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    setSearchQuery('');
    router.push(`/dashboard/research?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleResultClick = (href: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    router.push(href);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
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
                className="lg:hidden text-white p-1 hover:text-brand-primary transition-colors cursor-pointer"
                title="Open Mobile Sidebar"
              >
                <Menu size={24} />
              </button>
              
              {/* Desktop Sidebar Toggle Slider */}
              <button
                onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                className="hidden lg:flex text-gray-500 hover:text-brand-primary p-1 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                title={isDesktopCollapsed ? "Open Sidebar Slider" : "Close Sidebar Slider"}
              >
                {isDesktopCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
              </button>

              {/* ── Global Search Command Palette ──────────────────────── */}
              <div ref={searchContainerRef} className="hidden md:block relative w-96">
                <form onSubmit={handleSearchSubmit}>
                  <div className={`flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300 border ${
                    isSearchFocused
                      ? 'bg-white/8 border-brand-primary/40 shadow-[0_0_0_3px_rgba(212,175,55,0.08)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
                  }`}>
                    <Search size={15} className={`shrink-0 transition-colors ${isSearchFocused ? 'text-brand-primary' : 'text-gray-500'}`} />
                    <input
                      ref={searchInputRef}
                      id="global-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      placeholder="Search matters, clients, documents..."
                      autoComplete="off"
                      className="bg-transparent border-none outline-none text-xs text-white w-full font-inter placeholder:text-gray-600"
                    />
                    <AnimatePresence>
                      {!isSearchFocused ? (
                        <motion.div
                          key="kbd-badge"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1 shrink-0"
                        >
                          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-500 font-mono">
                            <Command size={8} />
                            K
                          </kbd>
                        </motion.div>
                      ) : searchQuery && (
                        <motion.button
                          key="clear-btn"
                          type="button"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setSearchQuery('')}
                          className="text-gray-500 hover:text-white shrink-0 transition-colors"
                        >
                          <X size={13} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </form>

                {/* ── Search Results Dropdown ────────────────────────────── */}
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-[calc(100%+10px)] left-0 right-0 z-[100] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/8"
                      style={{ background: 'rgba(10,10,14,0.92)', backdropFilter: 'blur(24px)' }}
                    >
                      {/* Empty state — no query */}
                      {!searchQuery.trim() && (
                        <div className="p-5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-600 mb-3">Quick Access</p>
                          <div className="space-y-1">
                            {[
                              { label: 'Active Matters', href: '/dashboard/cases', icon: Briefcase },
                              { label: 'Client Registry', href: '/dashboard/clients', icon: Users },
                              { label: 'Law Library', href: '/dashboard/research', icon: BookOpen },
                              { label: 'Documents Vault', href: '/dashboard/documents', icon: FileText },
                            ].map(item => (
                              <button
                                key={item.href}
                                onClick={() => handleResultClick(item.href)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-all group"
                              >
                                <item.icon size={14} className="text-gray-600 group-hover:text-brand-primary transition-colors shrink-0" />
                                <span className="text-xs font-inter font-medium text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
                              </button>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                            <Sparkles size={11} className="text-brand-primary/60" />
                            <p className="text-[9px] text-gray-600 font-inter">Type to search · <kbd className="font-mono">Esc</kbd> to close</p>
                          </div>
                        </div>
                      )}

                      {/* Results */}
                      {searchQuery.trim() && (
                        <div className="p-3 max-h-[420px] overflow-y-auto no-scrollbar">
                          {searchResults.length === 0 ? (
                            <div className="flex flex-col items-center py-8 text-center">
                              <Search size={28} className="text-gray-700 mb-3" />
                              <p className="text-sm font-bold text-gray-400 font-inter">No matches found</p>
                              <p className="text-[10px] text-gray-600 mt-1 font-inter">Try the AI Knowledge Base for semantic search</p>
                            </div>
                          ) : (
                            (() => {
                              const categories = ['Matters', 'Clients', 'Staff', 'Documents', 'Research'] as const;
                              return categories.map(cat => {
                                const catResults = searchResults.filter(r => r.category === cat);
                                if (catResults.length === 0) return null;
                                return (
                                  <div key={cat} className="mb-3">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-primary/70 px-3 mb-1.5">{cat}</p>
                                    <div className="space-y-0.5">
                                      {catResults.map(result => (
                                        <button
                                          key={result.id}
                                          onClick={() => handleResultClick(result.href)}
                                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-all group"
                                        >
                                          <result.icon size={14} className="text-gray-600 group-hover:text-brand-primary shrink-0 transition-colors" />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate font-inter group-hover:text-brand-primary transition-colors">{result.label}</p>
                                            <p className="text-[9px] text-gray-600 truncate font-mono mt-0.5">{result.sub}</p>
                                          </div>
                                          <ArrowRight size={12} className="text-gray-700 group-hover:text-brand-primary shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              });
                            })()
                          )}

                          {/* AI Redirect CTA */}
                          <div className="mt-2 pt-2 border-t border-white/5">
                            <button
                              onClick={handleSearchSubmit as unknown as React.MouseEventHandler}
                              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-brand-primary/10 transition-all group border border-transparent hover:border-brand-primary/20"
                            >
                              <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/20 transition-all">
                                <Sparkles size={13} className="text-brand-primary" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-xs font-bold text-white font-inter">AI Search Intelligence</p>
                                <p className="text-[9px] text-gray-500 font-inter mt-0.5">Search &quot;{searchQuery}&quot; across the full Knowledge Base</p>
                              </div>
                              <ArrowRight size={13} className="text-brand-primary shrink-0" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                        className="absolute right-0 mt-3 w-60 z-50 glass-panel border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-onyx/80 backdrop-blur-2xl"
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
