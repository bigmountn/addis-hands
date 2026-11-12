import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-28">
          <div className="overflow-hidden bg-[var(--soft)]">
            <Image
              src="/brand/logo-full-light.png"
              alt="Addis Hands"
              width={360}
              height={360}
              className="mx-auto h-auto w-full max-w-xs p-10"
              priority
            />
          </div>
          <div className="overflow-hidden bg-[var(--soft)]">
            <Image
              src="/about/made-in-ethiopia-wallet.jpg"
              alt="Handmade leather wallet stamped Made in Ethiopia"
              width={1000}
              height={1000}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="ah-section-title text-4xl md:text-5xl">{t("title")}</h1>
            <p className="text-lg text-[var(--ink-soft)]">{t("lead")}</p>
          </div>

          <section className="space-y-2">
            <h2 className="ah-section-title text-2xl">{t("storyTitle")}</h2>
            <p className="leading-relaxed text-[var(--ink-soft)]">{t("storyBody")}</p>
          </section>

          <section className="space-y-2">
            <h2 className="ah-section-title text-2xl">{t("whyTitle")}</h2>
            <p className="leading-relaxed text-[var(--ink-soft)]">{t("whyBody")}</p>
          </section>

          <section className="space-y-2">
            <h2 className="ah-section-title text-2xl">{t("curatedTitle")}</h2>
            <p className="leading-relaxed text-[var(--ink-soft)]">
              {t("curatedBody")}
            </p>
          </section>

          <section id="who" className="scroll-mt-28 space-y-3">
            <h2 className="ah-section-title text-2xl">{t("whoTitle")}</h2>
            <p className="text-sm font-medium leading-relaxed text-[var(--ink)] md:text-[0.95rem]">
              {t("whoProject")}
            </p>
            <p className="leading-relaxed text-[var(--ink-soft)]">{t("whoBody")}</p>
          </section>

          <div className="space-y-3 border-t border-[var(--line)] pt-6">
            <p className="text-sm text-[var(--muted)]">{t("ctaLead")}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/inquire?role=buyer" className="ah-btn ah-btn-primary">
                {t("ctaBuyer")}
              </Link>
              <Link href="/inquire?role=seller" className="ah-btn ah-btn-secondary">
                {t("ctaSeller")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
