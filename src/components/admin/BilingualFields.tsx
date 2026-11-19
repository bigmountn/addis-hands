"use client";

import { useState } from "react";
import type { BilingualString } from "@/data/types";
import { emptyBilingual } from "@/lib/learn";

export { emptyBilingual };

export function BilingualFields({
  labelKo,
  labelEn,
  value,
  onChange,
  multiline = false,
}: {
  labelKo: string;
  labelEn: string;
  value: BilingualString;
  onChange: (next: BilingualString) => void;
  multiline?: boolean;
}) {
  const [translating, setTranslating] = useState(false);
  const [message, setMessage] = useState("");

  async function translateToAmharic(force = false) {
    const english = value.en?.trim();
    if (!english) {
      setMessage("먼저 영어(EN)를 입력하세요.");
      return;
    }
    if (!force && value.am?.trim()) {
      const ok = confirm("암하릭(AM)이 이미 있습니다. 덮어쓸까요?");
      if (!ok) return;
    }

    setTranslating(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: english, source: "en", target: "am" }),
      });
      const data = (await response.json()) as {
        translated?: string;
        error?: string;
      };
      if (!response.ok || !data.translated) {
        throw new Error(data.error || "번역 실패");
      }
      onChange({ ...value, am: data.translated });
      setMessage("암하릭 자동 번역 완료. 필요하면 수정하세요.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "번역 실패");
    } finally {
      setTranslating(false);
    }
  }

  return (
    <fieldset className="space-y-3 border border-[var(--line)] bg-white p-4">
      <legend className="px-1 text-sm font-medium">
        {labelKo} ({labelEn})
      </legend>
      <p className="text-xs text-[var(--muted)]">
        영어(EN) 필수. 암하릭은 「자동 번역」으로 채운 뒤 다듬으면 됩니다.
      </p>

      <label className="block space-y-1 text-sm">
        <span>영어 EN *</span>
        {multiline ? (
          <textarea
            rows={6}
            required
            value={value.en ?? ""}
            onChange={(event) =>
              onChange({ ...value, en: event.target.value })
            }
            className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        ) : (
          <input
            required
            value={value.en ?? ""}
            onChange={(event) =>
              onChange({ ...value, en: event.target.value })
            }
            className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        )}
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={translating || !value.en?.trim()}
          onClick={() => translateToAmharic(false)}
          className="border border-[var(--line)] px-3 py-1.5 text-xs disabled:opacity-50"
        >
          {translating ? "번역 중…" : "EN → AM 자동 번역"}
        </button>
        {message ? (
          <p className="text-xs text-[var(--muted)]">{message}</p>
        ) : null}
      </div>

      <label className="block space-y-1 text-sm">
        <span>암하릭 AM</span>
        {multiline ? (
          <textarea
            rows={6}
            value={value.am ?? ""}
            onChange={(event) =>
              onChange({ ...value, am: event.target.value })
            }
            className="w-full border border-[var(--line)] px-3 py-2 font-[family-name:var(--font-ethiopic)] outline-none focus:border-[var(--leather)]"
          />
        ) : (
          <input
            value={value.am ?? ""}
            onChange={(event) =>
              onChange({ ...value, am: event.target.value })
            }
            className="w-full border border-[var(--line)] px-3 py-2 font-[family-name:var(--font-ethiopic)] outline-none focus:border-[var(--leather)]"
          />
        )}
      </label>
    </fieldset>
  );
}
