"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/about" as const, label: t("about") },
    { href: "/leather" as const, label: t("leather") },
    { href: "/companies" as const, label: t("companies") },
    { href: "/products" as const, label: t("products") },
    { href: "/inquire" as const, label: t("inquire") },
    { href: "/news" as const, label: t("news") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo-wordmark-light.png"
            alt="Addis Hands"
            width={180}
            height={58}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          className="border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink)] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--line)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-[var(--ink)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </header>
  );
}
