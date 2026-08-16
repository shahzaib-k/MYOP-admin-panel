"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex h-dvh items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
