import type { Category } from "@/shared/config";

export type DrawMode = "category" | "mix" | "course";

export type DrawState = "select" | "shuffling" | "result";

export interface DrawConfig {
  mode: DrawMode;
  category?: Category;
  city: string;
}
