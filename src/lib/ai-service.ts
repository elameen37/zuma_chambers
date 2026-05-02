import { create } from 'zustand';

export interface AIInsight {
  id: string;
  type: 'Summary' | 'Risk' | 'Draft' | 'Checklist' | 'Precedent' | 'Sentiment';
  content: string;
  confidence: number;
  category: 'Critical' | 'Warning' | 'Suggestion' | 'Info';
}

export interface SmartSearchResult {
  id: string;
  title: string;
  type: 'Matter' | 'Statute' | 'Document' | 'Contact';
  relevance: number;
  snippet: string;
}

interface AIStore {
  isAnalyzing: boolean;
  insights: Record<string, AIInsight[]>;
  processMatter: (matterId: string) => Promise<void>;
  generateDraft: (type: string, context: string) => Promise<string>;
  smartSearch: (query: string) => Promise<SmartSearchResult[]>;
}

export const useAIStore = create<AIStore>((set, get) => ({
  isAnalyzing: false,
  insights: {},

  processMatter: async (matterId) => {
    set({ isAnalyzing: true });
    // Simulate complex AI processing
    await new Promise(r => setTimeout(r, 2000));
    
    const newInsights: AIInsight[] = [
      {
        id: '1',
        type: 'Summary',
        content: 'This matter involves a multi-party contractual dispute regarding oil-block licensing. Key legal pivot is the interpretation of Clause 12.4 regarding Force Majeure.',
        confidence: 0.98,
        category: 'Info'
      },
      {
        id: '2',
        type: 'Risk',
        content: 'Potential jurisdictional challenge detected. The 90-day statutory limit for filing a cross-appeal expires in 72 hours.',
        confidence: 0.95,
        category: 'Critical'
      },
      {
        id: '3',
        type: 'Precedent',
        content: 'Highly relevant authority: Shell Petroleum Dev. Co. v. Nwawka [2003] NWLR. This addresses similar licensing revocations.',
        confidence: 0.88,
        category: 'Suggestion'
      },
      {
        id: '4',
        type: 'Checklist',
        content: '1. Verify tax clearance of the 3rd Defendant. 2. File Motion for Extension of Time. 3. Serve Notice of Appearance on the Attorney General.',
        confidence: 0.92,
        category: 'Suggestion'
      }
    ];

    set(state => ({
      insights: { ...state.insights, [matterId]: newInsights },
      isAnalyzing: false
    }));
  },

  generateDraft: async (type, context) => {
    await new Promise(r => setTimeout(r, 1500));
    return `[AI DRAFT: ${type.toUpperCase()}]\n\nIN THE HIGH COURT OF NIGERIA...\n\nBETWEEN: [Plaintiff] AND: [Defendant]\n\nMOTION ON NOTICE...\n\nTAKE NOTICE that this Honorable Court shall be moved on the grounds that ${context}...`;
  },

  smartSearch: async (query) => {
    await new Promise(r => setTimeout(r, 800));
    return [
      { id: 'r1', title: 'Evidence Act 2011', type: 'Statute', relevance: 0.98, snippet: 'Admissibility of electronic evidence in Nigerian courts...' },
      { id: 'r2', title: 'Zuma v. Federal Govt', type: 'Matter', relevance: 0.92, snippet: 'Ongoing litigation regarding sovereign immunity...' },
      { id: 'r3', title: 'Retainer Agreement - Pan African', type: 'Document', relevance: 0.85, snippet: 'Clause 4: Dispute resolution through arbitration in Lagos...' }
    ];
  }
}));
