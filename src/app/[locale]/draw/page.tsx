"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Header } from "@/widgets/header";
import { DrawController } from "@/widgets/draw-controller";

function DrawContent() {
  const searchParams = useSearchParams();
  const t = useTranslations();
  const cityKey = searchParams.get("city") || "SEOUL";
  const cityLabel = t(`cities.${cityKey}`);

  return (
    <>
      <Header showBack city={cityLabel} />
      <main className="flex-1 max-w-md mx-auto w-full">
        <DrawController />
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
