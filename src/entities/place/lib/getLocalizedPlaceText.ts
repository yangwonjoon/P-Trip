import type { Place, PlaceI18nValue, PlaceLocale } from "../model/types";

function normalizeLocale(locale: string): PlaceLocale {
  switch (locale) {
    case "ko":
    case "ja":
    case "zh":
    case "en":
      return locale;
    default:
      return "en";
  }
}

function readI18nValue(value: PlaceI18nValue | null | undefined, locale: string): string | undefined {
  if (!value) return undefined;

  const normalizedLocale = normalizeLocale(locale);
  const candidates: PlaceLocale[] =
    normalizedLocale === "ko"
      ? ["ko", "en", "ja", "zh"]
      : [normalizedLocale, "en", "ko", "ja", "zh"];

  for (const key of candidates) {
    const text = value[key]?.trim();
    if (text) return text;
  }

  return undefined;
}

function readLegacyValue(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const text = value?.trim();
    if (text) return text;
  }

  return "";
}

export function getPlaceName(place: Place, locale: string): string {
  return (
    readI18nValue(place.name_i18n, locale) ||
    readLegacyValue(locale === "ko" ? place.name_ko : place.name_en, place.name_en, place.name_ko)
  );
}

export function getPlaceSecondaryName(place: Place, locale: string): string {
  if (normalizeLocale(locale) === "ko") {
    return readI18nValue(place.name_i18n, "en") || readLegacyValue(place.name_en);
  }

  return readI18nValue(place.name_i18n, "ko") || readLegacyValue(place.name_ko);
}

export function getPlaceDescription(place: Place, locale: string): string {
  return readI18nValue(place.description_i18n, locale) || readLegacyValue(place.description);
}

export function getPlaceLongDescription(place: Place, locale: string): string {
  return (
    readI18nValue(place.description_long_i18n, locale) ||
    readLegacyValue(place.description_long) ||
    getPlaceDescription(place, locale)
  );
}

export function getPlaceAddress(place: Place, locale: string): string {
  return (
    readI18nValue(place.address_i18n, locale) ||
    readLegacyValue(normalizeLocale(locale) === "ko" ? place.address_ko : place.address_en, place.address_en, place.address_ko)
  );
}

export function getPlaceOperatingHours(place: Place, locale: string): string {
  return readI18nValue(place.operating_hours_i18n, locale) || readLegacyValue(place.operating_hours);
}

export function getPlaceClosedDays(place: Place, locale: string): string | undefined {
  return readI18nValue(place.closed_days_i18n, locale) || place.closed_days;
}

export function getPlaceNearestStation(place: Place, locale: string): string | undefined {
  return readI18nValue(place.nearest_station_i18n, locale) || place.nearest_station;
}

export function getPlaceDokkaebiTip(place: Place, locale: string): string | undefined {
  return readI18nValue(place.dokkaebi_tip_i18n, locale) || place.dokkaebi_tip;
}
