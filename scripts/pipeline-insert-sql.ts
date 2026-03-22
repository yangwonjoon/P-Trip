/**
 * pipeline:insert-sql — AI agent 결과 JSON -> Supabase INSERT SQL 생성
 *
 * 사용법:
 *   npm run pipeline:insert-sql -- --input=data/ai-ready/goyang-food.json
 *   npm run pipeline:insert-sql -- --input=data/ai-ready/goyang-food.json --output=supabase/generated/goyang_food.sql
 *
 * 입력 파일 형식:
 * {
 *   "places": [
 *     {
 *       "kakao_place_id": "24891400",
 *       "category": "FOOD",
 *       "city": "GOYANG",
 *       "name_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "description_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "description_long_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "address_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "operating_hours_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "closed_days_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "nearest_station_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "dokkaebi_tip_i18n": { "ko": "...", "en": "...", "ja": "...", "zh": "..." },
 *       "latitude": 37.67,
 *       "longitude": 126.76,
 *       "google_maps_url": "https://maps.google.com/?q=37.67,126.76",
 *       "google_place_id": "...",
 *       "images": ["https://..."],
 *       "tags": ["kalguksu", "local"],
 *       "budget_min": 9000,
 *       "budget_max": 15000,
 *       "walk_minutes": 8,
 *       "rating": 4.2,
 *       "weight": 1.0,
 *       "source": "MANUAL"
 *     }
 *   ]
 * }
 */
import "./lib/env";
import * as fs from "fs";
import * as path from "path";
import type { Locale } from "../src/i18n/routing";

type Category = "FOOD" | "ATTRACTION" | "SHOPPING";
type DataSource = "KAKAO" | "GOOGLE" | "MANUAL" | "COMMUNITY";
type I18nValue = Partial<Record<Locale, string>>;

interface PreparedPlace {
  kakao_place_id: string;
  category: Category;
  city: string;
  name_i18n: I18nValue;
  description_i18n: I18nValue;
  latitude: number;
  longitude: number;
  address_i18n: I18nValue;
  operating_hours_i18n: I18nValue;
  google_maps_url?: string;
  source?: DataSource;
  description_long_i18n?: I18nValue;
  closed_days_i18n?: I18nValue;
  nearest_station_i18n?: I18nValue;
  dokkaebi_tip_i18n?: I18nValue;
  google_place_id?: string;
  images?: string[];
  tags?: string[];
  budget_min?: number;
  budget_max?: number;
  walk_minutes?: number;
  rating?: number;
  weight?: number;
}

interface PreparedPlaceFile {
  places: PreparedPlace[];
}

function getArg(args: string[], key: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === key && args[i + 1]) return args[i + 1];
    if (args[i].startsWith(`${key}=`)) return args[i].split("=")[1];
  }
  return undefined;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const input = getArg(args, "--input");
  const output = getArg(args, "--output");

  if (!input) {
    console.error("❌ --input 파일 경로가 필요합니다.");
    process.exit(1);
  }

  return { input, output };
}

function ensureI18n(value: I18nValue | undefined, fieldName: string): Required<Record<Locale, string>> {
  const normalized = {
    ko: value?.ko?.trim() || "",
    en: value?.en?.trim() || "",
    ja: value?.ja?.trim() || "",
    zh: value?.zh?.trim() || "",
  };

  for (const locale of ["ko", "en", "ja", "zh"] as const) {
    if (!normalized[locale]) {
      throw new Error(`${fieldName}.${locale} 값이 비어 있습니다.`);
    }
  }

  return normalized;
}

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function toSqlText(value: string | null | undefined): string {
  if (!value) return "null";
  return `'${escapeSqlString(value)}'`;
}

function toSqlNumber(value: number | null | undefined): string {
  return typeof value === "number" ? String(value) : "null";
}

