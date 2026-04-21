import AdminStatsCard from "@/components/admin/AdminStatsCard";
import StatusBadge from "@/components/admin/StatusBadge";

const stats = {
  totalUsers: 1248,
  totalProperties: 532,
  totalActive: 401,
  totalPending: 87,
  totalSold: 44,
  totalMessages: 3290,
  totalReviews: 972,
  newUsersThisMonth: 112,
  newPropertiesThisMonth: 49,
};

const recentUsers = [
  { id: "u1", name: "Sophia Martin", email: "sophia@example.com", role: "USER", createdAt: "2026-04-20T10:15:00Z" },
  { id: "u2", name: "Ethan Walker", email: "ethan@example.com", role: "USER", createdAt: "2026-04-20T09:20:00Z" },
  { id: "u3", name: "Noah Davis", email: "noah@example.com", role: "ADMIN", createdAt: "2026-04-19T11:04:00Z" },
  { id: "u4", name: "Olivia Green", email: "olivia@example.com", role: "USER", createdAt: "2026-04-19T07:42:00Z" },
];

const recentProperties = [
  { id: "p1", title: "Oceanfront Villa", owner: "Sophia Martin", price: 980000, status: "PENDING" as const },
  { id: "p2", title: "Downtown Loft", owner: "Ethan Walker", price: 420000, status: "ACTIVE" as const },
  { id: "p3", title: "Suburban Family Home", owner: "Olivia Green", price: 510000, status: "SOLD" as const },
  { id: "p4", title: "Modern Apartment", owner: "Noah Davis", price: 310000, status: "ACTIVE" as const },
];

const formatDate = (value: string) => new Date(value).toLocaleDateString();
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export default function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminStatsCard label="Total Users" value={stats.totalUsers} hint={`+${stats.newUsersThisMonth} this month`} />
        <AdminStatsCard
          label="Total Properties"
          value={stats.totalProperties}
          hint={`+${stats.newPropertiesThisMonth} this month`}
        />
        <AdminStatsCard label="Active Listings" value={stats.totalActive} />
        <AdminStatsCard label="Pending Review" value={stats.totalPending} />
        <AdminStatsCard label="Messages" value={stats.totalMessages} />
        <AdminStatsCard label="Reviews" value={stats.totalReviews} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 text-slate-700">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Properties</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Owner</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((property) => (
                  <tr key={property.id} className="border-b border-slate-100 text-slate-700">
                    <td className="py-2">{property.title}</td>
                    <td className="py-2">{property.owner}</td>
                    <td className="py-2">{formatCurrency(property.price)}</td>
                    <td className="py-2">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">Approve</button>
                        <button className="rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}