"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LANES } from "@/data/lanes";
import { taxa } from "@/data/taxa";
import { theories } from "@/data/theories";
import type { Taxon, Theory } from "@/data/types";
import { formatKa, formatRange } from "@/lib/format";
import { taxonColor } from "@/lib/palette";
import { AXIS_TICKS_KA, TIMELINE_WIDTH, kaToX, xToKa } from "@/lib/timeScale";

const LANE_H = 40;
const AXIS_H = 28;
const LABEL_W = 148;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function Timeline({
  selectedId,
  onSelect,
  activeTheories,
  onSelectTheory,
  playheadKa,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeTheories: string[];
  onSelectTheory: (id: string) => void;
  playheadKa?: number;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const [zoom, setZoom] = useState(1);
  const [tip, setTip] = useState<{ taxon: Taxon; x: number; y: number } | null>(
    null,
  );
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  const width = TIMELINE_WIDTH * zoom;
  const height = LANES.length * LANE_H + AXIS_H + 8;
  const overlays = useMemo(
    () => theories.filter((t) => activeTheories.includes(t.id) && t.overlay),
    [activeTheories],
  );

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft = Math.max(0, TIMELINE_WIDTH * 0.42);
  }, []);

  function zoomAt(clientX: number, nextZoom: number) {
    const el = scroller.current;
    if (!el) return;
    const z = clamp(nextZoom, 0.55, 3.6);
    const rect = el.getBoundingClientRect();
    const xInContent = el.scrollLeft + (clientX - rect.left) - LABEL_W;
    const ka = xToKa(xInContent, TIMELINE_WIDTH * zoomRef.current);
    zoomRef.current = z;
    setZoom(z);
    requestAnimationFrame(() => {
      const newX = kaToX(ka, TIMELINE_WIDTH * z);
      el.scrollLeft = newX + LABEL_W - (clientX - rect.left);
    });
  }

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.12;
      zoomAt(e.clientX, zoomRef.current * factor);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinch.current) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        zoomAt(midX, pinch.current.zoom * (dist / pinch.current.dist));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div className="relative min-h-[380px] flex-1 bg-[#f7fbf7]">
      <div className="absolute right-3 top-2 z-40 flex items-center gap-1 rounded-full border border-[var(--line)] bg-white/95 px-1 py-1 text-[11px] shadow-sm">
        <button
          type="button"
          className="h-7 w-7 rounded-full hover:bg-[var(--green-soft)]"
          onClick={() => {
            const el = scroller.current;
            const mid = el ? el.getBoundingClientRect().left + el.clientWidth / 2 : 0;
            zoomAt(mid, zoomRef.current / 1.2);
          }}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="w-10 text-center font-mono text-[10px] text-[var(--muted)]">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="h-7 w-7 rounded-full hover:bg-[var(--green-soft)]"
          onClick={() => {
            const el = scroller.current;
            const mid = el ? el.getBoundingClientRect().left + el.clientWidth / 2 : 0;
            zoomAt(mid, zoomRef.current * 1.2);
          }}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
      <p className="pointer-events-none absolute bottom-2 left-[160px] z-40 text-[10px] text-[var(--muted)]">
        Pinch or Ctrl-scroll to zoom · drag to pan
      </p>
      <div
        ref={scroller}
        className="absolute inset-0 overflow-auto scroll-thin"
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            pinch.current = {
              dist: Math.hypot(dx, dy),
              zoom: zoomRef.current,
            };
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinch.current) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            zoomAt(midX, pinch.current.zoom * (dist / pinch.current.dist));
          }
        }}
        onTouchEnd={() => {
          pinch.current = null;
        }}
      >
        <div
          className="relative"
          style={{ width: width + LABEL_W, height }}
        >
          <div className="sticky left-0 z-30 h-full w-[148px] border-r border-[var(--line)] bg-[#f7fbf7]/95 backdrop-blur-sm">
            {LANES.map((lane) => {
              const first = taxa.find((t) => t.lane === lane.id);
              return (
                <button
                  key={lane.id}
                  type="button"
                  onClick={() => first && onSelect(first.id)}
                  className="flex w-full items-center px-3 text-left text-[11px] font-medium tracking-wide text-[var(--muted)] hover:text-[var(--deep)]"
                  style={{ height: LANE_H }}
                >
                  {lane.label}
                </button>
              );
            })}
          </div>

          <div
            className="absolute top-0"
            style={{ left: LABEL_W, width, height }}
          >
            {AXIS_TICKS_KA.map((tick) => {
              const x = kaToX(tick, width);
              return (
                <div
                  key={tick}
                  className="pointer-events-none absolute top-0 h-full border-l border-[#d7e6db]"
                  style={{ left: x }}
                >
                  <span className="absolute bottom-2 left-1 font-mono text-[10px] text-[var(--muted)]">
                    {tick === 0 ? "now" : formatKa(tick)}
                  </span>
                </div>
              );
            })}

            {LANES.map((lane) => (
              <div
                key={lane.id}
                className="absolute right-0 left-0 border-b border-[#e3eee6]"
                style={{ top: lane.id * LANE_H + LANE_H, height: 0 }}
              />
            ))}

            {overlays.map((theory) => (
              <TheoryBand
                key={theory.id}
                theory={theory}
                width={width}
                onClick={() => onSelectTheory(theory.id)}
              />
            ))}

            {playheadKa !== undefined ? (
              <div
                className="pointer-events-none absolute top-0 z-30 h-full border-l-2 border-dashed border-[var(--deep)]"
                style={{ left: kaToX(playheadKa, width) }}
              />
            ) : null}

            {taxa.map((taxon) => {
              const x1 = kaToX(taxon.rangeStartKa, width);
              const x2 = kaToX(taxon.rangeEndKa, width);
              const left = Math.min(x1, x2);
              const barWidth = Math.max(18, Math.abs(x2 - x1));
              const top = taxon.lane * LANE_H + 4;
              const selected = selectedId === taxon.id;
              const color = taxonColor(taxon);
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
                  className={`absolute z-20 rounded-full text-left transition ${
                    selected ? "ring-2 ring-[var(--deep)] ring-offset-2" : "hover:brightness-105"
                  }`}
                  style={{
                    left,
                    top,
                    width: barWidth,
                    height: 30,
                    background: color,
                    opacity: selected ? 1 : 0.92,
                  }}
                  aria-pressed={selected}
                >
                  <span className="block truncate px-2.5 pt-1 text-[11px] font-semibold leading-none text-white">
                    {shortName(taxon.name)}
                  </span>
                  <span className="block truncate px-2.5 text-[9px] text-white/80">
                    {taxon.nickname ?? formatRange(taxon.rangeStartKa, taxon.rangeEndKa)}
                  </span>
                  {taxon.rangeStartUncertain ? (
                    <span className="absolute inset-y-0 left-0 w-3 rounded-l-full bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,rgba(255,255,255,0.35)_2px,rgba(255,255,255,0.35)_4px)]" />
                  ) : null}
                  {taxon.rangeEndUncertain ? (
                    <span className="absolute inset-y-0 right-0 w-3 rounded-r-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.35)_2px,rgba(255,255,255,0.35)_4px)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {tip ? (
        <div
          className="pointer-events-none fixed z-40 max-w-xs rounded-2xl border border-[var(--line)] bg-white px-3 py-2 text-xs text-[var(--ink)] shadow-xl"
          style={{ left: tip.x, top: tip.y - 8, transform: "translate(-50%, -100%)" }}
        >
          <div className="font-serif text-sm italic">{tip.taxon.name}</div>
          <div className="mt-0.5 text-[var(--muted)]">
            {formatRange(tip.taxon.rangeStartKa, tip.taxon.rangeEndKa)}
            {tip.taxon.cranialCapacityCc
              ? ` · ${tip.taxon.cranialCapacityCc[0]}–${tip.taxon.cranialCapacityCc[1]} cc`
              : ""}
          </div>
          <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-[var(--muted)]">
            {tip.taxon.summary}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function shortName(name: string): string {
  return name
    .replace("Australopithecus ", "Au. ")
    .replace("Paranthropus ", "P. ")
    .replace("Sahelanthropus ", "S. ")
    .replace("Ardipithecus ", "Ar. ");
}

function TheoryBand({
  theory,
  width,
  onClick,
}: {
  theory: Theory;
  width: number;
  onClick: () => void;
}) {
  const overlay = theory.overlay;
  if (!overlay) return null;
  const x1 = kaToX(overlay.startKa, width);
  const x2 = kaToX(overlay.endKa, width);
  const left = Math.min(x1, x2);
  const bandWidth = Math.max(10, Math.abs(x2 - x1));
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
          className="pointer-events-none absolute rounded-md opacity-20"
          style={{
            left: kaToX(Math.max(...covers.map((t) => t!.rangeStartKa)), width),
            width: Math.max(
              8,
              kaToX(Math.min(...covers.map((t) => t!.rangeEndKa)), width) -
                kaToX(Math.max(...covers.map((t) => t!.rangeStartKa)), width),
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
        className="absolute z-10 flex h-4 items-center justify-center rounded-full border border-dashed px-1 text-[8px] font-semibold tracking-wide uppercase"
        style={{
          left,
          width: Math.max(bandWidth, 36),
          top: Math.max(0, top - 6),
          borderColor: theory.color,
          color: theory.color,
          background: `${theory.color}22`,
        }}
        title={overlay.label}
      >
        {theory.shortLabel}
      </button>
    </>
  );
}
