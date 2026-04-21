import SimpleBarChart from "@/components/admin/SimpleBarChart";
import StatusBadge from "@/components/admin/StatusBadge";

const userActivity = Array.from({ length: 30 }).map((_, index) => ({
  label: `${index + 1}`,
  value: [2, 1, 4, 3, 6, 5, 7, 5, 3, 8, 6, 4, 2, 3, 5, 7, 9, 8, 6, 4, 3, 2, 5, 6, 7, 5, 4, 3, 2, 4][index],
}));

const propertiesByType = [
  { label: "Apartment", value: 210 },
  { label: "House", value: 142 },
  { label: "Villa", value: 68 },
  { label: "Land", value: 55 },
  { label: "Commercial", value: 57 },
];

const propertiesByStatus = [
  { label: "ACTIVE", value: 401, color: "bg-emerald-500" },
  { label: "PENDING", value: 87, color: "bg-amber-500" },
  { label: "SOLD", value: 44, color: "bg-rose-500" },
];

const mostViewed = [
  { id: "p2", title: "Downtown Loft", views: 611, status: "ACTIVE" as const },
  { id: "p4", title: "Modern Apartment", views: 521, status: "ACTIVE" as const },
  { id: "p1", title: "Oceanfront Villa", views: 432, status: "PENDING" as const },
  { id: "p3", title: "Suburban Family Home", views: 288, status: "SOLD" as const },
];

export default function AdminAnalyticsPage() {
  const totalStatus = propertiesByStatus.reduce((acc, item) => acc + item.value, 0);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>

      <SimpleBarChart title="User Signups (Last 30 Days)" data={userActivity} heightClassName="h-56" />

      <div className="grid gap-6 xl:grid-cols-2">
        <SimpleBarChart title="Properties by Type" data={propertiesByType} />

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Properties by Status</h3>
          <div className="mt-4 flex items-center gap-6">
            <div
              className="h-36 w-36 rounded-full"
              style={{
                background: `conic-gradient(
                  #10b981 0deg ${(propertiesByStatus[0].value / totalStatus) * 360}deg,
                  #f59e0b ${(propertiesByStatus[0].value / totalStatus) * 360}deg ${((propertiesByStatus[0].value + propertiesByStatus[1].value) / totalStatus) * 360}deg,
                  #f43f5e ${((propertiesByStatus[0].value + propertiesByStatus[1].value) / totalStatus) * 360}deg 360deg
                )`,
              }}
            />
            <ul className="space-y-2">
              {propertiesByStatus.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                  <span className="text-slate-500">({item.value})</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Most Viewed Properties</h3>
        <ul className="mt-4 space-y-2">
          {mostViewed.map((property) => (
            <li key={property.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <div>
                <p className="font-medium text-slate-900">{property.title}</p>
                <p className="text-xs text-slate-500">{property.views} views</p>
              </div>
              <StatusBadge status={property.status} />
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}