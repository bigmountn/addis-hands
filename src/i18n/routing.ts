import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // AM sits immediately after EN for Ethiopian SME visitors.
  locales: ["en", "am", "ko", "ja", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
  // Always land on EN from `/` — do not follow Accept-Language / locale cookie.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

/** Learn is EN + Amharic only (Ethiopian SME staff). */
export const learnLocales = ["en", "am"] as const;
export type LearnLocale = (typeof learnLocales)[number];

export function isLearnLocale(locale: string): locale is LearnLocale {
  return (learnLocales as readonly string[]).includes(locale);
}
