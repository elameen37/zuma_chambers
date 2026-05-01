import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ClientType = 'Individual' | 'Company' | 'Government';
export type KYCStatus = 'Verified' | 'Pending' | 'Rejected' | 'Expired';

export interface CompanyDetails {
  cacNumber: string;
  directors: string[];
  dateOfIncorporation: string;
  industry: string;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  address: string;
  kycStatus: KYCStatus;
  riskProfile: 'Low' | 'Medium' | 'High';
  companyDetails?: CompanyDetails;
  retainerBalance: number;
  lastInteraction: string;
  createdAt: string;
}

export interface Interaction {
  id: string;
  clientId: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Letter';
  subject: string;
  summary: string;
  date: string;
  staffId: string;
}

interface ClientStore {
  clients: Client[];
  interactions: Interaction[];
  addClient: (client: Partial<Client>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addInteraction: (interaction: Interaction) => void;
  getClient: (id: string) => Client | undefined;
}

const initialClients: Client[] = [
  {
    id: 'c1',
    name: 'Zuma Energy Ltd',
    type: 'Company',
    email: 'legal@zumaenergy.com',
    phone: '+234 800 ZUMA OIL',
    address: '1 Zuma Plaza, Abuja',
    kycStatus: 'Verified',
    riskProfile: 'Low',
    companyDetails: {
      cacNumber: 'RC123456',
      directors: ['Alhaji Aliko Zuma', 'Dr. Olumide Smith'],
      dateOfIncorporation: '2010-05-12',
      industry: 'Oil & Gas'
    },
    retainerBalance: 5000000,
    lastInteraction: '2026-04-28',
    createdAt: '2020-01-01'
  },
  {
    id: 'c2',
    name: 'Chief Elameen',
    type: 'Individual',
    email: 'chief@elameen.law',
    phone: '+234 900 123 4567',
    address: 'Victoria Island, Lagos',
    kycStatus: 'Verified',
    riskProfile: 'Medium',
    retainerBalance: 1250000,
    lastInteraction: '2026-04-30',
    createdAt: '2024-02-15'
  }
];

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: initialClients,
      interactions: [],
      addClient: (client) => {
        const newClient: Client = {
          id: Math.random().toString(36).substring(7),
          name: '',
          type: 'Individual',
          email: '',
          phone: '',
          address: '',
          kycStatus: 'Pending',
          riskProfile: 'Low',
          retainerBalance: 0,
          lastInteraction: 'Never',
          createdAt: new Date().toISOString(),
          ...client,
        } as Client;
        set((state) => ({ clients: [newClient, ...state.clients] }));
      },
      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },
      addInteraction: (interaction) => {
        set((state) => ({ interactions: [interaction, ...state.interactions] }));
      },
      getClient: (id) => get().clients.find((c) => c.id === id),
    }),
    { name: 'zuma-client-storage' }
  )
);
