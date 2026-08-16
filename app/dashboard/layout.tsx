"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <LoadingSpinner label="Checking your session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
