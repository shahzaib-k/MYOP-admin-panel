import { api } from "@/services/api";
import type { ApiResponse, Category } from "@/types";

export interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<ApiResponse<Category[]>>("/categories");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
  const response = await api.post<ApiResponse<Category>>("/categories", payload);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const updateCategory = async (
  id: string,
  payload: Partial<CategoryPayload>
): Promise<Category> => {
  const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/categories/${id}`);
  if (!response.data.success) throw new Error(response.data.message);
};
