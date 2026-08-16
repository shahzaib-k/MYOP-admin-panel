"use client";

import { useOrders } from "@/hooks/useOrders";
import type { SortOption } from "@/hooks/useOrders";
import type { OrderStatus } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderTable } from "@/components/orders/OrderTable";
import { ORDER_STATUS_LABELS } from "@/utils/orderStatus";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "preparing", "completed", "cancelled"];

export default function OrdersPage() {
  const { orders, pagination, isLoading, error, filters, updateFilters, refetch } = useOrders();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by order ID or user ID..."
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          className="sm:max-w-xs"
        />
        <Select
          value={filters.status}
          onChange={(event) => updateFilters({ status: event.target.value as OrderStatus | "all" })}
          className="sm:max-w-xs"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
        <Select
          value={filters.sort}
          onChange={(event) => updateFilters({ sort: event.target.value as SortOption })}
          className="sm:max-w-xs"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest total</option>
          <option value="lowest">Lowest total</option>
        </Select>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <LoadingSpinner label="Loading orders..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : orders.length === 0 ? (
          <EmptyState title="No orders found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <OrderTable orders={orders} />
            {pagination && (
              <Pagination pagination={pagination} onPageChange={(page) => updateFilters({ page })} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
