import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addDocument: (doc: Partial<LegalDocument>) => void;
  addVersion: (docId: string, version: DocumentVersion) => void;
  updateDocument: (id: string, updates: Partial<LegalDocument>) => void;
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
      addDocument: (doc) => {
        const newDoc: LegalDocument = {
          id: Math.random().toString(36).substring(7),
          title: '',
          category: 'Contracts',
          currentVersion: 1,
          status: 'Draft',
          privilege: 'Confidential',
          versions: [],
          createdAt: new Date().toISOString(),
          ...doc,
        } as LegalDocument;
        set((state) => ({ documents: [newDoc, ...state.documents] }));
      },
      addVersion: (docId, version) => {
        set((state) => ({
          documents: state.documents.map((d) => 
            d.id === docId ? { ...d, currentVersion: version.version, versions: [version, ...d.versions] } : d
          )
        }));
      },
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },
    }),
    { name: 'zuma-document-storage' }
  )
);
