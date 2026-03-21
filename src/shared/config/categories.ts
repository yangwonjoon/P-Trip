import type { Category } from "./types";

export interface CategoryInfo {
  key: Category;
  label: string;
  emoji: string;
  description: string;
  color: string;
  colorLight: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: "FOOD",
    label: "Food & restaurants",
    emoji: "🍲",
    description: "BBQ, street food, cafes...",
    color: "#D85A30",
    colorLight: "rgba(216, 90, 48, 0.1)",
  },
  {
    key: "ATTRACTION",
    label: "Attractions",
    emoji: "🏯",
    description: "Temples, parks, views...",
    color: "#378ADD",
    colorLight: "rgba(55, 138, 221, 0.1)",
  },
  {
    key: "SHOPPING",
    label: "Shopping & markets",
    emoji: "🛍",
    description: "Traditional markets, malls...",
    color: "#1D9E75",
    colorLight: "rgba(29, 158, 117, 0.1)",
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<Category, CategoryInfo>;
