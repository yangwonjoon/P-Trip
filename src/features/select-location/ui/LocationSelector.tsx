"use client";

import { MapPin } from "lucide-react";
import { COPY, CITIES } from "@/shared/config";
import type { City } from "@/shared/config";
import { cn } from "@/shared/lib";

interface LocationSelectorProps {
  selectedCity: City;
  onSelectCity: (city: City) => void;
  onDetectLocation: () => void;
  isDetecting: boolean;
}

export function LocationSelector({
  selectedCity,
  onSelectCity,
  onDetectLocation,
  isDetecting,
}: LocationSelectorProps) {
  return (
    <section className="px-6 py-8">
      {/* 섹션 라벨 */}
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        {COPY.location.sectionLabel}
      </p>

      {/* 현재 위치 버튼 */}
      <button
        onClick={onDetectLocation}
        disabled={isDetecting}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
          "border-2 border-[var(--pt-teal)] bg-[var(--pt-teal)]/5",
          "text-[var(--pt-teal)] text-sm font-medium",
          "hover:bg-[var(--pt-teal)]/10 transition-colors",
          "disabled:opacity-50"
        )}
      >
        <MapPin className="w-4 h-4" />
        {isDetecting ? "Detecting..." : COPY.location.useMyLocation}
      </button>

      {/* 구분선 */}
      <p className="text-center text-xs text-muted-foreground my-4">
        {COPY.location.orPickCity}
      </p>

      {/* 도시 카드 그리드 */}
      <div className="grid grid-cols-3 gap-3">
        {CITIES.map((city) => {
          const isSelected = selectedCity === city.key;
          return (
            <button
              key={city.key}
              onClick={() => onSelectCity(city.key)}
              className={cn(
                "flex flex-col items-center gap-1 py-4 rounded-xl border-2 transition-all",
                isSelected
                  ? "border-[var(--pt-purple)] bg-[var(--pt-purple-light)]"
                  : "border-border hover:border-[var(--pt-purple)]/30"
              )}
            >
              <span className="text-2xl">{city.emoji}</span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected
                    ? "text-[var(--pt-purple)]"
                    : "text-foreground"
                )}
              >
                {city.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
