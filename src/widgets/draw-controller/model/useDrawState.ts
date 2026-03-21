"use client";

import { useState, useCallback } from "react";
import type { DrawState } from "@/features/draw-card";
import type { Category, Coordinates } from "@/shared/config";
import { FALLBACK_COORDS, getRadiusForLocation } from "@/shared/config";
import type { Place } from "@/entities/place";
import { drawNearbyRandomPlace } from "@/entities/place";

export function useDrawState(coords?: Coordinates, initialCategory?: Category) {
  const [state, setState] = useState<DrawState>("select");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory ?? null
  );
  const [result, setResult] = useState<Place | null>(null);

  const userCoords = coords ?? FALLBACK_COORDS;
  const radius = getRadiusForLocation(userCoords);

  const startShuffle = useCallback(() => {
    if (!selectedCategory) return;

    setState("shuffling");

    // 위치 기반 동적 반경 내 가중치 랜덤 장소 선택
    drawNearbyRandomPlace(userCoords, selectedCategory, radius).then((place) => {
      // 셔플 애니메이션 후 결과 표시
      setTimeout(() => {
        setResult(place);
        setState("result");
      }, 2000);
    });
  }, [selectedCategory, userCoords, radius]);

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
