import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/types";
import type { AppLocale } from "@/i18n/routing";
import { tLocal } from "@/lib/locale";
import { getCompany } from "@/lib/catalog";
import { MediaFrame } from "./MediaFrame";

export async function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: AppLocale;
}) {
  const t = await getTranslations("Products");
  const company = await getCompany(product.companySlug);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden bg-[var(--panel)] transition"
    >
      <MediaFrame
        src={product.coverImage}
        alt={tLocal(product.name, locale)}
        label={t("photoCover")}
        hint={`/media/products/${product.slug}/cover.jpg`}
        aspectClassName="aspect-square"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
      <div className="space-y-2 px-1 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--olive)]">
          {tLocal(product.category, locale)}
        </p>
        <h3 className="font-[family-name:var(--font-display)] text-xl font-light tracking-[-0.02em] text-[var(--ink)] transition group-hover:text-[var(--clay)]">
          {tLocal(product.name, locale)}
        </h3>
        <p className="text-sm text-[var(--muted)]">{company?.name}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          {tLocal(product.summary, locale)}
        </p>
        <div className="flex flex-wrap gap-3 pt-1 text-xs text-[var(--muted)]">
          <span>
            {t("moq")}: {product.moq}
          </span>
          <span>
            {t("leadTime")}: {product.leadTime}
          </span>
        </div>
        <p className="pt-1 text-sm font-semibold text-[var(--clay)]">
          {t("viewProduct")} →
        </p>
      </div>
    </Link>
  );
}
