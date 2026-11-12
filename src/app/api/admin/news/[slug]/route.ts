import { NextResponse } from "next/server";
import type { LocalizedString, NewsPost, NewsStatus } from "@/data/types";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import { fillLocalized } from "@/lib/localized";
import {
  deleteNewsPost,
  getNewsPost,
  upsertNewsPost,
} from "@/lib/news";

type Body = {
  date?: string;
  status?: NewsStatus;
  title?: Partial<LocalizedString> | string;
  summary?: Partial<LocalizedString> | string;
  body?: Partial<LocalizedString> | string;
  coverImage?: string;
};

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await context.params;
  const post = await getNewsPost(slug, { includeDrafts: true });
  if (!post) {
    return NextResponse.json({ error: "뉴스를 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json(post);
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
    const existing = await getNewsPost(slug, { includeDrafts: true });
    if (!existing) {
      return NextResponse.json({ error: "뉴스를 찾을 수 없습니다." }, { status: 404 });
    }

    const body = (await request.json()) as Body;
    const date = String(body.date ?? existing.date).trim();
    if (!date || !isValidDate(date)) {
      return NextResponse.json(
        { error: "날짜는 YYYY-MM-DD 형식이어야 합니다." },
        { status: 400 },
      );
    }

    const title = fillLocalized(body.title ?? existing.title);
    const summary = fillLocalized(body.summary ?? existing.summary);
    const bodyText = fillLocalized(body.body ?? existing.body);
    if (!title.en || !summary.en || !bodyText.en) {
      return NextResponse.json(
        { error: "제목·요약·본문 영어(EN)는 필수입니다." },
        { status: 400 },
      );
    }

    const post: NewsPost = {
      ...existing,
      date,
      status:
        body.status === "draft"
          ? "draft"
          : body.status === "published"
            ? "published"
            : existing.status ?? "published",
      title,
      summary,
      body: bodyText,
      coverImage:
        body.coverImage !== undefined
          ? String(body.coverImage).trim() || undefined
          : existing.coverImage,
    };

    await upsertNewsPost(post);
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "뉴스 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await context.params;
  const existing = await getNewsPost(slug, { includeDrafts: true });
  if (!existing) {
    return NextResponse.json({ error: "뉴스를 찾을 수 없습니다." }, { status: 404 });
  }
  await deleteNewsPost(slug);
  return NextResponse.json({ ok: true });
}
