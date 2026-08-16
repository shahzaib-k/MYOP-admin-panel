// Mirrors the response shapes documented in MYOP-backend/docs/API.md.
// Keep this in sync with the backend — it is the source of truth, not this file.

export type UserRole = "customer" | "admin";

export interface Admin {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Food {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";

export interface OrderItem {
  foodId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  changedAt: string;
  changedBy: string;
}

export interface Order {
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalPrice: number;
  budget: number | null;
  remainingBudget: number | null;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface DashboardStats {
  totals: {
    orders: number;
    foods: number;
    categories: number;
    customers: number;
    admins: number;
  };
  ordersByStatus: Record<OrderStatus, number>;
  revenue: {
    completed: number;
    averageOrderValue: number;
    averageBudget: number;
  };
  topSellingItems: Array<{
    foodId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    orderId: string;
    customerName: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
  }>;
}

// Backend envelope: { success, message, data } | { success, message, errors }
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors: Record<string, unknown> | null;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface OrderListResult {
  orders: Order[];
  pagination: Pagination;
}

export interface OrderQueryParams {
  status?: OrderStatus;
  search?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}
