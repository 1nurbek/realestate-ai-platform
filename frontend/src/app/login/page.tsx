'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

type LoginErrors = { email?: string; password?: string; general?: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: LoginErrors = {};
    if (!email.includes('@')) nextErrors.email = 'Please enter a valid email address.';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const token = res.data?.data?.token;
      const user = res.data?.data?.user;
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      router.push('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Log in to manage your listings and saved homes.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border-slate-200 text-sm"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border-slate-200 text-sm"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            Remember me
          </label>
          <div className="text-right text-sm">
            <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </Link>
          </div>
          {errors.general && <p className="text-sm text-red-600">{errors.general}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Log In'}
          </Button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          New here?{' '}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
