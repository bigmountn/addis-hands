"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { LocalizedString, NewsPost, NewsStatus } from "@/data/types";
import { ImageUploader } from "./ImageUploader";
import { LocalizedFields, emptyLocalized } from "./LocalizedFields";

type Props = {
  mode: "create" | "edit";
  initial?: NewsPost;
};

export function NewsForm({ mode, initial }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [status, setStatus] = useState<NewsStatus>(
    initial?.status ?? "published",
  );
  const [title, setTitle] = useState<LocalizedString>(
    initial?.title ?? emptyLocalized(),
  );
  const [summary, setSummary] = useState<LocalizedString>(
    initial?.summary ?? emptyLocalized(),
  );
  const [body, setBody] = useState<LocalizedString>(
    initial?.body ?? emptyLocalized(),
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

    const payload = {
      slug: slug.trim().toLowerCase(),
      date: date.trim(),
      status,
      title,
      summary,
      body,
      coverImage,
      gallery,
      sources: initial?.sources,
    };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/news"
          : `/api/admin/news/${encodeURIComponent(initial!.slug)}`,
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
      router.push(`/admin/news/${data.slug ?? payload.slug}`);
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
        `/api/admin/news/${encodeURIComponent(initial.slug)}`,
        { method: "DELETE" },
      );
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error || "삭제 실패");
      }
      router.push("/admin/news");
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
            placeholder="project-update"
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
          <span>상태 (Status)</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as NewsStatus)}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </label>
      </div>

      <LocalizedFields
        labelKo="제목"
        labelEn="Title"
        value={title}
        onChange={setTitle}
      />
      <LocalizedFields
        labelKo="요약"
        labelEn="Summary"
        value={summary}
        onChange={setSummary}
        multiline
      />
      <LocalizedFields
        labelKo="본문"
        labelEn="Body"
        value={body}
        onChange={setBody}
        multiline
      />

      <ImageUploader
        kind="news"
        slug={slug.trim().toLowerCase()}
        coverImage={coverImage}
        gallery={gallery}
        showGallery
        onChange={({ coverImage: nextCover, gallery: nextGallery }) => {
          setCoverImage(nextCover);
          setGallery(nextGallery);
        }}
      />

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
