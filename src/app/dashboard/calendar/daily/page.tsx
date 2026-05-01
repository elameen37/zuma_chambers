'use client';

import React from 'react';
import CauseListBoard from '@/components/legal/CauseListBoard';
import DailyBriefing from '@/components/legal/DailyBriefing';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function DailyCalendarPage() {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/calendar" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-gold-primary transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-3xl font-bold text-white font-playfair">Daily Litigation Desk</h1>
          </div>
          <p className="text-gray-400 text-sm font-inter">Live cause list, courtroom allocations, and chamber briefings.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline py-2.5 px-6 text-xs flex items-center gap-2">
            <Share2 size={16} /> Share Briefing
          </button>
          <button className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2">
            <Printer size={16} /> Print Cause List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <CauseListBoard date={today} />
        </div>
        <div>
          <DailyBriefing date={today} />
        </div>
      </div>
    </div>
  );
}
