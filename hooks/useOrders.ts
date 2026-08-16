"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order, OrderStatus, Pagination } from "@/types";
import * as orderService from "@/services/orderService";
import { normalizeError } from "@/utils/errorHandler";

export type SortOption = "newest" | "oldest" | "highest" | "lowest";

export interface OrderFilters {
  status: OrderStatus | "all";
  search: string;
  sort: SortOption;
  page: number;
}

const DEFAULT_FILTERS: OrderFilters = {
  status: "all",
  search: "",
  sort: "newest",
  page: 1,
};

/**
 * The backend only supports sorting by createdAt (asc/desc) — there is no
 * total-price sort. "highest"/"lowest" fetch the newest page from the server
 * and re-sort just that page client-side, per the spec's guidance to avoid
 * adding backend endpoints the data already supports.
 */
export function useOrders() {
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    const serverSort = filters.sort === "oldest" ? "asc" : "desc";

    orderService
      .getOrders({
        status: filters.status === "all" ? undefined : filters.status,
        search: debouncedSearch || undefined,
        sort: serverSort,
        page: filters.page,
        limit: 20,
      })
      .then((result) => {
        if (ignore) return;

        const sortedOrders =
          filters.sort === "highest" || filters.sort === "lowest"
            ? [...result.orders].sort((a, b) =>
                filters.sort === "highest"
                  ? b.totalPrice - a.totalPrice
                  : a.totalPrice - b.totalPrice
              )
            : result.orders;

        setOrders(sortedOrders);
        setPagination(result.pagination);
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
  }, [filters.status, filters.sort, filters.page, debouncedSearch, version]);

  const updateFilters = useCallback((partial: Partial<OrderFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      // any filter change other than page should reset back to page 1
      page: partial.page ?? 1,
    }));
  }, []);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return useMemo(
    () => ({ orders, pagination, isLoading, error, filters, updateFilters, refetch }),
    [orders, pagination, isLoading, error, filters, updateFilters, refetch]
  );
}
