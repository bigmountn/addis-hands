import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ko", "ja", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
  // Always land on EN from `/` — do not follow Accept-Language / locale cookie.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
