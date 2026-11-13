"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = {
  slug: string;
  initialViews: number | null;
  className?: string;
};

export function NewsViewTracker({
  slug,
  initialViews,
  className = "",
}: Props) {
  const t = useTranslations("News");
  const [views, setViews] = useState<number | null>(initialViews);

  useEffect(() => {
    let cancelled = false;

    async function record() {
      try {
        const res = await fetch(`/api/news/${encodeURIComponent(slug)}/view`, {
          method: "POST",
          credentials: "same-origin",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          views?: number | null;
          configured?: boolean;
        };
        if (cancelled) return;
        if (typeof data.views === "number") {
          setViews(data.views);
        } else if (data.configured === false) {
          setViews(null);
        }
      } catch {
        // Keep initial count if the request fails.
      }
    }

    void record();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (views === null) return null;

  return <span className={className}>{t("views", { count: views })}</span>;
}
