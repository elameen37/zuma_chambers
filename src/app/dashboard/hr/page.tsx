'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Users, Scale, BookOpen, Layout, FileText, Receipt,
  MapPin, Palette, Bell, ShieldCheck, Plus, Edit2, Trash2,
  Eye, ToggleLeft, ToggleRight, Save, ChevronRight, X, Check
} from '@/components/shared/Icons';

// ─── Types ────────────────────────────────────────────────────────────────────
type CMSTab = {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
};

// ─── CMS Tabs ─────────────────────────────────────────────────────────────────
const CMS_TABS: CMSTab[] = [
  { id: 'pages',        label: 'Website Pages',     icon: Globe,       description: 'Manage public-facing website pages and their content.' },
  { id: 'attorneys',    label: 'Attorney Profiles',  icon: Users,       description: 'Add, edit, and manage attorney bios and credentials.' },
  { id: 'practice',     label: 'Practice Areas',     icon: Scale,       description: 'Update legal specializations and service descriptions.' },
  { id: 'blog',         label: 'Blog & Insights',    icon: BookOpen,    description: 'Publish legal insights, newsletters, and case reviews.' },
  { id: 'homepage',     label: 'Homepage Sections',  icon: Layout,      description: 'Configure hero, stats, CTA, and featured content blocks.' },
  { id: 'legal',        label: 'Legal Templates',    icon: FileText,    description: 'Manage reusable legal document and contract templates.' },
  { id: 'invoice',      label: 'Invoice Templates',  icon: Receipt,     description: 'Configure branded invoice layouts and payment terms.' },
  { id: 'branches',     label: 'Office Branches',    icon: MapPin,      description: 'Manage chamber office locations and contact details.' },
  { id: 'branding',     label: 'Chamber Branding',   icon: Palette,     description: 'Control logos, colors, typography, and brand assets.' },
  { id: 'notifications',label: 'Notification Rules', icon: Bell,        description: 'Define trigger-based alert rules for staff and clients.' },
  { id: 'permissions',  label: 'Role Permissions',   icon: ShieldCheck, description: 'Configure access controls and role-based permissions.' },
];

