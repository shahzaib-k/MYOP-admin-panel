import { Badge } from "@/components/ui/Badge";
import { ORDER_STATUS_LABELS } from "@/utils/orderStatus";
import type { OrderStatus } from "@/types";

const STATUS_TONE: Record<OrderStatus, "warning" | "info" | "success" | "danger"> = {
  pending: "warning",
  preparing: "info",
  completed: "success",
  cancelled: "danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
