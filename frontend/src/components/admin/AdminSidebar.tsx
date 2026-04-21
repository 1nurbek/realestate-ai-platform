"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const navClass = (href: string) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      pathname === href || pathname.startsWith(`${href}/`)
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white",
    ].join(" ");

  return (
    <aside className="w-full shrink-0 border-r border-slate-800 bg-slate-900 md:w-72">
      <div className="border-b border-slate-800 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Admin Area</p>
        <h2 className="mt-1 text-xl font-bold text-white">Real Estate Platform</h2>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={navClass(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}