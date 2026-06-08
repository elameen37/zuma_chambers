import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export type TemplateCategory = 'Pleadings' | 'Motions' | 'Contracts' | 'Opinions' | 'Affidavits';

export interface DocumentTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  variables: string[]; // e.g., ["clientName", "courtName"]
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileUrl: string;
  changes: string;
  author: string;
  createdAt: string;
}

export interface LegalDocument {
  id: string;
  matterId?: string;
  clientId?: string;
  title: string;
  category: TemplateCategory;
  currentVersion: number;
  status: 'Draft' | 'Review' | 'Signed' | 'Archived';
  privilege: 'Public' | 'Confidential' | 'Privileged';
  expiryDate?: string;
  versions: DocumentVersion[];
  createdAt: string;
}

interface DocumentStore {
  templates: DocumentTemplate[];
  documents: LegalDocument[];
  addDocument: (doc: Partial<LegalDocument>) => Promise<void>;
  addVersion: (docId: string, version: DocumentVersion) => void;
  updateDocument: (id: string, updates: Partial<LegalDocument>) => void;
  syncWithSupabase: () => Promise<void>;
  subscribeToRealtime: () => () => void;
}

const initialTemplates: DocumentTemplate[] = [
  { id: 't1', title: 'NDA - Mutual Non-Disclosure', category: 'Contracts', description: 'Standard mutual confidentiality agreement.', variables: ['partyA', 'partyB', 'duration'] },
  { id: 't2', title: 'Motion for Stay of Execution', category: 'Motions', description: 'Formal request to suspend enforcement of a judgment.', variables: ['suitNumber', 'applicant', 'respondent', 'grounds'] },
  { id: 't3', title: 'Affidavit of Urgency', category: 'Affidavits', description: 'Sworn statement for emergency applications.', variables: ['deponentName', 'facts'] },
  { id: 't4', title: 'Professional Legal Opinion', category: 'Opinions', description: 'Standard layout for formal advisory notes.', variables: ['subject', 'background', 'analysis', 'conclusion'] }
];

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      templates: initialTemplates,
      documents: [],

      addDocument: async (doc) => {
        const newDoc: LegalDocument = {
          id: crypto.randomUUID(),
          title: '',
          category: 'Contracts',
          currentVersion: 1,
          status: 'Draft',
          privilege: 'Confidential',
          versions: [],
          createdAt: new Date().toISOString(),
          ...doc,
        } as LegalDocument;

        // Optimistic update
        set((state) => ({ documents: [newDoc, ...state.documents] }));

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('legal_documents') as any).insert({
            id: newDoc.id,
            title: newDoc.title,
            category: newDoc.category,
            current_version: newDoc.currentVersion,
            status: newDoc.status,
            privilege: newDoc.privilege,
            expiry_date: newDoc.expiryDate ?? null,
            matter_id: newDoc.matterId ?? null,
            client_id: newDoc.clientId ?? null,
          });
        } catch (e) {
          console.warn('Failed to persist document to Supabase', e);
        }
      },

      addVersion: (docId, version) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === docId ? { ...d, currentVersion: version.version, versions: [version, ...d.versions] } : d
          ),
        }));
      },

      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (supabase.from('legal_documents') as any).update({
            status: updates.status,
            privilege: updates.privilege,
            expiry_date: updates.expiryDate ?? null,
          }).eq('id', id);
        } catch (e) {
          console.warn('Failed to update document in Supabase', e);
        }
      },

      syncWithSupabase: async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from('legal_documents') as any)
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapped: LegalDocument[] = data.map((row: any) => {
              const existing = get().documents.find((d) => d.id === row.id);
              return {
                id: row.id,
                matterId: row.matter_id ?? undefined,
                clientId: row.client_id ?? undefined,
                title: row.title,
                category: (row.category ?? 'Contracts') as TemplateCategory,
                currentVersion: row.current_version ?? 1,
                status: (row.status ?? 'Draft') as LegalDocument['status'],
                privilege: (row.privilege ?? 'Confidential') as LegalDocument['privilege'],
                expiryDate: row.expiry_date ?? undefined,
                versions: existing?.versions ?? [],
                createdAt: row.created_at,
              };
            });
            set({ documents: mapped });
          }
        } catch (e) {
          console.error('Failed to sync documents from Supabase', e);
        }
      },

      subscribeToRealtime: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const channel = (supabase as any)
          .channel('legal-documents-realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'legal_documents' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (payload: any) => {
              const { eventType, new: newRow, old: oldRow } = payload;

              if (eventType === 'INSERT') {
                const existing = get().documents.find((d) => d.id === newRow.id);
                if (!existing) {
                  const doc: LegalDocument = {
                    id: newRow.id,
                    title: newRow.title,
                    category: (newRow.category ?? 'Contracts') as TemplateCategory,
                    currentVersion: newRow.current_version ?? 1,
                    status: (newRow.status ?? 'Draft') as LegalDocument['status'],
                    privilege: (newRow.privilege ?? 'Confidential') as LegalDocument['privilege'],
                    expiryDate: newRow.expiry_date ?? undefined,
                    versions: [],
                    createdAt: newRow.created_at,
                  };
                  set((state) => ({ documents: [doc, ...state.documents] }));
                }
              } else if (eventType === 'UPDATE') {
                set((state) => ({
                  documents: state.documents.map((d) =>
                    d.id === newRow.id
                      ? {
                          ...d,
                          title: newRow.title ?? d.title,
                          status: newRow.status ?? d.status,
                          privilege: newRow.privilege ?? d.privilege,
                          currentVersion: newRow.current_version ?? d.currentVersion,
                          expiryDate: newRow.expiry_date ?? d.expiryDate,
                        }
                      : d
                  ),
                }));
              } else if (eventType === 'DELETE') {
                set((state) => ({
                  documents: state.documents.filter((d) => d.id !== oldRow.id),
                }));
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      },
    }),
    { name: 'xyz-document-storage' }
  )
);
