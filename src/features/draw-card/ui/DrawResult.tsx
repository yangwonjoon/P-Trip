"use client";

import { useTranslations } from "next-intl";
import { MapPin, RotateCcw } from "lucide-react";
import type { Place } from "@/entities/place";
import { getDirectionsUrl } from "@/entities/place";
import { PlaceCard } from "@/entities/place/ui";
import { Button, MapEmbed } from "@/shared/ui";
import { Link } from "@/i18n/navigation";

interface DrawResultProps {
  place: Place;
  onDrawAgain: () => void;
}

export function DrawResult({ place, onDrawAgain }: DrawResultProps) {
  const t = useTranslations();

  return (
    <div className="px-6 py-8">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold">{t("draw.resultTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("draw.resultSub")}</p>
      </div>

      <PlaceCard place={place} />

      <div className="mt-4">
        <MapEmbed query={place.name_en} lat={place.latitude} lng={place.longitude} size="lg" />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <a href={getDirectionsUrl(place)} target="_blank" rel="noopener noreferrer">
          <Button className="w-full h-11 bg-[var(--pt-teal)] hover:bg-[var(--pt-teal)]/90 text-white font-semibold">
            <MapPin className="w-4 h-4 mr-1.5" />
            {t("actions.getDirections")}
          </Button>
        </a>

        <div className="grid grid-cols-2 gap-3">
          <Link href={`/result/${place.id}`}>
            <Button variant="outline" className="w-full h-10 font-medium">
              {t("actions.viewDetails")}
            </Button>
          </Link>
          <Button variant="outline" onClick={onDrawAgain} className="w-full h-10 font-medium">
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {t("actions.drawAgain")}
          </Button>
        </div>
      </div>
    </div>
  );
}
