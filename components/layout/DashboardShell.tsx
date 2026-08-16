"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <aside className="hidden w-64 shrink-0 lg:block">
        <Sidebar />
      </aside>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative h-full w-64">
            <Sidebar onNavigate={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
