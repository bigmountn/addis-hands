import { Redis } from "@upstash/redis";

const KEY_PREFIX = "news:views:";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function newsViewsConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function viewKey(slug: string) {
  return `${KEY_PREFIX}${slug}`;
}

export async function getNewsViewCount(slug: string): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const value = await redis.get<number | string>(viewKey(slug));
    if (value === null || value === undefined) return 0;
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return null;
  }
}

export async function getNewsViewCounts(
  slugs: string[],
): Promise<Record<string, number> | null> {
  const redis = getRedis();
  if (!redis) return null;
  if (slugs.length === 0) return {};

  try {
    const pipeline = redis.pipeline();
    for (const slug of slugs) {
      pipeline.get(viewKey(slug));
    }
    const results = await pipeline.exec();
    const counts: Record<string, number> = {};
    slugs.forEach((slug, index) => {
      const value = results[index] as number | string | null | undefined;
      if (value === null || value === undefined) {
        counts[slug] = 0;
        return;
      }
      const n = typeof value === "number" ? value : Number(value);
      counts[slug] = Number.isFinite(n) ? n : 0;
    });
    return counts;
  } catch {
    return null;
  }
}

export async function incrementNewsViewCount(
  slug: string,
): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const next = await redis.incr(viewKey(slug));
    return typeof next === "number" ? next : Number(next) || null;
  } catch {
    return null;
  }
}
