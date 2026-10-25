import { api } from "@/services/api";
import type { ApiResponse, Food } from "@/types";

export interface FoodPayload {
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  available?: boolean;
}

export const getFoods = async (): Promise<Food[]> => {
  const response = await api.get<ApiResponse<Food[]>>("/foods");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

/**
 * The backend has no GET /foods/:id — only a list and a by-category lookup.
 * Reuse the full list and find the item client-side so the edit page still
 * works from a direct link/refresh.
 */
export const getFoodById = async (id: string): Promise<Food | undefined> => {
  const foods = await getFoods();
  return foods.find((food) => food.id === id);
};

export const createFood = async (payload: FoodPayload): Promise<Food> => {
  const response = await api.post<ApiResponse<Food>>("/foods", payload);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const updateFood = async (
  id: string,
  payload: Partial<FoodPayload>
): Promise<Food> => {
  const response = await api.put<ApiResponse<Food>>(`/foods/${id}`, payload);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const deleteFood = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<null>>(`/foods/${id}`);
  if (!response.data.success) throw new Error(response.data.message);
};
