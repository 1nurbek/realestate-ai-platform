'use client';

import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { apiClient } from '@/lib/api';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/users', { params: { page: 1, limit: 50 } });
      const data = res.data?.data;
      setUsers(Array.isArray(data) ? data : data?.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const removeUser = async (id: string) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">Manage registered accounts.</p>
      </header>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No users.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeUser(u.id)}
                        disabled={deletingId === u.id || u.role === 'ADMIN'}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40"
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
