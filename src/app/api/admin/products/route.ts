import { NextResponse } from "next/server";
import type { Product } from "@/data/types";
import { getAllProducts, getCompany, getProduct } from "@/lib/catalog";
import { upsertProduct } from "@/lib/catalog-store";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import {
  normalizeProductInput,
  type ProductPayload,
} from "@/lib/product-fields";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getAllProducts());
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await request.json()) as ProductPayload;
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const companySlug = String(body.companySlug ?? "").trim().toLowerCase();

    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        { error: "slug 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }
    if (!companySlug || !(await getCompany(companySlug))) {
      return NextResponse.json(
        { error: "유효한 회사(companySlug)가 필요합니다." },
        { status: 400 },
      );
    }

    const normalized = normalizeProductInput({ ...body, slug, companySlug });
    if (
      !normalized.name.en ||
      !normalized.category.en ||
      !normalized.summary.en ||
      !normalized.material.en ||
      !normalized.origin.en
    ) {
      return NextResponse.json(
        { error: "이름·카테고리·소개·소재·원산지 영어(EN)는 필수입니다." },
        { status: 400 },
      );
    }
    if (!normalized.moq || !normalized.leadTime) {
      return NextResponse.json(
        { error: "MOQ와 리드타임은 필수입니다." },
        { status: 400 },
      );
    }
    if (await getProduct(slug, { includeUnpublished: true })) {
      return NextResponse.json(
        { error: "이미 존재하는 slug입니다." },
        { status: 409 },
      );
    }

    const product: Product = {
      ...normalized,
      slug,
      companySlug,
    };

    await upsertProduct(product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "제품 저장 실패" }, { status: 500 });
  }
}
