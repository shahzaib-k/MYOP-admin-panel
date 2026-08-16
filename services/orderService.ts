import { api } from "@/services/api";
import type { ApiResponse, Order, OrderListResult, OrderQueryParams, OrderStatus } from "@/types";

export const getOrders = async (params: OrderQueryParams = {}): Promise<OrderListResult> => {
  const response = await api.get<ApiResponse<OrderListResult>>("/admin/orders", {
    params,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getOrder = async (id: string): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/admin/orders/${id}`);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const response = await api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
    status,
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

/**
 * Deleting an order lives under /orders/:id (admin-restricted), not
 * /admin/orders/:id — the backend's orderRoutes, not adminRoutes.
 */
export const deleteOrder = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/orders/${id}`);
  if (!response.data.success) throw new Error(response.data.message);
};
