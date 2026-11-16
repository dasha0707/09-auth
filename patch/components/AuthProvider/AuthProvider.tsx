'use client';

import { useEffect, type ReactNode } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const session = await checkSession();
        if (!session.success) {
          if (active) clearIsAuthenticated();
          return;
        }
        const user = await getMe();
        if (active) setUser(user);
      } catch {
        if (active) clearIsAuthenticated();
      }
    };
    void restore();
    return () => { active = false; };
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
