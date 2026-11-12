import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCompanies, getFeaturedProducts } from "@/lib/catalog";
import { CompanyCard } from "@/components/CompanyCard";
import { ProductCard } from "@/components/ProductCard";
import { MediaFrame } from "@/components/MediaFrame";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");
  const companies = await getCompanies();
  const featuredCompanies = companies.slice(0, 3);
  const featuredProducts = (await getFeaturedProducts()).slice(0, 4);
  const heroMedia = "/hero/leather-messenger-hero.jpg";

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden border-b border-[var(--line)] bg-[var(--espresso)]">
        <div className="absolute inset-0">
          <MediaFrame
            src={heroMedia}
            alt="Handcrafted leather messenger bag"
            aspectClassName="h-full min-h-[88vh]"
            className="border-0"
            sizes="100vw"
            priority
            zoomClassName="ah-hero-media object-[72%_center]"
            dim
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(25,25,28,0.78)] via-[rgba(25,25,28,0.45)] to-transparent" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl items-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <div className="max-w-2xl space-y-5 text-white">
            <p className="ah-rise text-xs font-bold uppercase tracking-[0.18em] text-[var(--ochre)]">
              {t("eyebrow")}
            </p>
            <h1 className="ah-rise-delay font-[family-name:var(--font-display)] text-5xl font-light leading-[0.95] tracking-[-0.03em] md:text-7xl">
              ADDIS HANDS
            </h1>
            <p className="ah-fade text-sm uppercase tracking-[0.2em] text-white/70">
              Crafted by the hands of Addis
            </p>
            <p className="ah-fade max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              {t("mission")}
            </p>
            <div className="ah-fade flex flex-wrap gap-3 pt-2">
              <Link href="/companies" className="ah-btn ah-btn-primary !bg-white !text-[var(--ink)] hover:!bg-[var(--sand)]">
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/inquire"
                className="ah-btn border border-white/40 bg-transparent !text-white hover:border-white"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
            <p className="text-xs tracking-wide text-white/55">
              {tCommon("b2bOnly")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="ah-section-title text-3xl md:text-5xl">
            {t("featuredCompanies")}
          </h2>
          <Link
            href="/companies"
            className="text-sm font-medium text-[var(--clay)] underline-offset-4 hover:underline"
          >
            {t("viewAll")} →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredCompanies.map((company) => (
            <CompanyCard key={company.slug} company={company} locale={locale} />
          ))}
        </div>
      </section>

      <section className="bg-[var(--panel)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="ah-section-title text-3xl md:text-5xl">
              {t("featuredProducts")}
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-[var(--clay)] underline-offset-4 hover:underline"
            >
              {t("viewAll")} →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="max-w-3xl space-y-5">
          <p className="ah-eyebrow">{t("eyebrow")}</p>
          <h2 className="ah-section-title text-3xl md:text-5xl">
            {t("bridgeTitle")}
          </h2>
          <p className="text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
            {t("bridgeBody")}
          </p>
          <Link href="/about" className="ah-btn ah-btn-primary">
            About Addis Hands →
          </Link>
        </div>
      </section>
    </div>
  );
}
