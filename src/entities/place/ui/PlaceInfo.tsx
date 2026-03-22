import { useLocale, useTranslations } from "next-intl";
import type { Place } from "../model/types";
import { getPlaceLongDescription, getPlaceName, getPlaceSecondaryName } from "../lib/getLocalizedPlaceText";
import { CATEGORY_MAP } from "@/shared/config";

interface PlaceInfoProps {
  place: Place;
}

export function PlaceInfo({ place }: PlaceInfoProps) {
  const t = useTranslations();
  const locale = useLocale();
  const category = CATEGORY_MAP[place.category];
  const name = getPlaceName(place, locale);
  const secondaryName = getPlaceSecondaryName(place, locale);
  const description = getPlaceLongDescription(place, locale);

  return (
    <div className="px-6 py-4">
      <h1 className="text-xl font-bold">{name}</h1>
      {secondaryName && (
        <p className="text-sm text-muted-foreground">{secondaryName}</p>
      )}

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
        {description}
      </p>
    </div>
  );
}
