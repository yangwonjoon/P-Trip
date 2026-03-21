import { Clock, MapPin } from "lucide-react";
import type { Place } from "../model/types";
import { CATEGORY_MAP } from "@/shared/config";
import { cn } from "@/shared/lib";

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const category = CATEGORY_MAP[place.category];

  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card">
      {/* 사진 영역 */}
      <div className="relative h-[140px] bg-muted flex items-center justify-center">
        <span className="text-4xl">📷</span>
        {/* 카테고리 뱃지 */}
        <span
          className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.emoji} {category.label}
        </span>
      </div>

      {/* 정보 영역 */}
      <div className="p-4">
        <h3 className="text-base font-bold">{place.name_en}</h3>
        <p className="text-sm text-muted-foreground">{place.name_ko}</p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {place.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-full",
                "bg-muted text-muted-foreground"
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 설명 */}
        <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
          {place.description}
        </p>

        {/* 시간 + 주소 */}
        <div className="flex flex-col gap-1.5 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{place.operating_hours}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{place.address_en}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
