"use client";

import { useTranslations } from "next-intl";
import { MapPin, Share2, RotateCcw } from "lucide-react";
import type { Place } from "@/entities/place";
import { PlaceHero, PlaceInfo, PlaceDetails } from "@/entities/place";
import { Button, DokkaebiTip, MapEmbed } from "@/shared/ui";
import { Link } from "@/i18n/navigation";

interface ResultDetailProps {
  place: Place;
}

export function ResultDetail({ place }: ResultDetailProps) {
  const t = useTranslations();

  return (
    <div className="pb-8">
      <PlaceHero place={place} />
      <PlaceInfo place={place} />
      <PlaceDetails place={place} />

      <div className="px-6 mt-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          {t("placeDetails.location")}
        </p>
        <MapEmbed size="lg" />
      </div>

      <div className="px-6 mt-6 flex flex-col gap-3">
        <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer">
          <Button className="w-full h-12 bg-[var(--pt-teal)] hover:bg-[var(--pt-teal)]/90 text-white font-semibold text-base">
            <MapPin className="w-4 h-4 mr-1.5" />
            {t("actions.getDirections")}
          </Button>
        </a>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-10 font-medium">
            <Share2 className="w-4 h-4 mr-1.5" />
            {t("actions.share")}
          </Button>
          <Link href="/draw">
            <Button variant="outline" className="w-full h-10 font-medium">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {t("actions.drawAgain")}
            </Button>
          </Link>
        </div>
      </div>

      {place.dokkaebi_tip && (
        <div className="mt-6">
          <DokkaebiTip tip={place.dokkaebi_tip} />
        </div>
      )}

      <div className="mx-6 mt-6 rounded-xl bg-muted h-[90px] flex items-center justify-center">
        <span className="text-xs text-muted-foreground">
          Ad space — Google AdSense
        </span>
      </div>
    </div>
  );
}
