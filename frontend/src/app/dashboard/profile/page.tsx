"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("Alex Morgan");
  const [phone, setPhone] = useState("+1 (555) 230-1198");

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="mt-2 text-slate-600">Update your personal details and contact information.</p>
      </header>

      <form className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="avatar" className="mb-2 block text-sm font-semibold text-slate-700">
            Avatar
          </label>
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
              AM
            </div>
            <input id="avatar" type="file" className="block text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-indigo-700" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              value="alex@example.com"
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-slate-700">
            Phone
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Save Profile
        </button>
      </form>
    </section>
  );
}