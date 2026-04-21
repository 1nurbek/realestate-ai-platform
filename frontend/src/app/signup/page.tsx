'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Button from '@/components/Button';

type SignupErrors = { name?: string; email?: string; password?: string; confirmPassword?: string };

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({});

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: SignupErrors = {};
    if (name.trim().length < 2) nextErrors.name = 'Please enter your full name.';
    if (!email.includes('@')) nextErrors.email = 'Please enter a valid email address.';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors(nextErrors);
  };

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Join to save searches and connect with agents instantly.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input className="w-full rounded-lg border-slate-200 text-sm" value={name} onChange={(event) => setName(event.target.value)} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="w-full rounded-lg border-slate-200 text-sm" value={email} onChange={(event) => setEmail(event.target.value)} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" className="w-full rounded-lg border-slate-200 text-sm" value={password} onChange={(event) => setPassword(event.target.value)} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              type="password"
              className="w-full rounded-lg border-slate-200 text-sm"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
          <Button type="submit" fullWidth>
            Sign Up
          </Button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}