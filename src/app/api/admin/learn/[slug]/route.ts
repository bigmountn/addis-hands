import { NextResponse } from "next/server";
import type { BilingualString, LearnPost, LearnStatus } from "@/data/types";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";
import {
  deleteLearnPost,
  fillBilingual,
  getLearnPost,
  upsertLearnPost,
} from "@/lib/learn";
import { translateEnToAm } from "@/lib/translate";

type Body = {
  date?: string;
  status?: LearnStatus;
  episode?: number | string | null;
  title?: Partial<BilingualString> | string;
  summary?: Partial<BilingualString> | string;
  body?: Partial<BilingualString> | string;
  coverImage?: string;
  resourceUrl?: string;
  resourceLabel?: Partial<BilingualString> | string;
};

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function ensureAmOnSave(
  value: Partial<BilingualString> | string | undefined,
  existing?: BilingualString,
): Promise<BilingualString> {
  const filled = fillBilingual(value ?? existing);
  const rawAm =
    typeof value === "string"
      ? ""
      : String(value?.am ?? "").trim() || String(existing?.am ?? "").trim();
  if (rawAm) return { en: filled.en, am: rawAm };
  if (!filled.en) return filled;
  const am = await translateEnToAm(filled.en);
  return { en: filled.en, am };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { slug } = await context.params;
  const post = await getLearnPost(slug, { includeDrafts: true });
  if (!post) {
    return NextResponse.json({ error: "Learn 글을 찾을 수 없습니다." }, { status: 404 });
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
    const existing = await getLearnPost(slug, { includeDrafts: true });
    if (!existing) {
      return NextResponse.json({ error: "Learn 글을 찾을 수 없습니다." }, { status: 404 });
    }

    const body = (await request.json()) as Body;
    const date = String(body.date ?? existing.date).trim();
    if (!date || !isValidDate(date)) {
      return NextResponse.json(
        { error: "날짜는 YYYY-MM-DD 형식이어야 합니다." },
        { status: 400 },
      );
    }

    const episode =
      body.episode === null
        ? undefined
        : body.episode === undefined || body.episode === ""
          ? existing.episode
          : Number(body.episode);
    if (episode !== undefined && (!Number.isFinite(episode) || episode < 1)) {
      return NextResponse.json(
        { error: "회차(episode)는 1 이상의 숫자여야 합니다." },
        { status: 400 },
      );
    }

    const [title, summary, bodyText] = await Promise.all([
      ensureAmOnSave(body.title, existing.title),
      ensureAmOnSave(body.summary, existing.summary),
      ensureAmOnSave(body.body, existing.body),
    ]);
    if (!title.en || !summary.en || !bodyText.en) {
      return NextResponse.json(
        { error: "제목·요약·본문 영어(EN)는 필수입니다." },
        { status: 400 },
      );
    }

    const resourceUrl =
      body.resourceUrl !== undefined
        ? String(body.resourceUrl).trim() || undefined
        : existing.resourceUrl;

    let resourceLabel = existing.resourceLabel;
    if (body.resourceLabel !== undefined) {
      resourceLabel = await ensureAmOnSave(
        body.resourceLabel,
        existing.resourceLabel,
      );
      if (!resourceLabel.en) resourceLabel = undefined;
    }
    if (!resourceUrl) resourceLabel = undefined;

    const post: LearnPost = {
      ...existing,
      date,
      status:
        body.status === "draft"
          ? "draft"
          : body.status === "published"
            ? "published"
            : existing.status ?? "published",
      episode,
      title,
      summary,
      body: bodyText,
      coverImage:
        body.coverImage !== undefined
          ? String(body.coverImage).trim() || undefined
          : existing.coverImage,
      resourceUrl,
      resourceLabel,
    };

    await upsertLearnPost(post);
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Learn 수정 실패",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { slug } = await context.params;
    const existing = await getLearnPost(slug, { includeDrafts: true });
    if (!existing) {
      return NextResponse.json(
        { error: "Learn 글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    await deleteLearnPost(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Learn 삭제 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
