"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "대시보드 (Dashboard)" },
  { href: "/admin/companies", label: "회사 (Companies)" },
  { href: "/admin/products", label: "제품 (Products)" },
  { href: "/admin/news", label: "뉴스 (News)" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--cognac)]">
              Addis Hands
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl">
              관리자 (Admin)
            </h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)] hover:border-[var(--leather)] hover:text-[var(--ink)]"
          >
            로그아웃 (Logout)
          </button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-3 py-1.5 text-sm ${
                  active
                    ? "bg-[var(--ink)] text-white"
                    : "text-[var(--muted)] hover:bg-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
