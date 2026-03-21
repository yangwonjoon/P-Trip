import { Clock, MapPin, Train, Wallet } from "lucide-react";
import type { Place } from "../model/types";

interface PlaceDetailsProps {
  place: Place;
}

export function PlaceDetails({ place }: PlaceDetailsProps) {
  const items = [
    {
      icon: Clock,
      label: "Hours",
      value: place.operating_hours,
      sub: place.closed_days ? `(closed ${place.closed_days})` : undefined,
    },
    {
      icon: MapPin,
      label: "Address",
      value: place.address_en,
    },
    place.nearest_station
      ? {
          icon: Train,
          label: "Nearest station",
          value: place.nearest_station,
          sub: place.walk_minutes
            ? `— ${place.walk_minutes} min walk`
            : undefined,
        }
      : null,
    place.budget_min
      ? {
          icon: Wallet,
          label: "Budget",
          value: `${place.budget_min.toLocaleString()} - ${(place.budget_max ?? place.budget_min).toLocaleString()} KRW/person`,
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
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    {item.sub}
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
