'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

type PropertyRow = {
  id: string;
  title: string;
  location: string;
  price: number | string;
  status: string;
  views?: number;
  createdAt?: string;
};

export default function MyPropertiesPage() {
  const [items, setItems] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/properties/my', { params: { page: 1, limit: 50 } });
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

  const remove = async (id: string) => {
    if (!confirm('Delete this property? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/properties/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete property.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Properties</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your listings.</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button className="gap-2"><FiPlus /> Add Property</Button>
        </Link>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No properties yet. Click "Add Property" to create one.</td></tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/properties/${p.id}`} className="hover:text-indigo-600">{p.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.location}</td>
                  <td className="px-4 py-3 text-slate-600">${Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.views || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/properties/${p.id}/edit`}>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Edit">
                          <FiEdit />
                        </button>
                      </Link>
                      <button
                        onClick={() => remove(p.id)}
                        disabled={deletingId === p.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                        aria-label="Delete"
                      >
                        <FiTrash2 />
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
