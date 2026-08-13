import { silhouetteFor } from "@/data/silhouettes";
import { taxonColor } from "@/lib/palette";

export function HomininFigure({
  taxonId,
  label,
  caption,
  active = true,
  onClick,
  height = 180,
}: {
  taxonId: string;
  label?: string;
  caption?: string;
  active?: boolean;
  onClick?: () => void;
  height?: number;
}) {
  const art = silhouetteFor(taxonId);
  const color = taxonColor(taxonId);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl px-3 py-3 text-center transition ${
        active ? "opacity-100" : "opacity-25"
      } ${onClick ? "hover:-translate-y-0.5 hover:bg-white/70" : ""}`}
    >
      <div
        className="flex items-end justify-center"
        style={{ height, minWidth: 72 }}
      >
        {art ? (
          // Phylopic / original SVG; colored via CSS mask so the set shares one palette
          <span
            aria-hidden
            style={{
              display: "block",
              width: height * 0.42,
              height,
              background: color,
              WebkitMaskImage: `url(${art.src})`,
              maskImage: `url(${art.src})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center bottom",
              maskPosition: "center bottom",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
        ) : (
          <span
            className="inline-block rounded-full"
            style={{
              width: 18,
              height: 18,
              background: color,
              marginBottom: 8,
            }}
          />
        )}
      </div>
      {label ? (
        <span className="font-serif text-sm italic text-[var(--ink)]">{label}</span>
      ) : null}
      {caption ? (
        <span className="max-w-[11rem] text-[11px] leading-snug text-[var(--muted)]">
          {caption}
        </span>
      ) : null}
    </button>
  );
}
