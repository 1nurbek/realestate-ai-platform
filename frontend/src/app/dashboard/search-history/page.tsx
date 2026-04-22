'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTrash2 } from 'react-icons/fi';
import Button from '@/components/Button';
import { apiClient } from '@/lib/api';

type HistoryItem = {
  id: string;
  query: string;
  filters?: Record<string, any>;
  createdAt: string;
};

export default function SearchHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clearing, setClearing] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/search-history');
      const data = res.data?.data;
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load search history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const clearAll = async () => {
    if (!confirm('Clear all search history?')) return;
    setClearing(true);
    try {
      await apiClient.delete('/search-history');
      setItems([]);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to clear history.');
    } finally {
      setClearing(false);
    }
  };

  const toUrl = (item: HistoryItem) => {
    const params = new URLSearchParams();
    if (item.query) params.set('location', item.query);
    Object.entries(item.filters || {}).forEach(([k, v]) => {
      if (v != null && v !== '') params.set(k, String(v));
    });
    return `/properties${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Search History</h1>
          <p className="mt-1 text-sm text-slate-500">Your recent property searches.</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={clearAll} disabled={clearing} className="gap-2">
            <FiTrash2 /> {clearing ? 'Clearing...' : 'Clear All'}
          </Button>
        )}
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No search history yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{item.query || '(all)'}</p>
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <Link href={toUrl(item)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Rerun
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