// ─── Shared Table Row ──────────────────────────────────────────────────────────
const TableRow = ({ name, status, badge, onEdit, onDelete }: {
  name: string; status?: boolean; badge?: string; onEdit?: () => void; onDelete?: () => void;
}) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 hover:bg-white/3 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${status !== false ? 'bg-green-400' : 'bg-gray-600'}`} />
      <span className="text-[13px] font-bold text-white font-inter">{name}</span>
      {badge && (
        <span className="text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
          {badge}
        </span>
      )}
    </div>
    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all">
        <Edit2 size={14} />
      </button>
      <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
        <Trash2 size={14} />
      </button>
    </div>
  </div>
);

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, description, onAdd, addLabel = 'Add New' }: {
  title: string; description: string; onAdd?: () => void; addLabel?: string;
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
    <div>
      <h2 className="text-2xl font-bold text-white font-playfair mb-2">{title}</h2>
      <p className="text-sm text-gray-500 font-inter font-medium">{description}</p>
    </div>
    {onAdd && (
      <button onClick={onAdd} className="btn-modern !py-3 !px-6 !text-[11px] flex items-center gap-2 whitespace-nowrap">
        <Plus size={16} /> {addLabel}
      </button>
    )}
  </div>
);

// ─── Pages CMS ────────────────────────────────────────────────────────────────
const PagesPanel = () => {
  const pages = [
    { name: 'Home', badge: 'Published', status: true },
    { name: 'About Us', badge: 'Published', status: true },
    { name: 'Practice Areas', badge: 'Published', status: true },
    { name: 'Attorneys', badge: 'Published', status: true },
    { name: 'Insights & Blog', badge: 'Published', status: true },
    { name: 'Contact', badge: 'Draft', status: false },
    { name: 'Careers', badge: 'Draft', status: false },
  ];
  return (
    <div>
      <SectionHeader title="Website Pages" description="Manage the content, SEO metadata, and visibility of all public pages." addLabel="New Page" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 grid grid-cols-3 text-[10px] font-bold tracking-widest uppercase text-gray-500">
          <span>Page Name</span><span>Status</span><span className="text-right">Actions</span>
        </div>
        {pages.map((p) => <TableRow key={p.name} name={p.name} status={p.status} badge={p.badge} />)}
      </div>
    </div>
  );
};

// ─── Attorneys CMS ────────────────────────────────────────────────────────────
const AttorneysPanel = () => {
  const attorneys = [
    { name: 'Chief Olumide Zuma', badge: 'Senior Partner (SAN)', status: true },
    { name: 'Barr. Aisha Yakubu', badge: 'Managing Partner', status: true },
    { name: 'Dr. Emeka Okafor', badge: 'Lead Litigator', status: true },
    { name: 'Sarah Adebayo', badge: 'Senior Associate', status: true },
    { name: 'Ahmed Ibrahim', badge: 'Senior Associate', status: true },
    { name: 'Chioma Nelson', badge: 'Senior Associate', status: false },
  ];
  return (
    <div>
      <SectionHeader title="Attorney Profiles" description="Add new counsel, update bios, credentials, and specializations." addLabel="Add Attorney" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {attorneys.map((a) => <TableRow key={a.name} name={a.name} badge={a.badge} status={a.status} />)}
      </div>
    </div>
  );
};

// ─── Practice Areas CMS ───────────────────────────────────────────────────────
const PracticePanel = () => {
  const areas = [
    { name: 'Litigation & Dispute Resolution', badge: 'Active', status: true },
    { name: 'Corporate & Commercial Law', badge: 'Active', status: true },
    { name: 'Property & Maritime Law', badge: 'Active', status: true },
    { name: 'Criminal Defense', badge: 'Active', status: true },
    { name: 'Tech & IP Law', badge: 'Active', status: true },
    { name: 'Arbitration & ADR', badge: 'Active', status: true },
    { name: 'Compliance & AML', badge: 'Active', status: true },
    { name: 'Government Advisory', badge: 'Draft', status: false },
    { name: 'Family Law', badge: 'Active', status: true },
  ];
  return (
    <div>
      <SectionHeader title="Practice Areas" description="Manage legal specializations, icons, and descriptive content." addLabel="Add Practice Area" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {areas.map((a) => <TableRow key={a.name} name={a.name} badge={a.badge} status={a.status} />)}
      </div>
    </div>
  );
};

// ─── Blog CMS ─────────────────────────────────────────────────────────────────
const BlogPanel = () => {
  const posts = [
    { name: 'AI & Nigerian IP Law', badge: 'Published', status: true },
    { name: '2026 Petroleum Industry Act Amendments', badge: 'Published', status: true },
    { name: 'Supreme Court: Digital Currency Ruling', badge: 'Published', status: true },
    { name: 'Q1 2026 Legal Excellence Newsletter', badge: 'Published', status: true },
    { name: 'Cybersecurity Mandates for Fintech', badge: 'Draft', status: false },
    { name: 'Family Office Structuring Guide', badge: 'Draft', status: false },
  ];
  return (
    <div>
      <SectionHeader title="Blog & Insights" description="Publish, schedule, and manage legal insight articles and newsletters." addLabel="New Post" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {posts.map((p) => <TableRow key={p.name} name={p.name} badge={p.badge} status={p.status} />)}
      </div>
    </div>
  );
};

// ─── Homepage Sections CMS ────────────────────────────────────────────────────
const HomepagePanel = () => {
  const sections = [
    { name: 'Hero Banner', badge: 'Visible', status: true },
    { name: 'Statistics Bar', badge: 'Visible', status: true },
    { name: 'Practice Areas Highlight', badge: 'Visible', status: true },
    { name: 'Featured Attorney', badge: 'Hidden', status: false },
    { name: 'Client Testimonials', badge: 'Hidden', status: false },
    { name: 'Call-to-Action Block', badge: 'Visible', status: true },
    { name: 'Awards & Recognitions', badge: 'Draft', status: false },
  ];
  return (
    <div>
      <SectionHeader title="Homepage Sections" description="Toggle homepage content blocks on or off and configure their content." />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {sections.map((s) => <TableRow key={s.name} name={s.name} badge={s.badge} status={s.status} />)}
      </div>
    </div>
  );
};

// ─── Legal Templates CMS ──────────────────────────────────────────────────────
const LegalTemplatesPanel = () => {
  const templates = [
    { name: 'Client Engagement Letter', badge: 'Active', status: true },
    { name: 'Non-Disclosure Agreement (NDA)', badge: 'Active', status: true },
    { name: 'Retainer Agreement', badge: 'Active', status: true },
    { name: 'Corporate Governance Template', badge: 'Active', status: true },
    { name: 'Litigation Authority Letter', badge: 'Active', status: true },
    { name: 'Power of Attorney', badge: 'Draft', status: false },
    { name: 'Will & Testament Template', badge: 'Draft', status: false },
  ];
  return (
    <div>
      <SectionHeader title="Legal Templates" description="Manage reusable document templates used across case management." addLabel="New Template" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {templates.map((t) => <TableRow key={t.name} name={t.name} badge={t.badge} status={t.status} />)}
      </div>
    </div>
  );
};

// ─── Invoice Templates CMS ────────────────────────────────────────────────────
const InvoicePanel = () => {
  const templates = [
    { name: 'Standard Legal Invoice', badge: 'Default', status: true },
    { name: 'Corporate Retainer Invoice', badge: 'Active', status: true },
    { name: 'Litigation Fee Invoice', badge: 'Active', status: true },
    { name: 'Consultation Invoice', badge: 'Active', status: true },
    { name: 'Pro Bono Record', badge: 'Active', status: true },
  ];
  return (
    <div>
      <SectionHeader title="Invoice Templates" description="Configure branded billing layouts, tax fields, and payment terms." addLabel="New Template" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {templates.map((t) => <TableRow key={t.name} name={t.name} badge={t.badge} status={t.status} />)}
      </div>
    </div>
  );
};

// ─── Branches CMS ─────────────────────────────────────────────────────────────
const BranchesPanel = () => {
  const branches = [
    { name: 'Abuja HQ — Central Area', badge: 'HQ', status: true },
    { name: 'Lagos Office — Victoria Island', badge: 'Active', status: true },
    { name: 'London — Canary Wharf', badge: 'Active', status: true },
    { name: 'New York — Midtown Manhattan', badge: 'Active', status: true },
    { name: 'Dubai — DIFC', badge: 'Coming Soon', status: false },
  ];
  return (
    <div>
      <SectionHeader title="Office Branches" description="Manage chamber locations, contact details, and operating hours." addLabel="Add Branch" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {branches.map((b) => <TableRow key={b.name} name={b.name} badge={b.badge} status={b.status} />)}
      </div>
    </div>
  );
};

// ─── Branding CMS ─────────────────────────────────────────────────────────────
const BrandingPanel = () => {
  const brandFields = [
    { label: 'Primary Brand Color', value: '#C5A059', type: 'color' },
    { label: 'Secondary Color', value: '#0A0A0B', type: 'color' },
    { label: 'Primary Font', value: 'Playfair Display', type: 'text' },
    { label: 'Body Font', value: 'Inter', type: 'text' },
    { label: 'Firm Full Name', value: '[COMPANY_NAME]', type: 'text' },
    { label: 'Tagline', value: 'Elite Legal Counsel', type: 'text' },
    { label: 'Email Domain', value: '@company.law', type: 'text' },
  ];
  return (
    <div>
      <SectionHeader title="Chamber Branding" description="Control your firm's visual identity, colors, typography, and brand copy." />
      <div className="glass-panel rounded-2xl p-8 space-y-6">
        {brandFields.map((f) => (
          <div key={f.label} className="flex flex-col md:flex-row md:items-center gap-4">
            <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 font-inter w-48 shrink-0">{f.label}</label>
            <div className="flex items-center gap-4 flex-1">
              {f.type === 'color' && (
                <div className="w-10 h-10 rounded-xl border border-white/10" style={{ backgroundColor: f.value }} />
              )}
              <input
                defaultValue={f.value}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-[13px] font-bold text-white font-inter focus:border-brand-primary outline-none transition-all"
              />
            </div>
          </div>
        ))}
        <div className="pt-6 border-t border-white/5">
          <button className="btn-modern !py-3 !px-8 !text-[11px] flex items-center gap-2">
            <Save size={16} /> Save Branding
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Notifications CMS ────────────────────────────────────────────────────────
const NotificationsPanel = () => {
  const rules = [
    { name: 'New Case Assignment', badge: 'Email + In-App', status: true },
    { name: 'Upcoming Court Hearing (48h)', badge: 'Email + SMS', status: true },
    { name: 'Invoice Overdue (7 days)', badge: 'Email', status: true },
    { name: 'Document Uploaded to Case', badge: 'In-App', status: true },
    { name: 'New Client Intake Submitted', badge: 'Email + In-App', status: true },
    { name: 'Audit Log Critical Event', badge: 'Email', status: true },
    { name: 'Monthly Newsletter Digest', badge: 'Email', status: false },
    { name: 'Compliance Deadline Alert', badge: 'Email + SMS', status: false },
  ];
  return (
    <div>
      <SectionHeader title="Notification Rules" description="Define trigger-based alerts delivered to staff, clients, and administrators." addLabel="New Rule" />
      <div className="glass-panel rounded-2xl overflow-hidden">
        {rules.map((r) => <TableRow key={r.name} name={r.name} badge={r.badge} status={r.status} />)}
      </div>
    </div>
  );
};

// ─── Permissions CMS ──────────────────────────────────────────────────────────
const PermissionsPanel = () => {
  type RoleKey = 'Partner' | 'Associate' | 'Admin' | 'Finance' | 'Clerk' | 'Client';
  const roles: RoleKey[] = ['Partner', 'Associate', 'Admin', 'Finance', 'Clerk', 'Client'];
  const perms = [
    'View Cases', 'Create Cases', 'Edit Cases', 'Delete Cases',
    'View Documents', 'Upload Documents', 'View Finance', 'Create Invoices',
    'Manage Users', 'View Audit Logs', 'Manage Settings', 'View Analytics',
  ];
  const matrix: Record<RoleKey, number[]> = {
    Partner:   [1,1,1,1,1,1,1,1,1,1,1,1],
    Associate: [1,1,1,0,1,1,1,0,0,0,0,1],
    Admin:     [1,1,1,1,1,1,1,1,1,1,1,0],
    Finance:   [1,0,0,0,1,0,1,1,0,0,0,0],
    Clerk:     [1,0,1,0,1,1,0,0,0,0,0,0],
    Client:    [1,0,0,0,1,0,0,0,0,0,0,0],
  };
  return (
    <div>
      <SectionHeader title="Role Permissions" description="Configure access controls across the 6 role tiers. Changes apply immediately." />
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-500">Permission</th>
                {roles.map((r) => (
                  <th key={r} className="px-4 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-500 text-center">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {perms.map((perm, pi) => (
                <tr key={perm} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-white font-inter">{perm}</td>
                  {roles.map((role, ri) => (
                    <td key={role} className="px-4 py-4 text-center">
                      <div className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center ${
                        matrix[role][pi] ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/5 text-gray-700'
                      }`}>
                        {matrix[role][pi] ? <Check size={14} /> : <X size={14} />}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Panel Registry ───────────────────────────────────────────────────────────
