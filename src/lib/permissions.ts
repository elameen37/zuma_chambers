// ─── Zuma Chambers RBAC Permission System ────────────────────
// Zero-trust, role-based access control for enterprise legal operations

export type Role = 'partner' | 'associate' | 'admin' | 'clerk' | 'finance' | 'client';

export const PERMISSIONS = {
  // Case Management
  VIEW_CASES: 'view_cases',
  CREATE_CASES: 'create_cases',
  EDIT_CASES: 'edit_cases',
  DELETE_CASES: 'delete_cases',
  ASSIGN_CASES: 'assign_cases',

  // Documents
  VIEW_DOCUMENTS: 'view_documents',
  UPLOAD_DOCUMENTS: 'upload_documents',
  DELETE_DOCUMENTS: 'delete_documents',
  VIEW_PRIVILEGED: 'view_privileged',

  // Finance
  VIEW_FINANCE: 'view_finance',
  CREATE_INVOICES: 'create_invoices',
  APPROVE_EXPENSES: 'approve_expenses',

  // Calendar
  VIEW_CALENDAR: 'view_calendar',
  MANAGE_HEARINGS: 'manage_hearings',

  // Admin
  MANAGE_USERS: 'manage_users',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_SETTINGS: 'manage_settings',

  // Compliance
  VIEW_COMPLIANCE: 'view_compliance',
  MANAGE_COMPLIANCE: 'manage_compliance',

  // Team
  VIEW_TEAM: 'view_team',
  MANAGE_TEAM: 'manage_team',

  // Clients & CRM
  VIEW_CLIENTS: 'view_clients',
  MANAGE_CLIENTS: 'manage_clients',

  // Collaboration
  VIEW_COLLABORATION: 'view_collaboration',
  MANAGE_WORKFLOWS: 'manage_workflows',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// ─── Role → Permission Matrix ──────────────────────────────────
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  partner: Object.values(PERMISSIONS), // Full access

  associate: [
    PERMISSIONS.VIEW_CASES, PERMISSIONS.CREATE_CASES, PERMISSIONS.EDIT_CASES,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_COLLABORATION,
    PERMISSIONS.VIEW_DOCUMENTS, PERMISSIONS.UPLOAD_DOCUMENTS, PERMISSIONS.VIEW_PRIVILEGED,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_CALENDAR, PERMISSIONS.MANAGE_HEARINGS,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.VIEW_TEAM,
  ],

  admin: [
    PERMISSIONS.VIEW_CASES, PERMISSIONS.CREATE_CASES, PERMISSIONS.EDIT_CASES, PERMISSIONS.DELETE_CASES, PERMISSIONS.ASSIGN_CASES,
    PERMISSIONS.VIEW_DOCUMENTS, PERMISSIONS.UPLOAD_DOCUMENTS, PERMISSIONS.DELETE_DOCUMENTS,
    PERMISSIONS.VIEW_FINANCE, PERMISSIONS.CREATE_INVOICES, PERMISSIONS.APPROVE_EXPENSES,
    PERMISSIONS.VIEW_CALENDAR, PERMISSIONS.MANAGE_HEARINGS,
    PERMISSIONS.MANAGE_USERS, PERMISSIONS.VIEW_AUDIT_LOGS, PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_COMPLIANCE, PERMISSIONS.MANAGE_COMPLIANCE,
    PERMISSIONS.VIEW_TEAM, PERMISSIONS.MANAGE_TEAM,
  ],

  clerk: [
    PERMISSIONS.VIEW_CASES, PERMISSIONS.EDIT_CASES,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_DOCUMENTS, PERMISSIONS.UPLOAD_DOCUMENTS,
    PERMISSIONS.VIEW_CALENDAR, PERMISSIONS.MANAGE_HEARINGS,
    PERMISSIONS.VIEW_TEAM,
  ],

  finance: [
    PERMISSIONS.VIEW_CASES,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_FINANCE, PERMISSIONS.CREATE_INVOICES, PERMISSIONS.APPROVE_EXPENSES,
    PERMISSIONS.VIEW_CALENDAR,
    PERMISSIONS.VIEW_TEAM,
  ],

  client: [
    PERMISSIONS.VIEW_CASES,
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.VIEW_CALENDAR,
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

// ─── Route Guard Logic ─────────────────────────────────────────
const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard': [],  // All authenticated users
  '/dashboard/cases': [PERMISSIONS.VIEW_CASES],
  '/dashboard/matters': [PERMISSIONS.VIEW_CASES],
  '/dashboard/documents': [PERMISSIONS.VIEW_DOCUMENTS],
  '/dashboard/finance': [PERMISSIONS.VIEW_FINANCE],
  '/dashboard/compliance': [PERMISSIONS.VIEW_COMPLIANCE],
  '/dashboard/team': [PERMISSIONS.VIEW_TEAM],
  '/dashboard/calendar': [PERMISSIONS.VIEW_CALENDAR],
  '/dashboard/cause-list': [PERMISSIONS.VIEW_CALENDAR],
  '/dashboard/clients': [PERMISSIONS.VIEW_CLIENTS],
  '/dashboard/collaboration': [PERMISSIONS.VIEW_COLLABORATION],
  '/dashboard/audit-logs': [PERMISSIONS.VIEW_AUDIT_LOGS],
  '/dashboard/settings': [PERMISSIONS.MANAGE_SETTINGS],
};

export function canAccessRoute(role: Role, pathname: string): boolean {
  // Find the most specific matching route
  const matchingRoute = Object.keys(ROUTE_PERMISSIONS)
    .filter(route => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchingRoute) return true; // No restriction defined
  
  const requiredPermissions = ROUTE_PERMISSIONS[matchingRoute];
  if (requiredPermissions.length === 0) return true; // No specific permissions needed
  
  return requiredPermissions.every(perm => hasPermission(role, perm));
}

// ─── Role Display Helpers ──────────────────────────────────────
export const ROLE_LABELS: Record<Role, string> = {
  partner: 'Senior Partner',
  associate: 'Associate Counsel',
  admin: 'System Administrator',
  clerk: 'Court Clerk',
  finance: 'Finance Officer',
  client: 'Client Portal',
};

export const ROLE_COLORS: Record<Role, string> = {
  partner: 'bg-gold-primary/10 text-gold-primary border-gold-primary/20',
  associate: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  clerk: 'bg-green-500/10 text-green-500 border-green-500/20',
  finance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  client: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};
