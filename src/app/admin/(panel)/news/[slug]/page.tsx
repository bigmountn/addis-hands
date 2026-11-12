import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/NewsForm";
import { getNewsPost } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function AdminEditNewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPost(slug, { includeDrafts: true });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          뉴스 수정 (Edit news)
        </h2>
        <p className="text-sm text-[var(--muted)]">{post.slug}</p>
      </div>
      <NewsForm mode="edit" initial={post} />
    </div>
  );
}
