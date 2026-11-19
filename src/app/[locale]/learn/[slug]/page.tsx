import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  LearnBodyPair,
  LearnFieldPair,
  LearnPair,
} from "@/components/LearnBilingual";
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

function displayHost(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.host}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return url;
  }
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
  const resourceUrl = post.resourceUrl?.trim() || undefined;
  const screenshots = (post.resourceScreenshots ?? []).filter(Boolean);
  const resourceHost = resourceUrl ? displayHost(resourceUrl) : "";

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

      {resourceUrl ? (
        <aside className="mt-8 space-y-5 border border-[var(--line)] bg-[var(--soft)]/60 p-5 md:p-6">
          <LearnPair
            en={tEn("startHere")}
            am={tAm("startHere")}
            enClassName="text-xs font-bold uppercase tracking-[0.16em] text-[var(--olive)]"
            amClassName="text-xs font-bold uppercase tracking-[0.16em] text-[var(--olive)]"
          />
          <a
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all font-[family-name:var(--font-display)] text-xl font-light tracking-[-0.02em] text-[var(--clay)] underline-offset-4 hover:underline md:text-2xl"
          >
            {resourceHost}
          </a>
          {post.resourceBlurb ? (
            <LearnFieldPair
              value={post.resourceBlurb}
              enClassName="text-sm leading-relaxed text-[var(--ink-soft)] md:text-base"
              amClassName="text-sm leading-relaxed text-[var(--ink-soft)] md:text-base"
            />
          ) : null}
          {screenshots.length > 0 ? (
            <div className="space-y-3">
              <LearnPair
                en={tEn("siteScreens")}
                am={tAm("siteScreens")}
                enClassName="text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
                amClassName="text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
              />
              <div
                className={`grid gap-3 ${
                  screenshots.length > 1 ? "sm:grid-cols-2" : ""
                }`}
              >
                {screenshots.map((src, index) => (
                  <a
                    key={src}
                    href={resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden border border-[var(--line)] bg-white"
                  >
                    <MediaFrame
                      src={src}
                      alt={`${resourceHost} screen ${index + 1}`}
                      aspectClassName="aspect-[16/10]"
                      sizes="(max-width: 768px) 100vw, 360px"
                      zoomClassName=""
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          <div className="space-y-1 border-t border-[var(--line)] pt-4">
            <a
              href={resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-semibold text-[var(--clay)] underline-offset-4 hover:underline"
            >
              {post.resourceLabel
                ? tLearn(post.resourceLabel, "en")
                : tEn("openResource")}{" "}
              →
            </a>
            <a
              href={resourceUrl}
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
          </div>
        </aside>
      ) : null}

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
        <LearnBodyPair
          value={post.body}
          gallery={post.gallery ?? []}
          titleForAlt={tLearn(post.title, "en")}
        />
      </div>
    </article>
  );
}
