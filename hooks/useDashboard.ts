"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardStats } from "@/types";
import * as dashboardService from "@/services/dashboardService";
import { normalizeError } from "@/utils/errorHandler";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    dashboardService
      .getDashboardStats()
      .then((data) => {
        if (!ignore) setStats(data);
      })
      .catch((err) => {
        if (!ignore) setError(normalizeError(err).message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { stats, isLoading, error, refetch };
}
