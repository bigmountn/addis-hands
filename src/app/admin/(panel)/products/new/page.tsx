import { ProductForm } from "@/components/admin/ProductForm";
import { getCompanies } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          제품 등록 (New product)
        </h2>
        <p className="text-sm text-[var(--muted)]">
          영어 본문은 필수, 한/일/중은 선택입니다.
        </p>
      </div>
      <ProductForm mode="create" companies={companies} />
    </div>
  );
}
