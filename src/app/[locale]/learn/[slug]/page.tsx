import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
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

  const t = await getTranslations("Learn");
  const paragraphs = tLearn(post.body, locale)
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/learn"
        className="text-sm font-medium text-[var(--clay)] underline-offset-4 hover:underline"
      >
        ← {t("back")}
      </Link>

      <header className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {post.episode != null ? (
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--clay)]">
              {t("episode", { number: post.episode })}
            </span>
          ) : null}
          <time
            dateTime={post.date}
            className="text-xs uppercase tracking-[0.16em] text-[var(--olive)]"
          >
            {formatDate(post.date, locale)}
          </time>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-light tracking-[-0.03em] text-[var(--ink)] md:text-5xl">
          {tLearn(post.title, locale)}
        </h1>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)]">
          {tLearn(post.summary, locale)}
        </p>
      </header>

      {post.coverImage ? (
        <div className="mt-8">
          <MediaFrame
            src={post.coverImage}
            alt={tLearn(post.title, locale)}
            aspectClassName="aspect-[16/9]"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="mt-10 space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 24)}`}
            className="text-base leading-relaxed text-[var(--ink)]/85 md:text-lg whitespace-pre-line"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {post.resourceUrl ? (
        <aside className="mt-12 border-t border-[var(--line)] pt-6">
          <a
            href={post.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[var(--clay)] underline-offset-4 hover:underline"
          >
            {post.resourceLabel
              ? tLearn(post.resourceLabel, locale)
              : t("openResource")}{" "}
            →
          </a>
        </aside>
      ) : null}
    </article>
  );
}
