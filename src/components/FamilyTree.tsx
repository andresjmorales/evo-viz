"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CULTURE_ROWS, culture } from "@/data/culture";
import { LANES } from "@/data/lanes";
import { GENE_FLOW } from "@/data/story";
import { taxa } from "@/data/taxa";
import { theories } from "@/data/theories";
import { formatKa, formatRange } from "@/lib/format";
import { CLIMATE_START_KA, D18O_SERIES, d18o, seaLevel } from "@/lib/climate";
import { LANE_COLORS, THEORY_COLOR, taxonColor } from "@/lib/palette";
import { kaToX, xToKa } from "@/lib/timeScale";
import { timeStore, useKa } from "@/lib/timeStore";
import { useMeasure } from "@/lib/useMeasure";
import { SectionHeading, type OpenFn } from "./ui";

const ROW = 30;
const TOP = 34;
const BAR = 14;
const MAX_ZOOM = 14;

const ordered = [...taxa].sort(
  (a, b) => a.lane - b.lane || b.rangeStartKa - a.rangeStartKa,
);
const rowOf = Object.fromEntries(ordered.map((t, i) => [t.id, i]));
const SPECIES_BOTTOM = TOP + ordered.length * ROW;
const CROW = 24;
const CULTURE_TOP = SPECIES_BOTTOM + 12;
const CLIMATE_TOP = CULTURE_TOP + CULTURE_ROWS.length * CROW + 12;
const CLIMATE_H = 58;
const HEIGHT = CLIMATE_TOP + CLIMATE_H + 8;
const cultureY = (row: number) => CULTURE_TOP + row * CROW + CROW / 2;
const CULTURE_INK = "#3b4a5a";
/** Rows covered by the group label that starts at row r. */
const groupSpan = (r: number) => {
  let n = 1;
  while (r + n < CULTURE_ROWS.length && !CULTURE_ROWS[r + n]) n++;
  return n;
};
const rowY = (i: number) => TOP + i * ROW + ROW / 2;

const TICKS = [
  7000, 6000, 5000, 4000, 3000, 2500, 2000, 1500, 1000, 800, 600, 400, 300,
  200, 150, 100, 75, 50, 40, 30, 20, 10, 5, 0,
];

const PRESETS: { label: string; from: number }[] = [
  { label: "All 7 million years", from: 7200 },
  { label: "Last 2 million", from: 2000 },
  { label: "Last 500,000", from: 500 },
  { label: "Last 100,000", from: 100 },
];

