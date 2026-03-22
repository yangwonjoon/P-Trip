import { cn } from "@/shared/lib";

interface MapEmbedProps {
  /** 장소 이름 (지도 검색용) */
  query: string;
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Google Maps Embed API iframe
 * https://developers.google.com/maps/documentation/embed/get-started
 */
export function MapEmbed({ query, lat, lng, size = "lg", className }: MapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // API 키 없으면 플레이스홀더
  if (!apiKey) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center",
          size === "sm" ? "h-[120px]" : "h-[160px]",
          className
        )}
      >
        <span className="text-sm text-muted-foreground">Map</span>
      </div>
    );
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: `${lat},${lng}`,
    zoom: "15",
    maptype: "roadmap",
  });

  return (
    <div
      className={cn(
        "rounded-xl border border-border overflow-hidden",
        size === "sm" ? "h-[120px]" : "h-[160px]",
        className
      )}
    >
      <iframe
        className="w-full h-full"
        src={`https://www.google.com/maps/embed/v1/place?${params.toString()}`}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={query}
      />
    </div>
  );
}
