import Link from "next/link";
import { getCompanies } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            회사 (Companies)
          </h2>
          <p className="text-sm text-[var(--muted)]">{companies.length}개</p>
        </div>
        <Link
          href="/admin/companies/new"
          className="bg-[var(--ink)] px-4 py-2 text-sm text-white"
        >
          새 회사 (New)
        </Link>
      </div>

      <div className="overflow-x-auto border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--sand)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">회사명</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">도시</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.slug} className="border-b border-[var(--line)]">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/companies/${company.slug}`}
                    className="text-[var(--leather)] underline-offset-2 hover:underline"
                  >
                    {company.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{company.slug}</td>
                <td className="px-4 py-3">
                  {company.city}, {company.country}
                </td>
                <td className="px-4 py-3 text-xs">
                  {company.verified ? "Verified" : "—"}
                  {company.exportReady ? " · Export" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
