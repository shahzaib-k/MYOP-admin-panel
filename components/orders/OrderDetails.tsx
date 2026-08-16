import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Order ID" value={`#${order.orderId.slice(-8)}`} />
        <Field label="Customer" value={`${order.customerName} (${order.customerEmail})`} />
        <Field label="Created" value={formatDate(order.createdAt)} />
        <Field label="Last Updated" value={formatDate(order.updatedAt)} />
        <div>
          <p className="text-sm font-medium text-slate-500">Status</p>
          <div className="mt-1">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <Field label="Budget" value={order.budget !== null ? formatCurrency(order.budget) : "Not set"} />
        <Field
          label="Remaining Budget"
          value={order.remainingBudget !== null ? formatCurrency(order.remainingBudget) : "—"}
        />
        <Field label="Total" value={formatCurrency(order.totalPrice)} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Ordered Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.foodId}>
                  <td className="px-5 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-5 py-3 text-slate-700">{formatCurrency(item.price)}</td>
                  <td className="px-5 py-3 text-slate-700">{item.quantity}</td>
                  <td className="px-5 py-3 text-slate-700">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td colSpan={3} className="px-5 py-3 text-right font-semibold text-slate-900">
                  Total
                </td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  {formatCurrency(order.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {order.statusHistory.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">Status History</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {order.statusHistory.map((entry, index) => (
              <li key={`${entry.status}-${index}`} className="flex items-center justify-between px-5 py-3 text-sm">
                <OrderStatusBadge status={entry.status} />
                <span className="text-slate-500">{formatDate(entry.changedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-900">{value}</p>
    </div>
  );
}
