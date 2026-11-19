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
    { href: "/learn" as const, label: t("learn") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 md:px-6 md:py-4.5">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/logo-wordmark-light.png"
            alt="Addis Hands"
            width={500}
            height={163}
            sizes="(max-width: 768px) 160px, 200px"
            quality={100}
            className="h-10 w-auto md:h-12"
            priority
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1 md:flex lg:gap-x-4 xl:gap-x-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
          <div className="shrink-0 pl-1">
            <LanguageSwitcher />
          </div>
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
