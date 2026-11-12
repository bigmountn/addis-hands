"use client";

import type { SocialLinks } from "@/data/types";
import { emptySocial } from "@/lib/product-fields";

const fields: Array<{ key: keyof SocialLinks; label: string; placeholder: string }> = [
  {
    key: "instagram",
    label: "인스타그램 (Instagram)",
    placeholder: "https://instagram.com/yourbrand",
  },
  {
    key: "website",
    label: "웹사이트 (Website)",
    placeholder: "https://",
  },
  {
    key: "facebook",
    label: "페이스북 (Facebook)",
    placeholder: "https://facebook.com/",
  },
  {
    key: "youtube",
    label: "유튜브 (YouTube)",
    placeholder: "https://youtube.com/",
  },
  {
    key: "linkedin",
    label: "링크드인 (LinkedIn)",
    placeholder: "https://linkedin.com/company/",
  },
  {
    key: "tiktok",
    label: "틱톡 (TikTok)",
    placeholder: "https://tiktok.com/@",
  },
  {
    key: "other",
    label: "기타 SNS (Other)",
    placeholder: "https://",
  },
];

export function SocialLinksFields({
  value,
  onChange,
  hint,
}: {
  value: SocialLinks;
  onChange: (next: SocialLinks) => void;
  hint?: string;
}) {
  const current = { ...emptySocial(), ...value };

  return (
    <fieldset className="space-y-3 border border-[var(--line)] bg-white p-4">
      <legend className="px-1 text-sm font-medium">SNS · 채널 (Social links)</legend>
      <p className="text-xs text-[var(--muted)]">
        {hint ??
          "SME가 운영 중인 인스타그램·웹사이트 등을 넣으면 바이어가 브랜드 분위기를 확인할 수 있습니다."}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="block space-y-1 text-sm">
            <span>{field.label}</span>
            <input
              type="url"
              value={current[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) =>
                onChange({ ...current, [field.key]: event.target.value })
              }
              className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
