import Link from "next/link";
import { MapPin, Share2, RotateCcw } from "lucide-react";
import type { Place } from "@/entities/place";
import { PlaceHero, PlaceInfo, PlaceDetails } from "@/entities/place";
import { Button, DokkaebiTip, MapEmbed } from "@/shared/ui";
import { COPY } from "@/shared/config";

interface ResultDetailProps {
  place: Place;
}

export function ResultDetail({ place }: ResultDetailProps) {
  return (
    <div className="pb-8">
      {/* 히어로 사진 */}
      <PlaceHero place={place} />

      {/* 장소 정보 */}
      <PlaceInfo place={place} />

      {/* 상세 정보 블록 */}
      <PlaceDetails place={place} />

      {/* 구글맵 Embed */}
      <div className="px-6 mt-6">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Location
        </p>
        <MapEmbed size="lg" />
      </div>

      {/* CTA 버튼 */}
      <div className="px-6 mt-6 flex flex-col gap-3">
        <a
          href={place.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-full h-12 bg-[var(--pt-teal)] hover:bg-[var(--pt-teal)]/90 text-white font-semibold text-base">
            <MapPin className="w-4 h-4 mr-1.5" />
            {COPY.actions.getDirections}
          </Button>
        </a>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-10 font-medium">
            <Share2 className="w-4 h-4 mr-1.5" />
            {COPY.actions.share}
          </Button>
          <Link href="/draw">
            <Button variant="outline" className="w-full h-10 font-medium">
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {COPY.actions.drawAgain}
            </Button>
          </Link>
        </div>
      </div>

      {/* 도깨비 팁 */}
      {place.dokkaebi_tip && (
        <div className="mt-6">
          <DokkaebiTip tip={place.dokkaebi_tip} />
        </div>
      )}

      {/* AdSense placeholder */}
      <div className="mx-6 mt-6 rounded-xl bg-muted h-[90px] flex items-center justify-center">
        <span className="text-xs text-muted-foreground">
          Ad space — Google AdSense
        </span>
      </div>
    </div>
  );
}
