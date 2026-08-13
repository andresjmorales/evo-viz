"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LANES } from "@/data/lanes";
import { taxa } from "@/data/taxa";
import { theories } from "@/data/theories";
import type { Taxon, Theory } from "@/data/types";
import { formatKa, formatRange } from "@/lib/format";
import { AXIS_TICKS_KA, TIMELINE_WIDTH, kaToX } from "@/lib/timeScale";

const LANE_H = 40;
const AXIS_H = 28;
const LABEL_W = 148;

export function Timeline({
  selectedId,
  onSelect,
  activeTheories,
  onSelectTheory,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeTheories: string[];
  onSelectTheory: (id: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ taxon: Taxon; x: number; y: number } | null>(
    null,
  );

  const height = LANES.length * LANE_H + AXIS_H + 8;
  const overlays = useMemo(
    () => theories.filter((t) => activeTheories.includes(t.id) && t.overlay),
    [activeTheories],
  );

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft = Math.max(0, TIMELINE_WIDTH * 0.42);
  }, []);

  return (
    <div className="relative min-h-[380px] flex-1">
      <div
        ref={scroller}
        className="absolute inset-0 overflow-auto timeline-scroll"
      >
        <div
          className="relative"
          style={{ width: TIMELINE_WIDTH + LABEL_W, height }}
        >
          <div className="sticky left-0 z-30 h-full w-[148px] border-r border-stone-800/80 bg-[#100e0c]/95 backdrop-blur-sm">
            {LANES.map((lane) => {
              const first = taxa.find((t) => t.lane === lane.id);
              return (
                <button
                  key={lane.id}
                  type="button"
                  onClick={() => first && onSelect(first.id)}
                  className="flex w-full items-center px-3 text-left text-[11px] font-medium tracking-wide text-stone-400 hover:text-amber-100"
                  style={{ height: LANE_H }}
                >
                  {lane.label}
                </button>
              );
            })}
          </div>

          <div
            className="absolute top-0"
            style={{ left: LABEL_W, width: TIMELINE_WIDTH, height }}
          >
            {AXIS_TICKS_KA.map((ka) => {
              const x = kaToX(ka);
              return (
                <div
                  key={ka}
                  className="pointer-events-none absolute top-0 h-full border-l border-stone-800/70"
                  style={{ left: x }}
                >
                  <span className="absolute bottom-2 left-1 font-mono text-[10px] text-stone-500">
                    {ka === 0 ? "now" : formatKa(ka)}
                  </span>
                </div>
              );
            })}

            {LANES.map((lane) => (
              <div
                key={lane.id}
                className="absolute right-0 left-0 border-b border-stone-800/40"
                style={{ top: lane.id * LANE_H + LANE_H, height: 0 }}
              />
            ))}

            {overlays.map((theory) => (
              <TheoryBand
                key={theory.id}
                theory={theory}
                onClick={() => onSelectTheory(theory.id)}
              />
            ))}

            {taxa.map((taxon) => {
              const x1 = kaToX(taxon.rangeStartKa);
              const x2 = kaToX(taxon.rangeEndKa);
              const left = Math.min(x1, x2);
              const width = Math.max(18, Math.abs(x2 - x1));
                  const top = taxon.lane * LANE_H + 4;
              const selected = selectedId === taxon.id;
              return (
                <button
                  key={taxon.id}
                  type="button"
                  onClick={() => onSelect(taxon.id)}
                  onMouseEnter={(e) => {
                    const box = e.currentTarget.getBoundingClientRect();
                    setTip({
                      taxon,
                      x: box.left + box.width / 2,
                      y: box.top,
                    });
                  }}
                  onMouseLeave={() => setTip(null)}
                  className={`absolute z-20 rounded-sm text-left transition ${
                    selected
                      ? "ring-2 ring-amber-200 ring-offset-1 ring-offset-[#100e0c]"
                      : "hover:brightness-110"
                  }`}
                  style={{
                    left,
                    top,
                    width,
                    height: 30,
                    background: taxon.color,
                    opacity: selected ? 1 : 0.92,
                    boxShadow: selected
                      ? `0 0 18px ${taxon.color}88`
                      : "0 1px 0 rgba(0,0,0,0.35)",
                  }}
                  aria-pressed={selected}
                >
                  <span
                    className="block truncate px-2 pt-1 text-[11px] font-semibold leading-none"
                    style={{ color: taxon.lane === 8 ? "#1c1612" : "#1a1410" }}
                  >
                    {shortName(taxon.name)}
                  </span>
                  <span
                    className="block truncate px-2 text-[9px] opacity-80"
                    style={{ color: taxon.lane === 8 ? "#3d3428" : "#2a2218" }}
                  >
                    {taxon.nickname ?? formatRange(taxon.rangeStartKa, taxon.rangeEndKa)}
                  </span>
                  {taxon.rangeStartUncertain ? (
                    <span className="absolute inset-y-0 left-0 w-3 bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(0,0,0,0.25)_2px,rgba(0,0,0,0.25)_4px)]" />
                  ) : null}
                  {taxon.rangeEndUncertain ? (
                    <span className="absolute inset-y-0 right-0 w-3 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.25)_2px,rgba(0,0,0,0.25)_4px)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {tip ? (
        <div
          className="pointer-events-none fixed z-40 max-w-xs rounded-md border border-stone-700 bg-[#1a1612]/95 px-3 py-2 text-xs text-stone-200 shadow-xl backdrop-blur"
          style={{ left: tip.x, top: tip.y - 8, transform: "translate(-50%, -100%)" }}
        >
          <div className="font-serif text-sm text-amber-100">{tip.taxon.name}</div>
          <div className="mt-0.5 text-stone-400">
            {formatRange(tip.taxon.rangeStartKa, tip.taxon.rangeEndKa)}
            {tip.taxon.cranialCapacityCc
              ? ` · ${tip.taxon.cranialCapacityCc[0]}–${tip.taxon.cranialCapacityCc[1]} cc`
              : ""}
          </div>
          <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-stone-300">
            {tip.taxon.summary}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function shortName(name: string): string {
  return name.replace("Australopithecus ", "Au. ").replace("Paranthropus ", "P. ").replace("Sahelanthropus ", "S. ").replace("Ardipithecus ", "Ar. ");
}

function TheoryBand({
  theory,
  onClick,
}: {
  theory: Theory;
  onClick: () => void;
}) {
  const overlay = theory.overlay;
  if (!overlay) return null;
  const x1 = kaToX(overlay.startKa);
  const x2 = kaToX(overlay.endKa);
  const left = Math.min(x1, x2);
  const width = Math.max(10, Math.abs(x2 - x1));
  const taxon = taxa.find((t) => t.id === overlay.taxonId);
  const top = taxon ? taxon.lane * LANE_H + 2 : 4;
  const covers = (theory.coversTaxonIds ?? [])
    .map((id) => taxa.find((t) => t.id === id))
    .filter(Boolean);
  const minLane = covers.length
    ? Math.min(...covers.map((t) => t!.lane))
    : taxon?.lane ?? 0;
  const maxLane = covers.length
    ? Math.max(...covers.map((t) => t!.lane))
    : taxon?.lane ?? 0;

  return (
    <>
      {covers.length > 1 ? (
        <div
          className="pointer-events-none absolute rounded-sm opacity-25"
          style={{
            left: kaToX(Math.max(...covers.map((t) => t!.rangeStartKa))),
            width: Math.max(
              8,
              kaToX(Math.min(...covers.map((t) => t!.rangeEndKa))) -
                kaToX(Math.max(...covers.map((t) => t!.rangeStartKa))),
            ),
            top: minLane * LANE_H + 4,
            height: (maxLane - minLane + 1) * LANE_H - 8,
            background: theory.color,
          }}
        />
      ) : null}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="absolute z-10 flex h-4 items-center justify-center rounded-sm border border-dashed px-1 text-[8px] font-semibold tracking-wide uppercase"
        style={{
          left,
          width: Math.max(width, 36),
          top: Math.max(0, top - 6),
          borderColor: theory.color,
          color: theory.color,
          background: `${theory.color}44`,
        }}
        title={overlay.label}
      >
        {theory.shortLabel}
      </button>
    </>
  );
}
