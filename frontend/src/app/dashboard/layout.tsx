import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const hasToken = true;

  return (
    <div className="min-h-screen bg-slate-50">
      {!hasToken ? (
        <div className="mx-auto max-w-2xl p-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            You need to sign in to access the dashboard. Redirecting to login...
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-7xl flex-col md:min-h-screen md:flex-row">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      )}
    </div>
  );
}