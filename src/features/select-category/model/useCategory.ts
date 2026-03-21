"use client";

import { useState, useCallback } from "react";
import type { Category } from "@/shared/config";

export function useCategory() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const selectCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
  }, []);

  return { selectedCategory, selectCategory };
}
