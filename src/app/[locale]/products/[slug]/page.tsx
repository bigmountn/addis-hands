import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getProduct,
  getProductCompany,
  getProducts,
} from "@/lib/catalog";
import { MediaFrame } from "@/components/MediaFrame";
import { SocialLinksList } from "@/components/SocialLinksList";
import { tLocal } from "@/lib/locale";
import {
  buildProductJsonLd,
  productMetaDescription,
  productMetaTitle,
} from "@/lib/product-seo";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as AppLocale;
  const product = await getProduct(slug);
  if (!product) return {};

  const title = productMetaTitle(product, locale);
  const description = productMetaDescription(product, locale);
  const keywords = product.keywords ?? [];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.coverImage ? [{ url: product.coverImage }] : undefined,
    },
    alternates: {
      languages: {
        en: `/en/products/${slug}`,
        ko: `/ko/products/${slug}`,
        ja: `/ja/products/${slug}`,
        zh: `/zh/products/${slug}`,
      },
    },
  };
}

function ProseBlock({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  if (!body?.trim()) return null;
  return (
    <section className="space-y-3">
            <h2 className="ah-section-title text-2xl md:text-3xl">
              {title}
            </h2>
      <div className="whitespace-pre-line text-base leading-relaxed text-[var(--ink-soft)]">
        {body}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const product = await getProduct(slug);
  if (!product) notFound();

  const company = await getProductCompany(product);
  const t = await getTranslations("Products");
  const gallery = product.gallery ?? [];
  const features = product.features ?? [];
  const pathLabel = (product.categoryPath ?? []).join(" › ");
  const pageUrl = `https://addishands.com/${locale}/products/${product.slug}`;
  const jsonLd = buildProductJsonLd(product, company, locale, pageUrl);
  const mergedSocial = {
    ...company?.social,
    ...product.social,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div className="space-y-3">
          <MediaFrame
            src={product.coverImage}
            alt={tLocal(product.name, locale)}
            label={t("photoCover")}
            hint={`/media/products/${product.slug}/cover.jpg`}
            aspectClassName="aspect-square"
            className="bg-[var(--soft)]"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((src, index) => (
                <MediaFrame
                  key={src}
                  src={src}
                  alt={`${tLocal(product.name, locale)} ${index + 1}`}
                  label={t("photoGallery")}
                  hint={`/media/products/${product.slug}/gallery-${index + 1}.jpg`}
                  aspectClassName="aspect-square"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          ) : null}
          <p className="text-xs text-[var(--muted)]">{t("photoHelp")}</p>
        </div>

        <div className="space-y-5">
          {pathLabel ? (
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              {pathLabel}
            </p>
          ) : (
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--olive)]">
              {tLocal(product.category, locale)}
            </p>
          )}
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-light tracking-[-0.03em] text-[var(--ink)] md:text-5xl">
            {tLocal(product.name, locale)}
          </h1>
          {product.modelNumber ? (
            <p className="text-sm text-[var(--muted)]">
              {t("model")}: {product.modelNumber}
            </p>
          ) : null}
          {company ? (
            <p className="text-[var(--muted)]">
              {t("company")}:{" "}
              <Link
                href={`/companies/${company.slug}`}
                className="text-[var(--leather)] underline-offset-2 hover:underline"
              >
                {company.name}
              </Link>
            </p>
          ) : null}
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--ink)]/85">
            {tLocal(product.summary, locale)}
          </p>

          {(product.keywords?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.keywords!.map((keyword) => (
                <span
                  key={keyword}
                  className="border border-[var(--line)] bg-white px-2 py-1 text-xs text-[var(--muted)]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}

          <aside className="bg-[var(--panel)] p-6 ring-1 ring-[var(--line)]">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[var(--muted)]">{t("material")}</dt>
                <dd>{tLocal(product.material, locale)}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("origin")}</dt>
                <dd>{tLocal(product.origin, locale)}</dd>
              </div>
              {product.colors ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("colors")}</dt>
                  <dd>{product.colors}</dd>
                </div>
              ) : null}
              {product.sizes ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("sizes")}</dt>
                  <dd>{product.sizes}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-[var(--muted)]">{t("moq")}</dt>
                <dd>
                  {product.moq}
                  {product.unit ? ` (${product.unit})` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("leadTime")}</dt>
                <dd>{product.leadTime}</dd>
              </div>
              {product.priceRange ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("price")}</dt>
                  <dd>{product.priceRange}</dd>
                </div>
              ) : null}
              {product.hsCode ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("hsCode")}</dt>
                  <dd>{product.hsCode}</dd>
                </div>
              ) : null}
              {product.paymentTerms ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("paymentTerms")}</dt>
                  <dd>{product.paymentTerms}</dd>
                </div>
              ) : null}
              {product.supplyAbility ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("supplyAbility")}</dt>
                  <dd>{product.supplyAbility}</dd>
                </div>
              ) : null}
              {product.port ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("port")}</dt>
                  <dd>{product.port}</dd>
                </div>
              ) : null}
              {product.sampleAvailable ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("sample")}</dt>
                  <dd>
                    {t("sampleYes")}
                    {product.sampleLeadTime
                      ? ` · ${product.sampleLeadTime}`
                      : ""}
                  </dd>
                </div>
              ) : null}
              {(product.certifications?.length ?? 0) > 0 ? (
                <div>
                  <dt className="text-[var(--muted)]">{t("certifications")}</dt>
                  <dd>{product.certifications!.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          </aside>

          <SocialLinksList social={mergedSocial} title={t("social")} />

          <Link
            href={`/inquire?role=buyer&company=${encodeURIComponent(company?.name ?? "")}&product=${encodeURIComponent(product.name.en)}`}
            className="ah-btn ah-btn-primary"
          >
            {t("inquire")}
          </Link>
        </div>
      </div>

      <div className="mt-14 space-y-10 border-t border-[var(--line)] pt-10">
        <ProseBlock
          title={t("description")}
          body={
            product.description
              ? tLocal(product.description, locale)
              : undefined
          }
        />

        {features.length > 0 ? (
          <section className="space-y-3">
            <h2 className="ah-section-title text-2xl md:text-3xl">
              {t("features")}
            </h2>
            <ul className="space-y-2 text-base text-[var(--ink)]/85">
              {features.map((feature) => (
                <li key={feature.en}>• {tLocal(feature, locale)}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <ProseBlock
          title={t("applications")}
          body={
            product.applications
              ? tLocal(product.applications, locale)
              : undefined
          }
        />
        <ProseBlock
          title={t("specifications")}
          body={
            product.specifications
              ? tLocal(product.specifications, locale)
              : undefined
          }
        />
        <ProseBlock
          title={t("packaging")}
          body={
            product.packaging ? tLocal(product.packaging, locale) : undefined
          }
        />
      </div>
    </div>
  );
}
