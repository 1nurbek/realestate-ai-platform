"use client";

import { useState } from "react";

type SearchItem = {
  id: string;
  query: string;
  date: string;
};

const initialSearches: SearchItem[] = [
  { id: "s1", query: "2-bedroom apartment in Manhattan under $900k", date: "Apr 19, 2026" },
  { id: "s2", query: "Pet-friendly condos in Seattle", date: "Apr 17, 2026" },
  { id: "s3", query: "Houses with garden in Austin", date: "Apr 14, 2026" },
];

export default function SearchHistoryPage() {
  const [searches, setSearches] = useState(initialSearches);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Search History</h1>
          <p className="mt-2 text-slate-600">Reuse your recent searches with one click.</p>
        </div>
        <button
          onClick={() => setSearches([])}
          className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
        >
          Clear all
        </button>
      </div>

      {!searches.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No recent searches.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {searches.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{item.query}</p>
                <p className="mt-1 text-xs text-slate-500">{item.date}</p>
              </div>
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                Search again
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}