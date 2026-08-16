"use client";

import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function DashboardPage() {
  const { stats, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Orders" value={stats.totals.orders} />
        <StatCard label="Pending" value={stats.ordersByStatus.pending} accent="amber" />
        <StatCard label="Preparing" value={stats.ordersByStatus.preparing} accent="blue" />
        <StatCard label="Completed" value={stats.ordersByStatus.completed} accent="green" />
        <StatCard label="Total Food Items" value={stats.totals.foods} />
        <StatCard label="Total Categories" value={stats.totals.categories} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Completed Revenue" value={formatCurrency(stats.revenue.completed)} accent="green" />
        <StatCard label="Average Order Value" value={formatCurrency(stats.revenue.averageOrderValue)} />
        <StatCard label="Average Budget" value={formatCurrency(stats.revenue.averageBudget)} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm font-medium text-amber-600 hover:underline">
            View all
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <EmptyState title="No orders yet" description="New orders will show up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/orders/${order.orderId}`}
                        className="font-medium text-amber-600 hover:underline"
                      >
                        #{order.orderId.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{order.customerName || "—"}</td>
                    <td className="px-5 py-3 text-slate-700">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {stats.topSellingItems.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">Top Selling Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Item</th>
                  <th className="px-5 py-3 font-medium">Quantity Sold</th>
                  <th className="px-5 py-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.topSellingItems.map((item) => (
                  <tr key={item.foodId} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-5 py-3 text-slate-700">{item.quantity}</td>
                    <td className="px-5 py-3 text-slate-700">{formatCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
