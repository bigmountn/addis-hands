import Link from "next/link";
import { getNewsPosts } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const posts = await getNewsPosts({ includeDrafts: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            뉴스 (News)
          </h2>
          <p className="text-sm text-[var(--muted)]">{posts.length}개</p>
        </div>
        <Link
          href="/admin/news/new"
          className="bg-[var(--ink)] px-4 py-2 text-sm text-white"
        >
          새 글 (New)
        </Link>
      </div>

      <div className="overflow-x-auto border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--sand)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">제목 (EN)</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">날짜</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-b border-[var(--line)]">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/news/${post.slug}`}
                    className="text-[var(--leather)] underline-offset-2 hover:underline"
                  >
                    {post.title.en}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{post.slug}</td>
                <td className="px-4 py-3">{post.date}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide">
                  {post.status ?? "published"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
