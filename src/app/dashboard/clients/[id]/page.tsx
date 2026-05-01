'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientProfile from '@/components/crm/ClientProfile';
import { ArrowLeft, MessageSquare, Plus, Download } from 'lucide-react';
import Link from 'next/link';
import { useClientStore } from '@/lib/client-service';

export default function ClientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const client = useClientStore((state) => state.getClient(id as string));

  if (!client) {
    return <div className="text-center py-20 text-gray-500">Client not found.</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/clients" className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-gold-primary transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-3xl font-bold text-white font-playfair">Client Relationship Dossier</h1>
          </div>
          <p className="text-gray-400 text-sm font-inter">Deep-dive intelligence and management for {client.name}.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-outline py-2.5 px-6 text-xs flex items-center gap-2">
            <MessageSquare size={16} /> Log Interaction
          </button>
          <button className="btn-luxury py-2.5 px-6 text-xs flex items-center gap-2">
            <Download size={16} /> Export Dossier
          </button>
        </div>
      </div>

      <div className="mt-8">
        <ClientProfile client={client} />
      </div>
    </div>
  );
}
