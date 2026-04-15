'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { canAccessRoute } from '@/lib/permissions';
import { ShieldAlert, Lock } from '@/components/shared/Icons';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, is2FAVerified, user, addAuditEntry } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!is2FAVerified) {
      router.replace('/login?step=2fa');
      return;
    }

    if (user && !canAccessRoute(user.role, pathname)) {
      addAuditEntry('ACCESS_DENIED', pathname, 'denied', `Role ${user.role} blocked from ${pathname}`);
    }
  }, [isAuthenticated, is2FAVerified, user, pathname, router, addAuditEntry]);

  if (!isAuthenticated || !is2FAVerified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Lock className="text-gold-primary animate-pulse" size={32} />
          <p className="text-gray-400 text-sm font-inter">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (user && !canAccessRoute(user.role, pathname)) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="glass-card p-12 max-w-md text-center border-red-500/20">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white font-playfair mb-3">Access Denied</h2>
          <p className="text-gray-400 text-sm font-inter mb-2">
            Your role <span className="text-red-400 font-bold uppercase">{user.role}</span> does not have permission to access this resource.
          </p>
          <p className="text-gray-600 text-xs font-inter mb-8">
            This incident has been logged and reported to the security administrator.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-luxury px-8 py-3 text-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
