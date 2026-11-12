import type { SocialLinks } from "@/data/types";
import { hasSocial } from "@/lib/product-fields";

const labels: Array<{ key: keyof SocialLinks; label: string }> = [
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Website" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "other", label: "Other" },
];

export function SocialLinksList({
  social,
  title,
}: {
  social?: SocialLinks;
  title: string;
}) {
  if (!hasSocial(social)) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-sm uppercase tracking-[0.16em] text-[var(--olive)]">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {labels.map(({ key, label }) => {
          const href = social?.[key]?.trim();
          if (!href) return null;
          return (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--leather)] underline-offset-2 hover:underline"
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
