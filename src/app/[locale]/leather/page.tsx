import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExportDestinationCharts } from "@/components/ExportDestinationCharts";
import {
  BagIcon,
  CraftProductsIcon,
  GloveIcon,
  HidesIcon,
  LivestockIcon,
  ShoeIcon,
  SuedeIcon,
  TanneryIcon,
} from "@/components/LeatherUseIcons";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const materials = [
  {
    key: "cattle" as const,
    gradeKey: "cattleGrade" as const,
    useKey: "cattleUse" as const,
    image: "/industry/cattle-arba-minch.jpg",
    population: "70M",
    potential: "10M",
  },
  {
    key: "goat" as const,
    gradeKey: "goatGrade" as const,
    useKey: "goatUse" as const,
    image: "/industry/goat-hamer.jpg",
    population: "53M",
    potential: "14M",
  },
  {
    key: "sheep" as const,
    gradeKey: "sheepGrade" as const,
    useKey: "sheepUse" as const,
    image: "/industry/sheep-tigray.jpg",
    population: "43M",
    potential: "17M",
  },
];

const useItems = [
  {
    titleKey: "useGlovesTitle" as const,
    bodyKey: "useGlovesBody" as const,
    Icon: GloveIcon,
  },
  {
    titleKey: "useSuedeTitle" as const,
    bodyKey: "useSuedeBody" as const,
    Icon: SuedeIcon,
  },
  {
    titleKey: "useUppersTitle" as const,
    bodyKey: "useUppersBody" as const,
    Icon: ShoeIcon,
  },
  {
    titleKey: "useGoodsTitle" as const,
    bodyKey: "useGoodsBody" as const,
    Icon: BagIcon,
  },
];

const chainSteps = [
  { key: "chainLivestock" as const, Icon: LivestockIcon },
  { key: "chainHides" as const, Icon: HidesIcon },
  { key: "chainTannery" as const, Icon: TanneryIcon },
  { key: "chainProducts" as const, Icon: CraftProductsIcon },
];

export default async function LeatherPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);
  const t = await getTranslations("Leather");

  return (
    <div>
      <section className="border-b border-[var(--line)] bg-[linear-gradient(160deg,#ece4d6_0%,#f7f1e8_45%,#e8efe6_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-3xl space-y-5">
            <p className="ah-eyebrow ah-rise">{t("eyebrow")}</p>
            <h1 className="ah-rise-delay ah-section-title text-4xl md:text-6xl">
              {t("title")}
            </h1>
            <p className="ah-fade text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">
              {t("lead")}
            </p>
            <div className="ah-fade flex flex-wrap gap-3 pt-2">
              <Link href="/companies" className="ah-btn ah-btn-primary">
                {t("ctaCompanies")}
              </Link>
              <Link href="/products" className="ah-btn ah-btn-secondary">
                {t("ctaProducts")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 className="ah-section-title text-3xl md:text-4xl">
            {t("materialsTitle")}
          </h2>
          <p className="leading-relaxed text-[var(--ink-soft)]">
            {t("materialsLead")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {materials.map((item, index) => (
            <article
              key={item.key}
              className="ah-rise space-y-4"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="overflow-hidden bg-[var(--soft)]">
                <Image
                  src={item.image}
                  alt={t(`${item.key}Name`)}
                  width={640}
                  height={680}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="ah-section-title text-2xl">
                    {t(`${item.key}Name`)}
                  </h3>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--cognac)]">
                    {item.population}
                  </p>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--gold)]">
                  {t(item.gradeKey)}
                </p>
                <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t(`${item.key}Body`)}
                </p>
                <p className="text-sm text-[var(--ink)]">{t(item.useKey)}</p>
                <p className="text-xs text-[var(--muted)]">
                  {t("potentialLabel")}: {item.potential} {t(`${item.key}Unit`)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-xs text-[var(--muted)]">{t("materialsSource")}</p>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--espresso)] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-6 md:py-20">
          <div className="space-y-5">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-[-0.02em] md:text-5xl">
              {t("sheepTitle")}
            </h2>
            <p className="text-lg leading-relaxed text-white/80">
              {t("sheepLead")}
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-white/75">
              <li className="border-l border-[var(--ochre)] pl-4">
                {t("sheepPoint1")}
              </li>
              <li className="border-l border-[var(--ochre)] pl-4">
                {t("sheepPoint2")}
              </li>
              <li className="border-l border-[var(--ochre)] pl-4">
                {t("sheepPoint3")}
              </li>
            </ul>
            <p className="pt-2 text-base italic text-[var(--ochre)]">
              {t("sheepClose")}
            </p>
          </div>
          <div className="overflow-hidden">
            <Image
              src="/industry/sheep-tigray.jpg"
              alt={t("sheepTitle")}
              width={900}
              height={960}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 className="ah-section-title text-3xl md:text-4xl">
            {t("usesTitle")}
          </h2>
          <p className="leading-relaxed text-[var(--ink-soft)]">
            {t("usesLead")}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {useItems.map(({ titleKey, bodyKey, Icon }) => (
            <div
              key={titleKey}
              className="flex gap-4 border border-[var(--line)] bg-[var(--panel)] px-5 py-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[color-mix(in_srgb,var(--clay)_12%,white)] text-[var(--espresso)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--clay)_18%,transparent)]">
                <Icon className="h-8 w-8" />
              </div>
              <div className="min-w-0 space-y-1 pt-0.5">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {t(titleKey)}
                </p>
                <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                  {t(bodyKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 className="ah-section-title text-3xl md:text-4xl">
            {t("chainTitle")}
          </h2>
          <p className="leading-relaxed text-[var(--ink-soft)]">
            {t("chainBody")}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
          {chainSteps.map((step, index) => (
            <div
              key={step.key}
              className="flex flex-1 items-center gap-3 md:contents"
            >
              <div className="flex flex-1 flex-col items-center gap-3 border border-[var(--line)] bg-[var(--panel)] px-4 py-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-[color-mix(in_srgb,var(--cognac)_14%,white)] text-[var(--espresso)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--cognac)_22%,transparent)]">
                  <step.Icon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {t(step.key)}
                  </p>
                </div>
              </div>
              {index < chainSteps.length - 1 ? (
                <span
                  aria-hidden
                  className="hidden items-center px-2 text-[var(--muted)] md:flex"
                >
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <ExportDestinationCharts />

      <section className="border-t border-[var(--line)] bg-[var(--soft)]/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="max-w-2xl space-y-4">
            <h2 className="ah-section-title text-3xl md:text-4xl">
              {t("exploreTitle")}
            </h2>
            <p className="leading-relaxed text-[var(--ink-soft)]">
              {t("exploreBody")}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/companies" className="ah-btn ah-btn-primary">
                {t("ctaCompanies")}
              </Link>
              <Link href="/products" className="ah-btn ah-btn-secondary">
                {t("ctaProducts")}
              </Link>
              <Link
                href="/inquire?role=buyer"
                className="ah-btn ah-btn-secondary"
              >
                {t("ctaInquire")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
