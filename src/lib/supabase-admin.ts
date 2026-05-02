import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase';

// ─── Server-Side Supabase Admin Client ──────────────────────────
// Used only in API routes and server components (has service_role key)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
