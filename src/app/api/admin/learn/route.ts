import { NextResponse } from "next/server";
import type { BilingualString, LearnPost, LearnStatus } from "@/data/types";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import {
  fillBilingual,
  getLearnPost,
  getLearnPosts,
  upsertLearnPost,
} from "@/lib/learn";
import { translateEnToAm } from "@/lib/translate";

type Body = {
  slug?: string;
  date?: string;
  status?: LearnStatus;
  episode?: number | string;
  title?: Partial<BilingualString> | string;
  summary?: Partial<BilingualString> | string;
  body?: Partial<BilingualString> | string;
  coverImage?: string;
  gallery?: string[];
  resourceUrl?: string;
  resourceLabel?: Partial<BilingualString> | string;
};

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function ensureAmOnSave(
  value: Partial<BilingualString> | string | undefined,
): Promise<BilingualString> {
  const filled = fillBilingual(value);
  if (!filled.en) return filled;
  if (filled.am) return filled;
  const am = await translateEnToAm(filled.en);
  return { en: filled.en, am };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getLearnPosts({ includeDrafts: true }));
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await request.json()) as Body;
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const date = String(body.date ?? "").trim();
    const status: LearnStatus =
      body.status === "draft" ? "draft" : "published";
    const episodeRaw = body.episode;
    const episode =
      episodeRaw === undefined || episodeRaw === ""
        ? undefined
        : Number(episodeRaw);

    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        { error: "slug 형식이 올바르지 않습니다. (예: ai-for-everyone)" },
        { status: 400 },
      );
    }
    if (!date || !isValidDate(date)) {
      return NextResponse.json(
        { error: "날짜는 YYYY-MM-DD 형식이어야 합니다." },
        { status: 400 },
      );
    }
    if (episode !== undefined && (!Number.isFinite(episode) || episode < 1)) {
      return NextResponse.json(
        { error: "회차(episode)는 1 이상의 숫자여야 합니다." },
        { status: 400 },
      );
    }

    const [title, summary, bodyText] = await Promise.all([
      ensureAmOnSave(body.title),
      ensureAmOnSave(body.summary),
      ensureAmOnSave(body.body),
    ]);
    if (!title.en || !summary.en || !bodyText.en) {
      return NextResponse.json(
        { error: "제목·요약·본문 영어(EN)는 필수입니다." },
        { status: 400 },
      );
    }

    if (await getLearnPost(slug, { includeDrafts: true })) {
      return NextResponse.json(
        { error: "이미 존재하는 slug입니다." },
        { status: 409 },
      );
    }

    const resourceUrl = String(body.resourceUrl ?? "").trim() || undefined;
    let resourceLabel: BilingualString | undefined;
    if (resourceUrl && body.resourceLabel) {
      resourceLabel = await ensureAmOnSave(body.resourceLabel);
      if (!resourceLabel.en) resourceLabel = undefined;
    }

    const post: LearnPost = {
      slug,
      date,
      status,
      episode,
      title,
      summary,
      body: bodyText,
      coverImage: String(body.coverImage ?? "").trim() || undefined,
      gallery: Array.isArray(body.gallery)
        ? body.gallery.map((item) => String(item ?? ""))
        : [],
      resourceUrl,
      resourceLabel,
    };

    await upsertLearnPost(post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Learn 저장 실패",
      },
      { status: 500 },
    );
  }
}
