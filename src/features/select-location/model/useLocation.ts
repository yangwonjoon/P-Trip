"use client";

import { useState, useCallback } from "react";
import type { City } from "@/shared/config";

export function useLocation() {
  const [selectedCity, setSelectedCity] = useState<City>("SEOUL");
  const [isDetecting, setIsDetecting] = useState(false);

  const selectCity = useCallback((city: City) => {
    setSelectedCity(city);
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        // MVP: 위치 감지 시 서울로 기본 설정
        setSelectedCity("SEOUL");
        setIsDetecting(false);
      },
      () => {
        setIsDetecting(false);
      }
    );
  }, []);

  return { selectedCity, selectCity, detectLocation, isDetecting };
}
