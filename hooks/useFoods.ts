"use client";

import { useCallback, useEffect, useState } from "react";
import type { Food } from "@/types";
import * as foodService from "@/services/foodService";
import { normalizeError } from "@/utils/errorHandler";

export function useFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    foodService
      .getFoods()
      .then((data) => {
        if (!ignore) setFoods(data);
      })
      .catch((err) => {
        if (!ignore) setError(normalizeError(err).message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { foods, isLoading, error, refetch };
}
