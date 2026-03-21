"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/widgets/header";
import { HeroSection } from "@/widgets/hero-section";
import { ModeSelector } from "@/widgets/mode-selector";
import { LocationSelector, useLocation } from "@/features/select-location";
import { COPY } from "@/shared/config";
import { CITIES } from "@/shared/config";
import { Button } from "@/shared/ui";
import type { DrawMode } from "@/features/draw-card";

export default function Home() {
  const { selectedCity, selectCity, detectLocation, isDetecting } =
    useLocation();
  const [selectedMode, setSelectedMode] = useState<DrawMode>("category");

  const cityLabel = CITIES.find((c) => c.key === selectedCity)?.label;

  return (
    <>
      <Header city={cityLabel} />
      <main className="flex-1 max-w-md mx-auto w-full">
        <HeroSection />

        <LocationSelector
          selectedCity={selectedCity}
          onSelectCity={selectCity}
          onDetectLocation={detectLocation}
          isDetecting={isDetecting}
        />

        <ModeSelector
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />

        {/* CTA */}
        <section className="px-6 pb-8">
          <Link href={`/draw?city=${selectedCity}&mode=${selectedMode}`}>
            <Button className="w-full h-12 text-base font-semibold bg-[var(--pt-purple)] hover:bg-[var(--pt-purple)]/90">
              {COPY.actions.shuffleAndDraw}
            </Button>
          </Link>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {COPY.footer}
          </p>
        </section>
      </main>
    </>
  );
}
