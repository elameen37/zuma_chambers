import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StaffRole = 'Partner' | 'Associate' | 'Clerk' | 'Secretary' | 'Admin';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type AssetStatus = 'Available' | 'Assigned' | 'Maintenance';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  department: string;
  workload: number; // 0-100
  avatar?: string;
  status: 'Active' | 'On Leave' | 'Field';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  type: 'Annual' | 'Sick' | 'Maternity' | 'Compassionate';
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string;
}

export interface DispatchLog {
  id: string;
  clerkId: string;
  destination: string;
  purpose: string;
  timeOut: string;
  timeIn?: string;
  status: 'In Transit' | 'Completed';
}

export interface VehicleMovement {
  id: string;
  vehicle: string;
  driver: string;
  purpose: string;
  departure: string;
  arrival?: string;
  mileageStart: number;
  mileageEnd?: number;
}

export interface OfficeAsset {
  id: string;
  name: string;
  category: 'Electronics' | 'Furniture' | 'Equipment';
  assignedTo?: string;
  status: AssetStatus;
}

interface HRStore {
  staff: StaffMember[];
  leaveRequests: LeaveRequest[];
  dispatchLogs: DispatchLog[];
  vehicleMovements: VehicleMovement[];
  assets: OfficeAsset[];
  notices: { id: string; title: string; content: string; date: string; priority: 'Low' | 'High' }[];

  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: LeaveStatus) => void;
  addDispatchLog: (log: DispatchLog) => void;
  updateDispatchStatus: (id: string, status: 'Completed', timeIn: string) => void;
}

const initialStaff: StaffMember[] = [
  { id: '1', name: 'Chief Elameen SAN', role: 'Partner', email: 'elameen@zuma.com', phone: '+234 801 000 0001', department: 'Litigation', workload: 85, status: 'Active' },
  { id: '2', name: 'Barr. Aisha Yusuf', role: 'Associate', email: 'aisha@zuma.com', phone: '+234 801 000 0002', department: 'Corporate', workload: 60, status: 'Active' },
  { id: '3', name: 'John Okoro', role: 'Clerk', email: 'john@zuma.com', phone: '+234 801 000 0003', department: 'Operations', workload: 40, status: 'Field' },
  { id: '4', name: 'Sarah Ahmed', role: 'Associate', email: 'sarah@zuma.com', phone: '+234 801 000 0004', department: 'Energy', workload: 75, status: 'Active' },
];

const initialAssets: OfficeAsset[] = [
  { id: 'a1', name: 'MacBook Pro M3 - Senior Partner', category: 'Electronics', assignedTo: 'Chief Elameen SAN', status: 'Assigned' },
  { id: 'a2', name: 'Zuma Mobile Unit 01 (Toyota Prado)', category: 'Equipment', status: 'Available' },
  { id: 'a3', name: 'Canon Enterprise Scanner', category: 'Electronics', status: 'Available' },
];

export const useHRStore = create<HRStore>()(
  persist(
    (set) => ({
      staff: initialStaff,
      leaveRequests: [
        { id: 'l1', staffId: '2', type: 'Annual', startDate: '2026-06-01', endDate: '2026-06-15', status: 'Pending', reason: 'Summer vacation' }
      ],
      dispatchLogs: [
        { id: 'd1', clerkId: '3', destination: 'Supreme Court, Abuja', purpose: 'Filing of Briefs', timeOut: '09:00 AM', status: 'In Transit' }
      ],
      vehicleMovements: [],
      assets: initialAssets,
      notices: [
        { id: 'n1', title: 'Chambers Quarter 2 Strategy Session', content: 'All partners and senior associates are expected at the boardroom on Monday.', date: '2026-05-04', priority: 'High' }
      ],

      addLeaveRequest: (request) => set((state) => ({ leaveRequests: [request, ...state.leaveRequests] })),
      updateLeaveStatus: (id, status) => set((state) => ({
        leaveRequests: state.leaveRequests.map(r => r.id === id ? { ...r, status } : r)
      })),
      addDispatchLog: (log) => set((state) => ({ dispatchLogs: [log, ...state.dispatchLogs] })),
      updateDispatchStatus: (id, status, timeIn) => set((state) => ({
        dispatchLogs: state.dispatchLogs.map(l => l.id === id ? { ...l, status, timeIn } : l)
      })),
    }),
    {
      name: 'zuma-hr-storage',
    }
  )
);
