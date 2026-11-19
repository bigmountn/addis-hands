import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LearnFieldPair, LearnPair } from "@/components/LearnBilingual";
import { MediaFrame } from "@/components/MediaFrame";
import { getLearnPosts, tLearn } from "@/lib/learn";
import { isLearnLocale, type LearnLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function formatDate(date: string, locale: LearnLocale) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export default async function LearnIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLearnLocale(localeParam) ? localeParam : "en";
  setRequestLocale(locale);

  const tEn = await getTranslations({ locale: "en", namespace: "Learn" });
  const tAm = await getTranslations({ locale: "am", namespace: "Learn" });
  const posts = await getLearnPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-10 max-w-2xl space-y-5">
        <LearnPair
          as="h1"
          en={tEn("title")}
          am={tAm("title")}
          enClassName="ah-section-title text-4xl md:text-5xl"
          amClassName="ah-section-title text-3xl text-[var(--ink-soft)] md:text-4xl"
        />
        <LearnPair
          en={tEn("subtitle")}
          am={tAm("subtitle")}
          enClassName="text-[var(--muted)]"
          amClassName="text-[var(--muted)]"
        />
        <LearnPair
          en={tEn("languagesNote")}
          am={tAm("languagesNote")}
          enClassName="text-sm text-[var(--olive)]"
          amClassName="text-sm text-[var(--olive)]"
        />
      </div>

      {posts.length === 0 ? (
        <LearnPair
          en={tEn("empty")}
          am={tAm("empty")}
          enClassName="text-[var(--muted)]"
          amClassName="text-[var(--muted)]"
        />
      ) : (
        <div className="space-y-0 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {posts.map((post) => (
            <article key={post.slug} className="py-8">
              <Link
                href={`/learn/${post.slug}`}
                className={`group grid gap-6 md:items-start ${
                  post.coverImage
                    ? "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                    : ""
                }`}
              >
                {post.coverImage ? (
                  <MediaFrame
                    src={post.coverImage}
                    alt={tLearn(post.title, "en")}
                    aspectClassName="aspect-[16/10]"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : null}
                <div className="space-y-3">
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
                    as="h2"
                    enClassName="font-[family-name:var(--font-display)] text-2xl font-light tracking-[-0.02em] text-[var(--ink)] transition group-hover:text-[var(--clay)] md:text-3xl"
                    amClassName="font-[family-name:var(--font-display)] text-xl font-light tracking-[-0.02em] text-[var(--ink-soft)] transition group-hover:text-[var(--clay)] md:text-2xl"
                  />
                  <LearnFieldPair
                    value={post.summary}
                    enClassName="text-base leading-relaxed text-[var(--ink-soft)]"
                    amClassName="text-base leading-relaxed text-[var(--ink-soft)]"
                  />
                  <p className="text-sm font-semibold text-[var(--clay)]">
                    {tEn("readMore")} / {tAm("readMore")} →
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
