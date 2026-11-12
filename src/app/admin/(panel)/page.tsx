import Link from "next/link";
import { getCompanies, getProducts } from "@/lib/catalog";
import { getNewsPosts } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [companies, products, news] = await Promise.all([
    getCompanies(),
    getProducts(),
    getNewsPosts({ includeDrafts: true }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          대시보드 (Dashboard)
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          회사·제품·뉴스 데이터를 JSON 파일로 관리합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-[var(--line)] bg-white p-6">
          <p className="text-sm text-[var(--muted)]">회사 (Companies)</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
            {companies.length}
          </p>
          <Link
            href="/admin/companies"
            className="mt-4 inline-block text-sm text-[var(--leather)]"
          >
            목록 보기 →
          </Link>
        </div>
        <div className="border border-[var(--line)] bg-white p-6">
          <p className="text-sm text-[var(--muted)]">제품 (Products)</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
            {products.length}
          </p>
          <Link
            href="/admin/products"
            className="mt-4 inline-block text-sm text-[var(--leather)]"
          >
            목록 보기 →
          </Link>
        </div>
        <div className="border border-[var(--line)] bg-white p-6">
          <p className="text-sm text-[var(--muted)]">뉴스 (News)</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
            {news.length}
          </p>
          <Link
            href="/admin/news"
            className="mt-4 inline-block text-sm text-[var(--leather)]"
          >
            목록 보기 →
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/companies/new"
          className="bg-[var(--ink)] px-4 py-2.5 text-sm text-white"
        >
          회사 등록 (New company)
        </Link>
        <Link
          href="/admin/products/new"
          className="border border-[var(--ink)] px-4 py-2.5 text-sm"
        >
          제품 등록 (New product)
        </Link>
        <Link
          href="/admin/news/new"
          className="border border-[var(--ink)] px-4 py-2.5 text-sm"
        >
          뉴스 등록 (New news)
        </Link>
        <Link
          href="/en"
          className="border border-[var(--line)] px-4 py-2.5 text-sm text-[var(--muted)]"
        >
          공개 사이트 보기
        </Link>
      </div>
    </div>
  );
}
