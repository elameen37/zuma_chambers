import { NextResponse } from 'next/server';

// ─── Health Check API ────────────────────────────────────────────
// GET /api/health
// Used by CI/CD pipeline and uptime monitors
export async function GET() {
  const checks: Record<string, string> = {
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
    environment: process.env.NODE_ENV ?? 'development',
    region: process.env.VERCEL_REGION ?? 'local',
  };

  // Check Supabase connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' },
        signal: AbortSignal.timeout(3000),
      });
      checks.database = res.ok ? 'connected' : 'degraded';
    } else {
      checks.database = 'not_configured';
    }
  } catch {
    checks.database = 'unreachable';
  }

  const allHealthy = !Object.values(checks).includes('unreachable') && !Object.values(checks).includes('failed');

  return NextResponse.json(
    { service: 'Zuma Chambers API', ...checks },
    { status: allHealthy ? 200 : 503 }
  );
}
