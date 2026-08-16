"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊", exact: true },
  { href: "/dashboard/categories", label: "Categories", icon: "🗂️", exact: false },
  { href: "/dashboard/foods", label: "Food Items", icon: "🍔", exact: false },
  { href: "/dashboard/orders", label: "Orders", icon: "🧾", exact: false },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string, exact: boolean) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-200">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-2xl">🍽️</span>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">Make Your Own Platter</p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href, item.exact)
                ? "bg-amber-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <span aria-hidden>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
