"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItem = {
  href: string;
  label: string;
};

const items: SidebarItem[] = [
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/properties", label: "My Properties" },
  { href: "/dashboard/favorites", label: "Favorites" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/search-history", label: "Search History" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      pathname?.startsWith(href) ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700",
    ].join(" ");

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Dashboard</p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 p-3 backdrop-blur md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {items.map((item) => (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              className={`${linkClass(item.href)} whitespace-nowrap`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}