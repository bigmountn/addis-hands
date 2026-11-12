import { setRequestLocale } from "next-intl/server";
import { InquiryForm, type InquiryRole } from "@/components/InquiryForm";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function resolveRole(value?: string): InquiryRole {
  return value === "seller" ? "seller" : "buyer";
}

export default async function InquirePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ company?: string; product?: string; role?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { company = "", product = "", role: roleParam } = await searchParams;
  const locale = localeParam as AppLocale;
  const role = resolveRole(roleParam);
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <InquiryForm
        key={`${role}:${company}:${product}`}
        defaultRole={role}
        defaultCompany={company}
        defaultProduct={product}
      />
    </div>
  );
}
