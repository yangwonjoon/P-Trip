"use client";

import Link from "next/link";
import { MapPin, RotateCcw } from "lucide-react";
import type { Place } from "@/entities/place";
import { PlaceCard } from "@/entities/place/ui";
import { COPY } from "@/shared/config";
import { Button } from "@/shared/ui";

interface DrawResultProps {
  place: Place;
  onDrawAgain: () => void;
}

export function DrawResult({ place, onDrawAgain }: DrawResultProps) {
  return (
    <div className="px-6 py-8">
      {/* 헤더 카피 */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold">{COPY.draw.resultTitle}</h2>
        <p className="text-sm text-muted-foreground">
          {COPY.draw.resultSub}
        </p>
      </div>

      {/* 결과 카드 */}
      <PlaceCard place={place} />

      {/* 구글맵 Embed placeholder */}
      <div className="mt-4 rounded-xl border border-border overflow-hidden bg-muted h-[160px] flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Google Maps Embed
        </span>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-4 flex flex-col gap-3">
        <a
          href={place.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-full h-11 bg-[var(--pt-teal)] hover:bg-[var(--pt-teal)]/90 text-white font-semibold">
            <MapPin className="w-4 h-4 mr-1.5" />
            {COPY.actions.getDirections}
          </Button>
        </a>

        <div className="grid grid-cols-2 gap-3">
          <Link href={`/result/${place.id}`}>
            <Button
              variant="outline"
              className="w-full h-10 font-medium"
            >
              View details
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={onDrawAgain}
            className="w-full h-10 font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {COPY.actions.drawAgain}
          </Button>
        </div>
      </div>
    </div>
  );
}
