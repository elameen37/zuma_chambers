import { create } from 'zustand';

export interface AnalyticsData {
  activeCases: number;
  upcomingHearings: number;
  urgentDeadlines: number;
  unpaidInvoices: number;
  partnerRevenue: { name: string; amount: number; color: string }[];
  associatePerformance: { name: string; score: number; billable: number }[];
  caseAging: { range: string; count: number }[];
  workloadHeatmap: { day: string; hour: number; intensity: number }[];
  practiceAreaAnalytics: { area: string; value: number; growth: number }[];
  monthlyFilings: { month: string; count: number }[];
  successRates: { year: string; rate: number }[];
}

interface AnalyticsStore {
  data: AnalyticsData;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const mockData: AnalyticsData = {
  activeCases: 142,
  upcomingHearings: 24,
  urgentDeadlines: 8,
  unpaidInvoices: 42500000, // 42.5M Naira
  
  partnerRevenue: [
    { name: 'Chief Elameen SAN', amount: 125000000, color: '#D4AF37' },
    { name: 'Olumide Zuma', amount: 98000000, color: '#B8860B' },
    { name: 'Barr. Aisha Yusuf', amount: 45000000, color: '#DAA520' },
  ],
  
  associatePerformance: [
    { name: 'Sarah Ahmed', score: 94, billable: 180 },
    { name: 'Ibrahim Musa', score: 88, billable: 165 },
    { name: 'Nkechi M.', score: 91, billable: 172 },
  ],
  
  caseAging: [
    { range: '0-30 Days', count: 45 },
    { range: '31-90 Days', count: 32 },
    { range: '91-180 Days', count: 28 },
    { range: '180+ Days', count: 37 },
  ],
  
  workloadHeatmap: Array.from({ length: 7 * 12 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][Math.floor(i / 12)],
    hour: 8 + (i % 12),
    intensity: Math.floor(Math.random() * 100),
  })),
  
  practiceAreaAnalytics: [
    { area: 'Litigation', value: 45, growth: 12 },
    { area: 'Corporate', value: 30, growth: 8 },
    { area: 'Energy', value: 15, growth: 22 },
    { area: 'Maritime', value: 10, growth: -5 },
  ],
  
  monthlyFilings: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 22 },
    { month: 'May', count: 28 },
    { month: 'Jun', count: 24 },
  ],
  
  successRates: [
    { year: '2022', rate: 78 },
    { year: '2023', rate: 82 },
    { year: '2024', rate: 85 },
    { year: '2025', rate: 88 },
  ]
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  data: mockData,
  isLoading: false,
  refresh: async () => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 1000));
    set({ isLoading: false });
  }
}));
