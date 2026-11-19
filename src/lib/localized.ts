import type { LocalizedString } from "@/data/types";
import { routing, type AppLocale } from "@/i18n/routing";

export function fillLocalized(
  value: Partial<LocalizedString> | string | undefined,
  fallback = "",
): LocalizedString {
  const base =
    typeof value === "string"
      ? value
      : value?.en?.trim() ||
        value?.am?.trim() ||
        value?.ko?.trim() ||
        value?.ja?.trim() ||
        value?.zh?.trim() ||
        fallback;

  const result = {} as LocalizedString;
  for (const locale of routing.locales) {
    const typed = typeof value === "string" ? undefined : value?.[locale];
    result[locale] = typed?.trim() || base;
  }
  return result;
}

export function emptyLocalized(): LocalizedString {
  const result = {} as LocalizedString;
  for (const locale of routing.locales) {
    result[locale] = "";
  }
  return result;
}
