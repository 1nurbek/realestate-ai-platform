'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiUsers, FiHome, FiHeart, FiMessageSquare } from 'react-icons/fi';
import { apiClient } from '@/lib/api';

type Stats = {
  totalUsers?: number;
  totalProperties?: number;
  totalFavorites?: number;
  totalMessages?: number;
  [key: string]: any;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({});
  const [recentProps, setRecentProps] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, p, u] = await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/admin/recent-properties'),
          apiClient.get('/admin/recent-users'),
        ]);
        if (cancelled) return;
        setStats(s.data?.data || {});
        setRecentProps(p.data?.data || []);
        setRecentUsers(u.data?.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load admin data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers ?? '-', icon: FiUsers },
    { label: 'Total Properties', value: stats.totalProperties ?? '-', icon: FiHome },
    { label: 'Total Favorites', value: stats.totalFavorites ?? '-', icon: FiHeart },
    { label: 'Total Messages', value: stats.totalMessages ?? '-', icon: FiMessageSquare },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <card.icon className="text-2xl text-indigo-600" />
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{loading ? '...' : card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Users</h2>
            <Link href="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : recentUsers.length === 0 ? (
            <p className="text-sm text-slate-500">No users.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentUsers.slice(0, 5).map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{u.name}</p>
                    <p className="truncate text-xs text-slate-500">{u.email}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">{u.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : recentProps.length === 0 ? (
            <p className="text-sm text-slate-500">No properties.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProps.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <Link href={`/properties/${p.id}`} className="truncate font-medium text-slate-800 hover:text-indigo-600">{p.title}</Link>
                    <p className="truncate text-xs text-slate-500">{p.location}</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
