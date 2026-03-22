"use client";

import { useTranslations } from "next-intl";
import { MapPin, RotateCw } from "lucide-react";
import { cn } from "@/shared/lib";
import type { Coordinates } from "@/shared/config";

interface LocationSelectorProps {
  coordinates: Coordinates | null;
  onDetectLocation: () => void;
  isDetecting: boolean;
  hasError: boolean;
}

export function LocationSelector({
  coordinates,
  onDetectLocation,
  isDetecting,
  hasError,
}: LocationSelectorProps) {
  const t = useTranslations();
  const isDetected = coordinates !== null && !isDetecting;

  return (
    <section className="px-6 py-8">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        {t("location.sectionLabel")}
      </p>

      <button
        onClick={onDetectLocation}
        disabled={isDetecting}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl",
          "border-2 transition-colors",
          "disabled:opacity-50",
          isDetected && !hasError
            ? "border-[var(--pt-teal)] bg-[var(--pt-teal)]/10 text-[var(--pt-teal)]"
            : hasError
              ? "border-amber-400 bg-amber-400/5 text-amber-600"
              : "border-[var(--pt-teal)] bg-[var(--pt-teal)]/5 text-[var(--pt-teal)]"
        )}
      >
        {isDetecting ? (
          <>
            <RotateCw className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">{t("location.detecting")}</span>
          </>
        ) : isDetected && !hasError ? (
          <>
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{t("location.detected")}</span>
          </>
        ) : hasError ? (
          <>
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{t("location.fallback")}</span>
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{t("location.useMyLocation")}</span>
          </>
        )}
      </button>

      {hasError && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          {t("location.fallbackHint")}
        </p>
      )}
    </section>
  );
}
