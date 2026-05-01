import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MatterStage = 'Intake' | 'Discovery' | 'Pre-Trial' | 'Hearing' | 'Judgment' | 'Closed';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type EventType = 'Filing' | 'Hearing' | 'Deadline' | 'Milestone' | 'Meeting';

export interface Participant {
  id: string;
  name: string;
  role: 'Client' | 'Lead Counsel' | 'Associate' | 'Clerk' | 'Opposing Counsel';
  avatar?: string;
}

export interface MatterEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  date: string;
  isCompleted: boolean;
}

export interface Evidence {
  id: string;
  title: string;
  type: 'Document' | 'Exhibit' | 'Testimony' | 'Digital';
  status: 'Pending' | 'Admitted' | 'Contested';
  uploadedAt: string;
}

export interface Note {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Statute {
  id: string;
  title: string;
  reference: string;
  description: string;
}

export interface Matter {
  id: string;
  suitNumber: string;
  title: string;
  client: string;
  opposingParty: string;
  opposingCounsel: string;
  jurisdiction: string;
  court: string;
  judge: string;
  stage: MatterStage;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  leadCounsel: string;
  team: Participant[];
  events: MatterEvent[];
  evidence: Evidence[];
  notes: Note[];
  statutes: Statute[];
  lastUpdated: string;
  createdAt: string;
}

interface MatterStore {
  matters: Matter[];
  addMatter: (matter: Partial<Matter>) => void;
  updateMatter: (id: string, updates: Partial<Matter>) => void;
  getMatter: (id: string) => Matter | undefined;
}

const initialMatters: Matter[] = [
  {
    id: '1',
    suitNumber: 'FHC/ABJ/CS/120/24',
    title: 'Zuma vs Federal Govt of Nigeria',
    client: 'Zuma Energy Ltd',
    opposingParty: 'Federal Government of Nigeria',
    opposingCounsel: 'Abubakar Malami & Co',
    jurisdiction: 'Abuja',
    court: 'Federal High Court 4',
    judge: 'Hon. Justice B.F.M. Nyako',
    stage: 'Hearing',
    riskLevel: 'High',
    riskScore: 78,
    leadCounsel: 'Chief Elameen SAN',
    team: [
      { id: '1', name: 'John Doe', role: 'Lead Counsel' },
      { id: '2', name: 'Jane Smith', role: 'Associate' }
    ],
    events: [
      { id: 'e1', type: 'Hearing', title: 'Substantive Hearing', date: '2026-05-15', isCompleted: false },
      { id: 'e2', type: 'Filing', title: 'Statement of Defense', date: '2026-04-10', isCompleted: true }
    ],
    evidence: [
      { id: 'ev1', title: 'Oil Prospecting License 245', type: 'Document', status: 'Admitted', uploadedAt: '2026-04-12' }
    ],
    notes: [
      { id: 'n1', author: 'Jane Smith', content: 'Met with client to discuss new evidence regarding the OPL 245 license.', createdAt: '2026-04-15' }
    ],
    statutes: [
      { id: 's1', title: 'Petroleum Industry Act 2021', reference: 'Section 124(1)', description: 'Regulates the licensing of oil prospecting assets.' }
    ],
    lastUpdated: '2 hours ago',
    createdAt: '2026-01-10'
  },
  {
    id: '2',
    suitNumber: 'SC/CV/245/2023',
    title: 'Acme Corp Intellectual Property Appeal',
    client: 'Acme Corp',
    opposingParty: 'Globex Inc',
    opposingCounsel: 'Wole Olanipekun & Co',
    jurisdiction: 'Lagos',
    court: 'Supreme Court',
    judge: 'Hon. Justice Ariwoola',
    stage: 'Judgment',
    riskLevel: 'Low',
    riskScore: 25,
    leadCounsel: 'Barr. Aisha Yusuf',
    team: [{ id: '3', name: 'Aisha Yusuf', role: 'Lead Counsel' }],
    events: [{ id: 'e3', type: 'Hearing', title: 'Final Judgment', date: '2026-05-20', isCompleted: false }],
    evidence: [],
    notes: [],
    statutes: [],
    lastUpdated: 'Yesterday',
    createdAt: '2023-11-20'
  }
];

export const useMatterStore = create<MatterStore>()(
  persist(
    (set, get) => ({
      matters: initialMatters,
      addMatter: (matter) => {
        const newMatter: Matter = {
          id: Math.random().toString(36).substring(7),
          suitNumber: '',
          title: '',
          client: '',
          opposingParty: '',
          opposingCounsel: '',
          jurisdiction: '',
          court: '',
          judge: '',
          stage: 'Intake',
          riskLevel: 'Low',
          riskScore: 10,
          leadCounsel: 'Unassigned',
          team: [],
          events: [],
          evidence: [],
          notes: [],
          statutes: [],
          lastUpdated: 'Just now',
          createdAt: new Date().toISOString(),
          ...matter,
        } as Matter;
        set((state) => ({ matters: [newMatter, ...state.matters] }));
      },
      updateMatter: (id, updates) => {
        set((state) => ({
          matters: state.matters.map((m) => (m.id === id ? { ...m, ...updates, lastUpdated: 'Just now' } : m)),
        }));
      },
      getMatter: (id) => get().matters.find((m) => m.id === id),
    }),
    {
      name: 'zuma-matter-storage',
    }
  )
);
