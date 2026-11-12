import type { AppLocale } from "@/i18n/routing";

export type LocalizedString = Record<AppLocale, string>;

export type SocialLinks = {
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  other?: string;
};

export type ProductStatus = "draft" | "published" | "hidden";

export type NewsStatus = "draft" | "published";

export type NewsSource = {
  label: string;
  url: string;
};

export type NewsPost = {
  slug: string;
  /** ISO date string YYYY-MM-DD */
  date: string;
  status?: NewsStatus;
  title: LocalizedString;
  summary: LocalizedString;
  body: LocalizedString;
  coverImage?: string;
  /** Extra photos shown in the article */
  gallery?: string[];
  /** Optional press / reference links */
  sources?: NewsSource[];
};

export type Company = {
  slug: string;
  name: string;
  city: string;
  country: string;
  category: LocalizedString;
  summary: LocalizedString;
  strengths: LocalizedString[];
  verified: boolean;
  foundedYear?: number;
  employees?: string;
  exportReady: boolean;
  /** Cover photo shown on cards and company page hero */
  coverImage?: string;
  /** Company logo on the company profile (falls back to Addis Hands mark) */
  logoImage?: string;
  /** Extra workshop / team / factory photos */
  gallery?: string[];
  /** SME social / storefront links */
  social?: SocialLinks;
};

export type Product = {
  slug: string;
  companySlug: string;
  name: LocalizedString;
  category: LocalizedString;
  /** Short card blurb / answer-engine lead (1–2 sentences) */
  summary: LocalizedString;
  material: LocalizedString;
  origin: LocalizedString;
  moq: string;
  leadTime: string;
  priceRange?: string;
  featured?: boolean;
  /** Main product photo */
  coverImage?: string;
  /** Additional product angles / detail shots */
  gallery?: string[];

  /** TradeKorea-style visibility */
  status?: ProductStatus;
  modelNumber?: string;
  /** Hierarchical category breadcrumbs, e.g. Leather Goods > Wallets > Card wallets */
  categoryPath?: string[];
  /** Search / SEO keywords */
  keywords?: string[];

  /** Long SEO/GEO product description (aim for 5+ clear paragraphs in EN) */
  description?: LocalizedString;
  /** Bullet selling points */
  features?: LocalizedString[];
  /** Who buys it / use cases */
  applications?: LocalizedString;
  /** Measurable specs narrative */
  specifications?: LocalizedString;
  packaging?: LocalizedString;
  certifications?: string[];
  colors?: string;
  sizes?: string;
  unit?: string;
  hsCode?: string;
  paymentTerms?: string;
  supplyAbility?: string;
  sampleAvailable?: boolean;
  sampleLeadTime?: string;
  port?: string;

  /** Optional meta overrides for SEO */
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;

  /** Product or brand SNS links (Instagram etc.) */
  social?: SocialLinks;
};
