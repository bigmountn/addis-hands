import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Company } from "@/data/types";
import type { AppLocale } from "@/i18n/routing";
import { tLocal } from "@/lib/locale";
import { MediaFrame } from "./MediaFrame";

export async function CompanyCard({
  company,
  locale,
}: {
  company: Company;
  locale: AppLocale;
}) {
  const t = await getTranslations("Companies");

  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group block overflow-hidden bg-[var(--panel)] transition"
    >
      <MediaFrame
        src={company.coverImage}
        alt={`${company.name} cover`}
        label={t("photoCover")}
        hint={`/media/companies/${company.slug}/cover.jpg`}
        aspectClassName="aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="space-y-3 px-1 py-5">
        <div className="flex flex-wrap gap-2">
          {company.verified ? (
            <span className="bg-[var(--sage-pale,#ced4b8)]/40 px-2 py-0.5 text-[11px] uppercase tracking-wider text-[var(--olive)]">
              {t("verified")}
            </span>
          ) : null}
          {company.exportReady ? (
            <span className="bg-[var(--soft)] px-2 py-0.5 text-[11px] uppercase tracking-wider text-[var(--muted)]">
              {t("exportReady")}
            </span>
          ) : null}
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-light tracking-[-0.02em] text-[var(--ink)] transition group-hover:text-[var(--clay)]">
          {company.name}
        </h3>
        <p className="text-sm text-[var(--muted)]">
          {company.city}, {company.country} · {tLocal(company.category, locale)}
        </p>
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
          {tLocal(company.summary, locale)}
        </p>
        <p className="text-sm font-semibold text-[var(--clay)]">
          {t("viewProfile")} →
        </p>
      </div>
    </Link>
  );
}
