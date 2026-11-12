import { CompanyForm } from "@/components/admin/CompanyForm";

export default function AdminNewCompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          회사 등록 (New company)
        </h2>
        <p className="text-sm text-[var(--muted)]">
          영어 본문은 필수, 한/일/중은 선택입니다.
        </p>
      </div>
      <CompanyForm mode="create" />
    </div>
  );
}
