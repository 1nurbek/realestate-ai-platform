import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";

const activities = [
  "You listed 'Modern Loft in Downtown'.",
  "New inquiry received for 'Sea View Apartment'.",
  "Saved search: '3-bedroom houses under $600k'.",
  "Favorited property in Brooklyn Heights.",
];

export default function DashboardOverviewPage() {
  const userName = "Alex";

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {userName}</h1>
        <p className="mt-2 text-slate-600">Track your listings, messages, and saved properties in one place.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Total Properties" value={4} hint="+1 this month" />
        <StatsCard label="Total Favorites" value={12} hint="2 new this week" />
        <StatsCard label="Unread Messages" value={3} hint="Respond quickly to close deals" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <ul className="mt-4 space-y-3">
            {activities.map((activity) => (
              <li key={activity} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {activity}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/dashboard/properties/new"
              className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add Property
            </Link>
            <Link
              href="/properties"
              className="inline-flex w-full justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Browse Properties
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}