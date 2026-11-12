import { NewsForm } from "@/components/admin/NewsForm";

export default function AdminNewNewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          뉴스 등록 (New news)
        </h2>
        <p className="text-sm text-[var(--muted)]">
          영어(EN) 제목·요약·본문은 필수입니다.
        </p>
      </div>
      <NewsForm mode="create" />
    </div>
  );
}
