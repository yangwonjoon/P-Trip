"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/widgets/header";
import { DrawController } from "@/widgets/draw-controller";
import { CITIES } from "@/shared/config";

function DrawContent() {
  const searchParams = useSearchParams();
  const cityKey = searchParams.get("city") || "SEOUL";
  const cityLabel = CITIES.find((c) => c.key === cityKey)?.label ?? "Seoul";

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
