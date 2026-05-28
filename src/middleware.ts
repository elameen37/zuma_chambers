import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// ─── XYZ Chambers Route Protection Middleware ─────────────────────────────
// Runs on every request — refreshes session and guards /dashboard routes

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // ── 1. Check Session and 2FA Cookies ───────────────────────────
  const mockUserCookie = request.cookies.get('xyz_mock_user');
  const is2faVerified = request.cookies.get('xyz_2fa_verified')?.value === 'true';

  // ── 2. Initialize Supabase SSR Client ───────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ── 3. Check / Refresh Supabase session with a fail-fast timeout ──
  let user = null;
  try {
    const userPromise = supabase.auth.getUser().then(res => res.data?.user || null);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200));
    user = await Promise.race([userPromise, timeoutPromise]);
  } catch (err) {
    console.warn('[Middleware] Supabase auth check failed:', err);
  }

  const isAuth = !!mockUserCookie || !!user;
  const isFullyAuth = isAuth && is2faVerified;

  // ── 4. Guards ───────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!isFullyAuth) {
      const loginUrl = new URL('/login', request.url);
      if (isAuth) {
        loginUrl.searchParams.set('step', '2fa');
      } else {
        loginUrl.searchParams.set('redirected', 'true');
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/login' && isFullyAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run on all routes except static files and api
    '/((?!_next/static|_next/image|favicon.ico|hero-bg.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
