'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Role, ROLE_LABELS } from './permissions';

// ─── Types ─────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  title: string;
  department: string;
  lastLogin: string;
  ip: string;
  pin?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ip: string;
  status: 'success' | 'denied' | 'warning';
  details?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  sessionStarted: string | null;
  auditLog: AuditEntry[];
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role?: Role) => Promise<boolean>;
  signUp: (email: string, password: string, name: string, role: Role) => Promise<{ success: boolean; error?: string; message?: string; pin?: string }>;
  verify2FA: (code: string) => boolean;
  logout: () => void;
  addAuditEntry: (action: string, resource: string, status: 'success' | 'denied' | 'warning', details?: string) => void;
  switchRole: (role: Role) => void;
}

// ─── Mock User Database ────────────────────────────────────────
const MOCK_USERS: Record<Role, UserProfile> = {
  partner: {
    id: 'usr_001',
    name: 'Chief Olumide Zuma',
    email: 'olumide.zuma@zumachambers.com',
    role: 'partner',
    initials: 'OZ',
    title: 'Senior Advocate of Nigeria (SAN)',
    department: 'Litigation & Dispute Resolution',
    lastLogin: new Date().toISOString(),
    ip: '102.89.45.121',
  },
  associate: {
    id: 'usr_002',
    name: 'Adeyemi Cole',
    email: 'adeyemi.cole@zumachambers.com',
    role: 'associate',
    initials: 'AC',
    title: 'Associate Counsel',
    department: 'IP & Technology',
    lastLogin: new Date().toISOString(),
    ip: '102.89.45.134',
  },
  admin: {
    id: 'usr_003',
    name: 'Fatima Al-Bashir',
    email: 'fatima.admin@zumachambers.com',
    role: 'admin',
    initials: 'FA',
    title: 'System Administrator',
    department: 'IT & Security',
    lastLogin: new Date().toISOString(),
    ip: '102.89.45.100',
  },
  clerk: {
    id: 'usr_004',
    name: 'Ibrahim Musa',
    email: 'ibrahim.musa@zumachambers.com',
    role: 'clerk',
    initials: 'IM',
    title: 'Senior Court Clerk',
    department: 'Registry & Filings',
    lastLogin: new Date().toISOString(),
    ip: '102.89.45.155',
  },
  finance: {
    id: 'usr_005',
    name: 'Sarah Nwosu',
    email: 'sarah.nwosu@zumachambers.com',
    role: 'finance',
    initials: 'SN',
    title: 'Chief Finance Officer',
    department: 'Billing & Revenue',
    lastLogin: new Date().toISOString(),
    ip: '102.89.45.178',
  },
  client: {
    id: 'usr_006',
    name: 'James Wilson',
    email: 'james.wilson@acmecorp.com',
    role: 'client',
    initials: 'JW',
    title: 'Corporate Client',
    department: 'External',
    lastLogin: new Date().toISOString(),
    ip: '197.210.64.22',
  },
};

