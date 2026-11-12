import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { MediaFrame } from "@/components/MediaFrame";
import { getNewsPost, getNewsPosts } from "@/lib/news";
import { tLocal } from "@/lib/locale";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function formatDate(date: string, locale: AppLocale) {
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
  const posts = await getNewsPosts({ includeDrafts: true });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const post = await getNewsPost(slug);
  if (!post) notFound();

  const t = await getTranslations("News");
  const paragraphs = tLocal(post.body, locale)
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const gallery = post.gallery ?? [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/news"
        className="text-sm font-medium text-[var(--clay)] underline-offset-4 hover:underline"
      >
        ← {t("back")}
      </Link>

      <header className="mt-8 space-y-4">
        <time
          dateTime={post.date}
          className="text-xs uppercase tracking-[0.16em] text-[var(--olive)]"
        >
          {formatDate(post.date, locale)}
        </time>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-light tracking-[-0.03em] text-[var(--ink)] md:text-5xl">
          {tLocal(post.title, locale)}
        </h1>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)]">
          {tLocal(post.summary, locale)}
        </p>
      </header>

      {post.coverImage ? (
        <div className="mt-8">
          <MediaFrame
            src={post.coverImage}
            alt={tLocal(post.title, locale)}
            aspectClassName="aspect-[16/9]"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="mt-10 space-y-8">
        {paragraphs.map((paragraph, index) => (
          <div key={`${index}-${paragraph.slice(0, 24)}`} className="space-y-8">
            <p className="text-base leading-relaxed text-[var(--ink)]/85 md:text-lg whitespace-pre-line">
              {paragraph}
            </p>
            {gallery[index] ? (
              <MediaFrame
                src={gallery[index]}
                alt={`${tLocal(post.title, locale)} — ${index + 1}`}
                aspectClassName="aspect-[4/3]"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : null}
          </div>
        ))}

        {gallery.length > paragraphs.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.slice(paragraphs.length).map((src, index) => (
              <MediaFrame
                key={src}
                src={src}
                alt={`${tLocal(post.title, locale)} — extra ${index + 1}`}
                aspectClassName="aspect-[4/3]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ))}
          </div>
        ) : null}
      </div>

      {post.sources && post.sources.length > 0 ? (
        <aside className="mt-12 border-t border-[var(--line)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--olive)]">
            {t("sources")}
          </p>
          <ul className="space-y-2 text-sm">
            {post.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--clay)] underline-offset-4 hover:underline"
                >
                  {source.label} →
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}
