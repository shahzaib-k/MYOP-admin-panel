"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "@/types";
import * as categoryService from "@/services/categoryService";
import { normalizeError } from "@/utils/errorHandler";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    categoryService
      .getCategories()
      .then((data) => {
        if (!ignore) setCategories(data);
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

  return { categories, isLoading, error, refetch };
}
