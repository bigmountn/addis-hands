import Link from "next/link";
import { getLearnPosts } from "@/lib/learn";

export const dynamic = "force-dynamic";

export default async function AdminLearnPage() {
  const posts = await getLearnPosts({ includeDrafts: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            Learn
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {posts.length}개 · 가죽 SME 가이드 · EN 작성 후 AM 자동 번역 · 공개 시 EN+AM 동시 표기
          </p>
        </div>
        <Link
          href="/admin/learn/new"
          className="bg-[var(--ink)] px-4 py-2 text-sm text-white"
        >
          새 글 (New)
        </Link>
      </div>

      <div className="overflow-x-auto border border-[var(--line)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--sand)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">회차</th>
              <th className="px-4 py-3 font-medium">제목 (EN)</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">날짜</th>
              <th className="px-4 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[var(--muted)]"
                >
                  아직 Learn 글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.slug} className="border-b border-[var(--line)]">
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {post.episode ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/learn/${post.slug}`}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
