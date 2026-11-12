import type { AppLocale } from "@/i18n/routing";
import type { LocalizedString } from "@/data/types";

export function tLocal(
  value: LocalizedString,
  locale: AppLocale,
): string {
  return value[locale] ?? value.en;
}
