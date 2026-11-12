import type { LocalizedString } from "@/data/types";
import type { AppLocale } from "@/i18n/routing";

export function fillLocalized(
  value: Partial<LocalizedString> | string | undefined,
  fallback = "",
): LocalizedString {
  const base =
    typeof value === "string"
      ? value
      : value?.en?.trim() ||
        value?.ko?.trim() ||
        value?.ja?.trim() ||
        value?.zh?.trim() ||
        fallback;

  const locales: AppLocale[] = ["en", "ko", "ja", "zh"];
  const result = {} as LocalizedString;
  for (const locale of locales) {
    const typed = typeof value === "string" ? undefined : value?.[locale];
    result[locale] = typed?.trim() || base;
  }
  return result;
}
