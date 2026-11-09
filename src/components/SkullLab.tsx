"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { fossilsForTaxon, getTaxon } from "@/data/catalog";
import { LANES } from "@/data/lanes";
import { taxa } from "@/data/taxa";
import { formatRange } from "@/lib/format";
import { LANE_COLORS, taxonColor } from "@/lib/palette";
import { lerpParams, skullParams, type SkullParams } from "@/lib/skull";
import { SectionHeading, shortName, type OpenFn } from "./ui";

const SkullViewer = dynamic(() => import("./SkullViewer"), { ssr: false });

type Mode = "single" | "side" | "morph";

const CAVEAT: Record<string, string> = {
  orrorin: "No skull of Orrorin has been found. This shape is borrowed from its nearest relatives.",
  denisovan:
    "Denisovans are known mainly from DNA. This shape follows the Harbin skull, which may or may not be one of them.",
  anamensis: "Based largely on a single cranium (MRD) described in 2019.",
};

export function notice(p: SkullParams): string[] {
  const out: string[] = [];
  const pct = Math.round((p.cc / 1350) * 100);
  out.push(
    `Brain about ${Math.round(p.cc / 10) * 10} cc` +
      (pct < 92 ? `, roughly ${pct}% of the modern average` : pct > 106 ? ", slightly larger than the modern average" : ", the modern average"),
  );
  if (p.vault > 0.85) out.push("Tall, rounded braincase with a vertical forehead");
  else if (p.vault < 0.4) out.push("Low braincase set behind the face rather than above it");
  else out.push("Long, low braincase with a sloping forehead");
  if (p.brow > 0.7) out.push("Heavy bar of bone above the eyes (a brow ridge)");
  else if (p.brow < 0.3) out.push("Hardly any brow ridge");
  if (p.prog > 0.5) out.push("Jaws push well forward of the eyes");
  else if (p.prog < 0.2) out.push("Small, flat face tucked under the forehead");
  if (p.crest > 0.5) out.push("A bony crest along the top anchored huge chewing muscles");
  if (p.tooth > 1.4) out.push("Enormous, flat cheek teeth for grinding");
  if (p.bun > 0.6) out.push("A bulge at the back of the skull, the occipital “bun”");
  if (p.chin > 0.5) out.push("A projecting chin, found only in our species");
  else out.push("No chin: the front of the jaw slopes backward");
  return out;
}

