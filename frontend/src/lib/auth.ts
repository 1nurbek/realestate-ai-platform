'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string | null;
  phone?: string | null;
};

export function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('token');
}

export function readUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
}

/**
 * Client-side guard. If no token -> redirect to /login.
 * If requireAdmin and user role != ADMIN -> redirect to /.
 * Returns { ready } which is true once the guard has verified access.
 */
export function useAuthGuard(options: { requireAdmin?: boolean } = {}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = readToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    const u = readUser();
    if (options.requireAdmin && u?.role !== 'ADMIN') {
      router.replace('/');
      return;
    }
    setUser(u);
    setReady(true);
  }, [options.requireAdmin, router]);

  return { ready, user };
}
