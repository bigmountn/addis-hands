"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Company,
  LocalizedString,
  Product,
  ProductStatus,
  SocialLinks,
} from "@/data/types";
import { ImageUploader } from "./ImageUploader";
import { LocalizedFields, emptyLocalized } from "./LocalizedFields";
import { SocialLinksFields } from "./SocialLinksFields";
import { emptySocial } from "@/lib/product-fields";

const statusLabel: Record<ProductStatus, string> = {
  draft: "임시저장 (Draft)",
  published: "공개 (Published)",
  hidden: "비노출 (Hidden)",
};

type Props = {
  mode: "create" | "edit";
  companies: Company[];
  initial?: Product;
};

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border border-[var(--line)] bg-[var(--panel)] p-5">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          {title}
        </h3>
        {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ProductForm({ mode, companies, initial }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [companySlug, setCompanySlug] = useState(
    initial?.companySlug ?? companies[0]?.slug ?? "",
  );
  const [status, setStatus] = useState<ProductStatus>(
    initial?.status ?? "draft",
  );
  const [modelNumber, setModelNumber] = useState(initial?.modelNumber ?? "");
  const [name, setName] = useState<LocalizedString>(
    initial?.name ?? emptyLocalized(),
  );
  const [category, setCategory] = useState<LocalizedString>(
    initial?.category ?? emptyLocalized(),
  );
  const [categoryPath, setCategoryPath] = useState(
    (initial?.categoryPath ?? []).join(" > "),
  );
  const [keywords, setKeywords] = useState(
    (initial?.keywords ?? []).join(", "),
  );
  const [summary, setSummary] = useState<LocalizedString>(
    initial?.summary ?? emptyLocalized(),
  );
  const [description, setDescription] = useState<LocalizedString>(
    initial?.description ?? emptyLocalized(),
  );
  const [featuresText, setFeaturesText] = useState(
    (initial?.features ?? []).map((item) => item.en).join("\n"),
  );
  const [applications, setApplications] = useState<LocalizedString>(
    initial?.applications ?? emptyLocalized(),
  );
  const [specifications, setSpecifications] = useState<LocalizedString>(
    initial?.specifications ?? emptyLocalized(),
  );
  const [packaging, setPackaging] = useState<LocalizedString>(
    initial?.packaging ?? emptyLocalized(),
  );
  const [material, setMaterial] = useState<LocalizedString>(
    initial?.material ?? emptyLocalized(),
  );
  const [origin, setOrigin] = useState<LocalizedString>(
    initial?.origin ?? {
      en: "Made in Ethiopia",
      am: "",
      ko: "",
      ja: "",
      zh: "",
    },
  );
  const [colors, setColors] = useState(initial?.colors ?? "");
  const [sizes, setSizes] = useState(initial?.sizes ?? "");
  const [unit, setUnit] = useState(initial?.unit ?? "pcs");
  const [moq, setMoq] = useState(initial?.moq ?? "");
  const [leadTime, setLeadTime] = useState(initial?.leadTime ?? "");
  const [priceRange, setPriceRange] = useState(initial?.priceRange ?? "");
  const [hsCode, setHsCode] = useState(initial?.hsCode ?? "");
  const [paymentTerms, setPaymentTerms] = useState(initial?.paymentTerms ?? "");
  const [supplyAbility, setSupplyAbility] = useState(
    initial?.supplyAbility ?? "",
  );
  const [sampleAvailable, setSampleAvailable] = useState(
    Boolean(initial?.sampleAvailable),
  );
  const [sampleLeadTime, setSampleLeadTime] = useState(
    initial?.sampleLeadTime ?? "",
  );
  const [port, setPort] = useState(initial?.port ?? "");
  const [certifications, setCertifications] = useState(
    (initial?.certifications ?? []).join(", "),
  );
  const [seoTitle, setSeoTitle] = useState<LocalizedString>(
    initial?.seoTitle ?? emptyLocalized(),
  );
  const [seoDescription, setSeoDescription] = useState<LocalizedString>(
    initial?.seoDescription ?? emptyLocalized(),
  );
  const [social, setSocial] = useState<SocialLinks>({
    ...emptySocial(),
    ...initial?.social,
  });
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [coverImage, setCoverImage] = useState(initial?.coverImage);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function save(nextStatus: ProductStatus) {
    setSaveState("saving");
    setMessage("");
    setStatus(nextStatus);

    const features = featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((en) => ({ en, am: "", ko: "", ja: "", zh: "" }));

    const payload = {
      slug: slug.trim().toLowerCase(),
      companySlug,
      status: nextStatus,
      modelNumber,
      name,
      category,
      categoryPath: categoryPath
        .split(">")
        .map((part) => part.trim())
        .filter(Boolean),
      keywords: keywords
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      summary,
      description,
      features,
      applications,
      specifications,
      packaging,
      material,
      origin,
      colors,
      sizes,
      unit,
      moq: moq.trim(),
      leadTime: leadTime.trim(),
      priceRange,
      hsCode,
      paymentTerms,
      supplyAbility,
      sampleAvailable,
      sampleLeadTime,
      port,
      certifications: certifications
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      seoTitle,
      seoDescription,
      social,
      featured,
      coverImage,
      gallery,
    };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${encodeURIComponent(initial!.slug)}`,
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
      router.push(`/admin/products/${data.slug ?? payload.slug}`);
      router.refresh();
    } catch (err) {
      setSaveState("error");
      setMessage(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setSaveState((prev) => (prev === "error" ? prev : "idle"));
    }
  }

  async function onDelete() {
    if (!initial || !confirm(`정말 삭제할까요? (${initial.slug})`)) return;
    const response = await fetch(
      `/api/admin/products/${encodeURIComponent(initial.slug)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setSaveState("error");
      setMessage(data.error || "삭제 실패");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      className="space-y-6"
    >
      <Section
        title="1. 기본 정보 (Basic)"
        hint="임시 저장은 비공개 초안, 제출은 공개 사이트에 반영됩니다."
      >
        <p className="text-sm text-[var(--muted)]">
          현재 상태: {statusLabel[status]}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span>슬러그 (Slug) *</span>
            <input
              required
              disabled={mode === "edit"}
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="my-product"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)] disabled:bg-[var(--sand)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>회사 (Company) *</span>
            <select
              required
              value={companySlug}
              onChange={(event) => setCompanySlug(event.target.value)}
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            >
              <option value="">선택</option>
              {companies.map((company) => (
                <option key={company.slug} value={company.slug}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm md:col-span-2">
            <span>모델번호 (Model number)</span>
            <input
              value={modelNumber}
              onChange={(event) => setModelNumber(event.target.value)}
              placeholder="AH-WAL-001"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
        </div>
        <LocalizedFields
          labelKo="제품명"
          labelEn="Product name"
          value={name}
          onChange={setName}
        />
        <p className="text-xs text-[var(--muted)]">
          팁: 제품명에 핵심 키워드를 넣고, 모델번호만으로 대체하지 마세요. (TradeKorea 반려 사유
          참고)
        </p>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
          추천 제품 (Featured on homepage)
        </label>
      </Section>

      <Section
        title="2. 카테고리 · 키워드 (Category & keywords)"
        hint="세분 카테고리 경로와 키워드가 많을수록 검색·AI 인용에 유리합니다. 예: Leather Goods > Wallets > Card wallets"
      >
        <LocalizedFields
          labelKo="카테고리"
          labelEn="Category"
          value={category}
          onChange={setCategory}
        />
        <label className="block space-y-1 text-sm">
          <span>카테고리 경로 (Category path)</span>
          <input
            value={categoryPath}
            onChange={(event) => setCategoryPath(event.target.value)}
            placeholder="Leather Goods > Wallets > Card wallets"
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>검색 키워드 (Keywords)</span>
          <textarea
            rows={3}
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            placeholder="Ethiopian leather wallet, handmade card holder, cowhide B2B"
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
          <span className="text-xs text-[var(--muted)]">
            쉼표 또는 줄바꿈으로 구분. 세분 키워드를 충분히 넣으세요.
          </span>
        </label>
      </Section>

      <Section
        title="3. 이미지 (Images)"
        hint="상세설명보다 먼저 등록하세요. 이메일·연락처·한글 워터마크를 이미지에 넣지 마세요."
      >
        <ImageUploader
          kind="product"
          slug={slug.trim().toLowerCase()}
          coverImage={coverImage}
          gallery={gallery}
          onChange={({
            coverImage: nextCover,
            gallery: nextGallery,
          }) => {
            setCoverImage(nextCover);
            setGallery(nextGallery);
          }}
        />
      </Section>

      <Section
        title="4. SEO · GEO 제품설명 (Structured description)"
        hint="짧은 요약(카드/메타) + 본문 5줄 이상 + 특징·용도·스펙 섹션으로 나눠 AI Overview·검색 엔진이 인용하기 쉽게 작성하세요. 설명에 이메일·메신저를 넣지 마세요."
      >
        <LocalizedFields
          labelKo="짧은 소개"
          labelEn="Summary / lead"
          value={summary}
          onChange={setSummary}
          multiline
        />
        <LocalizedFields
          labelKo="상세 설명"
          labelEn="Full description"
          value={description}
          onChange={setDescription}
          multiline
        />
        <label className="block space-y-1 text-sm">
          <span>핵심 특징 (Features, EN one per line)</span>
          <textarea
            rows={4}
            value={featuresText}
            onChange={(event) => setFeaturesText(event.target.value)}
            placeholder={"Natural grain cowhide\nHand-finished edges\nCustom logo available"}
            className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
          />
        </label>
        <LocalizedFields
          labelKo="용도 · 타깃 바이어"
          labelEn="Applications / buyers"
          value={applications}
          onChange={setApplications}
          multiline
        />
        <LocalizedFields
          labelKo="사양 설명"
          labelEn="Specifications"
          value={specifications}
          onChange={setSpecifications}
          multiline
        />
        <LocalizedFields
          labelKo="포장"
          labelEn="Packaging"
          value={packaging}
          onChange={setPackaging}
          multiline
        />
        <LocalizedFields
          labelKo="SEO 타이틀"
          labelEn="SEO title"
          value={seoTitle}
          onChange={setSeoTitle}
        />
        <LocalizedFields
          labelKo="SEO 메타 설명"
          labelEn="SEO meta description"
          value={seoDescription}
          onChange={setSeoDescription}
          multiline
        />
      </Section>

      <Section
        title="5. 사양 · 무역조건 (Specs & trade terms)"
        hint="MOQ·납기·샘플·결제조건은 바이어 문의 전환에 직접 영향을 줍니다."
      >
        <LocalizedFields
          labelKo="소재"
          labelEn="Material"
          value={material}
          onChange={setMaterial}
        />
        <LocalizedFields
          labelKo="원산지"
          labelEn="Origin"
          value={origin}
          onChange={setOrigin}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span>색상 (Colors)</span>
            <input
              value={colors}
              onChange={(event) => setColors(event.target.value)}
              placeholder="Natural, Burgundy, Black"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>사이즈 (Sizes)</span>
            <input
              value={sizes}
              onChange={(event) => setSizes(event.target.value)}
              placeholder="10 × 7 cm"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>단위 (Unit)</span>
            <input
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="pcs"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>MOQ *</span>
            <input
              required
              value={moq}
              onChange={(event) => setMoq(event.target.value)}
              placeholder="50 pcs"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>리드타임 (Lead time) *</span>
            <input
              required
              value={leadTime}
              onChange={(event) => setLeadTime(event.target.value)}
              placeholder="4-6 weeks"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>가격대 (Price range)</span>
            <input
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              placeholder="FOB quote on request"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>HS 코드 (HS code)</span>
            <input
              value={hsCode}
              onChange={(event) => setHsCode(event.target.value)}
              placeholder="4202.31"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>결제조건 (Payment terms)</span>
            <input
              value={paymentTerms}
              onChange={(event) => setPaymentTerms(event.target.value)}
              placeholder="T/T, L/C"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>공급능력 (Supply ability)</span>
            <input
              value={supplyAbility}
              onChange={(event) => setSupplyAbility(event.target.value)}
              placeholder="2,000 pcs / month"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>선적항 (Port)</span>
            <input
              value={port}
              onChange={(event) => setPort(event.target.value)}
              placeholder="Djibouti / Addis Ababa air"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>샘플 납기 (Sample lead time)</span>
            <input
              value={sampleLeadTime}
              onChange={(event) => setSampleLeadTime(event.target.value)}
              placeholder="7-10 days"
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
          <label className="block space-y-1 text-sm md:col-span-2">
            <span>인증 (Certifications)</span>
            <input
              value={certifications}
              onChange={(event) => setCertifications(event.target.value)}
              placeholder="ISO, OEKO-TEX, ..."
              className="w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--leather)]"
            />
          </label>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sampleAvailable}
            onChange={(event) => setSampleAvailable(event.target.checked)}
          />
          샘플 가능 (Sample available)
        </label>
      </Section>

      <Section
        title="6. SNS (Social)"
        hint="제품/브랜드 인스타그램이 있으면 넣으세요. 회사 공통 SNS는 회사 편집에서도 등록할 수 있습니다."
      >
        <SocialLinksFields value={social} onChange={setSocial} />
      </Section>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-5">
        <button
          type="button"
          disabled={saveState === "saving"}
          onClick={() => void save("draft")}
          className="border border-[var(--ink)] px-5 py-2.5 text-sm disabled:opacity-60"
        >
          {saveState === "saving" ? "저장 중…" : "임시 저장 (Draft)"}
        </button>
        <button
          type="button"
          disabled={saveState === "saving"}
          onClick={() => void save("published")}
          className="bg-[var(--ink)] px-5 py-2.5 text-sm text-white disabled:opacity-60"
        >
          {saveState === "saving" ? "제출 중…" : "제출 (Publish)"}
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
      <p className="text-xs text-[var(--muted)]">
        임시 저장: 공개 사이트에 안 보임 · 제출: 바로 공개 반영
      </p>
      {message ? <p className="text-sm text-red-700">{message}</p> : null}
    </form>
  );
}
