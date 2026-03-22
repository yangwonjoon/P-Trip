"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Header } from "@/widgets/header";
import { DrawController } from "@/widgets/draw-controller";
import type { Coordinates } from "@/shared/config";
import type { DrawMode } from "@/features/draw-card";
import { FALLBACK_COORDS } from "@/shared/config";

function DrawContent() {
  const searchParams = useSearchParams();
  const t = useTranslations();

  // URL에서 좌표 파싱, 없으면 폴백
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const coordinates: Coordinates =
    !isNaN(lat) && !isNaN(lng) ? { lat, lng } : FALLBACK_COORDS;

  // 드로우 모드 (category | mix)
  const mode = (searchParams.get("mode") as DrawMode) ?? "category";

  return (
    <>
      <Header showBack city={t("location.nearMe")} />
      <main className="flex-1 max-w-md mx-auto w-full">
        <DrawController coordinates={coordinates} mode={mode} />
      </main>
    </>
  );
}

export default function DrawPage() {
  return (
    <Suspense>
      <DrawContent />
    </Suspense>
  );
}