function Picker({
  value,
  onChange,
  exclude,
}: {
  value: string;
  onChange: (id: string) => void;
  exclude?: string;
}) {
  return (
    <div className="space-y-2.5">
      {LANES.map((lane) => {
        const list = taxa.filter((t) => t.lane === lane.id);
        return (
          <div key={lane.id} className="flex flex-wrap items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: LANE_COLORS[lane.id].ink }} />
            {list.map((t) => {
              const on = value === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={t.id === exclude}
                  aria-pressed={on}
                  onClick={() => onChange(t.id)}
                  className="rounded-full px-2.5 py-1 text-[12.5px] italic ring-1 ring-inset transition disabled:opacity-35"
                  style={
                    on
                      ? { background: LANE_COLORS[lane.id].ink, color: "#fff", boxShadow: "none" }
                      : { background: "#fff", color: "var(--ink)", boxShadow: "inset 0 0 0 1px var(--line)" }
                  }
                >
                  {shortName(t.name)}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function SkullLab({
  onOpen,
  a,
  onChangeA,
}: {
  onOpen: OpenFn;
  a: string;
  onChangeA: (id: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("side");
  const [b, setB] = useState("sapiens");
  const [blend, setBlend] = useState(0.5);
  const [jaw, setJaw] = useState(true);
  const ta = getTaxon(a)!;
  const tb = getTaxon(b)!;
  const pa = useMemo(() => skullParams(a), [a]);
  const pb = useMemo(() => skullParams(b), [b]);
  const step = Math.round(blend * 20) / 20;

  const items = useMemo(() => {
    if (mode === "single") return [{ key: a, params: pa }];
    if (mode === "side") return [{ key: a, params: pa }, { key: b, params: pb }];
    return [{ key: `${a}>${b}@${step}`, params: lerpParams(pa, pb, step) }];
  }, [mode, a, b, pa, pb, step]);

  const casts = fossilsForTaxon(a).filter((f) => f.viewers.length > 0);

  return (
    <section id="skulls" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="Skull lab" title="Turn the evidence over in your hands">
        Most of what we know comes from skulls. Pick a species, spin it, and
        set it beside another, or blend one into the other to see exactly
        what changed.
      </SectionHeading>

      <div className="mt-9 grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="overflow-hidden rounded-3xl border border-[var(--line)]">
          <div className="stage relative">
            <SkullViewer items={items} showJaw={jaw} className="h-[340px] sm:h-[460px]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-around px-4 text-center">
              {mode === "morph" ? (
                <span className="rounded-full bg-white/80 px-3 py-1 text-[12.5px] text-[var(--muted)] backdrop-blur">
                  {step === 0 ? <em>{ta.name}</em> : step === 1 ? <em>{tb.name}</em> : (
                    <>{Math.round((1 - step) * 100)}% <em>{shortName(ta.name)}</em> · {Math.round(step * 100)}% <em>{shortName(tb.name)}</em></>
                  )}
                </span>
              ) : (
                (mode === "side" ? [ta, tb] : [ta]).map((t) => (
                  <span key={t.id} className="rounded-full bg-white/80 px-3 py-1 text-[12.5px] backdrop-blur">
                    <em className="font-semibold" style={{ color: taxonColor(t.id) }}>{t.name}</em>
                    <span className="ml-2 text-[var(--faint)]">{formatRange(t.rangeStartKa, t.rangeEndKa)}</span>
                  </span>
                ))
              )}
            </div>
            <span className="pointer-events-none absolute right-4 top-3 text-[11px] text-[var(--faint)]">Drag to rotate</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] bg-white px-4 py-3">
            <div className="flex gap-1 rounded-full bg-[var(--panel)] p-1">
              {([["single", "One"], ["side", "Side by side"], ["morph", "Blend"]] as const).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
                    mode === m ? "bg-[var(--ink)] text-white" : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {mode === "morph" ? (
              <label className="order-last flex w-full items-center gap-3 whitespace-nowrap text-[12.5px] text-[var(--muted)]">
                <em>{shortName(ta.name)}</em>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={blend}
                  onChange={(e) => setBlend(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer accent-[var(--green)]"
                  aria-label="Blend between the two skulls"
                />
                <em>{shortName(tb.name)}</em>
              </label>
            ) : null}
            <span className="flex-1" />
            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-[var(--muted)]">
              <input type="checkbox" checked={jaw} onChange={(e) => setJaw(e.target.checked)} className="h-4 w-4 accent-[var(--green)]" />
              Lower jaw
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-2.5 text-[12.5px] font-semibold text-[var(--ink)]">{mode === "single" ? "Species" : "First skull"}</p>
            <Picker value={a} onChange={onChangeA} />
          </div>
          {mode !== "single" ? (
            <div>
              <p className="mb-2.5 text-[12.5px] font-semibold text-[var(--ink)]">{mode === "morph" ? "Blend toward" : "Second skull"}</p>
              <Picker value={b} onChange={setB} exclude={a} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {(mode === "single" ? [ta] : [ta, tb]).map((t) => (
          <div key={t.id} className="rounded-3xl border border-[var(--line)] bg-white p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[16px] font-semibold italic" style={{ color: taxonColor(t.id) }}>{t.name}</h3>
              <button type="button" onClick={() => onOpen({ kind: "taxon", id: t.id })} className="shrink-0 text-[12.5px] font-medium text-[var(--green)] hover:underline">
                Full profile →
              </button>
            </div>
            <ul className="mt-3 space-y-1.5 text-[14px] leading-snug text-[var(--muted)]">
              {notice(skullParams(t.id)).map((n) => (
                <li key={n} className="flex gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: taxonColor(t.id) }} />
                  {n}
                </li>
              ))}
            </ul>
            {CAVEAT[t.id] ? <p className="mt-3 text-[12.5px] text-[var(--faint)]">{CAVEAT[t.id]}</p> : null}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-[var(--panel)] px-5 py-4 text-[13px] leading-relaxed text-[var(--muted)]">
        <span className="min-w-[260px] flex-1">
          <strong className="font-semibold text-[var(--ink)]">These are teaching models, not scans.</strong>{" "}
          Each skull is generated from published proportions so that any two can be compared or blended. For the real bones, open a scanned cast:
        </span>
        {casts.length === 0 ? <span className="text-[var(--faint)]">no public scan is linked for this species yet.</span> : null}
        {casts.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onOpen({ kind: "fossil", id: f.id })}
            className="rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-[var(--ink)] ring-1 ring-[var(--line)] transition hover:ring-[var(--green)]"
          >
            {f.name} →
          </button>
        ))}
      </div>
    </section>
  );
}
