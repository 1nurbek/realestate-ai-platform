"use client";

import { useMemo, useState } from "react";
import StatusBadge from "@/components/admin/StatusBadge";

type PropertyStatus = "ACTIVE" | "PENDING" | "SOLD";

type PropertyItem = {
  id: string;
  image: string;
  title: string;
  owner: string;
  price: number;
  type: string;
  status: PropertyStatus;
  views: number;
  date: string;
};

const allProperties: PropertyItem[] = [
  { id: "p1", image: "OV", title: "Oceanfront Villa", owner: "Sophia Martin", price: 980000, type: "VILLA", status: "PENDING", views: 432, date: "2026-04-20" },
  { id: "p2", image: "DL", title: "Downtown Loft", owner: "Ethan Walker", price: 420000, type: "APARTMENT", status: "ACTIVE", views: 611, date: "2026-04-19" },
  { id: "p3", image: "SF", title: "Suburban Family Home", owner: "Olivia Green", price: 510000, type: "HOUSE", status: "SOLD", views: 288, date: "2026-04-18" },
  { id: "p4", image: "MA", title: "Modern Apartment", owner: "Noah Davis", price: 310000, type: "APARTMENT", status: "ACTIVE", views: 521, date: "2026-04-18" },
  { id: "p5", image: "CL", title: "Countryside Land", owner: "Liam Moore", price: 190000, type: "LAND", status: "PENDING", views: 102, date: "2026-04-16" },
];

const filters: Array<"ALL" | PropertyStatus> = ["ALL", "ACTIVE", "PENDING", "SOLD"];

export default function AdminPropertiesPage() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | PropertyStatus>("ALL");

  const properties = useMemo(() => {
    if (statusFilter === "ALL") return allProperties;
    return allProperties.filter((item) => item.status === statusFilter);
  }, [statusFilter]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Property Moderation</h2>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={[
                "rounded-full px-3 py-1 text-xs font-semibold",
                statusFilter === filter ? "bg-indigo-600 text-white" : "bg-white text-slate-700 border border-slate-300",
              ].join(" ")}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <article className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-200 text-xs font-bold text-slate-700">
                      {property.image}
                    </span>
                    <span className="font-medium">{property.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{property.owner}</td>
                <td className="px-4 py-3">${property.price.toLocaleString()}</td>
                <td className="px-4 py-3">{property.type}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={property.status} />
                </td>
                <td className="px-4 py-3">{property.views}</td>
                <td className="px-4 py-3">{new Date(property.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">Approve</button>
                    <button className="rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}