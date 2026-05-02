import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ResourceType = 'Statute' | 'CaseLaw' | 'Precedent' | 'Memo';
export type CourtLevel = 'Supreme Court' | 'Court of Appeal' | 'High Court';

export interface LegalResource {
  id: string;
  type: ResourceType;
  title: string;
  citation?: string;
  year: number;
  content: string;
  tags: string[];
  court?: CourtLevel;
  judge?: string;
  author?: string;
  isSaved?: boolean;
}

export interface LegalMemo {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  relatedCases: string[];
}

interface ResearchStore {
  resources: LegalResource[];
  savedAuthorities: string[]; // IDs
  memos: LegalMemo[];
  
  toggleSave: (id: string) => void;
  addMemo: (memo: LegalMemo) => void;
  searchResources: (query: string) => LegalResource[];
}

const initialResources: LegalResource[] = [
  {
    id: 's1',
    type: 'Statute',
    title: 'Evidence Act 2011',
    citation: 'Laws of the Federation of Nigeria',
    year: 2011,
    content: 'An Act to consolidate the law relating to Evidence in all judicial proceedings and for connected purposes.',
    tags: ['Evidence', 'Civil Procedure', 'Criminal Procedure']
  },
  {
    id: 's2',
    type: 'Statute',
    title: 'Companies and Allied Matters Act (CAMA) 2020',
    citation: 'CAMA 2020',
    year: 2020,
    content: 'An Act to repeal the Companies and Allied Matters Act 1990 and enact the Companies and Allied Matters Act 2020.',
    tags: ['Corporate', 'Business', 'Governance']
  },
  {
    id: 'c1',
    type: 'CaseLaw',
    title: 'Fawehinmi v. Abacha',
    citation: '(2000) 6 NWLR (Pt. 660) 228',
    year: 2000,
    court: 'Supreme Court',
    judge: 'Hon. Justice Ogundare, JSC',
    content: 'The African Charter on Human and Peoples Rights (Ratification and Enforcement) Act is a statute with international flavor.',
    tags: ['Human Rights', 'Constitutional Law']
  },
  {
    id: 'c2',
    type: 'CaseLaw',
    title: 'Savannah Bank v. Ajilo',
    citation: '(1989) 1 NWLR (Pt. 97) 305',
    year: 1989,
    court: 'Supreme Court',
    judge: 'Hon. Justice Uwais, JSC',
    content: 'Every person who owned a right of occupancy before the Land Use Act came into effect is deemed to be a holder of a statutory right of occupancy.',
    tags: ['Land Law', 'Property']
  },
  {
    id: 'p1',
    type: 'Precedent',
    title: 'Motion for Stay of Execution (Commercial)',
    year: 2024,
    content: 'Standard template for requesting a stay of execution in high-value commercial litigation.',
    tags: ['Litigation', 'Commercial', 'Stay of Execution']
  }
];

export const useResearchStore = create<ResearchStore>()(
  persist(
    (set, get) => ({
      resources: initialResources,
      savedAuthorities: [],
      memos: [
        {
          id: 'm1',
          title: 'Analysis of Section 124(1) of the Petroleum Industry Act',
          author: 'Chief Elameen SAN',
          date: '2026-03-15',
          summary: 'Executive summary of the regulatory implications for oil prospecting licenses.',
          content: 'Full text of the legal memo regarding PIA 2021...',
          relatedCases: ['c1', 'c2']
        }
      ],
      
      toggleSave: (id) => {
        set((state) => {
          const isSaved = state.savedAuthorities.includes(id);
          return {
            savedAuthorities: isSaved 
              ? state.savedAuthorities.filter(sid => sid !== id)
              : [...state.savedAuthorities, id]
          };
        });
      },
      
      addMemo: (memo) => {
        set((state) => ({ memos: [memo, ...state.memos] }));
      },
      
      searchResources: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().resources.filter(r => 
          r.title.toLowerCase().includes(lowerQuery) || 
          r.content.toLowerCase().includes(lowerQuery) ||
          r.citation?.toLowerCase().includes(lowerQuery) ||
          r.tags.some(t => t.toLowerCase().includes(lowerQuery))
        );
      }
    }),
    {
      name: 'zuma-research-storage',
    }
  )
);