export function FamilyTree({
  onOpen,
  selectedId,
  activeTheories,
  onToggleTheory,
}: {
  onOpen: OpenFn;
  selectedId: string | null;
  activeTheories: string[];
  onToggleTheory: (id: string) => void;
}) {
  const ka = useKa();
  const [wrapRef, wrapW] = useMeasure<HTMLDivElement>();
  const scroller = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const labelW = wrapW < 640 ? 0 : 148;
  const base = Math.max(300, wrapW - labelW - 2);
  const W = base * zoom;
  const x = useCallback((k: number) => kaToX(k, W - 24) + 12, [W]);

  const applyZoom = useCallback(
    (next: number, anchorPx?: number) => {
      const el = scroller.current;
      if (!el) return;
      const z = Math.min(MAX_ZOOM, Math.max(1, next));
      const a = anchorPx ?? el.clientWidth / 2;
      const frac = (el.scrollLeft + a) / (base * zoomRef.current);
      zoomRef.current = z;
      setZoom(z);
      requestAnimationFrame(() => {
        el.scrollLeft = frac * base * z - a;
      });
    },
    [base],
  );

  const showFrom = (from: number) => {
    const el = scroller.current;
    if (!el) return;
    const f = kaToX(from, 1);
    const z = Math.min(MAX_ZOOM, 1 / Math.max(0.02, 1 - f));
    zoomRef.current = z;
    setZoom(z);
    requestAnimationFrame(() => {
      el.scrollTo({ left: f * base * z, behavior: "smooth" });
    });
  };

  // Ctrl/⌘ + wheel and two-finger pinch zoom around the pointer.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let pinch: { d: number; z: number } | null = null;
    const wheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      applyZoom(zoomRef.current * Math.exp(-e.deltaY * 0.01), e.clientX - r.left);
    };
    const dist = (e: TouchEvent) =>
      Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    const start = (e: TouchEvent) => {
      if (e.touches.length === 2) pinch = { d: dist(e), z: zoomRef.current };
    };
    const move = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinch) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const mid = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left;
      applyZoom(pinch.z * (dist(e) / pinch.d), mid);
    };
    const end = () => {
      pinch = null;
    };
    el.addEventListener("wheel", wheel, { passive: false });
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    return () => {
      el.removeEventListener("wheel", wheel);
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
    };
  }, [applyZoom]);

  const ticks = useMemo(() => {
    const out: number[] = [];
    let last = -Infinity;
    for (const k of TICKS) {
      const px = x(k);
      if (px - last >= 62) {
        out.push(k);
        last = px;
      }
    }
    return out;
  }, [x]);

  // Tools and behaviour: place each label beside its mark where there is room.
  const cultureMarks = useMemo(() => {
    const rows = CULTURE_ROWS.map((_, r) =>
      culture
        .filter((c) => c.row === r)
        .map((c) => {
          const point = c.startKa === c.endKa;
          const x0 = x(c.startKa) - (point ? 6 : 0);
          const x1 = point ? x(c.startKa) + 6 : Math.max(x(c.endKa), x0 + 8);
          return { c, point, x0, x1, w: c.label.length * 5.8, labelX: null as number | null, anchor: "start" as "start" | "end" | "middle" };
        })
        .sort((a, b) => a.x0 - b.x0),
    );
    for (const row of rows) {
      let busyUntil = 0;
      row.forEach((m, i) => {
        const next = row[i + 1];
        if (m.x1 + 8 + m.w < (next ? next.x0 - 6 : W - 4)) {
          m.labelX = m.x1 + 7;
          busyUntil = m.x1 + 8 + m.w;
        } else if (m.x0 - 8 - m.w > busyUntil) {
          m.labelX = m.x0 - 7;
          m.anchor = "end";
          busyUntil = m.x1;
        } else {
          // No room beside it: sit the label on the bar if the bar is long enough.
          if (!m.point && m.x1 - m.x0 > m.w + 12) {
            m.labelX = (m.x0 + m.x1) / 2;
            m.anchor = "middle";
          }
          busyUntil = m.x1;
        }
      });
    }
    return rows.flat();
  }, [x, W]);

  // The oxygen-isotope climate curve, warm at the top.
  const climate = useMemo(() => {
    const yOf = (v: number) => CLIMATE_TOP + 6 + ((v - 2.6) / (5.1 - 2.6)) * (CLIMATE_H - 12);
    let d = "";
    let lastPx = -1;
    for (let i = D18O_SERIES.length - 1; i >= 0; i--) {
      const [t, v] = D18O_SERIES[i];
      const px = x(t);
      if (px - lastPx < 0.7 && i !== 0) continue;
      d += `${d ? "L" : "M"}${px.toFixed(1)} ${yOf(v).toFixed(1)}`;
      lastPx = px;
    }
    return { d, yOf };
  }, [x]);
  const nowD18o = d18o(ka);

  const overlays = theories.filter((t) => t.overlay && activeTheories.includes(t.id));
  // Extra rows under the tree for overlay name tags, so they never cover a bar.
  const svgH = HEIGHT + (overlays.length ? Math.min(3, overlays.length) * 24 + 8 : 0);
  const laneSpans = LANES.map((l) => {
    const rows = ordered.map((t, i) => (t.lane === l.id ? i : -1)).filter((i) => i >= 0);
    return { lane: l, first: rows[0], count: rows.length };
  });

  const seekFromEvent = (clientX: number) => {
    const el = scroller.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    timeStore.pause();
    timeStore.setKa(xToKa(clientX - r.left + el.scrollLeft - 12, W - 24));
  };

  return (
    <section id="tree" className="mt-24 bg-[var(--panel)] py-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHeading kicker="The family tree" title="Every species, on one timeline">
          Each bar is a species, placed where its fossils are dated. Beneath
          them run the tools and behaviours people left behind, and the
          planet’s climate. Click anything to read about it, zoom in on the
          crowded last half-million years, or switch on a model of Adam and
          Eve to see where it would sit.
        </SectionHeading>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-white p-1 ring-1 ring-[var(--line)]">
            {PRESETS.map((p) => {
              const active = Math.abs(zoom - 1 / Math.max(0.02, 1 - kaToX(p.from, 1))) < 0.02;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => showFrom(p.from)}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
                    active ? "bg-[var(--ink)] text-white" : "text-[var(--muted)] hover:bg-[var(--green-soft)]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-[var(--line)]">
            <button type="button" aria-label="Zoom out" onClick={() => applyZoom(zoom / 1.5)} className="grid h-7 w-7 place-items-center rounded-full text-[16px] text-[var(--muted)] hover:bg-[var(--green-soft)]">−</button>
            <span className="w-11 text-center text-[11.5px] tabular-nums text-[var(--faint)]">{zoom.toFixed(1)}×</span>
            <button type="button" aria-label="Zoom in" onClick={() => applyZoom(zoom * 1.5)} className="grid h-7 w-7 place-items-center rounded-full text-[16px] text-[var(--muted)] hover:bg-[var(--green-soft)]">+</button>
          </div>
          <span className="hidden text-[12px] text-[var(--faint)] md:inline">Pinch, or hold Ctrl/⌘ and scroll, to zoom</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12.5px] font-medium text-[var(--muted)]">Overlay a model of Adam &amp; Eve</span>
          {theories
            .filter((t) => t.kind !== "scientific")
            .map((t) => {
              const on = activeTheories.includes(t.id);
              const color = THEORY_COLOR[t.id];
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggleTheory(t.id)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium ring-1 transition"
                  style={
                    on
                      ? { background: color, color: "#fff", boxShadow: "none" }
                      : { background: "#fff", color: "var(--ink)", boxShadow: "inset 0 0 0 1px var(--line)" }
                  }
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: on ? "#fff" : color }} />
                  {t.shortLabel}
                </button>
              );
            })}
        </div>

        <div ref={wrapRef} className="mt-5 flex overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
          {labelW ? (
            <div className="relative shrink-0 border-r border-[var(--line)]" style={{ width: labelW, height: svgH }}>
              {laneSpans.map(({ lane, first, count }) => (
                <div
                  key={lane.id}
                  className="absolute left-0 right-0 flex items-center gap-2 pl-4 pr-2"
                  style={{ top: TOP + first * ROW, height: count * ROW }}
                >
                  <span className="w-[3px] self-stretch rounded-full" style={{ background: LANE_COLORS[lane.id].ink, margin: "5px 0" }} />
                  <span className="text-[12px] font-semibold leading-tight text-[var(--ink)]">{lane.label}</span>
                </div>
              ))}
              {CULTURE_ROWS.map((label, r) =>
                label ? (
                  <div key={label} className="absolute left-0 right-0 flex items-center gap-2 pl-4 pr-2" style={{ top: CULTURE_TOP + r * CROW, height: CROW * groupSpan(r) }}>
                    <span className="w-[3px] self-stretch rounded-full" style={{ background: CULTURE_INK, margin: "5px 0" }} />
                    <span className="text-[12px] font-semibold leading-tight text-[var(--ink)]">{label}</span>
                  </div>
                ) : null,
              )}
              <div className="absolute left-0 right-0 flex items-center gap-2 pl-4 pr-2" style={{ top: CLIMATE_TOP, height: CLIMATE_H }}>
                <span className="w-[3px] self-stretch rounded-full bg-[#2a78e4]" style={{ margin: "5px 0" }} />
                <span className="text-[12px] leading-tight">
                  <span className="font-semibold text-[var(--ink)]">Global climate</span>
                  <span className="block text-[10.5px] text-[var(--faint)]">warm ↑ · ice age ↓</span>
                </span>
              </div>
            </div>
          ) : null}
          <div ref={scroller} className="thin-scroll relative min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
            {wrapW ? (
              <svg
                width={W}
                height={svgH}
                className="block select-none"
                onClick={(e) => {
                  if ((e.target as Element).closest("[data-hit]")) return;
                  seekFromEvent(e.clientX);
                }}
              >
                <defs>
                  <pattern id="uncertain" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="2.4" height="5" fill="#fff" opacity="0.55" />
                  </pattern>
                </defs>
                {laneSpans.map(({ lane, first, count }) =>
                  lane.id % 2 === 0 ? (
                    <rect key={lane.id} x={0} y={TOP + first * ROW} width={W} height={count * ROW} fill="#f8fbf9" />
                  ) : null,
                )}
                {ticks.map((k) => (
                  <g key={k}>
                    <line x1={x(k)} x2={x(k)} y1={TOP - 6} y2={HEIGHT} stroke="#e9f0eb" />
                    <text
                      x={x(k)}
                      y={18}
                      fontSize="11"
                      fill="#8a9a91"
                      textAnchor={k === 0 ? "end" : "middle"}
                      className="tabular-nums"
                    >
                      {k === 0 ? "now" : formatKa(k)}
                    </text>
                  </g>
                ))}

                {overlays.map((t) => {
                  const o = t.overlay!;
                  const color = THEORY_COLOR[t.id];
                  const x0 = x(o.startKa);
                  const x1 = Math.max(x(o.endKa), x0 + 7);
                  const r = o.taxonId ? rowOf[o.taxonId] : undefined;
                  return (
                    <g key={t.id} data-hit role="button" tabIndex={0} className="cursor-pointer outline-none"
                      onClick={() => onOpen({ kind: "theory", id: t.id })}
                      onKeyDown={(e) => e.key === "Enter" && onOpen({ kind: "theory", id: t.id })}>
                      <title>{o.label}</title>
                      <rect x={x0} y={TOP - 6} width={x1 - x0} height={HEIGHT - TOP + 6} fill={color} opacity={0.13} />
                      <line x1={x0} x2={x0} y1={TOP - 6} y2={HEIGHT} stroke={color} strokeWidth={1.2} strokeDasharray="4 3" />
                      <line x1={x1} x2={x1} y1={TOP - 6} y2={HEIGHT} stroke={color} strokeWidth={1.2} strokeDasharray="4 3" />
                      {t.genealogicalWave && r !== undefined ? (
                        <path
                          d={`M${x1} ${rowY(r)} L${x(0)} ${TOP} L${x(0)} ${SPECIES_BOTTOM} Z`}
                          fill={color}
                          opacity={0.14}
                        />
                      ) : null}
                      {r !== undefined ? (
                        <rect x={x0 - 3} y={rowY(r) - 12} width={x1 - x0 + 6} height={24} rx={7} fill="none" stroke={color} strokeWidth={2.2} />
                      ) : null}
                    </g>
                  );
                })}

                {ordered.map((t) => {
                  if (!t.parentId) return null;
                  const p = taxa.find((q) => q.id === t.parentId);
                  if (!p) return null;
                  const xc = x(t.rangeStartKa);
                  const xp = Math.min(Math.max(x(p.rangeStartKa) + 6, xc - 26), x(p.rangeEndKa));
                  const y0 = rowY(rowOf[p.id]);
                  const y1 = rowY(rowOf[t.id]);
                  return (
                    <path
                      key={t.id}
                      d={`M${xp} ${y0} C ${xp} ${(y0 + y1) / 2}, ${xc - 18} ${y1}, ${xc} ${y1}`}
                      fill="none"
                      stroke="#b4c5bb"
                      strokeWidth={1.3}
                      strokeDasharray="3 3"
                    />
                  );
                })}

                {ordered.map((t, i) => {
                  const x0 = x(t.rangeStartKa);
                  const x1 = Math.max(x(t.rangeEndKa), x0 + 8);
                  const y = rowY(i);
                  const color = taxonColor(t.id);
                  const labelLeft = x1 > W - 190;
                  const selected = selectedId === t.id;
                  const fuzz = Math.min(14, (x1 - x0) * 0.3);
                  return (
                    <g
                      key={t.id}
                      data-hit
                      role="button"
                      tabIndex={0}
                      aria-label={`${t.name}, ${formatRange(t.rangeStartKa, t.rangeEndKa)}`}
                      onClick={() => onOpen({ kind: "taxon", id: t.id })}
                      onKeyDown={(e) => e.key === "Enter" && onOpen({ kind: "taxon", id: t.id })}
                      className="group cursor-pointer outline-none"
                    >
                      <title>{`${t.name} · ${formatRange(t.rangeStartKa, t.rangeEndKa)}`}</title>
                      <rect x={0} y={y - ROW / 2} width={W} height={ROW} fill="transparent" className="group-hover:fill-[#0c9a5610] group-focus-visible:fill-[#0c9a5618]" />
                      {selected ? (
                        <rect x={x0 - 4} y={y - BAR / 2 - 4} width={x1 - x0 + 8} height={BAR + 8} rx={(BAR + 8) / 2} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
                      ) : null}
                      <rect x={x0} y={y - BAR / 2} width={x1 - x0} height={BAR} rx={BAR / 2} fill={color} />
                      {t.rangeStartUncertain ? (
                        <rect x={x0} y={y - BAR / 2} width={fuzz} height={BAR} rx={BAR / 2} fill="url(#uncertain)" />
                      ) : null}
                      {t.rangeEndUncertain ? (
                        <rect x={x1 - fuzz} y={y - BAR / 2} width={fuzz} height={BAR} rx={BAR / 2} fill="url(#uncertain)" />
                      ) : null}
                      <text
                        x={labelLeft ? x0 - 8 : x1 + 8}
                        y={y + 4}
                        textAnchor={labelLeft ? "end" : "start"}
                        fontSize="12.5"
                        fontStyle="italic"
                        fontWeight={selected ? 700 : 500}
                        fill="#0d2118"
                        stroke="#fff"
                        strokeWidth={3.5}
                        paintOrder="stroke"
                        className="group-hover:underline"
                      >
                        {t.name}
                      </text>
                    </g>
                  );
                })}

                <line x1={0} x2={W} y1={SPECIES_BOTTOM + 5} y2={SPECIES_BOTTOM + 5} stroke="#dde7e0" />
                {cultureMarks.map(({ c, point, x0, x1, labelX, anchor }) => {
                  const y = cultureY(c.row);
                  const cx = x(c.startKa);
                  return (
                    <g
                      key={c.id}
                      data-hit
                      role="button"
                      tabIndex={0}
                      aria-label={c.label}
                      onClick={() => onOpen({ kind: "culture", id: c.id })}
                      onKeyDown={(e) => e.key === "Enter" && onOpen({ kind: "culture", id: c.id })}
                      className="group cursor-pointer outline-none"
                    >
                      <title>{c.label}</title>
                      <rect x={x0 - 4} y={y - CROW / 2} width={x1 - x0 + 8 + (labelX !== null && anchor === "start" ? c.label.length * 6.1 + 8 : 0)} height={CROW} fill="transparent" />
                      {point ? (
                        <path d={`M${cx} ${y - 6} l6 6 l-6 6 l-6 -6 z`} fill={CULTURE_INK} className="group-hover:fill-[var(--green)] group-focus-visible:fill-[var(--green)]" />
                      ) : (
                        <rect x={x0} y={y - 4} width={x1 - x0} height={8} rx={4} fill={CULTURE_INK} opacity={0.82} className="group-hover:fill-[var(--green)] group-hover:opacity-100 group-focus-visible:fill-[var(--green)]" />
                      )}
                      {labelX !== null && anchor === "middle" ? (
                        <rect x={labelX - c.label.length * 2.95 - 6} y={y - 8} width={c.label.length * 5.9 + 12} height={16} rx={8} fill="#fff" />
                      ) : null}
                      {labelX !== null ? (
                        <text x={labelX} y={y + 4} textAnchor={anchor} fontSize="11.5" fill="#0d2118" stroke="#fff" strokeWidth={anchor === "middle" ? 0 : 3} paintOrder="stroke" className="group-hover:underline">
                          {c.label}
                        </text>
                      ) : null}
                    </g>
                  );
                })}

                <g
                  data-hit
                  role="button"
                  tabIndex={0}
                  aria-label="Global climate record"
                  className="cursor-pointer outline-none"
                  onClick={() => onOpen({ kind: "claim", id: "climate-driver" })}
                  onKeyDown={(e) => e.key === "Enter" && onOpen({ kind: "claim", id: "climate-driver" })}
                >
                  <title>Deep-sea oxygen isotopes: a record of global ice volume and temperature</title>
                  <rect x={0} y={CLIMATE_TOP} width={W} height={CLIMATE_H} fill="#f3f7fd" />
                  {x(CLIMATE_START_KA) > 150 ? (
                    <text x={x(CLIMATE_START_KA) - 10} y={CLIMATE_TOP + CLIMATE_H / 2 + 4} textAnchor="end" fontSize="10.5" fill="#8a9a91">
                      record starts here
                    </text>
                  ) : null}
                  <path d={climate.d} fill="none" stroke="#2a78e4" strokeWidth={1.3} strokeLinejoin="round" />
                  {nowD18o !== null ? (
                    <>
                      <circle cx={x(ka)} cy={climate.yOf(nowD18o)} r={3.5} fill="#fff" stroke="#2a78e4" strokeWidth={2} />
                      <text
                        x={x(ka) + (x(ka) > W - 150 ? -8 : 8)}
                        y={CLIMATE_TOP + 12}
                        textAnchor={x(ka) > W - 150 ? "end" : "start"}
                        fontSize="10.5"
                        fill="#2a5fb0"
                        stroke="#f3f7fd"
                        strokeWidth={3}
                        paintOrder="stroke"
                      >
                        sea level {Math.round(seaLevel(ka) / 5) * 5 > 0 ? "+" : ""}
                        {Math.round(seaLevel(ka) / 5) * 5} m
                      </text>
                    </>
                  ) : null}
                </g>

                {GENE_FLOW.map((g) => {
                  const gx = x(g.ka);
                  const ya = rowY(rowOf[g.a]);
                  const yb = rowY(rowOf[g.b]);
                  return (
                    <g key={g.id} data-hit role="button" tabIndex={0} className="cursor-pointer outline-none [&:hover_circle]:r-[6px]"
                      onClick={() => onOpen({ kind: "claim", id: g.claimId })}
                      onKeyDown={(e) => e.key === "Enter" && onOpen({ kind: "claim", id: g.claimId })}>
                      <title>{g.label}</title>
                      <line x1={gx} x2={gx} y1={ya} y2={yb} stroke="transparent" strokeWidth={14} />
                      <line x1={gx} x2={gx} y1={ya} y2={yb} stroke="#0d2118" strokeWidth={1.6} strokeDasharray="2 3" />
                      <circle cx={gx} cy={ya} r={4.5} fill="#fff" stroke="#0d2118" strokeWidth={1.6} />
                      <circle cx={gx} cy={yb} r={4.5} fill="#fff" stroke="#0d2118" strokeWidth={1.6} />
                    </g>
                  );
                })}

                {overlays.map((t, i) => {
                  const o = t.overlay!;
                  const color = THEORY_COLOR[t.id];
                  const cx = (x(o.startKa) + Math.max(x(o.endKa), x(o.startKa) + 7)) / 2;
                  const text = `${t.shortLabel}: Adam & Eve`;
                  const tw = text.length * 6.3 + 18;
                  const lx = Math.min(Math.max(cx - tw / 2, 4), W - tw - 4);
                  const ly = HEIGHT + 4 + (i % 3) * 24;
                  return (
                    <g key={t.id} data-hit className="cursor-pointer" onClick={() => onOpen({ kind: "theory", id: t.id })}>
                      <rect x={lx} y={ly} width={tw} height={20} rx={10} fill={color} />
                      <text x={lx + tw / 2} y={ly + 14} textAnchor="middle" fontSize="11.5" fontWeight={600} fill="#fff">
                        {text}
                      </text>
                    </g>
                  );
                })}

                <g
                  data-hit
                  className="cursor-ew-resize"
                  onPointerDown={(e) => {
                    (e.currentTarget as Element).setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if ((e.currentTarget as Element).hasPointerCapture(e.pointerId)) seekFromEvent(e.clientX);
                  }}
                >
                  <line x1={x(ka)} x2={x(ka)} y1={TOP - 8} y2={HEIGHT} stroke="#0d2118" strokeWidth={1.4} />
                  <line x1={x(ka)} x2={x(ka)} y1={0} y2={HEIGHT} stroke="transparent" strokeWidth={18} />
                  <path d={`M${x(ka) - 7} ${TOP - 14} h14 v6 l-7 7 l-7 -7 z`} fill="#0d2118" />
                </g>
              </svg>
            ) : (
              <div style={{ height: HEIGHT }} />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-[var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <svg width="34" height="10"><path d="M1 5 H33" stroke="#b4c5bb" strokeWidth="1.3" strokeDasharray="3 3" /></svg>
            proposed descent (a hypothesis)
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="14" height="22"><line x1="7" x2="7" y1="4" y2="18" stroke="#0d2118" strokeWidth="1.6" strokeDasharray="2 3" /><circle cx="7" cy="4" r="3.2" fill="#fff" stroke="#0d2118" strokeWidth="1.4" /><circle cx="7" cy="18" r="3.2" fill="#fff" stroke="#0d2118" strokeWidth="1.4" /></svg>
            interbreeding shown by DNA
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="30" height="12"><rect x="0" y="1" width="30" height="10" rx="5" fill="#6f7c90" /><rect x="0" y="1" width="12" height="10" rx="5" fill="url(#uncertain)" /></svg>
            striped end: date is uncertain
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="12" height="14"><path d="M0 0 h12 v5 l-6 6 l-6 -6 z" fill="#0d2118" /></svg>
            the moment shown on the globe ({formatKa(ka)}). Drag it, or click anywhere.
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="30" height="14"><path d="M9 1 l6 6 l-6 6 l-6 -6 z" fill="#3b4a5a" /><rect x="18" y="3" width="12" height="8" rx="4" fill="#3b4a5a" /></svg>
            a dated find, and a lasting tradition
          </span>
        </div>
      </div>
    </section>
  );
}
