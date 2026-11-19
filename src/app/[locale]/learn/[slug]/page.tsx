import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { LearnBodyPair, LearnFieldPair } from "@/components/LearnBilingual";
import { MediaFrame } from "@/components/MediaFrame";
import { getLearnPost, getLearnPosts, tLearn } from "@/lib/learn";
import { isLearnLocale, type LearnLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function formatDate(date: string, locale: LearnLocale) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export async function generateStaticParams() {
  const posts = await getLearnPosts({ includeDrafts: true });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function LearnDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = isLearnLocale(localeParam) ? localeParam : "en";
  setRequestLocale(locale);

  const post = await getLearnPost(slug);
  if (!post) notFound();

  const tEn = await getTranslations({ locale: "en", namespace: "Learn" });
  const tAm = await getTranslations({ locale: "am", namespace: "Learn" });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/learn"
        className="text-sm font-medium text-[var(--clay)] underline-offset-4 hover:underline"
      >
        ← {tEn("back")} / {tAm("back")}
      </Link>

      <header className="mt-8 space-y-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {post.episode != null ? (
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--clay)]">
              {tEn("episode", { number: post.episode })} ·{" "}
              {tAm("episode", { number: post.episode })}
            </span>
          ) : null}
          <time
            dateTime={post.date}
            className="text-xs uppercase tracking-[0.16em] text-[var(--olive)]"
          >
            {formatDate(post.date, "en")}
          </time>
        </div>
        <LearnFieldPair
          value={post.title}
          as="h1"
          enClassName="font-[family-name:var(--font-display)] text-4xl font-light tracking-[-0.03em] text-[var(--ink)] md:text-5xl"
          amClassName="font-[family-name:var(--font-display)] text-3xl font-light tracking-[-0.03em] text-[var(--ink-soft)] md:text-4xl"
        />
        <LearnFieldPair
          value={post.summary}
          enClassName="text-lg leading-relaxed text-[var(--ink-soft)]"
          amClassName="text-lg leading-relaxed text-[var(--ink-soft)]"
        />
      </header>

      {post.coverImage ? (
        <div className="mt-8">
          <MediaFrame
            src={post.coverImage}
            alt={tLearn(post.title, "en")}
            aspectClassName="aspect-[16/9]"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="mt-10">
        <LearnBodyPair value={post.body} />
      </div>

      {post.resourceUrl ? (
        <aside className="mt-12 space-y-2 border-t border-[var(--line)] pt-6">
          <a
            href={post.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold text-[var(--clay)] underline-offset-4 hover:underline"
          >
            {post.resourceLabel
              ? tLearn(post.resourceLabel, "en")
              : tEn("openResource")}{" "}
            →
          </a>
          {post.resourceLabel?.am || !post.resourceLabel ? (
            <a
              href={post.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              lang="am"
              className="block font-[family-name:var(--font-ethiopic)] text-sm font-semibold text-[var(--clay)] underline-offset-4 hover:underline"
            >
              {post.resourceLabel
                ? tLearn(post.resourceLabel, "am")
                : tAm("openResource")}{" "}
              →
            </a>
          ) : null}
        </aside>
      ) : null}
    </article>
  );
}
