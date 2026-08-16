"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import * as foodService from "@/services/foodService";
import type { FoodPayload } from "@/services/foodService";
import type { Food } from "@/types";
import { FoodForm } from "@/components/foods/FoodForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { normalizeError } from "@/utils/errorHandler";

export default function EditFoodPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const [food, setFood] = useState<Food | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setFood(undefined);
    setLoadError(null);

    foodService
      .getFoodById(params.id)
      .then((result) => {
        if (!ignore) setFood(result ?? null);
      })
      .catch((err) => {
        if (!ignore) setLoadError(normalizeError(err).message);
      });

    return () => {
      ignore = true;
    };
  }, [params.id, retryVersion]);

  const handleSubmit = async (payload: FoodPayload) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await foodService.updateFood(params.id, payload);
      router.push("/dashboard/foods");
    } catch (err) {
      setSubmitError(normalizeError(err).message);
      setIsSubmitting(false);
    }
  };

  if (isLoadingCategories || food === undefined) {
    return <LoadingSpinner label="Loading food item..." />;
  }

  if (loadError) {
    return <ErrorMessage message={loadError} onRetry={() => setRetryVersion((v) => v + 1)} />;
  }

  if (food === null) {
    return <ErrorMessage message="Food item not found." />;
  }

  return (
    <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <FoodForm
        initialData={food}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/foods")}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitLabel="Save Changes"
      />
    </div>
  );
}
