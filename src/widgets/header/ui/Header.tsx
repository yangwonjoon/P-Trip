"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib";

interface HeaderProps {
  showBack?: boolean;
  city?: string;
}

export function Header({ showBack = false, city }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-12 px-4 max-w-md mx-auto">
        {/* Left: back button */}
        <div className="w-8">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center: logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--pt-purple-dark)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-sm">P&apos;s Trip</span>
        </Link>

        {/* Right: city badge */}
        <div className="w-auto">
          {city && (
            <span
              className={cn(
                "text-xs px-2.5 py-1 rounded-full",
                "bg-muted text-muted-foreground"
              )}
            >
              {city}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
