"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  learnLocales,
  routing,
  type AppLocale,
  type LearnLocale,
} from "@/i18n/routing";

const labels: Record<AppLocale, string> = {
  en: "EN",
  am: "AM",
  ko: "KR",
  ja: "JP",
  zh: "CN",
};

function isLearnPath(pathname: string) {
  return pathname === "/learn" || pathname.startsWith("/learn/");
}

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const locales = isLearnPath(pathname)
    ? (learnLocales as readonly LearnLocale[])
    : routing.locales;

  return (
    <div className="flex shrink-0 items-center gap-0.5" aria-label="Language">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={`rounded px-1.5 py-1 text-xs tracking-wide transition sm:px-2 ${
              active
                ? "bg-[var(--ink)] text-white"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
