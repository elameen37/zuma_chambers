import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Browser/Client-Side Supabase Client ───────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

// ─── Type-Safe Database Schema ──────────────────────────────────
export type Database = {
  public: {
    Tables: {
      matters: {
        Row: {
          id: string;
          suit_number: string;
          title: string;
          stage: string;
          priority: string;
          client_name: string;
          assigned_counsel: string;
          next_hearing: string | null;
          type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['matters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['matters']['Insert']>;
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          recipient_email: string;
          recipient_phone: string | null;
          type: 'email' | 'sms' | 'whatsapp';
          subject: string;
          body: string;
          status: 'pending' | 'sent' | 'failed';
          sent_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
  };
};

export type SupabaseClient = typeof supabase;
