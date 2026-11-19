"use client";

import type { LocalizedString } from "@/data/types";
import { emptyLocalized } from "@/lib/localized";

export { emptyLocalized };

const locales: Array<{
  code: keyof LocalizedString;
  label: string;
  required?: boolean;
}> = [
  { code: "en", label: "영어 EN", required: true },
  { code: "am", label: "암하릭 AM" },
  { code: "ko", label: "한국어 KO" },
  { code: "ja", label: "일본어 JA" },
  { code: "zh", label: "중국어 ZH" },
];

export function LocalizedFields({
  labelKo,
  labelEn,
  value,
  onChange,
  multiline = false,
}: {
  labelKo: string;
  labelEn: string;
  value: LocalizedString;
  onChange: (next: LocalizedString) => void;
  multiline?: boolean;
}) {
  return (
    <fieldset className="space-y-3 border border-[var(--line)] bg-white p-4">
      <legend className="px-1 text-sm font-medium">
        {labelKo} ({labelEn})
      </legend>
      <p className="text-xs text-[var(--muted)]">
        영어(EN) 필수. 비워둔 언어는 저장 시 영어 값으로 채워집니다.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {locales.map((locale) => (
          <label key={locale.code} className="block space-y-1 text-sm">
            <span>
              {locale.label}
              {locale.required ? " *" : ""}
            </span>
            {multiline ? (
              <textarea
                rows={3}
                required={locale.required}
                value={value[locale.code] ?? ""}
                onChange={(event) =>
                  onChange({ ...value, [locale.code]: event.target.value })
                }
                className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--leather)]"
              />
            ) : (
              <input
                required={locale.required}
                value={value[locale.code] ?? ""}
                onChange={(event) =>
                  onChange({ ...value, [locale.code]: event.target.value })
                }
                className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--leather)]"
              />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
