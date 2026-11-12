import Link from "next/link";
import { getAllProducts, getCompanies } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, companies] = await Promise.all([
    getAllProducts(),
    getCompanies(),
  ]);
  const companyName = new Map(companies.map((c) => [c.slug, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            제품 (Products)
          </h2>
          <p className="text-sm text-[var(--muted)]">{products.length}개</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[var(--ink)] px-4 py-2 text-sm text-white"
        >
          새 제품 (New)
        </Link>
      </div>

      <div className="overflow-x-auto border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--sand)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">제품명 (EN)</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">회사</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">MOQ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug} className="border-b border-[var(--line)]">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${product.slug}`}
                    className="text-[var(--leather)] underline-offset-2 hover:underline"
                  >
                    {product.name.en}
                    {product.featured ? " ★" : ""}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{product.slug}</td>
                <td className="px-4 py-3">
                  {companyName.get(product.companySlug) ?? product.companySlug}
                </td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide">
                  {product.status ?? "published"}
                </td>
                <td className="px-4 py-3">{product.moq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
