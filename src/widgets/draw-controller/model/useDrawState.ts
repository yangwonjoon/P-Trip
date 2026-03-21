"use client";

import { useState, useCallback } from "react";
import type { DrawState } from "@/features/draw-card";
import type { Category, City } from "@/shared/config";
import type { Place } from "@/entities/place";
import { drawRandomPlace } from "@/entities/place";

export function useDrawState(city: City = "SEOUL", initialCategory?: Category) {
  const [state, setState] = useState<DrawState>("select");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory ?? null
  );
  const [result, setResult] = useState<Place | null>(null);

  const startShuffle = useCallback(() => {
    if (!selectedCategory) return;

    setState("shuffling");

    // Supabase에서 가중치 기반 랜덤 장소 선택
    drawRandomPlace(city, selectedCategory).then((place) => {
      // 셔플 애니메이션 후 결과 표시
      setTimeout(() => {
        setResult(place);
        setState("result");
      }, 2000);
    });
  }, [selectedCategory, city]);

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
