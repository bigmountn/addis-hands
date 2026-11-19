import { LearnForm } from "@/components/admin/LearnForm";

export default function AdminNewLearnPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Learn 등록 (New lesson)
        </h2>
        <p className="text-sm text-[var(--muted)]">
          영어(EN)로 작성하세요. 암하릭(AM)은 자동 번역 버튼 또는 저장 시
          채워집니다.
        </p>
      </div>
      <LearnForm mode="create" />
    </div>
  );
}
