'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!token) {
      setError('Missing reset token. Please use the link from your email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { token, password });
      setSuccess('Password reset successful. Redirecting to login...');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
      <p className="mt-2 text-sm text-slate-500">Choose a new password for your account.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">New password</label>
          <input
            type="password"
            className="w-full rounded-lg border-slate-200 text-sm"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Confirm new password</label>
          <input
            type="password"
            className="w-full rounded-lg border-slate-200 text-sm"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{success}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Saving...' : 'Reset password'}
        </Button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Back to{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          login
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
