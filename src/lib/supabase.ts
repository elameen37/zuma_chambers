import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Browser/Client-Side Supabase Client ───────────────────────────────────
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ─── Full Type-Safe Database Schema ────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      // ── Profiles ───────────────────────────────────────────────────────
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          role: 'partner' | 'associate' | 'admin' | 'clerk' | 'finance' | 'client';
          initials: string | null;
          title: string | null;
          department: string | null;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          bar_number: string | null;
          specialization: string[] | null;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };

      // ── Clients ────────────────────────────────────────────────────────
      clients: {
        Row: {
          id: string;
          name: string;
          type: 'Individual' | 'Company' | 'Government';
          email: string | null;
          phone: string | null;
          address: string | null;
          kyc_status: string;
          risk_profile: string;
          cac_number: string | null;
          industry: string | null;
          retainer_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };

      // ── Matters ────────────────────────────────────────────────────────
      matters: {
        Row: {
          id: string;
          suit_number: string;
          title: string;
          client_id: string | null;
          opposing_party: string | null;
          opposing_counsel: string | null;
          jurisdiction: string | null;
          court: string | null;
          judge: string | null;
          stage: 'Intake' | 'Discovery' | 'Pre-Trial' | 'Hearing' | 'Judgment' | 'Closed';
          risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
          risk_score: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['matters']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['matters']['Insert']>;
      };

      // ── Matter Events ──────────────────────────────────────────────────
      matter_events: {
        Row: {
          id: string;
          matter_id: string;
          type: 'Filing' | 'Hearing' | 'Deadline' | 'Milestone' | 'Meeting';
          title: string;
          description: string | null;
          event_date: string;
          is_completed: boolean;
          courtroom: string | null;
          assigned_clerk_id: string | null;
          attendance_status: string;
          outcome: string | null;
          next_hearing_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['matter_events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['matter_events']['Insert']>;
      };

      // ── Legal Documents ────────────────────────────────────────────────
      legal_documents: {
        Row: {
          id: string;
          matter_id: string | null;
          client_id: string | null;
          title: string;
          category: string | null;
          current_version: number;
          status: string;
          privilege: string;
          expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['legal_documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['legal_documents']['Insert']>;
      };

      // ── Document Versions ──────────────────────────────────────────────
      document_versions: {
        Row: {
          id: string;
          document_id: string;
          version: number;
          file_name: string;
          file_path: string;
          changes: string | null;
          author_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['document_versions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['document_versions']['Insert']>;
      };

      // ── Invoices ───────────────────────────────────────────────────────
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          client_id: string | null;
          matter_id: string | null;
          issued_by: string | null;
          status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
          currency: string;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          total: number;
          due_date: string | null;
          paid_at: string | null;
          notes: string | null;
          line_items: InvoiceLineItem[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'invoice_number' | 'tax_amount' | 'total' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };

      // ── Blog Posts ─────────────────────────────────────────────────────
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          author_id: string | null;
          category: string;
          tags: string[];
          status: 'Draft' | 'Published' | 'Archived';
          published_at: string | null;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at' | 'views'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };

      // ── Branches ───────────────────────────────────────────────────────
      branches: {
        Row: {
          id: string;
          name: string;
          city: string;
          country: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          is_headquarters: boolean;
          is_active: boolean;
          coordinates: { lat: number; lng: number } | null;
          operating_hours: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['branches']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['branches']['Insert']>;
      };

      // ── Audit Logs ─────────────────────────────────────────────────────
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_name: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          resource_name: string | null;
          ip_address: string | null;
          status: 'success' | 'denied' | 'warning';
          details: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: never;
      };

      // ── User Notifications ─────────────────────────────────────────────
      user_notifications: {
        Row: {
          id: string;
          recipient_id: string;
          title: string;
          body: string;
          type: 'info' | 'warning' | 'success' | 'error' | 'case' | 'invoice' | 'hearing';
          link: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_notifications']['Insert']>;
      };

      // ── Notifications Log (External - email/sms/whatsapp) ──────────────
      notifications: {
        Row: {
          id: string;
          recipient_email: string | null;
          recipient_phone: string | null;
          type: 'email' | 'sms' | 'whatsapp';
          subject: string;
          body: string;
          status: 'pending' | 'sent' | 'failed';
          message_id: string | null;
          error_message: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };

      // ── Inquiries ──────────────────────────────────────────────────────
      inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          nature: string | null;
          preferred_date: string | null;
          message: string | null;
          status: 'New' | 'Reviewed' | 'Contacted' | 'Converted' | 'Closed';
          assigned_to: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>;
      };

      // ── Staff ──────────────────────────────────────────────────────────
      staff: {
        Row: {
          id: string;
          name: string;
          role: 'Partner' | 'Associate' | 'Clerk' | 'Secretary' | 'Admin';
          email: string;
          phone: string | null;
          department: string;
          workload: number;
          status: 'Active' | 'On Leave' | 'Field';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['staff']['Insert']>;
      };

      // ── Legal Resources ────────────────────────────────────────────────
      legal_resources: {
        Row: {
          id: string;
          title: string;
          type: 'Statute' | 'CaseLaw' | 'Precedent';
          citation: string | null;
          year: number | null;
          court: string | null;
          content: string;
          tags: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['legal_resources']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['legal_resources']['Insert']>;
      };
    };
  };
};

// ─── Convenience Type Aliases ──────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Matter = Database['public']['Tables']['matters']['Row'];
export type MatterEvent = Database['public']['Tables']['matter_events']['Row'];
export type LegalDocument = Database['public']['Tables']['legal_documents']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type Branch = Database['public']['Tables']['branches']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type UserNotification = Database['public']['Tables']['user_notifications']['Row'];
export type Inquiry = Database['public']['Tables']['inquiries']['Row'];
export type StaffMember = Database['public']['Tables']['staff']['Row'];
export type LegalResource = Database['public']['Tables']['legal_resources']['Row'];

// ─── Invoice Line Item ─────────────────────────────────────────────────────
export interface InvoiceLineItem {
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export type SupabaseClient = typeof supabase;
