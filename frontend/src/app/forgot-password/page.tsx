'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setResetUrl('');
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      const data = res.data?.data || {};
      setSuccess(data.message || 'Password reset link generated.');
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to process request. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your account email to receive a password reset link.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border-slate-200 text-sm"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <p className="font-semibold">{success}</p>
              {resetUrl ? (
                <>
                  <p className="mt-2 text-xs">Email service not configured yet; use this link to reset:</p>
                  <a
                    href={resetUrl}
                    className="mt-1 block break-all text-xs font-medium text-indigo-700 underline hover:text-indigo-800"
                  >
                    {resetUrl}
                  </a>
                </>
              ) : null}
            </div>
          )}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
