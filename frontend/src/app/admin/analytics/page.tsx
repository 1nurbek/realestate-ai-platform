'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>({});
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [propertyStats, setPropertyStats] = useState<any>({});
  const [mostViewed, setMostViewed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, ua, ps, mv] = await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/admin/user-activity'),
          apiClient.get('/admin/property-stats'),
          apiClient.get('/admin/most-viewed'),
        ]);
        if (cancelled) return;
        setStats(s.data?.data || {});
        setUserActivity(ua.data?.data || []);
        setPropertyStats(ps.data?.data || {});
        setMostViewed(mv.data?.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load analytics.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Platform-wide insights.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Total Properties', value: stats.totalProperties },
          { label: 'Active Properties', value: stats.activeProperties },
          { label: 'This Month Signups', value: stats.newUsersThisMonth },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{loading ? '...' : card.value ?? '-'}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">User Activity</h2>
          {loading ? (
            <p className="mt-3 text-sm text-slate-500">Loading...</p>
          ) : userActivity.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No activity.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {userActivity.slice(0, 10).map((a: any, idx: number) => (
                <li key={idx} className="flex items-center justify-between">
                  <span className="text-slate-700">{a.date || a.label}</span>
                  <span className="font-semibold text-slate-900">{a.count ?? a.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Property Stats by Type</h2>
          {loading ? (
            <p className="mt-3 text-sm text-slate-500">Loading...</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {Object.entries(propertyStats).map(([key, val]: any) => (
                <li key={key} className="flex items-center justify-between">
                  <span className="text-slate-700">{key}</span>
                  <span className="font-semibold text-slate-900">{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Most Viewed Properties</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading...</p>
        ) : mostViewed.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No data.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100 text-sm">
            {mostViewed.slice(0, 10).map((p: any) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <span className="min-w-0 truncate text-slate-800">{p.title}</span>
                <span className="font-semibold text-slate-900">{p.views} views</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
