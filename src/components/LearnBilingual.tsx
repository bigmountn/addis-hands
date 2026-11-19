import type { BilingualString } from "@/data/types";
import { tLearn } from "@/lib/learn";

export function LearnPair({
  en,
  am,
  as: Tag = "p",
  enClassName = "",
  amClassName = "",
}: {
  en: string;
  am: string;
  as?: "p" | "h1" | "h2" | "span";
  enClassName?: string;
  amClassName?: string;
}) {
  const english = en.trim();
  const amharic = am.trim();
  if (!english && !amharic) return null;

  return (
    <div className="space-y-2">
      {english ? <Tag className={enClassName}>{english}</Tag> : null}
      {amharic ? (
        <Tag
          className={`font-[family-name:var(--font-ethiopic)] ${amClassName}`}
          lang="am"
        >
          {amharic}
        </Tag>
      ) : null}
    </div>
  );
}

export function LearnFieldPair({
  value,
  as = "p",
  enClassName = "",
  amClassName = "",
}: {
  value: BilingualString;
  as?: "p" | "h1" | "h2" | "span";
  enClassName?: string;
  amClassName?: string;
}) {
  return (
    <LearnPair
      en={tLearn(value, "en")}
      am={tLearn(value, "am")}
      as={as}
      enClassName={enClassName}
      amClassName={amClassName}
    />
  );
}

export function LearnBodyPair({ value }: { value: BilingualString }) {
  const enParts = tLearn(value, "en")
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const amParts = tLearn(value, "am")
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const count = Math.max(enParts.length, amParts.length);

  return (
    <div className="space-y-8">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="space-y-3">
          {enParts[index] ? (
            <p className="text-base leading-relaxed text-[var(--ink)]/85 md:text-lg whitespace-pre-line">
              {enParts[index]}
            </p>
          ) : null}
          {amParts[index] ? (
            <p
              lang="am"
              className="font-[family-name:var(--font-ethiopic)] text-base leading-relaxed text-[var(--ink-soft)] md:text-lg whitespace-pre-line"
            >
              {amParts[index]}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
