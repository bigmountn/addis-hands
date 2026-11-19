import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { translateEnToAm } from "@/lib/translate";

type Body = {
  text?: string;
  source?: string;
  target?: string;
};

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await request.json()) as Body;
    const text = String(body.text ?? "");
    const source = String(body.source ?? "en").toLowerCase();
    const target = String(body.target ?? "am").toLowerCase();

    if (source !== "en" || target !== "am") {
      return NextResponse.json(
        { error: "현재는 영어(EN) → 암하릭(AM)만 지원합니다." },
        { status: 400 },
      );
    }
    if (!text.trim()) {
      return NextResponse.json({ error: "번역할 영어 텍스트가 비어 있습니다." }, { status: 400 });
    }
    if (text.length > 12000) {
      return NextResponse.json(
        { error: "한 번에 12,000자까지 번역할 수 있습니다." },
        { status: 400 },
      );
    }

    const translated = await translateEnToAm(text);
    return NextResponse.json({ translated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "자동 번역에 실패했습니다. 암하릭을 직접 입력해 주세요.",
      },
      { status: 502 },
    );
  }
}
