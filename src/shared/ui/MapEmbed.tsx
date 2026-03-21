import { cn } from "@/shared/lib";

interface MapEmbedProps {
  size?: "sm" | "lg";
  className?: string;
}

export function MapEmbed({ size = "lg", className }: MapEmbedProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center",
        size === "sm" ? "h-[120px]" : "h-[160px]",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        Google Maps Embed
      </span>
    </div>
  );
}
