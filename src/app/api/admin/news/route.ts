import { NextResponse } from "next/server";
import type {
  LocalizedString,
  NewsPost,
  NewsSource,
  NewsStatus,
} from "@/data/types";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import { fillLocalized } from "@/lib/localized";
import { getNewsPost, getNewsPosts, upsertNewsPost } from "@/lib/news";

type Body = {
  slug?: string;
  date?: string;
  status?: NewsStatus;
  title?: Partial<LocalizedString> | string;
  summary?: Partial<LocalizedString> | string;
  body?: Partial<LocalizedString> | string;
  coverImage?: string;
  gallery?: string[];
  sources?: NewsSource[];
};

function normalizeSources(sources: Body["sources"]): NewsSource[] | undefined {
  if (!Array.isArray(sources)) return undefined;
  const cleaned = sources
    .map((item) => ({
      label: String(item?.label ?? "").trim(),
      url: String(item?.url ?? "").trim(),
    }))
    .filter((item) => item.label && item.url);
  return cleaned.length > 0 ? cleaned : undefined;
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getNewsPosts({ includeDrafts: true }));
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await request.json()) as Body;
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const date = String(body.date ?? "").trim();
    const status: NewsStatus =
      body.status === "draft" ? "draft" : "published";

    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        { error: "slug 형식이 올바르지 않습니다. (예: project-update)" },
        { status: 400 },
      );
    }
    if (!date || !isValidDate(date)) {
      return NextResponse.json(
        { error: "날짜는 YYYY-MM-DD 형식이어야 합니다." },
        { status: 400 },
      );
    }

    const title = fillLocalized(body.title);
    const summary = fillLocalized(body.summary);
    const bodyText = fillLocalized(body.body);
    if (!title.en || !summary.en || !bodyText.en) {
      return NextResponse.json(
        { error: "제목·요약·본문 영어(EN)는 필수입니다." },
        { status: 400 },
      );
    }

    if (await getNewsPost(slug, { includeDrafts: true })) {
      return NextResponse.json(
        { error: "이미 존재하는 slug입니다." },
        { status: 409 },
      );
    }

    const post: NewsPost = {
      slug,
      date,
      status,
      title,
      summary,
      body: bodyText,
      coverImage: String(body.coverImage ?? "").trim() || undefined,
      gallery: Array.isArray(body.gallery)
        ? body.gallery.map(String).filter(Boolean)
        : [],
      sources: normalizeSources(body.sources),
    };

    await upsertNewsPost(post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "뉴스 저장 실패" }, { status: 500 });
  }
}
