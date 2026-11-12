import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isValidSlug, requireAdmin } from "@/lib/admin-api";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const form = await request.formData();
    const kind = String(form.get("kind") ?? "");
    const slug = String(form.get("slug") ?? "").trim().toLowerCase();
    const role = String(form.get("role") ?? "cover");
    const file = form.get("file");

    if (kind !== "company" && kind !== "product" && kind !== "news") {
      return NextResponse.json(
        { error: "kind는 company, product 또는 news여야 합니다." },
        { status: 400 },
      );
    }
    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json({ error: "유효한 slug가 필요합니다." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "파일이 필요합니다." }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일은 8MB 이하여야 합니다." },
        { status: 400 },
      );
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "지원 형식: JPEG, PNG, WebP, GIF, SVG" },
        { status: 400 },
      );
    }

    const folder =
      kind === "company" ? "companies" : kind === "product" ? "products" : "news";
    const safeRole =
      role === "cover"
        ? "cover"
        : role === "logo"
          ? "logo"
          : role.startsWith("gallery-")
            ? role.replace(/[^a-z0-9-]/g, "")
            : `gallery-${Date.now()}`;

    const relativeDir = path.join("media", folder, slug);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);
    await fs.mkdir(absoluteDir, { recursive: true });

    const filename = `${safeRole}${ext}`;
    const absolutePath = path.join(absoluteDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(absolutePath, buffer);

    const url = `/${relativeDir.replaceAll(path.sep, "/")}/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}