function toSqlTextArray(values: string[] | undefined): string {
  if (!values || values.length === 0) return "'{}'::text[]";
  const escaped = values
    .map((value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`)
    .join(",");
  return `${toSqlText(`{${escaped}}`)}::text[]`;
}

function toSqlJsonb(value: I18nValue | undefined, fieldName: string, required = false): string {
  if (!value) {
    if (required) {
      throw new Error(`${fieldName} 값이 필요합니다.`);
    }
    return "null";
  }

  const normalized = required
    ? ensureI18n(value, fieldName)
    : {
        ko: value.ko?.trim() || "",
        en: value.en?.trim() || "",
        ja: value.ja?.trim() || "",
        zh: value.zh?.trim() || "",
      };

  if (!required && !Object.values(normalized).some(Boolean)) {
    return "null";
  }

  return `'${escapeSqlString(JSON.stringify(normalized))}'::jsonb`;
}

function buildGoogleMapsUrl(place: PreparedPlace): string {
  return place.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
}

function buildInsertStatement(place: PreparedPlace): string {
  const name = ensureI18n(place.name_i18n, "name_i18n");
  const description = ensureI18n(place.description_i18n, "description_i18n");
  const address = ensureI18n(place.address_i18n, "address_i18n");
  const operatingHours = ensureI18n(place.operating_hours_i18n, "operating_hours_i18n");

  const source = place.source ?? "MANUAL";
  const googleMapsUrl = buildGoogleMapsUrl(place);

  return `insert into places (
  name_en,
  name_ko,
  name_i18n,
  category,
  city,
  description,
  description_i18n,
  description_long,
  description_long_i18n,
  images,
  latitude,
  longitude,
  address_en,
  address_ko,
  address_i18n,
  operating_hours,
  operating_hours_i18n,
  closed_days,
  closed_days_i18n,
  nearest_station,
  nearest_station_i18n,
  walk_minutes,
  budget_min,
  budget_max,
  dokkaebi_tip,
  dokkaebi_tip_i18n,
  google_maps_url,
  tags,
  rating,
  weight,
  source,
  kakao_place_id,
  google_place_id
)
select
  ${toSqlText(name.en)},
  ${toSqlText(name.ko)},
  ${toSqlJsonb(place.name_i18n, "name_i18n", true)},
  ${toSqlText(place.category)},
  ${toSqlText(place.city)},
  ${toSqlText(description.en)},
  ${toSqlJsonb(place.description_i18n, "description_i18n", true)},
  ${toSqlText(place.description_long_i18n?.en)},
  ${toSqlJsonb(place.description_long_i18n, "description_long_i18n")},
  ${toSqlTextArray(place.images)},
  ${toSqlNumber(place.latitude)},
  ${toSqlNumber(place.longitude)},
  ${toSqlText(address.en)},
  ${toSqlText(address.ko)},
  ${toSqlJsonb(place.address_i18n, "address_i18n", true)},
  ${toSqlText(operatingHours.en)},
  ${toSqlJsonb(place.operating_hours_i18n, "operating_hours_i18n", true)},
  ${toSqlText(place.closed_days_i18n?.en)},
  ${toSqlJsonb(place.closed_days_i18n, "closed_days_i18n")},
  ${toSqlText(place.nearest_station_i18n?.en)},
  ${toSqlJsonb(place.nearest_station_i18n, "nearest_station_i18n")},
  ${toSqlNumber(place.walk_minutes)},
  ${toSqlNumber(place.budget_min)},
  ${toSqlNumber(place.budget_max)},
  ${toSqlText(place.dokkaebi_tip_i18n?.en)},
  ${toSqlJsonb(place.dokkaebi_tip_i18n, "dokkaebi_tip_i18n")},
  ${toSqlText(googleMapsUrl)},
  ${toSqlTextArray(place.tags)},
  ${toSqlNumber(place.rating ?? 4.0)},
  ${toSqlNumber(place.weight ?? 1.0)},
  ${toSqlText(source)},
  ${toSqlText(place.kakao_place_id)},
  ${toSqlText(place.google_place_id)}
where not exists (
  select 1 from places where kakao_place_id = ${toSqlText(place.kakao_place_id)}
);`;
}

function main() {
  const { input, output } = parseArgs();
  const inputPath = path.resolve(process.cwd(), input);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ 입력 파일이 없습니다: ${inputPath}`);
    process.exit(1);
  }

  const parsed = JSON.parse(fs.readFileSync(inputPath, "utf-8")) as PreparedPlaceFile;
  if (!Array.isArray(parsed.places) || parsed.places.length === 0) {
    console.error("❌ places 배열이 비어 있습니다.");
    process.exit(1);
  }

  const statements = parsed.places.map(buildInsertStatement);
  const sql = [
    "-- Generated by scripts/pipeline-insert-sql.ts",
    "-- Review before running in Supabase SQL Editor",
    "",
    "begin;",
    "",
    ...statements,
    "",
    "commit;",
    "",
  ].join("\n");

  if (output) {
    const outputPath = path.resolve(process.cwd(), output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, sql, "utf-8");
    console.log(`✅ SQL 저장 완료: ${outputPath}`);
  } else {
    console.log(sql);
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`❌ SQL 생성 실패: ${message}`);
  process.exit(1);
}
