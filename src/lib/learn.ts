import { promises as fs } from "fs";
import path from "path";
import type { BilingualString, LearnPost } from "@/data/types";
import type { LearnLocale } from "@/i18n/routing";

const learnPath = path.join(process.cwd(), "data", "learn.json");

async function readLearn(): Promise<LearnPost[]> {
  const raw = await fs.readFile(learnPath, "utf8");
  return JSON.parse(raw) as LearnPost[];
}

export function isLearnPublic(post: LearnPost) {
  return (post.status ?? "published") === "published";
}

export async function getLearnPosts(options?: {
  includeDrafts?: boolean;
}): Promise<LearnPost[]> {
  const posts = await readLearn();
  const filtered = options?.includeDrafts
    ? posts
    : posts.filter(isLearnPublic);
  return [...filtered].sort((a, b) => {
    const episodeA = a.episode ?? 0;
    const episodeB = b.episode ?? 0;
    if (episodeA !== episodeB) return episodeA - episodeB;
    return a.date.localeCompare(b.date);
  });
}

export async function getLearnPost(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<LearnPost | undefined> {
  const posts = await getLearnPosts(options);
  return posts.find((post) => post.slug === slug);
}

export function tLearn(
  value: BilingualString,
  locale: LearnLocale,
): string {
  const localized = value[locale]?.trim();
  if (localized) return localized;
  return value.en?.trim() || value.am?.trim() || "";
}

export function emptyBilingual(): BilingualString {
  return { en: "", am: "" };
}

export function fillBilingual(
  value: Partial<BilingualString> | string | undefined,
  fallback = "",
): BilingualString {
  if (typeof value === "string") {
    return { en: value.trim() || fallback, am: "" };
  }
  return {
    en: value?.en?.trim() || fallback,
    am: value?.am?.trim() || "",
  };
}

async function saveLearnPosts(posts: LearnPost[]) {
  try {
    await fs.writeFile(
      learnPath,
      JSON.stringify(posts, null, 2) + "\n",
      "utf8",
    );
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      throw new Error(
        "Vercel 등 읽기 전용 환경에서는 관리자 삭제가 저장되지 않습니다. 로컬에서 data/learn.json을 수정한 뒤 GitHub에 푸시하세요.",
      );
    }
    throw error;
  }
}

export async function upsertLearnPost(post: LearnPost) {
  const posts = await getLearnPosts({ includeDrafts: true });
  const index = posts.findIndex((item) => item.slug === post.slug);
  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.push(post);
  }
  await saveLearnPosts(posts);
  return post;
}

export async function deleteLearnPost(slug: string) {
  const posts = await getLearnPosts({ includeDrafts: true });
  await saveLearnPosts(posts.filter((item) => item.slug !== slug));
}
