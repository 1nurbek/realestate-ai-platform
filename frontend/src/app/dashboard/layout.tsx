"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuthGuard } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { ready } = useAuthGuard();

  if (!ready) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Checking your session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col md:min-h-screen md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
