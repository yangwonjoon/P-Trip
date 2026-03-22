"use client";

import { useState, useCallback, useEffect } from "react";
import type { Coordinates } from "@/shared/config";
import { FALLBACK_COORDS } from "@/shared/config";

export function useLocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Geolocation API 미지원 브라우저 → 폴백
      setCoordinates(FALLBACK_COORDS);
      setHasError(true);
      return;
    }

    setIsDetecting(true);
    setHasError(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsDetecting(false);
      },
      () => {
        // 위치 권한 거부 또는 에러 → 폴백 좌표 (서울 시청)
        setCoordinates(FALLBACK_COORDS);
        setHasError(true);
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5분 캐시
      }
    );
  }, []);

  // 첫 렌더링 시 자동 위치 감지 — 마운트 후 비동기로 실행하여 cascading render 방지
  useEffect(() => {
    const timer = setTimeout(detectLocation, 0);
    return () => clearTimeout(timer);
  }, [detectLocation]);

  return { coordinates, detectLocation, isDetecting, hasError };
}
