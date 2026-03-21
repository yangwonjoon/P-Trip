"use client";

import { useState, useCallback } from "react";
import type { DrawState } from "@/features/draw-card";
import type { Category } from "@/shared/config";
import type { Place } from "@/entities/place";
import { MOCK_PLACES } from "@/shared/mocks";

export function useDrawState(initialCategory?: Category) {
  const [state, setState] = useState<DrawState>("select");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory ?? null
  );
  const [result, setResult] = useState<Place | null>(null);

  const startShuffle = useCallback(() => {
    if (!selectedCategory) return;

    setState("shuffling");

    // 목데이터에서 해당 카테고리 랜덤 선택
    const candidates = MOCK_PLACES.filter(
      (p) => p.category === selectedCategory
    );
    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    // 셔플 애니메이션 후 결과 표시
    setTimeout(() => {
      setResult(pick);
      setState("result");
    }, 2000);
  }, [selectedCategory]);

  const drawAgain = useCallback(() => {
    setResult(null);
    setState("select");
    setSelectedCategory(null);
  }, []);

  return {
    state,
    selectedCategory,
    setSelectedCategory,
    result,
    startShuffle,
    drawAgain,
  };
}
