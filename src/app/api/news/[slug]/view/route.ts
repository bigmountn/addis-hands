import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getNewsPost } from "@/lib/news";
import {
  getNewsViewCount,
  incrementNewsViewCount,
  newsViewsConfigured,
} from "@/lib/news-views";

export const runtime = "nodejs";

const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours — same visitor refresh won't inflate

function viewCookieName(slug: string) {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 48);
  return `ah_nv_${safe}`;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const post = await getNewsPost(slug);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!newsViewsConfigured()) {
    return NextResponse.json({ views: null, configured: false });
  }

  const views = await getNewsViewCount(slug);
  return NextResponse.json({ views, configured: true });
}

export async function POST(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const post = await getNewsPost(slug);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!newsViewsConfigured()) {
    return NextResponse.json({ views: null, configured: false, counted: false });
  }

  const jar = await cookies();
  const cookie = viewCookieName(slug);
  const already = jar.get(cookie)?.value === "1";

  let views: number | null;
  let counted = false;

  if (already) {
    views = await getNewsViewCount(slug);
  } else {
    views = await incrementNewsViewCount(slug);
    counted = views !== null;
  }

  const response = NextResponse.json({
    views,
    configured: true,
    counted,
  });

  if (counted) {
    response.cookies.set(cookie, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
  }

  return response;
}
