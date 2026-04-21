"use client";

import { useMemo, useState } from "react";

type UserItem = {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  propertiesCount: number;
  joinedDate: string;
};

const allUsers: UserItem[] = [
  { id: "u1", avatar: "SM", name: "Sophia Martin", email: "sophia@example.com", role: "USER", propertiesCount: 4, joinedDate: "2026-03-14" },
  { id: "u2", avatar: "EW", name: "Ethan Walker", email: "ethan@example.com", role: "USER", propertiesCount: 2, joinedDate: "2026-03-10" },
  { id: "u3", avatar: "ND", name: "Noah Davis", email: "noah@example.com", role: "ADMIN", propertiesCount: 1, joinedDate: "2026-02-26" },
  { id: "u4", avatar: "OG", name: "Olivia Green", email: "olivia@example.com", role: "USER", propertiesCount: 6, joinedDate: "2026-02-20" },
  { id: "u5", avatar: "LM", name: "Liam Moore", email: "liam@example.com", role: "USER", propertiesCount: 3, joinedDate: "2026-02-13" },
  { id: "u6", avatar: "AA", name: "Amelia Adams", email: "amelia@example.com", role: "USER", propertiesCount: 0, joinedDate: "2026-02-09" },
  { id: "u7", avatar: "JM", name: "James Miller", email: "james@example.com", role: "USER", propertiesCount: 1, joinedDate: "2026-02-03" },
  { id: "u8", avatar: "EB", name: "Emma Brown", email: "emma@example.com", role: "USER", propertiesCount: 5, joinedDate: "2026-01-30" },
];

const PAGE_SIZE = 5;

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter((user) => user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const users = filteredUsers.slice(start, start + PAGE_SIZE);

  const handleDelete = (user: UserItem) => {
    const ok = window.confirm(`Delete ${user.name} (${user.email}) and related data?`);
    if (ok) {
      // Mock-only action
      window.alert("Delete request queued (mock).");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search name or email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-300 focus:ring sm:w-80"
        />
      </div>

      <article className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Properties</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      {user.avatar}
                    </span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.propertiesCount}</td>
                <td className="px-4 py-3">{new Date(user.joinedDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(user)}
                    className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {users.length} of {filteredUsers.length} users
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded border border-slate-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-slate-700">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded border border-slate-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}