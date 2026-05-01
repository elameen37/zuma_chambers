'use client';

import React from 'react';
import ChamberCalendar from '@/components/legal/ChamberCalendar';
import { CalendarDays, Plus, List } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Court Calendar</h1>
          <p className="text-gray-400 text-sm font-inter">Centralized litigation schedule and deadline monitoring for the entire chamber.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/calendar/daily" className="btn-outline py-2.5 px-6 text-xs flex items-center gap-2">
            <List size={16} /> Daily Cause List
          </Link>
          <button className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2">
            <Plus size={16} /> Schedule Event
          </button>
        </div>
      </div>

      <div className="mt-8">
        <ChamberCalendar />
      </div>
    </div>
  );
}
