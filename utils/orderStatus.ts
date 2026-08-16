import type { OrderStatus } from "@/types";

// Mirrors MYOP-backend/utils/orderStatus.js — keep transitions identical to the
// backend's own rules so the UI never offers a change the API will reject.
export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "completed",
  "cancelled",
];

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["preparing", "cancelled"],
  preparing: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export const getAllowedNextStatuses = (status: OrderStatus): OrderStatus[] => {
  return ORDER_STATUS_TRANSITIONS[status] ?? [];
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  completed: "Completed",
  cancelled: "Cancelled",
};
