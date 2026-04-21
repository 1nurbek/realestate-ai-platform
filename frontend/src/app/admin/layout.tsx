import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[1440px] flex-col md:min-h-screen md:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                ADMIN
              </span>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}