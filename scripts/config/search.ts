/**
 * 카테고리별 카카오 API 검색 전략
 *
 * FOOD: 카테고리 코드 FD6
 * ATTRACTION: 카테고리 코드 AT4(관광명소) + CT1(문화시설) 합산
 * SHOPPING: 키워드 검색 (백화점, 쇼핑몰, 전통시장, 면세점, 아울렛)
 */

export type Category = "FOOD" | "ATTRACTION" | "SHOPPING";

export interface CategoryCodeSearch {
  type: "category_code";
  codes: string[];
}

export interface KeywordSearch {
  type: "keyword";
  keywords: string[];
}

export type SearchStrategy = CategoryCodeSearch | KeywordSearch;

export const CATEGORY_SEARCH: Record<Category, SearchStrategy> = {
  FOOD: {
    type: "category_code",
    codes: ["FD6"],
  },
  ATTRACTION: {
    type: "category_code",
    codes: ["AT4", "CT1"],
  },
  SHOPPING: {
    type: "keyword",
    keywords: ["백화점", "쇼핑몰", "전통시장", "면세점", "아울렛"],
  },
};
