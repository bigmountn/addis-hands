type Props = {
  count: number | null | undefined;
  label: (count: number) => string;
  className?: string;
};

/** Server-friendly view label for list cards (no increment). */
export function NewsViewLabel({ count, label, className = "" }: Props) {
  if (count === null || count === undefined) return null;
  return <span className={className}>{label(count)}</span>;
}
