'use client';

import React from 'react';
import WorkflowBoard from '@/components/legal/WorkflowBoard';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function WorkflowPage() {
  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair mb-2">Workspace Pipeline</h1>
          <p className="text-gray-400 text-sm font-inter">Monitor and manage the progression of active legal matters through the chamber lifecycle.</p>
        </div>
        <Link href="/dashboard/cases/new" className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2">
          <Plus size={16} /> New Matter
        </Link>
      </div>

      <div className="mt-8">
        <WorkflowBoard />
      </div>
    </div>
  );
}
