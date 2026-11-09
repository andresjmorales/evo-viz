"use client";

import type { CSSProperties, ReactNode } from "react";
import { figureFor } from "@/data/figures";
import type { Status } from "@/data/types";
import { STATUS_BLURB, STATUS_LABEL } from "@/lib/format";
import { STATUS_COLOR } from "@/lib/palette";

export type PanelTarget =
  | { kind: "taxon"; id: string }
  | { kind: "claim"; id: string }
  | { kind: "theory"; id: string }
  | { kind: "fossil"; id: string }
  | { kind: "route"; id: string };

export type OpenFn = (t: PanelTarget) => void;

const ORDER: Status[] = ["settled", "strong", "contested", "shaky", "speculative"];

/** Status chip with a five-step meter, so the scale reads at a glance. */
export function StatusBadge({
  status,
  dark = false,
  compact = false,
}: {
  status: Status;
  dark?: boolean;
  compact?: boolean;
}) {
  const c = STATUS_COLOR[status];
  const level = 5 - ORDER.indexOf(status);
  return (
    <span
      title={STATUS_BLURB[status]}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-[3px] text-[11px] font-semibold leading-none"
      style={
        dark
          ? { background: "rgba(255,255,255,0.1)", color: "#fff" }
          : { background: c.bg, color: c.fg }
      }
    >
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-[1px]"
            style={{
              height: 3 + i * 1.6,
              background: i <= level ? c.dot : dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)",
            }}
          />
        ))}
      </span>
      {compact ? null : STATUS_LABEL[status]}
    </span>
  );
}

/** A tinted PhyloPic silhouette, flipped to walk toward the present. */
export function Figure({
  taxonId,
  height,
  color,
  className = "",
  style,
}: {
  taxonId: string;
  height: number;
  color: string;
  className?: string;
  style?: CSSProperties;
}) {
  const fig = figureFor(taxonId);
  if (!fig) return null;
  return (
    <div
      aria-hidden
      className={`figure-mask ${className}`}
      style={{
        height,
        width: height * fig.aspect,
        background: color,
        maskImage: `url(${fig.src})`,
        WebkitMaskImage: `url(${fig.src})`,
        transform: "scaleX(-1)",
        ...style,
      }}
    />
  );
}

export function SectionHeading({
  id,
  kicker,
  title,
  children,
}: {
  id?: string;
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header id={id} className="max-w-[720px]">
      <p className="kicker text-[var(--green)]">{kicker}</p>
      <h2 className="display mt-3 text-[34px] leading-[1.08] text-[var(--ink)] sm:text-[44px]">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--muted)]">{children}</p>
      ) : null}
    </header>
  );
}

export function shortName(name: string): string {
  return name
    .replace("Australopithecus", "Au.")
    .replace("Paranthropus", "P.")
    .replace("Sahelanthropus", "S.")
    .replace("Ardipithecus", "Ar.")
    .replace("Orrorin", "O.")
    .replace("Homo ", "H. ");
}
