"use client";

import { taxa } from "@/data/taxa";
import { taxonColor } from "@/lib/palette";
import { formatKa } from "@/lib/format";

const IDS = ["erectus", "neanderthal", "sapiens"] as const;
const START = 2000;
const END = 0;

function xOf(ka: number, width: number) {
  return ((START - ka) / (START - END)) * width;
}

export function TrioChart({
  ka,
  onSelect,
}: {
  ka?: number;
  onSelect?: (id: string) => void;
}) {
  const width = 640;
  const rowH = 36;
  const labelW = 118;
  const chartW = width - labelW - 16;
  const height = 28 + IDS.length * rowH;

  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white p-4">
      <div className="flex items-baseline justify-between gap-3">
        <figcaption className="font-serif text-lg text-[var(--ink)]">
          The classroom three, in time
        </figcaption>
        <span className="text-[11px] text-[var(--muted)]">2 Ma → now</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 w-full">
        {[2000, 1000, 500, 100, 0].map((tick) => {
          const x = labelW + xOf(tick, chartW);
          return (
            <g key={tick}>
              <line
                x1={x}
                x2={x}
                y1={8}
                y2={height - 4}
                stroke="#d7e6db"
                strokeWidth="1"
              />
              <text x={x + 3} y={14} fontSize="9" fill="#4a6656">
                {tick === 0 ? "now" : formatKa(tick)}
              </text>
            </g>
          );
        })}
        {IDS.map((id, i) => {
          const taxon = taxa.find((t) => t.id === id);
          if (!taxon) return null;
          const y = 22 + i * rowH;
          const x1 = labelW + xOf(Math.min(START, taxon.rangeStartKa), chartW);
          const x2 = labelW + xOf(Math.max(END, taxon.rangeEndKa), chartW);
          const live =
            ka !== undefined &&
            ka <= taxon.rangeStartKa &&
            ka >= taxon.rangeEndKa;
          return (
            <g key={id}>
              <text
                x={8}
                y={y + 16}
                fontSize="12"
                fill="#163226"
                fontStyle="italic"
              >
                H. {id === "neanderthal" ? "neanderthalensis" : id}
              </text>
              <rect
                x={x1}
                y={y}
                width={Math.max(6, x2 - x1)}
                height={22}
                rx="11"
                fill={taxonColor(id)}
                opacity={live || ka === undefined ? 0.95 : 0.35}
                className={onSelect ? "cursor-pointer" : undefined}
                onClick={() => onSelect?.(id)}
              />
            </g>
          );
        })}
        {ka !== undefined && ka <= START ? (
          <line
            x1={labelW + xOf(ka, chartW)}
            x2={labelW + xOf(ka, chartW)}
            y1={16}
            y2={height - 2}
            stroke="#0f4d32"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        ) : null}
      </svg>
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted)]">
        They overlap. Erectus is still around when sapiens appear. Neanderthals
        are cousins in time, not a missing rung under us.
      </p>
    </figure>
  );
}
