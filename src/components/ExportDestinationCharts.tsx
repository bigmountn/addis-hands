import { getTranslations } from "next-intl/server";

type CountryKey =
  | "countryChina"
  | "countryVietnam"
  | "countryHongKong"
  | "countryIndonesia"
  | "countryIndia"
  | "countryUnitedStates"
  | "countryItaly"
  | "countrySweden"
  | "countryPoland"
  | "countryGermany"
  | "countryFrance"
  | "countryUnitedKingdom";

type Bar = {
  countryKey: CountryKey;
  valueLabel: string;
  share: number;
};

const flagCode: Record<CountryKey, string> = {
  countryChina: "cn",
  countryVietnam: "vn",
  countryHongKong: "hk",
  countryIndonesia: "id",
  countryIndia: "in",
  countryUnitedStates: "us",
  countryItaly: "it",
  countrySweden: "se",
  countryPoland: "pl",
  countryGermany: "de",
  countryFrance: "fr",
  countryUnitedKingdom: "gb",
};

/** Sheep/lamb skin leather prepared after tanning — WITS/Comtrade 2023 (USD). */
const materialBars: Bar[] = [
  { countryKey: "countryChina", valueLabel: "$6.2M", share: 100 },
  { countryKey: "countryVietnam", valueLabel: "$2.9M", share: 47 },
  { countryKey: "countryHongKong", valueLabel: "$1.1M", share: 17 },
  { countryKey: "countryIndonesia", valueLabel: "$1.0M", share: 16 },
  { countryKey: "countryIndia", valueLabel: "$0.8M", share: 13 },
];

/** Leather articles — OEC 2024 (USD). */
const articleBars: Bar[] = [
  { countryKey: "countryUnitedStates", valueLabel: "$3.4M", share: 100 },
  { countryKey: "countryItaly", valueLabel: "$0.43M", share: 12 },
  { countryKey: "countrySweden", valueLabel: "$0.31M", share: 9 },
  { countryKey: "countryChina", valueLabel: "$0.20M", share: 6 },
  { countryKey: "countryPoland", valueLabel: "$0.16M", share: 5 },
];

/** Leather footwear — 2024 trade aggregates (USD). */
const footwearBars: Bar[] = [
  { countryKey: "countryItaly", valueLabel: "$1.6M", share: 100 },
  { countryKey: "countryUnitedStates", valueLabel: "$1.2M", share: 75 },
  { countryKey: "countryGermany", valueLabel: "$0.70M", share: 44 },
  { countryKey: "countryFrance", valueLabel: "$0.67M", share: 42 },
  { countryKey: "countryUnitedKingdom", valueLabel: "$0.28M", share: 18 },
];

export async function ExportDestinationCharts() {
  const t = await getTranslations("Leather");

  const charts = [
    {
      title: t("exportMaterialsTitle"),
      note: t("exportMaterialsNote"),
      bars: materialBars,
      accent: "var(--cognac)",
    },
    {
      title: t("exportArticlesTitle"),
      note: t("exportArticlesNote"),
      bars: articleBars,
      accent: "var(--clay)",
    },
    {
      title: t("exportFootwearTitle"),
      note: t("exportFootwearNote"),
      bars: footwearBars,
      accent: "var(--olive)",
    },
  ];

  return (
    <section className="border-y border-[var(--line)] bg-[var(--panel)]">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 className="ah-section-title text-3xl md:text-4xl">
            {t("exportTitle")}
          </h2>
          <p className="leading-relaxed text-[var(--ink-soft)]">
            {t("exportLead")}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {charts.map((chart) => (
            <div key={chart.title} className="space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
                  {chart.title}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--muted)]">
                  {chart.note}
                </p>
              </div>
              <ul className="space-y-3.5">
                {chart.bars.map((bar) => (
                  <li
                    key={`${chart.title}-${bar.countryKey}`}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-[var(--ink)]">
                        <img
                          src={`/flags/${flagCode[bar.countryKey]}.svg`}
                          alt=""
                          width={18}
                          height={12}
                          className="h-3 w-[18px] shrink-0 rounded-[1px] object-cover ring-1 ring-[var(--line)]"
                          loading="lazy"
                        />
                        <span className="truncate">{t(bar.countryKey)}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-[var(--muted)]">
                        {bar.valueLabel}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-sm bg-[var(--soft)]">
                      <div
                        className="h-full rounded-sm"
                        style={{
                          width: `${bar.share}%`,
                          background: chart.accent,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-[var(--muted)]">
          {t("exportSource")}
        </p>
      </div>
    </section>
  );
}
