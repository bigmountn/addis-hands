"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Company, LocalizedString, SocialLinks } from "@/data/types";
import { ImageUploader } from "./ImageUploader";
import { LocalizedFields, emptyLocalized } from "./LocalizedFields";
import { SocialLinksFields } from "./SocialLinksFields";
import { emptySocial } from "@/lib/product-fields";

type Props = {
  mode: "create" | "edit";
  initial?: Company;
};

export function CompanyForm({ mode, initial }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [country, setCountry] = useState(initial?.country ?? "Ethiopia");
  const [category, setCategory] = useState<LocalizedString>(
    initial?.category ?? emptyLocalized(),
  );
  const [summary, setSummary] = useState<LocalizedString>(
    initial?.summary ?? emptyLocalized(),
  );
  const [strengthsText, setStrengthsText] = useState(
    (initial?.strengths ?? []).map((item) => item.en).join("\n"),
  );
  const [verified, setVerified] = useState(Boolean(initial?.verified));
  const [exportReady, setExportReady] = useState(Boolean(initial?.exportReady));
  const [foundedYear, setFoundedYear] = useState(
    initial?.foundedYear?.toString() ?? "",
  );
  const [employees, setEmployees] = useState(initial?.employees ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage);
  const [logoImage, setLogoImage] = useState(initial?.logoImage);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [social, setSocial] = useState<SocialLinks>({
    ...emptySocial(),
    ...initial?.social,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const strengths = strengthsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((en) => ({ en, ko: "", ja: "", zh: "" }));

    const payload = {
      slug: slug.trim().toLowerCase(),
      name: name.trim(),
      city: city.trim(),
      country: country.trim(),
      category,
      summary,
      strengths,
      verified,
      exportReady,
      foundedYear: foundedYear ? Number(foundedYear) : null,
      employees,
      coverImage,
      logoImage,
      gallery,
      social,
    };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/companies"
          : `/api/admin/companies/${encodeURIComponent(initial!.slug)}`,
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
      router.push(`/admin/companies/${data.slug ?? payload.slug}`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setStatus((prev) => (prev === "error" ? prev : "idle"));
    }
  }

  async function onDelete() {
    if (!initial || !confirm(`정말 삭제할까요? (${initial.slug})`)) return;
    const response = await fetch(
      `/api/admin/companies/${encodeURIComponent(initial.slug)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setStatus("error");
      setMessage(data.error || "삭제 실패");
      return;
    }
    router.push("/admin/companies");
    router.refresh();
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
            placeholder="my-company"
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)] disabled:bg-[var(--sand)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>회사명 (Company name) *</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>도시 (City) *</span>
          <input
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>국가 (Country)</span>
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>설립연도 (Founded year)</span>
          <input
            type="number"
            value={foundedYear}
            onChange={(event) => setFoundedYear(event.target.value)}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>직원 수 (Employees)</span>
          <input
            value={employees}
            onChange={(event) => setEmployees(event.target.value)}
            placeholder="11-50"
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
      </div>

      <LocalizedFields
        labelKo="카테고리"
        labelEn="Category"
        value={category}
        onChange={setCategory}
      />
      <LocalizedFields
        labelKo="소개"
        labelEn="Summary"
        value={summary}
        onChange={setSummary}
        multiline
      />

      <label className="block space-y-1 text-sm">
        <span>강점 (Strengths, EN one per line)</span>
        <textarea
          rows={4}
          value={strengthsText}
          onChange={(event) => setStrengthsText(event.target.value)}
          className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          placeholder={"Export-ready QC\nCustom sampling"}
        />
      </label>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={verified}
            onChange={(event) => setVerified(event.target.checked)}
          />
          검증됨 (Verified)
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={exportReady}
            onChange={(event) => setExportReady(event.target.checked)}
          />
          수출 준비 (Export ready)
        </label>
      </div>

      <SocialLinksFields
        value={social}
        onChange={setSocial}
        hint="SME 인스타그램·웹사이트가 있으면 회사 프로필에 노출됩니다."
      />

      <ImageUploader
        kind="company"
        slug={slug.trim().toLowerCase()}
        coverImage={coverImage}
        logoImage={logoImage}
        gallery={gallery}
        showLogo
        onChange={({
          coverImage: nextCover,
          logoImage: nextLogo,
          gallery: nextGallery,
        }) => {
          setCoverImage(nextCover);
          setLogoImage(nextLogo);
          setGallery(nextGallery);
        }}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-[var(--ink)] px-5 py-2.5 text-sm text-white disabled:opacity-60"
        >
          {status === "saving" ? "저장 중…" : "저장 (Save)"}
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
