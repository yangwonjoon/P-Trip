"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { DrawState, DrawMode } from "@/features/draw-card";
import type { Category, Coordinates } from "@/shared/config";
import { FALLBACK_COORDS, getRadiusForLocation } from "@/shared/config";
import type { Place } from "@/entities/place";
import { drawNearbyRandomPlace } from "@/entities/place";

export function useDrawState(coords?: Coordinates, mode: DrawMode = "category") {
  // mix 모드면 카테고리 선택 없이 바로 셔플 시작
  const [state, setState] = useState<DrawState>(mode === "mix" ? "shuffling" : "select");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [result, setResult] = useState<Place | null>(null);

  const userCoords = coords ?? FALLBACK_COORDS;
  const radius = getRadiusForLocation(userCoords);

  // mix 모드: 마운트 시 전체 카테고리에서 바로 셔플
  const hasStartedMix = useRef(false);
  useEffect(() => {
    if (mode === "mix" && !hasStartedMix.current) {
      hasStartedMix.current = true;
      drawNearbyRandomPlace(userCoords, undefined, radius).then((place) => {
        setTimeout(() => {
          setResult(place);
          setState("result");
        }, 2000);
      });
    }
  }, [mode, userCoords, radius]);

  const startShuffle = useCallback(() => {
    if (mode === "category" && !selectedCategory) return;

    setState("shuffling");

    // category 모드: 선택된 카테고리, mix 모드: 전체
    const category = mode === "category" ? selectedCategory ?? undefined : undefined;
    drawNearbyRandomPlace(userCoords, category, radius).then((place) => {
      setTimeout(() => {
        setResult(place);
        setState("result");
      }, 2000);
    });
  }, [mode, selectedCategory, userCoords, radius]);

  const drawAgain = useCallback(() => {
    setResult(null);
    if (mode === "mix") {
      // mix 모드: 다시 뽑기 시 바로 셔플
      setState("shuffling");
      drawNearbyRandomPlace(userCoords, undefined, radius).then((place) => {
        setTimeout(() => {
          setResult(place);
          setState("result");
        }, 2000);
      });
    } else {
      setState("select");
      setSelectedCategory(null);
    }
  }, [mode, userCoords, radius]);

  return {
    state,
    selectedCategory,
    setSelectedCategory,
    result,
    startShuffle,
    drawAgain,
  };
}
