'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type AdminProperty = {
  id: string;
  title: string;
  location: string;
  price: number | string;
  status: string;
  user?: { id: string; name: string; email?: string };
  createdAt?: string;
};

export default function AdminPropertiesPage() {
  const [items, setItems] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/properties', { params: { page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'desc' } });
      setItems(res.data?.data?.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const moderate = async (id: string, status: 'APPROVE' | 'REJECT' | 'ACTIVE' | 'DELETE') => {
    if (status === 'DELETE' && !confirm('Delete this property permanently?')) return;
    setBusyId(id);
    try {
      await apiClient.patch(`/admin/properties/${id}/moderate`, { status });
      if (status === 'DELETE') {
        setItems((prev) => prev.filter((p) => p.id !== id));
      } else {
        await fetchItems();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Action failed.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
        <p className="mt-1 text-sm text-slate-500">Moderate all listings.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No properties.</td></tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/properties/${p.id}`} className="hover:text-indigo-600">{p.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.user?.name || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.location}</td>
                  <td className="px-4 py-3 text-slate-600">${Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => moderate(p.id, 'APPROVE')}
                        disabled={busyId === p.id}
                        className="rounded-md border border-emerald-200 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => moderate(p.id, 'REJECT')}
                        disabled={busyId === p.id}
                        className="rounded-md border border-amber-200 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-40"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => moderate(p.id, 'DELETE')}
                        disabled={busyId === p.id}
                        className="rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
