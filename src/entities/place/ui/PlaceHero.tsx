import { Share2 } from "lucide-react";
import type { Place } from "../model/types";
import { CATEGORY_MAP } from "@/shared/config";

interface PlaceHeroProps {
  place: Place;
}

export function PlaceHero({ place }: PlaceHeroProps) {
  const category = CATEGORY_MAP[place.category];

  return (
    <div className="relative h-[220px] bg-muted flex items-center justify-center">
      <span className="text-5xl">📷</span>

      {/* 카테고리 뱃지 */}
      <span
        className="absolute bottom-4 left-4 text-xs font-medium px-2.5 py-1 rounded-full text-white"
        style={{ backgroundColor: category.color }}
      >
        {category.emoji} {category.label}
      </span>

      {/* 공유 FAB */}
      <button
        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[var(--pt-purple)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--pt-purple)]/90 transition-colors"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
