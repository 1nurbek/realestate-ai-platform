'use client';

import { FormEvent, useEffect, useState } from 'react';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';
import { readUser } from '@/lib/auth';

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({ name: '', email: '', phone: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.get('/users/me');
        if (cancelled) return;
        const data = res.data?.data || {};
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar: data.avatar || '',
        });
      } catch {
        const cached = readUser();
        if (cached) {
          setForm({
            name: cached.name || '',
            email: cached.email || '',
            phone: cached.phone || '',
            avatar: cached.avatar || '',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = (key: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const body: Record<string, string> = { name: form.name };
      if (form.phone.trim()) body.phone = form.phone.trim();
      if (form.avatar.trim()) body.avatar = form.avatar.trim();
      const res = await apiClient.patch('/users/me', body);
      const updated = res.data?.data;
      if (updated) {
        const existing = readUser();
        const merged = { ...(existing || {}), ...updated };
        localStorage.setItem('user', JSON.stringify(merged));
      }
      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Update your account details.</p>
      </header>
      <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
          <input className="w-full rounded-lg border-slate-200 text-sm" value={form.name} onChange={onChange('name')} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm text-slate-500" value={form.email} disabled />
          <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <input className="w-full rounded-lg border-slate-200 text-sm" value={form.phone} onChange={onChange('phone')} placeholder="+1 555 000 1111" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Avatar URL</label>
          <input className="w-full rounded-lg border-slate-200 text-sm" value={form.avatar} onChange={onChange('avatar')} placeholder="https://..." />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{success}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
