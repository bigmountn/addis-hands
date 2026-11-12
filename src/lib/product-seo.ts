import type { Company, Product } from "@/data/types";
import type { AppLocale } from "@/i18n/routing";
import { tLocal } from "@/lib/locale";

export function productMetaTitle(product: Product, locale: AppLocale) {
  if (product.seoTitle?.[locale] || product.seoTitle?.en) {
    return tLocal(product.seoTitle, locale);
  }
  return `${tLocal(product.name, locale)} | Addis Hands`;
}

export function productMetaDescription(product: Product, locale: AppLocale) {
  if (product.seoDescription?.[locale] || product.seoDescription?.en) {
    return tLocal(product.seoDescription, locale);
  }
  return tLocal(product.summary, locale);
}

export function buildProductJsonLd(
  product: Product,
  company: Company | undefined,
  locale: AppLocale,
  url: string,
) {
  const images = [
    product.coverImage,
    ...(product.gallery ?? []),
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tLocal(product.name, locale),
    description: tLocal(product.description ?? product.summary, locale),
    category: tLocal(product.category, locale),
    material: tLocal(product.material, locale),
    countryOfOrigin: {
      "@type": "Country",
      name: tLocal(product.origin, locale),
    },
    image: images,
    sku: product.modelNumber || product.slug,
    url,
    brand: company
      ? {
          "@type": "Brand",
          name: company.name,
        }
      : undefined,
    manufacturer: company
      ? {
          "@type": "Organization",
          name: company.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: company.city,
            addressCountry: company.country,
          },
          sameAs: Object.values(company.social ?? {}).filter(Boolean),
        }
      : undefined,
    additionalProperty: [
      { "@type": "PropertyValue", name: "MOQ", value: product.moq },
      { "@type": "PropertyValue", name: "Lead time", value: product.leadTime },
      product.hsCode
        ? { "@type": "PropertyValue", name: "HS code", value: product.hsCode }
        : null,
      ...(product.keywords ?? []).map((keyword) => ({
        "@type": "PropertyValue",
        name: "keyword",
        value: keyword,
      })),
    ].filter(Boolean),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: product.priceRange || "0",
      description: product.priceRange || "Quote on request",
      url,
    },
  };
}
