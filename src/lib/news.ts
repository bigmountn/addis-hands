import { promises as fs } from "fs";
import path from "path";
import type { NewsPost } from "@/data/types";

const newsPath = path.join(process.cwd(), "data", "news.json");

async function readNews(): Promise<NewsPost[]> {
  const raw = await fs.readFile(newsPath, "utf8");
  return JSON.parse(raw) as NewsPost[];
}

export function isNewsPublic(post: NewsPost) {
  return (post.status ?? "published") === "published";
}

export async function getNewsPosts(options?: {
  includeDrafts?: boolean;
}): Promise<NewsPost[]> {
  const posts = await readNews();
  const filtered = options?.includeDrafts
    ? posts
    : posts.filter(isNewsPublic);
  return [...filtered].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsPost(
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<NewsPost | undefined> {
  const posts = await getNewsPosts(options);
  return posts.find((post) => post.slug === slug);
}

export async function saveNewsPosts(posts: NewsPost[]) {
  await fs.writeFile(newsPath, JSON.stringify(posts, null, 2) + "\n", "utf8");
}

export async function upsertNewsPost(post: NewsPost) {
  const posts = await getNewsPosts({ includeDrafts: true });
  const index = posts.findIndex((item) => item.slug === post.slug);
  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.push(post);
  }
  await saveNewsPosts(posts);
  return post;
}

export async function deleteNewsPost(slug: string) {
  const posts = await getNewsPosts({ includeDrafts: true });
  await saveNewsPosts(posts.filter((item) => item.slug !== slug));
}
