import { useTranslations } from "next-intl";
import type { Place } from "../model/types";
import { CATEGORY_MAP } from "@/shared/config";

interface PlaceInfoProps {
  place: Place;
}

export function PlaceInfo({ place }: PlaceInfoProps) {
  const t = useTranslations();
  const category = CATEGORY_MAP[place.category];

  return (
    <div className="px-6 py-4">
      <h1 className="text-xl font-bold">{place.name_en}</h1>
      <p className="text-sm text-muted-foreground">{place.name_ko}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {place.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: category.color }}
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-foreground/80 mt-4 leading-[1.7]">
        {place.description_long || place.description}
      </p>
    </div>
  );
}
