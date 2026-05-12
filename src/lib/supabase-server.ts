import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './supabase';

// ─── Server-Side Supabase Client (for Server Components & Route Handlers) ──
// Uses cookie-based session management — required for SSR auth
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — ignored (middleware handles it)
          }
        },
      },
    }
  );
}

// ─── Get authenticated user profile (server-side) ──────────────────────────
export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}
