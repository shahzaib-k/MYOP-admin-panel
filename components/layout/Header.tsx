"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PAGE_TITLES: Array<[string, string]> = [
  ["/dashboard/categories", "Categories"],
  ["/dashboard/foods/create", "Add Food Item"],
  ["/dashboard/foods", "Food Items"],
  ["/dashboard/orders", "Orders"],
  ["/dashboard", "Dashboard"],
];

const getPageTitle = (pathname: string): string => {
  const match = PAGE_TITLES.find(([prefix]) => pathname.startsWith(prefix));
  return match?.[1] ?? "Dashboard";
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{getPageTitle(pathname)}</h1>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
