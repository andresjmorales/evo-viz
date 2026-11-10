"use client";

import { STATURE_CM } from "@/data/figures";
import { getTaxon } from "@/data/catalog";
import { taxa } from "@/data/taxa";
import { formatKa, formatRange } from "@/lib/format";
import { LANE_COLORS, taxonColor } from "@/lib/palette";
import { kaToX } from "@/lib/timeScale";
import { skullParams } from "@/lib/skull";
import { useMeasure } from "@/lib/useMeasure";
import { Figure, SectionHeading, shortName, type OpenFn } from "./ui";

const CAST = [
  "ardipithecus",
  "afarensis",
  "boisei",
  "habilis",
  "erectus",
  "heidelbergensis",
  "neanderthal",
  "floresiensis",
  "sapiens",
];
const PX_PER_CM = 1.32;

const POINTS = [
  {
    n: "1",
    title: "Feet before brains",
    text: "Our ancestors walked upright for at least two million years before their brains grew much beyond an ape’s.",
  },
  {
    n: "2",
    title: "Usually more than one",
    text: "For most of the last four million years several kinds of hominin were alive at once. Being the only one is new.",
  },
  {
    n: "3",
    title: "Branches that rejoin",
    text: "Neanderthals, Denisovans and our own ancestors split, then met again and had children. Their DNA is still in us.",
  },
];

