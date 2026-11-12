import { notFound } from "next/navigation";
import { CompanyForm } from "@/components/admin/CompanyForm";
import { getCompany } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminEditCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          회사 수정 (Edit company)
        </h2>
        <p className="text-sm text-[var(--muted)]">{company.slug}</p>
      </div>
      <CompanyForm mode="edit" initial={company} />
    </div>
  );
}
