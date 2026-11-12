import { NextResponse } from "next/server";
import type { Product } from "@/data/types";
import { getCompany, getProduct } from "@/lib/catalog";
import { deleteProduct, upsertProduct } from "@/lib/catalog-store";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import {
  normalizeProductInput,
  type ProductPayload,
} from "@/lib/product-fields";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await context.params;
  const product = await getProduct(slug, { includeUnpublished: true });
  if (!product) {
    return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json(product);
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
    const existing = await getProduct(slug, { includeUnpublished: true });
    if (!existing) {
      return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
    }

    const body = (await request.json()) as ProductPayload;
    const companySlug = String(
      body.companySlug ?? existing.companySlug,
    )
      .trim()
      .toLowerCase();

    if (!companySlug || !(await getCompany(companySlug))) {
      return NextResponse.json(
        { error: "유효한 회사(companySlug)가 필요합니다." },
        { status: 400 },
      );
    }

    const normalized = normalizeProductInput(
      { ...body, companySlug },
      existing,
    );
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

    const product: Product = {
      ...existing,
      ...normalized,
      slug,
      companySlug,
    };

    await upsertProduct(product);
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "제품 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await context.params;
  const existing = await getProduct(slug, { includeUnpublished: true });
  if (!existing) {
    return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }
  await deleteProduct(slug);
  return NextResponse.json({ ok: true });
}
