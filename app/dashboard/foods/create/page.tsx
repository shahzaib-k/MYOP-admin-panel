"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import * as foodService from "@/services/foodService";
import type { FoodPayload } from "@/services/foodService";
import { FoodForm } from "@/components/foods/FoodForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { normalizeError } from "@/utils/errorHandler";

export default function CreateFoodPage() {
  const router = useRouter();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (payload: FoodPayload) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await foodService.createFood(payload);
      router.push("/dashboard/foods");
    } catch (err) {
      setSubmitError(normalizeError(err).message);
      setIsSubmitting(false);
    }
  };

  if (isLoadingCategories) {
    return <LoadingSpinner label="Loading categories..." />;
  }

  return (
    <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <FoodForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/foods")}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitLabel="Add Food Item"
      />
    </div>
  );
}
