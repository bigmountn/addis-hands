import type { AppLocale } from "@/i18n/routing";
import type { LocalizedString } from "@/data/types";

export function tLocal(
  value: LocalizedString,
  locale: AppLocale,
): string {
  const localized = value[locale]?.trim();
  if (localized) return localized;
  return value.en?.trim() || Object.values(value).find((v) => v?.trim()) || "";
}
