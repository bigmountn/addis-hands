import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MediaFrame } from "@/components/MediaFrame";
import { NewsViewLabel } from "@/components/NewsViewLabel";
import { getNewsPosts } from "@/lib/news";
import { getNewsViewCounts } from "@/lib/news-views";
import { tLocal } from "@/lib/locale";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function formatDate(date: string, locale: AppLocale) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export default async function NewsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);

  const t = await getTranslations("News");
  const posts = await getNewsPosts();
  const viewCounts = await getNewsViewCounts(posts.map((post) => post.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 max-w-2xl space-y-3">
        <h1 className="ah-section-title text-4xl md:text-5xl">{t("title")}</h1>
        <p className="text-[var(--muted)]">{t("subtitle")}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--muted)]">{t("empty")}</p>
      ) : (
        <div className="space-y-0 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {posts.map((post) => (
            <article key={post.slug} className="py-8">
              <Link
                href={`/news/${post.slug}`}
                className={`group grid gap-6 md:items-start ${
                  post.coverImage
                    ? "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                    : ""
                }`}
              >
                {post.coverImage ? (
                  <MediaFrame
                    src={post.coverImage}
                    alt={tLocal(post.title, locale)}
                    aspectClassName="aspect-[16/10]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : null}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <time
                      dateTime={post.date}
                      className="text-xs uppercase tracking-[0.16em] text-[var(--olive)]"
                    >
                      {formatDate(post.date, locale)}
                    </time>
                    <NewsViewLabel
                      count={viewCounts?.[post.slug]}
                      label={(count) => t("views", { count })}
                      className="text-xs text-[var(--muted)]"
                    />
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-light tracking-[-0.02em] text-[var(--ink)] transition group-hover:text-[var(--clay)] md:text-3xl">
                    {tLocal(post.title, locale)}
                  </h2>
                  <p className="text-base leading-relaxed text-[var(--ink-soft)]">
                    {tLocal(post.summary, locale)}
                  </p>
                  <p className="text-sm font-semibold text-[var(--clay)]">
                    {t("readMore")} →
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
