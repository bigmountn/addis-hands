import { NextResponse } from "next/server";
import type { Company, LocalizedString, SocialLinks } from "@/data/types";
import { getCompany } from "@/lib/catalog";
import {
  deleteCompany,
  fillLocalized,
  upsertCompany,
} from "@/lib/catalog-store";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import { cleanSocial } from "@/lib/product-fields";

type Body = {
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

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await context.params;
  const company = await getCompany(slug);
  if (!company) {
    return NextResponse.json({ error: "회사를 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json(company);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { slug } = await context.params;
    if (!isValidSlug(slug)) {
      return NextResponse.json({ error: "잘못된 slug" }, { status: 400 });
    }
    const existing = await getCompany(slug);
    if (!existing) {
      return NextResponse.json({ error: "회사를 찾을 수 없습니다." }, { status: 404 });
    }

    const body = (await request.json()) as Body;
    const name = String(body.name ?? existing.name).trim();
    const city = String(body.city ?? existing.city).trim();
    const country = String(body.country ?? existing.country).trim() || "Ethiopia";
    const category = fillLocalized(body.category ?? existing.category);
    const summary = fillLocalized(body.summary ?? existing.summary);

    if (!name || !city || !category.en || !summary.en) {
      return NextResponse.json(
        { error: "필수 항목(회사명/도시/카테고리·소개 EN)을 확인하세요." },
        { status: 400 },
      );
    }

    const foundedRaw = body.foundedYear;
    const foundedYear =
      foundedRaw === null || foundedRaw === undefined || foundedRaw === ""
        ? undefined
        : Number(foundedRaw);

    const company: Company = {
      ...existing,
      name,
      city,
      country,
      category,
      summary,
      strengths:
        body.strengths !== undefined
          ? normalizeStrengths(body.strengths)
          : existing.strengths,
      verified:
        body.verified !== undefined ? Boolean(body.verified) : existing.verified,
      foundedYear:
        foundedYear !== undefined && Number.isFinite(foundedYear)
          ? foundedYear
          : body.foundedYear === null || body.foundedYear === ""
            ? undefined
            : existing.foundedYear,
      employees:
        body.employees !== undefined
          ? String(body.employees).trim() || undefined
          : existing.employees,
      exportReady:
        body.exportReady !== undefined
          ? Boolean(body.exportReady)
          : existing.exportReady,
      coverImage:
        body.coverImage !== undefined
          ? String(body.coverImage).trim() || undefined
          : existing.coverImage,
      logoImage:
        body.logoImage !== undefined
          ? String(body.logoImage).trim() || undefined
          : existing.logoImage,
      gallery:
        body.gallery !== undefined
          ? body.gallery.map(String).filter(Boolean)
          : existing.gallery,
      social:
        body.social !== undefined ? cleanSocial(body.social) : existing.social,
    };

    await upsertCompany(company);
    return NextResponse.json(company);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "회사 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await context.params;
  const existing = await getCompany(slug);
  if (!existing) {
    return NextResponse.json({ error: "회사를 찾을 수 없습니다." }, { status: 404 });
  }
  await deleteCompany(slug);
  return NextResponse.json({ ok: true });
}
