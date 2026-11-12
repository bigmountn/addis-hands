import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  label?: string;
  hint?: string;
  className?: string;
  aspectClassName?: string;
  sizes?: string;
  priority?: boolean;
  zoomClassName?: string;
  dim?: boolean;
};

export function MediaFrame({
  src,
  alt,
  label = "Photo",
  hint,
  className = "",
  aspectClassName = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  zoomClassName = "ah-media-zoom",
  dim = false,
}: Props) {
  const isSvg = Boolean(src?.endsWith(".svg"));

  return (
    <div
      className={`relative overflow-hidden bg-[var(--soft)] ${aspectClassName} ${className}`}
    >
      {src ? (
        isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className={`absolute inset-0 h-full w-full object-cover ${zoomClassName}`}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover ${zoomClassName}`}
          />
        )
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            {label}
          </p>
          {hint ? (
            <p className="max-w-[18rem] break-all font-mono text-[11px] leading-relaxed text-[var(--ink)]/55">
              {hint}
            </p>
          ) : null}
        </div>
      )}
      {dim ? (
        <div className="pointer-events-none absolute inset-0 bg-black/15" />
      ) : null}
    </div>
  );
}
