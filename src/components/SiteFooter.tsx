import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const INQUIRY_EMAIL = "info@bigmountn.com";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const year = new Date().getFullYear();

  const explore = [
    { href: "/about" as const, label: tNav("about") },
    { href: "/leather" as const, label: tNav("leather") },
    { href: "/companies" as const, label: tNav("companies") },
    { href: "/products" as const, label: tNav("products") },
    { href: "/news" as const, label: tNav("news") },
  ];

  return (
    <footer className="mt-auto bg-[var(--footer)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-12 md:px-6">
        <div className="space-y-4">
          <p className="font-[family-name:var(--font-display)] text-3xl font-light tracking-[-0.02em]">
            ADDIS HANDS
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-white/65">
            {t("blurb")}
          </p>
          <p className="text-xs tracking-[0.04em] text-white/40">{t("note")}</p>
          <Link
            href="/about#who"
            className="inline-block text-sm text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            {t("operator")}
          </Link>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ochre)]">
            {t("explore")}
          </p>
          <ul className="space-y-2.5 text-sm">
            {explore.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/80 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ochre)]">
            {t("contact")}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            {t("contactLead")}
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/inquire?role=buyer"
                className="text-white/85 transition hover:text-white"
              >
                {t("buyerInquiry")}
              </Link>
            </li>
            <li>
              <Link
                href="/inquire?role=seller"
                className="text-white/85 transition hover:text-white"
              >
                {t("listingInquiry")}
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${INQUIRY_EMAIL}`}
                className="text-white/85 transition hover:text-white"
              >
                {INQUIRY_EMAIL}
              </a>
            </li>
          </ul>
          <p className="text-xs text-white/40">{t("response")}</p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40 md:px-6">
        © {year} Addis Hands. {t("rights")}
      </div>
    </footer>
  );
}