export function ShortVersion({ onOpen }: { onOpen: OpenFn }) {
  return (
    <section id="short" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="The short version" title="A bush with tangled branches">
        The famous picture shows a single file of figures, each replacing the
        last. The real history branched, and several branches lived side by
        side.
      </SectionHeading>

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <ol className="space-y-6">
          {POINTS.map((p) => (
            <li key={p.n} className="flex gap-4">
              <span className="display grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--green-soft)] text-[17px] text-[var(--green)]">
                {p.n}
              </span>
              <div>
                <h3 className="text-[17px] font-semibold text-[var(--ink)]">{p.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--muted)]">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <BushDiagram onOpen={onOpen} />
      </div>

      <Lineup onOpen={onOpen} />
      <BrainChart onOpen={onOpen} />
    </section>
  );
}

function BushDiagram({ onOpen }: { onOpen: OpenFn }) {
  const c = (lane: number) => LANE_COLORS[lane].ink;
  const label = (
    x: number,
    y: number,
    text: string,
    id: string,
    sub?: string,
    anchor: "start" | "end" = "start",
  ) => (
    <g
      role="button"
      tabIndex={0}
      onClick={() => onOpen({ kind: "taxon", id })}
      onKeyDown={(e) => e.key === "Enter" && onOpen({ kind: "taxon", id })}
      className="cursor-pointer outline-none [&:focus-visible_text]:underline [&:hover_text]:underline"
    >
      <text x={x} y={y} textAnchor={anchor} fontSize="13.5" fontWeight="600" fill="#0d2118">
        {text}
      </text>
      {sub ? (
        <text x={x} y={y + 15} textAnchor={anchor} fontSize="11.5" fill="#586b61">
          {sub}
        </text>
      ) : null}
    </g>
  );
  return (
    <figure className="min-w-0 rounded-3xl border border-[var(--line)] bg-white p-4 sm:p-6">
      <div className="thin-scroll overflow-x-auto">
      <svg viewBox="0 0 720 352" className="h-auto w-full min-w-[560px]" role="img" aria-label="Simplified branching diagram of human evolution">
        {[
          [36, "4 Ma"],
          [200, "2 Ma"],
          [372, "700 ka"],
          [470, "300 ka"],
          [628, "40 ka"],
          [700, "now"],
        ].map(([x, t]) => (
          <g key={t}>
            <line x1={x} x2={x} y1={18} y2={318} stroke="#e6ede8" strokeDasharray="2 5" />
            <text x={x} y={340} textAnchor="middle" fontSize="11" fill="#8a9a91">
              {t}
            </text>
          </g>
        ))}
        <g fill="none" strokeLinecap="round" strokeWidth={13}>
          <path d="M156 128 C 196 128, 196 62, 246 58 L 330 58" stroke={c(2)} />
          <path d="M36 128 L 200 128" stroke={c(1)} />
          <path d="M360 128 C 400 128, 396 224, 440 224" stroke={c(5)} />
          <path d="M440 224 C 480 224, 478 176, 520 176 L 628 176" stroke={c(6)} />
          <path d="M440 224 L 636 224" stroke={c(7)} />
          <path d="M440 224 C 480 224, 478 278, 520 278 L 696 278" stroke={c(8)} />
          <path d="M200 128 L 596 128" stroke={c(4)} />
        </g>
        <circle cx={330} cy={58} r={3} fill="#fff" />
        <circle cx={596} cy={128} r={3} fill="#fff" />
        <circle cx={628} cy={176} r={3} fill="#fff" />
        <circle cx={636} cy={224} r={3} fill="#fff" />
        <path d="M704 278 l-12 -8 v16 z" fill={c(8)} />
        <g fill="none" stroke="#0d2118" strokeWidth={1.6} strokeDasharray="3 4" strokeLinecap="round">
          <path d="M606 184 C 616 210, 626 244, 630 268" markerEnd="url(#arr)" />
          <path d="M650 232 C 656 246, 658 256, 659 268" markerEnd="url(#arr)" />
        </g>
        <defs>
          <marker id="arr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M1 1 L7 4 L1 7" fill="none" stroke="#0d2118" strokeWidth="1.4" />
          </marker>
        </defs>
        {label(36, 94, "Australopiths", "afarensis", "upright apes, like Lucy")}
        {label(250, 24, "Paranthropus", "boisei", "heavy-jawed side branch")}
        {label(262, 94, "Homo erectus", "erectus", "first to leave Africa")}
        {label(396, 256, "H. heidelbergensis", "heidelbergensis", "the likely common ancestor", "end")}
        {label(524, 156, "Neanderthals", "neanderthal")}
        {label(524, 206, "Denisovans", "denisovan")}
        {label(524, 306, "Homo sapiens", "sapiens", "us")}
        <text x={672} y={248} fontSize="11" fill="#586b61">
          shared
        </text>
        <text x={672} y={261} fontSize="11" fill="#586b61">
          DNA
        </text>
      </svg>
      </div>
      <figcaption className="mt-2 text-[12.5px] leading-relaxed text-[var(--faint)]">
        A deliberately simple sketch. Time runs left to right and is not to
        scale. Dotted arrows mark interbreeding. Click a name for the details,
        or see every species in the family tree below.
      </figcaption>
    </figure>
  );
}

function Lineup({ onOpen }: { onOpen: OpenFn }) {
  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="display text-[26px] text-[var(--ink)]">Nine relatives, drawn to the same scale</h3>
        <p className="text-[13px] text-[var(--faint)]">Oldest on the left. Click anyone to meet them.</p>
      </div>
      <div className="thin-scroll mt-6 overflow-x-auto rounded-3xl border border-[var(--line)] bg-[var(--panel)]">
        <div className="relative min-w-[980px] px-11 pb-2 pt-8">
          {[50, 100, 150].map((cm) => (
            <div
              key={cm}
              className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-[#d3e0d8]"
              style={{ bottom: 103 + cm * PX_PER_CM }}
            >
              <span className="absolute left-3 -translate-y-1/2 bg-[var(--panel)] pr-1 text-[10.5px] tabular-nums text-[var(--faint)]">
                {cm} cm
              </span>
            </div>
          ))}
          <div className="relative grid grid-cols-9 items-end">
            {CAST.map((id) => {
              const t = getTaxon(id)!;
              const color = taxonColor(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOpen({ kind: "taxon", id })}
                  className="group flex flex-col items-center px-1 text-center"
                >
                  <div className="flex items-end justify-center" style={{ height: 250 }}>
                    <Figure
                      taxonId={id}
                      height={STATURE_CM[id] * PX_PER_CM}
                      color={color}
                      className="transition duration-300 group-hover:-translate-y-1 group-hover:brightness-110"
                    />
                  </div>
                  <div className="mt-2 h-[3px] w-10 rounded-full" style={{ background: color }} />
                  <div className="mt-2.5 h-[80px]">
                    <div className="whitespace-nowrap text-[12.5px] font-semibold italic leading-tight tracking-tight text-[var(--ink)] group-hover:underline">
                      {shortName(t.name)}
                    </div>
                    <div className="mt-1 text-[11.5px] leading-snug text-[var(--muted)]">
                      {formatRange(t.rangeStartKa, t.rangeEndKa)}
                    </div>
                    <div className="mt-0.5 text-[11.5px] tabular-nums leading-snug text-[var(--faint)]">
                      {t.cranialCapacityCc
                        ? `brain ${t.cranialCapacityCc[0]}–${t.cranialCapacityCc[1]} cc`
                        : ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12.5px] text-[var(--faint)]">
        Heights are mid-range adult estimates. Silhouettes are life
        restorations by T. Michael Keesey (PhyloPic, public domain): hair, skin
        and posture are informed guesses, the proportions come from bones.
      </p>
    </div>
  );
}

type LabelPos = "above" | "below" | "end-above" | "end-below";
const LABELS: Record<string, LabelPos> = {
  sahelanthropus: "above",
  afarensis: "above",
  boisei: "end-below",
  habilis: "above",
  erectus: "above",
  heidelbergensis: "above",
  neanderthal: "above",
  sapiens: "end-below",
  naledi: "below",
  floresiensis: "end-below",
};
const MOBILE_LABELS = new Set(["afarensis", "erectus", "neanderthal", "sapiens"]);

function BrainChart({ onOpen }: { onOpen: OpenFn }) {
  const [ref, width] = useMeasure<HTMLDivElement>();
  const H = 360;
  const m = { l: 46, r: 16, t: 20, b: 34 };
  const w = Math.max(320, width);
  const x = (ka: number) => m.l + kaToX(ka, w - m.l - m.r);
  const y = (cc: number) => m.t + (1 - cc / 1800) * (H - m.t - m.b);
  // Denisovans have no measured braincase, so they are left off.
  const rows = taxa.filter((t) => t.cranialCapacityCc && t.id !== "denisovan");
  const ticks = [7000, 5000, 3000, 2000, 1000, 400, 100, 0].filter(
    (k) => w > 620 || ![5000, 400].includes(k),
  );
  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="display text-[26px] text-[var(--ink)]">Brains: flat for millions of years, then steep</h3>
        <p className="text-[13px] text-[var(--faint)]">
          Each line is one species: how long it lasted, at its typical brain volume. The thin bar is the measured range.
        </p>
      </div>
      <div ref={ref} className="mt-6 rounded-3xl border border-[var(--line)] bg-white p-3 sm:p-5">
        {width ? (
          <svg width={w} height={H} role="img" aria-label="Typical brain volume of each species through time" className="block">
            {[0, 400, 800, 1200, 1600].map((cc) => (
              <g key={cc}>
                <line x1={m.l} x2={w - m.r} y1={y(cc)} y2={y(cc)} stroke={cc ? "#edf2ee" : "#cfdcd4"} />
                <text x={m.l - 8} y={y(cc) + 4} textAnchor="end" fontSize="11" fill="#8a9a91" className="tabular-nums">
                  {cc ? cc.toLocaleString("en-US") : "0"}
                </text>
              </g>
            ))}
            <text x={8} y={m.t - 6} fontSize="11" fill="#8a9a91">cm³</text>
            <line x1={m.l} x2={w - m.r} y1={y(400)} y2={y(400)} stroke="#0d2118" strokeDasharray="2 4" opacity={0.4} />
            <text x={w - m.r} y={y(400) + 15} textAnchor="end" fontSize="11" fill="#586b61">
              a chimpanzee’s brain, about 400 cm³
            </text>
            {ticks.map((k) => (
              <text
                key={k}
                x={x(k)}
                y={H - 10}
                textAnchor={k === 0 ? "end" : k === 7000 ? "start" : "middle"}
                fontSize="11"
                fill="#8a9a91"
              >
                {k === 0 ? "now" : formatKa(k)}
              </text>
            ))}
            {rows.map((t) => {
              const [lo, hi] = t.cranialCapacityCc!;
              const mean = skullParams(t.id).cc;
              const x0 = x(t.rangeStartKa);
              const x1 = Math.max(x(t.rangeEndKa), x0 + 8);
              const yy = y(mean);
              const color = taxonColor(t.id);
              return (
                <g
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen({ kind: "taxon", id: t.id })}
                  onKeyDown={(e) => e.key === "Enter" && onOpen({ kind: "taxon", id: t.id })}
                  className="cursor-pointer outline-none [&:focus-visible_.bar]:stroke-[9px] [&:hover_.bar]:stroke-[9px]"
                >
                  <title>{`${t.name}: ${lo}–${hi} cm³`}</title>
                  <line x1={(x0 + x1) / 2} x2={(x0 + x1) / 2} y1={y(hi)} y2={y(lo)} stroke={color} strokeWidth={1.5} opacity={0.45} />
                  <line x1={x0} x2={x1} y1={yy} y2={yy} stroke="transparent" strokeWidth={16} />
                  <line className="bar transition-[stroke-width]" x1={x0 + 3} x2={x1 - 3} y1={yy} y2={yy} stroke={color} strokeWidth={6} strokeLinecap="round" />
                </g>
              );
            })}
            {rows.map((t) => {
              const pos = LABELS[t.id];
              if (!pos || !(w > 620 || MOBILE_LABELS.has(t.id))) return null;
              const x0 = x(t.rangeStartKa);
              const x1 = Math.max(x(t.rangeEndKa), x0 + 8);
              const yy = y(skullParams(t.id).cc);
              const end = pos.startsWith("end");
              const below = pos.endsWith("below");
              return (
                <text
                  key={t.id}
                  x={end ? x1 : x0}
                  y={below ? yy + 17 : yy - 9}
                  textAnchor={end ? "end" : "start"}
                  fontSize="12"
                  fontStyle="italic"
                  fontWeight={600}
                  fill={taxonColor(t.id)}
                  stroke="#fff"
                  strokeWidth={3.5}
                  paintOrder="stroke"
                  className="pointer-events-none"
                >
                  {shortName(t.name)}
                </text>
              );
            })}
          </svg>
        ) : (
          <div style={{ height: H }} />
        )}
      </div>
      <p className="mt-3 text-[12.5px] text-[var(--faint)]">
        The time axis is stretched toward the present, so the last 400,000
        years take up as much room as the first five million. Two late
        species, <em>H. floresiensis</em> and <em>H. naledi</em>, kept small
        brains: size did not only go up.
      </p>
    </div>
  );
}
