'use client';

import React from 'react';
import MatterIntakeForm from '@/components/legal/MatterIntakeForm';
import { Gavel, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewMatterPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/cases" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-gold-primary transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-3xl font-bold text-white font-playfair">New Matter Intake</h1>
          </div>
          <p className="text-gray-400 text-sm font-inter">Follow the wizard to docket a new case file into the Chamber Intelligence system.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-gold-primary/10 rounded-lg border border-gold-primary/20">
          <Gavel className="text-gold-primary" size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-primary">Clerk Office</span>
        </div>
      </div>

      <div className="mt-8">
        <MatterIntakeForm />
      </div>
    </div>
  );
}