const PANELS: Record<string, React.ReactNode> = {
  pages:         <PagesPanel />,
  attorneys:     <AttorneysPanel />,
  practice:      <PracticePanel />,
  blog:          <BlogPanel />,
  homepage:      <HomepagePanel />,
  legal:         <LegalTemplatesPanel />,
  invoice:       <InvoicePanel />,
  branches:      <BranchesPanel />,
  branding:      <BrandingPanel />,
  notifications: <NotificationsPanel />,
  permissions:   <PermissionsPanel />,
};

// ─── Main CMS Page ─────────────────────────────────────────────────────────────
export default function ChamberAdminCMSPage() {
  const [activeTab, setActiveTab] = useState('pages');
  const activeTabData = CMS_TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="heading-premium text-3xl md:text-4xl text-white font-playfair mb-2">Chamber Admin CMS</h1>
          <p className="text-sm text-gray-500 font-inter font-medium">
            Central control panel for all website content, configurations, and operational settings.
          </p>
        </div>
        <div className="flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl text-[10px] font-bold text-brand-primary uppercase tracking-widest">
          <Eye size={14} /> Live Preview Mode
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-panel rounded-2xl p-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          {CMS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] font-bold tracking-[0.1em] uppercase font-inter transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-brand-primary text-onyx shadow-gold-glow'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Context */}
      <div className="flex items-center gap-3 text-[11px] text-gray-500 font-inter font-bold">
        <span className="text-brand-primary">CMS</span>
        <ChevronRight size={12} />
        <span className="text-white">{activeTabData.label}</span>
        <span className="ml-4 text-gray-600">— {activeTabData.description}</span>
      </div>

      {/* Panel Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {PANELS[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
