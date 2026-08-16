import { api } from "@/services/api";
import type { Admin, ApiResponse } from "@/types";

export interface LoginResult {
  user: Admin;
  token: string;
}

/**
 * The backend has one login endpoint shared by customers and admins
 * (POST /auth/login). It returns a session regardless of role, so the
 * admin-only check happens here — a customer account must never reach
 * the dashboard even though the token itself would be valid.
 */
export const login = async (email: string, password: string): Promise<LoginResult> => {
  const response = await api.post<ApiResponse<LoginResult>>("/auth/login", {
    email,
    password,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  const { user, token } = response.data.data;

  if (user.role !== "admin") {
    throw new Error("This account does not have admin access.");
  }

  return { user, token };
};

export const getProfile = async (): Promise<Admin> => {
  const response = await api.get<ApiResponse<Admin>>("/auth/me");

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};
