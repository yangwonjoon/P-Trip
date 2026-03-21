"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/widgets/header";
import { HeroSection } from "@/widgets/hero-section";
import { ModeSelector } from "@/widgets/mode-selector";
import { LocationSelector, useLocation } from "@/features/select-location";
import { Button } from "@/shared/ui";
import { Link } from "@/i18n/navigation";
import type { DrawMode } from "@/features/draw-card";

export default function Home() {
  const t = useTranslations();
  const { coordinates, detectLocation, isDetecting, hasError } = useLocation();
  const [selectedMode, setSelectedMode] = useState<DrawMode>("category");

  // 좌표 기반 → "Near me" 또는 감지 전 표시 없음
  const locationLabel = coordinates
    ? t("location.nearMe")
    : undefined;

  // 좌표를 URL 파라미터로 전달
  const drawHref = coordinates
    ? `/draw?lat=${coordinates.lat}&lng=${coordinates.lng}&mode=${selectedMode}`
    : `/draw?mode=${selectedMode}`;

  return (
    <>
      <Header city={locationLabel} />
      <main className="flex-1 max-w-md mx-auto w-full">
        <HeroSection />

        <LocationSelector
          coordinates={coordinates}
          onDetectLocation={detectLocation}
          isDetecting={isDetecting}
          hasError={hasError}
        />

        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />

        <section className="px-6 pb-8">
          <Link href={drawHref}>
            <Button className="w-full h-12 text-base font-semibold bg-[var(--pt-purple)] hover:bg-[var(--pt-purple)]/90">
              {t("actions.shuffleAndDraw")}
            </Button>
          </Link>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {t("footer")}
          </p>
        </section>
      </main>
    </>
  );
}
