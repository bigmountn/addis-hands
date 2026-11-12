import { NextResponse } from "next/server";
import type { Company, LocalizedString, SocialLinks } from "@/data/types";
import { getCompanies, getCompany } from "@/lib/catalog";
import { fillLocalized, upsertCompany } from "@/lib/catalog-store";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import { cleanSocial } from "@/lib/product-fields";

type Body = {
  slug?: string;
  name?: string;
  city?: string;
  country?: string;
  category?: Partial<LocalizedString> | string;
  summary?: Partial<LocalizedString> | string;
  strengths?: Array<Partial<LocalizedString> | string>;
  verified?: boolean;
  foundedYear?: number | string | null;
  employees?: string;
  exportReady?: boolean;
  coverImage?: string;
  logoImage?: string;
  gallery?: string[];
  social?: Partial<SocialLinks>;
};

function normalizeStrengths(
  strengths: Body["strengths"],
): LocalizedString[] {
  if (!Array.isArray(strengths)) return [];
  return strengths
    .map((item) => fillLocalized(item))
    .filter((item) => item.en.trim().length > 0);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const companies = await getCompanies();
  return NextResponse.json(companies);
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await request.json()) as Body;
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();
    const city = String(body.city ?? "").trim();
    const country = String(body.country ?? "").trim() || "Ethiopia";

    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        { error: "slug 형식이 올바르지 않습니다. (예: my-company)" },
        { status: 400 },
      );
    }
    if (!name || !city) {
      return NextResponse.json(
        { error: "회사명과 도시는 필수입니다." },
        { status: 400 },
      );
    }

    const category = fillLocalized(body.category);
    const summary = fillLocalized(body.summary);
    if (!category.en || !summary.en) {
      return NextResponse.json(
        { error: "카테고리·소개 영어(EN)는 필수입니다." },
        { status: 400 },
      );
    }

    if (await getCompany(slug)) {
      return NextResponse.json(
        { error: "이미 존재하는 slug입니다." },
        { status: 409 },
      );
    }

    const foundedRaw = body.foundedYear;
    const foundedYear =
      foundedRaw === null || foundedRaw === undefined || foundedRaw === ""
        ? undefined
        : Number(foundedRaw);

    const company: Company = {
      slug,
      name,
      city,
      country,
      category,
      summary,
      strengths: normalizeStrengths(body.strengths),
      verified: Boolean(body.verified),
      foundedYear:
        foundedYear !== undefined && Number.isFinite(foundedYear)
          ? foundedYear
          : undefined,
      employees: String(body.employees ?? "").trim() || undefined,
      exportReady: Boolean(body.exportReady),
      coverImage: String(body.coverImage ?? "").trim() || undefined,
      logoImage: String(body.logoImage ?? "").trim() || undefined,
      gallery: Array.isArray(body.gallery)
        ? body.gallery.map(String).filter(Boolean)
        : [],
      social: cleanSocial(body.social),
    };

    await upsertCompany(company);
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "회사 저장 실패" }, { status: 500 });
  }
}
