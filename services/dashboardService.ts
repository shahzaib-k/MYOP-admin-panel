import { api } from "@/services/api";
import type { ApiResponse, DashboardStats } from "@/types";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<ApiResponse<DashboardStats>>("/admin/dashboard");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
