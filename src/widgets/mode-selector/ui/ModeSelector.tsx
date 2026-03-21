"use client";

import { ChevronRight } from "lucide-react";
import { COPY } from "@/shared/config";
import type { DrawMode } from "@/features/draw-card";
import { cn } from "@/shared/lib";

interface ModeSelectorProps {
  selectedMode: DrawMode;
  onSelectMode: (mode: DrawMode) => void;
}

const MODES: {
  key: DrawMode;
  emoji: string;
  label: string;
  description: string;
  badge?: string;
  disabled?: boolean;
}[] = [
  {
    key: "category",
    emoji: "🍲",
    label: COPY.mode.category.label,
    description: COPY.mode.category.description,
  },
  {
    key: "mix",
    emoji: "🔀",
    label: COPY.mode.mix.label,
    description: COPY.mode.mix.description,
  },
  {
    key: "course",
    emoji: "🌍",
    label: COPY.mode.course.label,
    description: COPY.mode.course.description,
    badge: COPY.mode.course.badge,
    disabled: true,
  },
];

export function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  return (
    <section className="px-6 pb-8">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        {COPY.mode.sectionLabel}
      </p>

      <div className="flex flex-col gap-3">
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.key;
          return (
            <button
              key={mode.key}
              onClick={() => !mode.disabled && onSelectMode(mode.key)}
              disabled={mode.disabled}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                mode.disabled && "opacity-50 cursor-not-allowed",
                isSelected && !mode.disabled
                  ? "border-[var(--pt-purple)] bg-[var(--pt-purple-light)]"
                  : "border-border hover:border-[var(--pt-purple)]/30"
              )}
            >
              <span className="text-2xl">{mode.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{mode.label}</span>
                  {mode.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {mode.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mode.description}
                </p>
              </div>
              {!mode.disabled && (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
