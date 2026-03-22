import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPin, Train, Wallet } from "lucide-react";
import type { Place } from "../model/types";
import {
  getPlaceAddress,
  getPlaceClosedDays,
  getPlaceNearestStation,
  getPlaceOperatingHours,
} from "../lib/getLocalizedPlaceText";

interface PlaceDetailsProps {
  place: Place;
}

export function PlaceDetails({ place }: PlaceDetailsProps) {
  const t = useTranslations("placeDetails");
  const locale = useLocale();
  const operatingHours = getPlaceOperatingHours(place, locale);
  const closedDays = getPlaceClosedDays(place, locale);
  const address = getPlaceAddress(place, locale);
  const nearestStation = getPlaceNearestStation(place, locale);

  const items = [
    {
      icon: Clock,
      label: t("hours"),
      value: operatingHours,
      sub: closedDays ? t("closedDays", { days: closedDays }) : undefined,
    },
    {
      icon: MapPin,
      label: t("address"),
      value: address,
    },
    nearestStation
      ? {
          icon: Train,
          label: t("nearestStation"),
          value: nearestStation,
          sub: place.walk_minutes
            ? t("walkMinutes", { minutes: place.walk_minutes })
            : undefined,
        }
      : null,
    place.budget_min
      ? {
          icon: Wallet,
          label: t("budget"),
          value: t("budgetRange", {
            min: place.budget_min.toLocaleString(),
            max: (place.budget_max ?? place.budget_min).toLocaleString(),
          }),
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="mx-6 rounded-xl bg-muted/50 p-4 flex flex-col gap-4">
      {items.map((item, i) => {
        if (!item) return null;
        const Icon = item.icon;
        return (
          <div key={i} className="flex gap-3">
            <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-sm font-medium mt-0.5">
                {item.value}
                {item.sub && (
                  <span className="text-muted-foreground font-normal"> {item.sub}</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
