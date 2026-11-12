import type {
  LocalizedString,
  Product,
  ProductStatus,
  SocialLinks,
} from "@/data/types";
import { fillLocalized } from "@/lib/localized";

export function emptySocial(): SocialLinks {
  return {
    website: "",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
    tiktok: "",
    other: "",
  };
}

export function cleanSocial(
  value: Partial<SocialLinks> | undefined | null,
): SocialLinks | undefined {
  if (!value) return undefined;
  const next: SocialLinks = {};
  const keys: Array<keyof SocialLinks> = [
    "website",
    "instagram",
    "facebook",
    "youtube",
    "linkedin",
    "tiktok",
    "other",
  ];
  for (const key of keys) {
    const raw = String(value[key] ?? "").trim();
    if (raw) next[key] = raw;
  }
  return Object.keys(next).length ? next : undefined;
}

export function hasSocial(social?: SocialLinks) {
  if (!social) return false;
  return Object.values(social).some((value) => Boolean(value?.trim()));
}

function optionalLocalized(
  value: Partial<LocalizedString> | string | undefined | null,
): LocalizedString | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string" && !value.trim()) return undefined;
  if (typeof value !== "string") {
    const hasAny = ["en", "ko", "ja", "zh"].some(
      (locale) => Boolean(value[locale as keyof LocalizedString]?.trim()),
    );
    if (!hasAny) return undefined;
  }
  return fillLocalized(value);
}

function listFromUnknown(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function featuresFromUnknown(value: unknown): LocalizedString[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const features = value
    .map((item) => {
      if (typeof item === "string") return fillLocalized(item);
      return fillLocalized(item as Partial<LocalizedString>);
    })
    .filter((item) => item.en.trim().length > 0);
  return features.length ? features : undefined;
}

export type ProductPayload = {
  slug?: string;
  companySlug?: string;
  name?: Partial<LocalizedString> | string;
  category?: Partial<LocalizedString> | string;
  summary?: Partial<LocalizedString> | string;
  material?: Partial<LocalizedString> | string;
  origin?: Partial<LocalizedString> | string;
  moq?: string;
  leadTime?: string;
  priceRange?: string;
  featured?: boolean;
  coverImage?: string;
  gallery?: string[];
  status?: ProductStatus | string;
  modelNumber?: string;
  categoryPath?: string[] | string;
  keywords?: string[] | string;
  description?: Partial<LocalizedString> | string;
  features?: Array<Partial<LocalizedString> | string>;
  applications?: Partial<LocalizedString> | string;
  specifications?: Partial<LocalizedString> | string;
  packaging?: Partial<LocalizedString> | string;
  certifications?: string[] | string;
  colors?: string;
  sizes?: string;
  unit?: string;
  hsCode?: string;
  paymentTerms?: string;
  supplyAbility?: string;
  sampleAvailable?: boolean;
  sampleLeadTime?: string;
  port?: string;
  seoTitle?: Partial<LocalizedString> | string;
  seoDescription?: Partial<LocalizedString> | string;
  social?: Partial<SocialLinks>;
};

export function normalizeProductInput(
  body: ProductPayload,
  existing?: Product,
): Omit<Product, "slug" | "companySlug"> & {
  slug?: string;
  companySlug?: string;
} {
  const statusRaw = String(body.status ?? existing?.status ?? "published");
  const status: ProductStatus =
    statusRaw === "draft" || statusRaw === "hidden" || statusRaw === "published"
      ? statusRaw
      : "published";

  return {
    slug: body.slug,
    companySlug: body.companySlug,
    name: fillLocalized(body.name ?? existing?.name),
    category: fillLocalized(body.category ?? existing?.category),
    summary: fillLocalized(body.summary ?? existing?.summary),
    material: fillLocalized(body.material ?? existing?.material),
    origin: fillLocalized(body.origin ?? existing?.origin ?? "Ethiopia"),
    moq: String(body.moq ?? existing?.moq ?? "").trim(),
    leadTime: String(body.leadTime ?? existing?.leadTime ?? "").trim(),
    priceRange:
      body.priceRange !== undefined
        ? String(body.priceRange).trim() || undefined
        : existing?.priceRange,
    featured:
      body.featured !== undefined ? Boolean(body.featured) : existing?.featured,
    coverImage:
      body.coverImage !== undefined
        ? String(body.coverImage).trim() || undefined
        : existing?.coverImage,
    gallery:
      body.gallery !== undefined
        ? body.gallery.map(String).filter(Boolean)
        : existing?.gallery ?? [],
    status,
    modelNumber:
      body.modelNumber !== undefined
        ? String(body.modelNumber).trim() || undefined
        : existing?.modelNumber,
    categoryPath:
      body.categoryPath !== undefined
        ? listFromUnknown(body.categoryPath)
        : existing?.categoryPath,
    keywords:
      body.keywords !== undefined
        ? listFromUnknown(body.keywords)
        : existing?.keywords,
    description:
      body.description !== undefined
        ? optionalLocalized(body.description)
        : existing?.description,
    features:
      body.features !== undefined
        ? featuresFromUnknown(body.features)
        : existing?.features,
    applications:
      body.applications !== undefined
        ? optionalLocalized(body.applications)
        : existing?.applications,
    specifications:
      body.specifications !== undefined
        ? optionalLocalized(body.specifications)
        : existing?.specifications,
    packaging:
      body.packaging !== undefined
        ? optionalLocalized(body.packaging)
        : existing?.packaging,
    certifications:
      body.certifications !== undefined
        ? listFromUnknown(body.certifications)
        : existing?.certifications,
    colors:
      body.colors !== undefined
        ? String(body.colors).trim() || undefined
        : existing?.colors,
    sizes:
      body.sizes !== undefined
        ? String(body.sizes).trim() || undefined
        : existing?.sizes,
    unit:
      body.unit !== undefined
        ? String(body.unit).trim() || undefined
        : existing?.unit,
    hsCode:
      body.hsCode !== undefined
        ? String(body.hsCode).trim() || undefined
        : existing?.hsCode,
    paymentTerms:
      body.paymentTerms !== undefined
        ? String(body.paymentTerms).trim() || undefined
        : existing?.paymentTerms,
    supplyAbility:
      body.supplyAbility !== undefined
        ? String(body.supplyAbility).trim() || undefined
        : existing?.supplyAbility,
    sampleAvailable:
      body.sampleAvailable !== undefined
        ? Boolean(body.sampleAvailable)
        : existing?.sampleAvailable,
    sampleLeadTime:
      body.sampleLeadTime !== undefined
        ? String(body.sampleLeadTime).trim() || undefined
        : existing?.sampleLeadTime,
    port:
      body.port !== undefined
        ? String(body.port).trim() || undefined
        : existing?.port,
    seoTitle:
      body.seoTitle !== undefined
        ? optionalLocalized(body.seoTitle)
        : existing?.seoTitle,
    seoDescription:
      body.seoDescription !== undefined
        ? optionalLocalized(body.seoDescription)
        : existing?.seoDescription,
    social:
      body.social !== undefined
        ? cleanSocial(body.social)
        : existing?.social,
  };
}

export function isProductPublic(product: Product) {
  return (product.status ?? "published") === "published";
}
