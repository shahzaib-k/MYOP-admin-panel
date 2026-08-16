"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFoods } from "@/hooks/useFoods";
import { useCategories } from "@/hooks/useCategories";
import * as foodService from "@/services/foodService";
import type { Food } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { FoodTable } from "@/components/foods/FoodTable";
import { normalizeError } from "@/utils/errorHandler";

export default function FoodsPage() {
  const { foods, isLoading, error, refetch } = useFoods();
  const { categories } = useCategories();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // GET /foods returns the whole list with no server-side search or
  // category filter, so both happen here against the already-fetched data.
  const filteredFoods = useMemo(() => {
    const term = search.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesSearch = term === "" || food.name.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "all" || food.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [foods, search, categoryFilter]);

  const handleDelete = async () => {
    if (!foodToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await foodService.deleteFood(foodToDelete.id);
      setFoodToDelete(null);
      await refetch();
    } catch (err) {
      setDeleteError(normalizeError(err).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search food items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:max-w-xs"
          />
          <Select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="sm:max-w-xs"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={() => router.push("/dashboard/foods/create")}>+ Add Food Item</Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <LoadingSpinner label="Loading food items..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : foods.length === 0 ? (
          <EmptyState
            title="No food items yet"
            description="Add your first food item to build the menu."
            action={
              <Link href="/dashboard/foods/create">
                <Button>+ Add Food Item</Button>
              </Link>
            }
          />
        ) : filteredFoods.length === 0 ? (
          <EmptyState title="No matching food items" description="Try a different search or filter." />
        ) : (
          <FoodTable
            foods={filteredFoods}
            onEdit={(food) => router.push(`/dashboard/foods/${food.id}`)}
            onDelete={(food) => {
              setFoodToDelete(food);
              setDeleteError(null);
            }}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={foodToDelete !== null}
        title="Delete Food Item?"
        message={
          deleteError || `Are you sure you want to delete "${foodToDelete?.name}"? This cannot be undone.`
        }
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setFoodToDelete(null)}
      />
    </div>
  );
}
