"use client";

import { COPY, CATEGORIES } from "@/shared/config";
import type { Category } from "@/shared/config";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface CategorySelectProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onShuffle: () => void;
}

export function CategorySelect({
  selectedCategory,
  onSelectCategory,
  onShuffle,
}: CategorySelectProps) {
  return (
    <div className="flex flex-col items-center px-6 py-8">
      {/* 도깨비 플레이스홀더 */}
      <div className="w-20 h-20 rounded-full bg-[var(--pt-purple-dark)]/10 flex items-center justify-center text-3xl mb-4">
        👹
      </div>

      <h2 className="text-lg font-bold mb-1">{COPY.draw.pickDeck}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {COPY.draw.pickDeckSub}
      </p>

      {/* 카테고리 카드 리스트 */}
      <div className="w-full flex flex-col gap-3 mb-8">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "bg-opacity-10"
                  : "border-border hover:border-opacity-30"
              )}
              style={
                isSelected
                  ? {
                      borderColor: cat.color,
                      backgroundColor: cat.colorLight,
                    }
                  : undefined
              }
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div className="flex-1">
                <span className="font-semibold text-sm">{cat.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <Button
        onClick={onShuffle}
        disabled={!selectedCategory}
        className="w-full h-12 text-base font-semibold bg-[var(--pt-purple)] hover:bg-[var(--pt-purple)]/90 disabled:opacity-40"
      >
        {COPY.draw.shuffleButton}
      </Button>
    </div>
  );
}
