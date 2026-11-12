import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getCompanies,
  getCompany,
  getProductsByCompany,
} from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { MediaFrame } from "@/components/MediaFrame";
import { SocialLinksList } from "@/components/SocialLinksList";
import { tLocal } from "@/lib/locale";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((company) => ({ slug: company.slug }));
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const company = await getCompany(slug);
  if (!company) notFound();

  const t = await getTranslations("Companies");
  const companyProducts = await getProductsByCompany(company.slug);
  const gallery = company.gallery ?? [];
  const logoSrc = company.logoImage || "/brand/logo-full.png";
  const usingFallbackLogo = !company.logoImage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-3">
          <MediaFrame
            src={company.coverImage}
            alt={`${company.name} cover`}
            label={t("photoCover")}
            hint={`/media/companies/${company.slug}/cover.jpg`}
            aspectClassName="aspect-[16/10]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((src, index) => (
                <MediaFrame
                  key={src}
                  src={src}
                  alt={`${company.name} gallery ${index + 1}`}
                  label={t("photoGallery")}
                  hint={`/media/companies/${company.slug}/gallery-${index + 1}.jpg`}
                  aspectClassName="aspect-[4/3]"
                  sizes="(max-width: 1024px) 50vw, 30vw"
                />
              ))}
            </div>
          ) : null}
          <p className="text-xs text-[var(--muted)]">{t("photoHelp")}</p>
        </div>

        <div className="space-y-4">
          <div className="flex h-24 w-24 items-center justify-center border border-[var(--line)] bg-white p-3 md:h-28 md:w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={
                usingFallbackLogo
                  ? "Addis Hands"
                  : `${company.name} logo`
              }
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {company.verified ? (
              <span className="rounded-sm bg-[var(--olive)]/15 px-2 py-0.5 text-[11px] uppercase tracking-wider text-[var(--olive)]">
                {t("verified")}
              </span>
            ) : null}
            {company.exportReady ? (
              <span className="rounded-sm bg-[var(--sand)] px-2 py-0.5 text-[11px] uppercase tracking-wider text-[var(--muted)]">
                {t("exportReady")}
              </span>
            ) : null}
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-light tracking-[-0.03em] text-[var(--ink)] md:text-5xl">
            {company.name}
          </h1>
          <p className="text-[var(--muted)]">
            {company.city}, {company.country}
          </p>
          <p className="text-lg leading-relaxed text-[var(--ink)]/85">
            {tLocal(company.summary, locale)}
          </p>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--muted)]">{t("category")}</dt>
              <dd>{tLocal(company.category, locale)}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">{t("location")}</dt>
              <dd>
                {company.city}, {company.country}
              </dd>
            </div>
          </dl>
          <div>
            <h2 className="mb-2 text-sm uppercase tracking-[0.16em] text-[var(--olive)]">
              {t("strengths")}
            </h2>
            <ul className="space-y-1 text-sm text-[var(--ink)]/85">
              {company.strengths.map((item) => (
                <li key={item.en}>• {tLocal(item, locale)}</li>
              ))}
            </ul>
          </div>
          <SocialLinksList social={company.social} title={t("social")} />

          <Link
            href={`/inquire?role=buyer&company=${encodeURIComponent(company.name)}`}
            className="ah-btn ah-btn-primary"
          >
            {t("inquire")}
          </Link>
        </div>
      </div>

      <section>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {t("products")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companyProducts.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
