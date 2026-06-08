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
  // Calendar & Court Logistics
  courtroom?: string;
  assignedCounsel?: string[];
  assignedClerk?: string;
  attendanceStatus?: 'Pending' | 'Attended' | 'Missed';
  outcome?: string;
  nextHearingDate?: string;
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
  type: string;
  nextHearing?: string | null;
  lastUpdated: string;
  createdAt: string;
}

interface MatterStore {
  matters: Matter[];
  addMatter: (matter: Partial<Matter>) => Promise<void> | void;
  updateMatter: (id: string, updates: Partial<Matter>) => void;
  getMatter: (id: string) => Matter | undefined;
  syncWithSupabase: () => Promise<void>;
  subscribeToRealtime: () => () => void;
}

const initialMatters: Matter[] = [
  {
    id: '1',
    suitNumber: 'FHC/ABJ/CS/120/24',
    title: 'XYZ vs Federal Govt of Nigeria',
    client: 'XYZ Energy Ltd',
    opposingParty: 'Federal Government of Nigeria',
    opposingCounsel: 'Abubakar Malami & Co',
    jurisdiction: 'Abuja',
    court: 'Federal High Court 4',
    judge: 'Hon. Justice B.F.M. Nyako',
    stage: 'Hearing',
    riskLevel: 'High',
    riskScore: 78,
    leadCounsel: 'Chief Elameen SAN',
    type: 'Civil Litigation',
    team: [
      { id: '1', name: 'John Doe', role: 'Lead Counsel' },
      { id: '2', name: 'Jane Smith', role: 'Associate' }
    ],
    events: [
      { 
        id: 'e1', 
        type: 'Hearing', 
        title: 'Substantive Hearing', 
        date: new Date().toISOString().split('T')[0], // TODAY
        isCompleted: false,
        courtroom: 'Courtroom 4A',
        assignedCounsel: ['Chief Elameen SAN', 'John Doe'],
        assignedClerk: 'Usman Ali',
        attendanceStatus: 'Pending'
      },
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
    type: 'Appellate',
    team: [{ id: '3', name: 'Aisha Yusuf', role: 'Lead Counsel' }],
    events: [
      { 
        id: 'e3', 
        type: 'Hearing', 
        title: 'Final Judgment', 
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // TOMORROW
        isCompleted: false,
        courtroom: 'Supreme Court Chamber 1',
        assignedCounsel: ['Aisha Yusuf'],
        assignedClerk: 'Mary Ebuka',
        attendanceStatus: 'Pending'
      }
    ],
    evidence: [],
    notes: [],
    statutes: [],
    lastUpdated: 'Yesterday',
    createdAt: '2023-11-20'
  },
  {
    id: '3',
    suitNumber: 'NICN/ABJ/12/24',
    title: 'Executive Severance Litigation',
    client: 'James Wilson',
    opposingParty: 'Former Corporate Employer',
    opposingCounsel: 'Okeke & Okeke Chambers',
    jurisdiction: 'Abuja',
    court: 'National Industrial Court',
    judge: 'Hon. Justice K.I. Amadi',
    stage: 'Hearing',
    riskLevel: 'Medium',
    riskScore: 45,
    leadCounsel: 'Adeyemi Cole',
    type: 'Labour & Employment',
    team: [{ id: '4', name: 'Adeyemi Cole', role: 'Lead Counsel' }],
    events: [
      { id: 'e4', type: 'Hearing', title: 'Hearing of Preliminary Objection', date: '2026-04-30', isCompleted: false }
    ],
    evidence: [],
    notes: [],
    statutes: [],
    lastUpdated: '3 hours ago',
    createdAt: '2026-02-15'
  },
  {
    id: '4',
    suitNumber: 'LD/1024/GCM/24',
    title: 'Lagos State Maritime Jurisdiction',
    client: 'Maritime Board',
    opposingParty: 'Lighthouse Shipping Ltd',
    opposingCounsel: 'Spurgeon & Co',
    jurisdiction: 'Lagos',
    court: 'High Court of Lagos State',
    judge: 'Hon. Justice A.J. Coker',
    stage: 'Discovery',
    riskLevel: 'Medium',
    riskScore: 50,
    leadCounsel: 'Ibrahim Musa',
    type: 'Commercial Law',
    team: [{ id: '5', name: 'Ibrahim Musa', role: 'Lead Counsel' }],
    events: [
      { id: 'e5', type: 'Meeting', title: 'Discovery Document Review', date: '2026-04-28', isCompleted: false }
    ],
    evidence: [],
    notes: [],
    statutes: [],
    lastUpdated: '1 day ago',
    createdAt: '2026-01-20'
  },
  {
    id: '5',
    suitNumber: 'FCT/HC/CV/09/24',
    title: 'Global Tech Compliance Audit',
    client: 'Global Tech Inc',
    opposingParty: 'Corporate Affairs Commission',
    opposingCounsel: 'CAC Legal Unit',
    jurisdiction: 'Abuja',
    court: 'FCT High Court',
    judge: 'Hon. Justice Y. Halilu',
    stage: 'Closed',
    riskLevel: 'Low',
    riskScore: 15,
    leadCounsel: 'Sarah Nwosu',
    type: 'Compliance',
    team: [{ id: '6', name: 'Sarah Nwosu', role: 'Lead Counsel' }],
    events: [],
    evidence: [],
    notes: [],
    statutes: [],
    lastUpdated: 'Completed',
    createdAt: '2025-11-10'
  },
  {
    id: '6',
    suitNumber: 'FHC/L/CS/88/24',
    title: 'Bank vs Telecom Aggregator',
    client: 'First National Bank',
    opposingParty: 'Mobile Link Services',
    opposingCounsel: 'Sofola & Co',
    jurisdiction: 'Lagos',
    court: 'Federal High Court, Lagos',
    judge: 'Hon. Justice I.N. Oweibo',
    stage: 'Pre-Trial',
    riskLevel: 'High',
    riskScore: 72,
    leadCounsel: 'Chief Elameen SAN',
    type: 'Civil Litigation',
    team: [{ id: '1', name: 'John Doe', role: 'Lead Counsel' }],
    events: [
      { id: 'e6', type: 'Deadline', title: 'Filing of Pre-Trial Conference Form', date: '2026-05-12', isCompleted: false }
    ],
    evidence: [],
    notes: [],
    statutes: [],
    lastUpdated: '4 hours ago',
    createdAt: '2026-03-01'
  },
  {
    id: '7',
    suitNumber: 'CA/A/221/2024',
    title: 'Oil Bloc Revocation Appeal',
    client: 'Delta Oil Corp',
    opposingParty: 'Minister of Petroleum Resources',
    opposingCounsel: 'Federal Ministry of Justice',
    jurisdiction: 'Abuja',
    court: 'Court of Appeal, Abuja',
    judge: 'Hon. Justice M.B. Dongban-Mensem',
    stage: 'Discovery',
    riskLevel: 'Critical',
    riskScore: 90,
    leadCounsel: 'Chief Elameen SAN',
    type: 'Energy Law',
    team: [{ id: '1', name: 'John Doe', role: 'Lead Counsel' }],
    events: [
      { id: 'e7', type: 'Filing', title: 'Filing of Record of Appeal', date: '2026-06-15', isCompleted: false }
    ],
    evidence: [],
    notes: [],
    statutes: [],
    lastUpdated: '2 days ago',
    createdAt: '2024-10-15'
  }
];


import { supabase } from './supabase';

export const useMatterStore = create<MatterStore>()(
  persist(
    (set, get) => ({
      matters: initialMatters,
      addMatter: async (matter) => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const generatedSuitNumber = matter.suitNumber || `XYZ/CV/${randomNum}/${year}`;

        const newMatter: Matter = {
          id: Math.random().toString(36).substring(7),
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
          type: 'General',
          nextHearing: null,
          team: [],
          events: [],
          evidence: [],
          notes: [],
          statutes: [],
          lastUpdated: 'Just now',
          createdAt: new Date().toISOString(),
          ...matter,
          suitNumber: generatedSuitNumber,
        } as Matter;
        
        set((state) => ({ matters: [newMatter, ...state.matters] }));
        
        // Try to sync to Supabase (fire and forget for now)
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('matters') as any).insert({
            suit_number: newMatter.suitNumber,
            title: newMatter.title,
            stage: newMatter.stage,
            risk_level: newMatter.riskLevel,
            risk_score: newMatter.riskScore,
            opposing_party: newMatter.opposingParty || null,
            opposing_counsel: newMatter.opposingCounsel || null,
            jurisdiction: newMatter.jurisdiction || null,
            court: newMatter.court || null,
            judge: newMatter.judge || null,
          });
        } catch (e) {
          console.warn('Failed to insert into Supabase', e);
        }
      },
      updateMatter: (id, updates) => {
        set((state) => ({
          matters: state.matters.map((m) => (m.id === id ? { ...m, ...updates, lastUpdated: 'Just now' } : m)),
        }));
      },
      getMatter: (id) => get().matters.find((m) => m.id === id),
      syncWithSupabase: async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from('matters') as any).select('*');
          if (!error && data && data.length > 0) {
            // Map Supabase rows to Matter interface with defensive merging to protect offline/local fields
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedMatters = data.map((row: any) => {
              const existingMatter = get().matters.find((m) => m.id === row.id || m.suitNumber === row.suit_number);
              return {
                id: row.id,
                suitNumber: row.suit_number,
                title: row.title,
                client: row.client_name || existingMatter?.client || 'Unknown Client',
                opposingParty: row.opposing_party || existingMatter?.opposingParty || 'Opposing Party',
                opposingCounsel: row.opposing_counsel || existingMatter?.opposingCounsel || 'Unknown',
                jurisdiction: row.jurisdiction || existingMatter?.jurisdiction || 'Unknown',
                court: row.court || existingMatter?.court || 'High Court',
                judge: row.judge || existingMatter?.judge || 'Unknown',
                stage: row.stage as MatterStage,
                riskLevel: (row.risk_level || row.priority || 'Low') as RiskLevel,
                riskScore: row.risk_score || 50,
                leadCounsel: row.assigned_counsel || existingMatter?.leadCounsel || 'Unassigned',
                type: row.type || existingMatter?.type || 'General',
                nextHearing: row.next_hearing || existingMatter?.nextHearing || null,
                team: existingMatter?.team || [],
                events: existingMatter?.events || [],
                evidence: existingMatter?.evidence || [],
                notes: existingMatter?.notes || [],
                statutes: existingMatter?.statutes || [],
                lastUpdated: new Date().toISOString(),
                createdAt: row.created_at || new Date().toISOString(),
              };
            });
            
            // Merge or replace
            set({ matters: mappedMatters as Matter[] });
          }
        } catch (e) {
          console.error('Failed to sync matters from Supabase', e);
        }
      },
      subscribeToRealtime: () => {
        interface DBRow {
          id: string;
          suit_number?: string;
          title?: string;
          client_name?: string;
          opposing_party?: string;
          opposing_counsel?: string;
          jurisdiction?: string;
          court?: string;
          judge?: string;
          stage?: string;
          risk_level?: string;
          risk_score?: number;
          assigned_counsel?: string;
          type?: string;
          next_hearing?: string;
          created_at?: string;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const channel = (supabase as any)
          .channel('matters-realtime')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'matters' },
            (payload: { eventType: string; new: DBRow; old: DBRow }) => {
              console.log('Realtime change received for matters:', payload);
              const { eventType, new: newRow, old: oldRow } = payload;
              
              if (eventType === 'INSERT') {
                const mapped: Matter = {
                  id: newRow.id,
                  suitNumber: newRow.suit_number || '',
                  title: newRow.title || '',
                  client: newRow.client_name || 'Unknown Client',
                  opposingParty: newRow.opposing_party || 'Opposing Party',
                  opposingCounsel: newRow.opposing_counsel || 'Unknown',
                  jurisdiction: newRow.jurisdiction || 'Unknown',
                  court: newRow.court || 'High Court',
                  judge: newRow.judge || 'Unknown',
                  stage: newRow.stage as MatterStage,
                  riskLevel: (newRow.risk_level || 'Low') as RiskLevel,
                  riskScore: newRow.risk_score || 10,
                  leadCounsel: newRow.assigned_counsel || 'Unassigned',
                  type: newRow.type || 'General',
                  nextHearing: newRow.next_hearing || null,
                  team: [],
                  events: [],
                  evidence: [],
                  notes: [],
                  statutes: [],
                  lastUpdated: 'Just now',
                  createdAt: newRow.created_at || new Date().toISOString(),
                };
                
                set((state) => {
                  if (state.matters.some((m) => m.id === mapped.id)) return state;
                  return { matters: [mapped, ...state.matters] };
                });
              } else if (eventType === 'UPDATE') {
                set((state) => ({
                  matters: state.matters.map((m) => {
                    if (m.id === newRow.id) {
                      return {
                        ...m,
                        suitNumber: newRow.suit_number ?? m.suitNumber,
                        title: newRow.title ?? m.title,
                        opposingParty: newRow.opposing_party ?? m.opposingParty,
                        opposingCounsel: newRow.opposing_counsel ?? m.opposingCounsel,
                        jurisdiction: newRow.jurisdiction ?? m.jurisdiction,
                        court: newRow.court ?? m.court,
                        judge: newRow.judge ?? m.judge,
                        stage: (newRow.stage as MatterStage) ?? m.stage,
                        riskLevel: (newRow.risk_level as RiskLevel) ?? m.riskLevel,
                        riskScore: newRow.risk_score ?? m.riskScore,
                        leadCounsel: newRow.assigned_counsel ?? m.leadCounsel,
                        type: newRow.type ?? m.type,
                        nextHearing: newRow.next_hearing ?? m.nextHearing,
                        lastUpdated: 'Just now',
                      };
                    }
                    return m;
                  }),
                }));
              } else if (eventType === 'DELETE') {
                set((state) => ({
                  matters: state.matters.filter((m) => m.id !== oldRow.id),
                }));
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }),
    {
      name: 'xyz-matter-storage',
    }
  )
);

