import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCompanies, getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ company?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { company: companyFilter } = await searchParams;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);
  const t = await getTranslations("Products");
  const [companies, products] = await Promise.all([
    getCompanies(),
    getProducts(),
  ]);

  const filtered = companyFilter
    ? products.filter((product) => product.companySlug === companyFilter)
    : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 max-w-2xl space-y-3">
        <h1 className="ah-section-title text-4xl md:text-5xl">{t("title")}</h1>
        <p className="text-[var(--muted)]">{t("subtitle")}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`border px-3 py-1.5 text-sm ${
            !companyFilter
              ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--sand)]"
              : "border-[var(--line)] text-[var(--muted)]"
          }`}
        >
          {t("filterAll")}
        </Link>
        {companies.map((company) => (
          <Link
            key={company.slug}
            href={`/products?company=${encodeURIComponent(company.slug)}`}
            className={`border px-3 py-1.5 text-sm ${
              companyFilter === company.slug
                ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--sand)]"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {company.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">{t("empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
