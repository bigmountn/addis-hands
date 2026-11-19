"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { BilingualString, LearnPost, LearnStatus } from "@/data/types";
import { ImageUploader } from "./ImageUploader";
import { BilingualFields, emptyBilingual } from "./BilingualFields";

type Props = {
  mode: "create" | "edit";
  initial?: LearnPost;
};

async function ensureAmharic(
  value: BilingualString,
): Promise<BilingualString> {
  const en = value.en?.trim() ?? "";
  if (!en) return value;
  if (value.am?.trim()) return { en, am: value.am.trim() };

  const response = await fetch("/api/admin/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: en, source: "en", target: "am" }),
  });
  const data = (await response.json()) as {
    translated?: string;
    error?: string;
  };
  if (!response.ok || !data.translated) {
    throw new Error(
      data.error ||
        "암하릭 자동 번역에 실패했습니다. AM을 직접 입력하거나 다시 저장해 주세요.",
    );
  }
  return { en, am: data.translated };
}

export function LearnForm({ mode, initial }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [episode, setEpisode] = useState(
    initial?.episode != null ? String(initial.episode) : "",
  );
  const [status, setStatus] = useState<LearnStatus>(
    initial?.status ?? "published",
  );
  const [title, setTitle] = useState<BilingualString>(
    initial?.title ?? emptyBilingual(),
  );
  const [summary, setSummary] = useState<BilingualString>(
    initial?.summary ?? emptyBilingual(),
  );
  const [body, setBody] = useState<BilingualString>(
    initial?.body ?? emptyBilingual(),
  );
  const [resourceUrl, setResourceUrl] = useState(initial?.resourceUrl ?? "");
  const [resourceLabel, setResourceLabel] = useState<BilingualString>(
    initial?.resourceLabel ?? emptyBilingual(),
  );
  const [coverImage, setCoverImage] = useState(initial?.coverImage);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormStatus("saving");
    setMessage("");

    try {
      const [nextTitle, nextSummary, nextBody] = await Promise.all([
        ensureAmharic(title),
        ensureAmharic(summary),
        ensureAmharic(body),
      ]);
      setTitle(nextTitle);
      setSummary(nextSummary);
      setBody(nextBody);

      let nextResourceLabel: BilingualString | undefined;
      if (resourceUrl.trim()) {
        if (resourceLabel.en.trim()) {
          nextResourceLabel = await ensureAmharic(resourceLabel);
          setResourceLabel(nextResourceLabel);
        } else {
          nextResourceLabel = undefined;
        }
      }

      const payload = {
        slug: slug.trim().toLowerCase(),
        date: date.trim(),
        status,
        episode: episode.trim() ? Number(episode) : undefined,
        title: nextTitle,
        summary: nextSummary,
        body: nextBody,
        coverImage,
        gallery,
        resourceUrl: resourceUrl.trim() || undefined,
        resourceLabel: nextResourceLabel,
      };

      const response = await fetch(
        mode === "create"
          ? "/api/admin/learn"
          : `/api/admin/learn/${encodeURIComponent(initial!.slug)}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string; slug?: string };
      if (!response.ok) {
        throw new Error(data.error || "저장 실패");
      }
      router.push(`/admin/learn/${data.slug ?? payload.slug}`);
      router.refresh();
    } catch (err) {
      setFormStatus("error");
      setMessage(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setFormStatus((prev) => (prev === "error" ? prev : "idle"));
    }
  }

  async function onDelete() {
    if (!initial || !confirm(`정말 삭제할까요? (${initial.slug})`)) return;
    setFormStatus("saving");
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/learn/${encodeURIComponent(initial.slug)}`,
        { method: "DELETE" },
      );
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error || "삭제 실패");
      }
      router.push("/admin/learn");
      router.refresh();
    } catch (err) {
      setFormStatus("error");
      setMessage(err instanceof Error ? err.message : "삭제 실패");
    } finally {
      setFormStatus((prev) => (prev === "error" ? prev : "idle"));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>슬러그 (Slug) *</span>
          <input
            required
            disabled={mode === "edit"}
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="ai-for-everyone"
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)] disabled:bg-[var(--sand)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>날짜 (Date) *</span>
          <input
            required
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>회차 (Episode)</span>
          <input
            type="number"
            min={1}
            value={episode}
            onChange={(event) => setEpisode(event.target.value)}
            placeholder="1"
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>상태 (Status)</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LearnStatus)}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </label>
      </div>

      <BilingualFields
        labelKo="제목"
        labelEn="Title"
        value={title}
        onChange={setTitle}
      />
      <BilingualFields
        labelKo="요약"
        labelEn="Summary"
        value={summary}
        onChange={setSummary}
        multiline
      />
      <BilingualFields
        labelKo="본문"
        labelEn="Body"
        value={body}
        onChange={setBody}
        multiline
      />

      <fieldset className="space-y-3 border border-[var(--line)] bg-white p-4">
        <legend className="px-1 text-sm font-medium">
          무료 리소스 링크 (Resource)
        </legend>
        <label className="block space-y-1 text-sm">
          <span>URL</span>
          <input
            type="url"
            value={resourceUrl}
            onChange={(event) => setResourceUrl(event.target.value)}
            placeholder="https://www.elementsofai.com/"
            className="w-full border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <BilingualFields
          labelKo="링크 라벨"
          labelEn="Resource label"
          value={resourceLabel}
          onChange={setResourceLabel}
        />
      </fieldset>

      <ImageUploader
        kind="learn"
        slug={slug.trim().toLowerCase()}
        coverImage={coverImage}
        gallery={gallery}
        showGallery
        onChange={({ coverImage: nextCover, gallery: nextGallery }) => {
          setCoverImage(nextCover);
          setGallery(nextGallery);
        }}
      />

      <p className="text-xs text-[var(--muted)]">
        저장 시 암하릭이 비어 있으면 영어에서 자동 번역합니다. 번역 품질은
        반드시 한 번 확인해 주세요.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={formStatus === "saving"}
          className="bg-[var(--ink)] px-5 py-2.5 text-sm text-white disabled:opacity-60"
        >
          {formStatus === "saving" ? "저장 중…" : "저장 (Save)"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={onDelete}
            className="border border-red-300 px-5 py-2.5 text-sm text-red-700"
          >
            삭제 (Delete)
          </button>
        ) : null}
      </div>
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
    </form>
  );
}
