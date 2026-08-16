import Link from "next/link";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Order ID</th>
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium">Items</th>
            <th className="px-5 py-3 font-medium">Total</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.orderId} className="hover:bg-slate-50">
              <td className="px-5 py-3 font-medium text-slate-900">#{order.orderId.slice(-8)}</td>
              <td className="px-5 py-3 text-slate-700">
                <div>{order.customerName || "—"}</div>
                <div className="text-xs text-slate-400">{order.customerEmail}</div>
              </td>
              <td className="px-5 py-3 text-slate-500">{order.items.length}</td>
              <td className="px-5 py-3 text-slate-700">{formatCurrency(order.totalPrice)}</td>
              <td className="px-5 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-5 py-3 text-slate-500">{formatDate(order.createdAt)}</td>
              <td className="px-5 py-3 text-right">
                <Link href={`/dashboard/orders/${order.orderId}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
