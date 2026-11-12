import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCompanies } from "@/lib/catalog";
import { CompanyCard } from "@/components/CompanyCard";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function CompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);
  const t = await getTranslations("Companies");
  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 max-w-2xl space-y-3">
        <h1 className="ah-section-title text-4xl md:text-5xl">{t("title")}</h1>
        <p className="text-[var(--muted)]">{t("subtitle")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {companies.map((company) => (
          <CompanyCard key={company.slug} company={company} locale={locale} />
        ))}
      </div>
    </div>
  );
}
