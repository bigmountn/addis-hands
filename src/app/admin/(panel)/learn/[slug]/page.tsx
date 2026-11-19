import { notFound } from "next/navigation";
import { LearnForm } from "@/components/admin/LearnForm";
import { getLearnPost } from "@/lib/learn";

export const dynamic = "force-dynamic";

export default async function AdminEditLearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getLearnPost(slug, { includeDrafts: true });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Learn 수정 (Edit lesson)
        </h2>
        <p className="text-sm text-[var(--muted)]">{post.slug}</p>
      </div>
      <LearnForm mode="edit" initial={post} />
    </div>
  );
}
