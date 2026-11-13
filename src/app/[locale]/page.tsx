import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCompanies, getFeaturedProducts, getProducts } from "@/lib/catalog";
import { CompanyCard } from "@/components/CompanyCard";
import { ProductCard } from "@/components/ProductCard";
import { MediaFrame } from "@/components/MediaFrame";
import { routing, type AppLocale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const companies = await getCompanies();
  const products = await getProducts();
  const featuredCompanies = companies.slice(0, 3);
  const featuredProducts = (await getFeaturedProducts()).slice(0, 4);
  const heroMedia = "/hero/leather-messenger-hero.jpg";
  const companyCount = companies.length;
  const productCount = products.length;
  const languageCount = routing.locales.length;

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
            quality={62}
            zoomClassName="ah-hero-media object-[82%_center] md:object-[78%_center]"
            dim
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(25,25,28,0.88)] via-[rgba(25,25,28,0.62)] to-[rgba(25,25,28,0.18)]" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl items-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <div className="max-w-2xl space-y-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e8c57a] md:text-sm">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-xl text-balance font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-[-0.03em] md:text-6xl">
              {t("headline")}
            </h1>
            <p className="max-w-lg text-pretty text-base leading-relaxed text-white/90 md:text-lg md:text-balance">
              {t("mission")}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/companies"
                className="ah-btn ah-btn-primary !bg-white !text-[var(--ink)] hover:!bg-[var(--sand)]"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/inquire"
                className="ah-btn border border-white/50 bg-transparent !text-white hover:border-white"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-white/90 md:text-[15px]">
              {t("ctaNote")}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--panel)]">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-2 px-4 py-5 text-sm text-[var(--ink-soft)] md:px-6 md:text-[15px]">
          <span>{t("statsCompanies", { count: companyCount })}</span>
          <span className="hidden text-[var(--line)] sm:inline" aria-hidden>
            ·
          </span>
          <span>{t("statsProducts", { count: productCount })}</span>
          <span className="hidden text-[var(--line)] sm:inline" aria-hidden>
            ·
          </span>
          <span>{t("statsLanguages", { count: languageCount })}</span>
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

      <section className="border-b border-[var(--line)] bg-[var(--canvas)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <div className="max-w-3xl space-y-6">
            <h2 className="ah-section-title text-3xl md:text-5xl">
              {t("orderingTitle")}
            </h2>
            <ol className="space-y-3 text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
              <li>
                <span className="mr-2 font-medium text-[var(--ink)]">1.</span>
                {t("orderingStep1")}
              </li>
              <li>
                <span className="mr-2 font-medium text-[var(--ink)]">2.</span>
                {t("orderingStep2")}
              </li>
              <li>
                <span className="mr-2 font-medium text-[var(--ink)]">3.</span>
                {t("orderingStep3")}
              </li>
            </ol>
            <p className="text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
              {t("orderingNote")}
            </p>
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