// ─── Initial Audit Log ─────────────────────────────────────────
const INITIAL_AUDIT_LOG: AuditEntry[] = [
  { id: 'aud_001', timestamp: '2026-04-15T18:42:00Z', userId: 'usr_001', userName: 'Chief Olumide Zuma', action: 'LOGIN', resource: 'Authentication', ip: '102.89.45.121', status: 'success' },
  { id: 'aud_002', timestamp: '2026-04-15T18:35:00Z', userId: 'usr_003', userName: 'Fatima Al-Bashir', action: 'MODIFY_ROLE', resource: 'User: Ibrahim Musa', ip: '102.89.45.100', status: 'success', details: 'Role changed from junior_clerk to clerk' },
  { id: 'aud_003', timestamp: '2026-04-15T17:22:00Z', userId: 'unknown', userName: 'Unknown', action: 'LOGIN_FAILED', resource: 'Authentication', ip: '41.203.67.89', status: 'denied', details: 'Invalid credentials - 3rd attempt' },
  { id: 'aud_004', timestamp: '2026-04-15T16:58:00Z', userId: 'usr_002', userName: 'Adeyemi Cole', action: 'VIEW_DOCUMENT', resource: 'Zuma_vs_FGN_Expert_Report.pdf', ip: '102.89.45.134', status: 'success' },
  { id: 'aud_005', timestamp: '2026-04-15T16:30:00Z', userId: 'usr_006', userName: 'James Wilson', action: 'ACCESS_DENIED', resource: '/dashboard/finance', ip: '197.210.64.22', status: 'denied', details: 'Insufficient permissions for client role' },
  { id: 'aud_006', timestamp: '2026-04-15T15:45:00Z', userId: 'usr_004', userName: 'Ibrahim Musa', action: 'FILE_COURT_DOCUMENT', resource: 'Motion for Stay of Execution', ip: '102.89.45.155', status: 'success' },
  { id: 'aud_007', timestamp: '2026-04-15T14:20:00Z', userId: 'usr_005', userName: 'Sarah Nwosu', action: 'GENERATE_INVOICE', resource: 'INV-2026-0017', ip: '102.89.45.178', status: 'success', details: 'Amount: ₦4,500,000' },
  { id: 'aud_008', timestamp: '2026-04-15T13:10:00Z', userId: 'usr_001', userName: 'Chief Olumide Zuma', action: 'PRIVILEGE_ESCALATION_CHECK', resource: 'Case: FHC/ABJ/CS/120/24', ip: '102.89.45.121', status: 'warning', details: 'Partner accessing Level 1 classified evidence' },
  { id: 'aud_009', timestamp: '2026-04-15T12:00:00Z', userId: 'usr_003', userName: 'Fatima Al-Bashir', action: 'EXPORT_DATA', resource: 'Financial Reports Q2', ip: '102.89.45.100', status: 'success' },
  { id: 'aud_010', timestamp: '2026-04-15T10:30:00Z', userId: 'usr_002', userName: 'Adeyemi Cole', action: 'UPDATE_CASE', resource: 'SC/CV/245/2023', ip: '102.89.45.134', status: 'success', details: 'Status changed: Discovery → Hearing' },
  { id: 'aud_011', timestamp: '2026-04-14T22:15:00Z', userId: 'unknown', userName: 'Unknown', action: 'BRUTE_FORCE_DETECTED', resource: 'Authentication', ip: '41.203.67.89', status: 'denied', details: 'IP blocked after 5 failed attempts' },
  { id: 'aud_012', timestamp: '2026-04-14T18:40:00Z', userId: 'usr_001', userName: 'Chief Olumide Zuma', action: 'APPROVE_SETTLEMENT', resource: 'Case: LD/1024/GCM/24', ip: '102.89.45.121', status: 'success', details: 'Settlement amount: ₦25,000,000' },
];

import { supabase } from './supabase';

