"use client";

import { useState } from "react";

type Props = {
  kind: "company" | "product" | "news" | "learn";
  slug: string;
  coverImage?: string;
  logoImage?: string;
  gallery?: string[];
  showLogo?: boolean;
  showGallery?: boolean;
  onChange: (next: {
    coverImage?: string;
    logoImage?: string;
    gallery: string[];
  }) => void;
};

export function ImageUploader({
  kind,
  slug,
  coverImage,
  logoImage,
  gallery = [],
  showLogo = false,
  showGallery = true,
  onChange,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File, role: string) {
    if (!slug) {
      setError("먼저 slug를 입력하세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("kind", kind);
      form.set("slug", slug);
      form.set("role", role);
      form.set("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "업로드 실패");
      }
      if (role === "cover") {
        onChange({ coverImage: data.url, logoImage, gallery });
      } else if (role === "logo") {
        onChange({ coverImage, logoImage: data.url, gallery });
      } else {
        onChange({ coverImage, logoImage, gallery: [...gallery, data.url] });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setBusy(false);
    }
  }

  return (
    <fieldset className="space-y-4 border border-[var(--line)] bg-white p-4">
      <legend className="px-1 text-sm font-medium">이미지 (Images)</legend>
      {!slug ? (
        <p className="text-sm text-[var(--muted)]">
          이미지 업로드 전에 slug를 입력하세요.
        </p>
      ) : null}

      {showLogo ? (
        <label className="block space-y-2 text-sm">
          <span>회사 로고 (Company logo)</span>
          <p className="text-xs text-[var(--muted)]">
            없으면 공개 페이지에 Addis Hands 기본 로고가 표시됩니다.
          </p>
          <input
            type="file"
            accept="image/*"
            disabled={busy || !slug}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file, "logo");
              event.target.value = "";
            }}
          />
          {logoImage ? (
            <div className="mt-2 space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoImage}
                alt="Logo preview"
                className="h-24 w-24 border border-[var(--line)] object-contain bg-[var(--soft)] p-2"
              />
              <button
                type="button"
                className="text-xs text-red-700"
                onClick={() =>
                  onChange({ coverImage, logoImage: undefined, gallery })
                }
              >
                로고 제거 (Remove logo)
              </button>
            </div>
          ) : null}
        </label>
      ) : null}

      <label className="block space-y-2 text-sm">
        <span>커버 이미지 (Cover image)</span>
        <input
          type="file"
          accept="image/*"
          disabled={busy || !slug}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file, "cover");
            event.target.value = "";
          }}
        />
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt="Cover preview"
            className="mt-2 h-40 w-full max-w-sm object-cover border border-[var(--line)]"
          />
        ) : null}
      </label>

      {showGallery ? (
        <>
          <label className="block space-y-2 text-sm">
            <span>갤러리 추가 (Add gallery image)</span>
            <input
              type="file"
              accept="image/*"
              disabled={busy || !slug}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file, `gallery-${gallery.length + 1}`);
                event.target.value = "";
              }}
            />
          </label>

          {gallery.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {gallery.map((src) => (
                <div key={src} className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt="Gallery preview"
                    className="aspect-square w-full object-cover border border-[var(--line)]"
                  />
                  <button
                    type="button"
                    className="text-xs text-red-700"
                    onClick={() =>
                      onChange({
                        coverImage,
                        logoImage,
                        gallery: gallery.filter((item) => item !== src),
                      })
                    }
                  >
                    제거 (Remove)
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      {busy ? <p className="text-sm text-[var(--muted)]">업로드 중…</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </fieldset>
  );
}
