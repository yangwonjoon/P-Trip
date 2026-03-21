"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import type { DrawMode } from "@/features/draw-card";
import { cn } from "@/shared/lib";

interface ModeSelectorProps {
  selectedMode: DrawMode;
  onSelectMode: (mode: DrawMode) => void;
}

const MODES: {
  key: DrawMode;
  emoji: string;
  disabled?: boolean;
}[] = [
  { key: "category", emoji: "🍲" },
  { key: "mix", emoji: "🔀" },
  { key: "course", emoji: "🌍", disabled: true },
];

export function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  const t = useTranslations();

  return (
    <section className="px-6 pb-8">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        {t("mode.sectionLabel")}
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
                  <span className="font-semibold text-sm">
                    {t(`mode.${mode.key}.label`)}
                  </span>
                  {mode.disabled && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {t("mode.course.badge")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(`mode.${mode.key}.description`)}
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