// ─── Context ───────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    is2FAVerified: false,
    sessionStarted: null,
    auditLog: INITIAL_AUDIT_LOG,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapSupabaseUser = (user: any): UserProfile => ({
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    role: (user.user_metadata?.role as Role) || 'client',
    initials: user.user_metadata?.initials || user.email?.substring(0, 2).toUpperCase() || 'U',
    title: user.user_metadata?.title || 'User',
    department: user.user_metadata?.department || 'General',
    lastLogin: user.last_sign_in_at || new Date().toISOString(),
    ip: 'Unknown',
    pin: user.user_metadata?.pin,
  });

  // Supabase Auth Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState(prev => ({
          ...prev,
          user: mapSupabaseUser(session.user),
          isAuthenticated: true,
          sessionStarted: session.user.last_sign_in_at || new Date().toISOString(),
        }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setState(prev => ({
          ...prev,
          user: mapSupabaseUser(session.user),
          isAuthenticated: true,
          sessionStarted: session.user.last_sign_in_at || new Date().toISOString(),
        }));
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          sessionStarted: null,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addAuditEntry = useCallback((action: string, resource: string, status: 'success' | 'denied' | 'warning', details?: string) => {
    const entry: AuditEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: state.user?.id ?? 'unknown',
      userName: state.user?.name ?? 'Unknown',
      action,
      resource,
      ip: state.user?.ip ?? '0.0.0.0',
      status,
      details,
    };
    setState(prev => ({
      ...prev,
      auditLog: [entry, ...prev.auditLog],
    }));
  }, [state.user]);

  const login = useCallback(async (email: string, password: string, role?: Role): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const mappedUser = mapSupabaseUser(data.user);
        
        setState(prev => ({
          ...prev,
          user: mappedUser,
          isAuthenticated: true,
          is2FAVerified: false,
          sessionStarted: new Date().toISOString(),
          auditLog: [{
            id: `aud_${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: mappedUser.id,
            userName: mappedUser.name,
            action: 'LOGIN',
            resource: 'Authentication',
            ip: mappedUser.ip,
            status: 'success',
          }, ...prev.auditLog],
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      // Fallback to mock for demo purposes if Supabase is unconfigured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
        console.warn('Falling back to mock authentication...');
        const selectedRole = role ?? 'associate';
        const user = { ...MOCK_USERS[selectedRole], email, lastLogin: new Date().toISOString() };
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          is2FAVerified: false,
          sessionStarted: new Date().toISOString(),
        }));
        return true;
      }
      return false;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string, role: Role): Promise<{ success: boolean; error?: string; message?: string; pin?: string }> => {
    try {
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || email.substring(0, 2).toUpperCase();
      const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            initials,
            title: role === 'partner' ? 'Partner' : role === 'associate' ? 'Associate Counsel' : 'Staff',
            department: 'Operations',
            pin: generatedPin,
          }
        }
      });

      if (error) throw error;

      // If session is null, it means email confirmation is required
      if (data.user && !data.session) {
        return { success: true, message: 'Please check your email to verify your account.', pin: generatedPin };
      }

      return { success: true, pin: generatedPin };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Sign-up error:', err);
      return { success: false, error: err.message || 'Failed to register account.' };
    }
  }, []);

  const verify2FA = useCallback((code: string): boolean => {
    // Check if the user has a specific PIN assigned
    if (state.user?.pin) {
      if (code === state.user.pin) {
        setState(prev => ({
          ...prev,
          is2FAVerified: true,
          auditLog: [{
            id: `aud_${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: prev.user?.id ?? 'unknown',
            userName: prev.user?.name ?? 'Unknown',
            action: '2FA_VERIFIED',
            resource: 'Authentication',
            ip: prev.user?.ip ?? '0.0.0.0',
            status: 'success',
          }, ...prev.auditLog],
        }));
        return true;
      }
      return false;
    }
    
    // Fallback: mock accept any 6-digit code for 2FA (for old accounts)
    if (code.length === 6) {
      setState(prev => ({
        ...prev,
        is2FAVerified: true,
        auditLog: [{
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: prev.user?.id ?? 'unknown',
          userName: prev.user?.name ?? 'Unknown',
          action: '2FA_VERIFIED',
          resource: 'Authentication',
          ip: prev.user?.ip ?? '0.0.0.0',
          status: 'success',
        }, ...prev.auditLog],
      }));
      return true;
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user?.pin]);

  const logout = useCallback(async () => {
    addAuditEntry('LOGOUT', 'Authentication', 'success');
    await supabase.auth.signOut();
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      is2FAVerified: false,
      sessionStarted: null,
    }));
  }, [addAuditEntry]);

  const switchRole = useCallback(async (role: Role) => {
    // 1. Update Supabase Metadata (Persistence)
    const { data, error } = await supabase.auth.updateUser({
      data: { role }
    });

    if (error) {
      console.error('Failed to update role in Supabase:', error);
      // Fallback for mock/demo users
      const newUser = { ...MOCK_USERS[role], lastLogin: new Date().toISOString() };
      setState(prev => ({
        ...prev,
        user: newUser,
      }));
      return;
    }

    // 2. Update Local State (UI Response)
    if (data.user) {
      const updatedUser = mapSupabaseUser(data.user);
      setState(prev => ({
        ...prev,
        user: updatedUser,
        auditLog: [{
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          userId: updatedUser.id,
          userName: updatedUser.name,
          action: 'ROLE_SWITCH',
          resource: `Switched to ${ROLE_LABELS[role]}`,
          ip: updatedUser.ip,
          status: 'warning',
          details: `Role successfully updated to: ${role}`,
        }, ...prev.auditLog],
      }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signUp, verify2FA, logout, addAuditEntry, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
