import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  getAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = String(body.password ?? "");
    const expected = getAdminPassword();

    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    if (password !== expected) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "로그인에 실패했습니다." }, { status: 500 });
  }
}
