"use client";

import { useEffect, useRef, useState } from "react";
import { QUARTZITE, centroid, clipPoly, polyPath, tone, type Pt } from "@/lib/facets";
import { Stone } from "./ToolArt";

/**
 * Knapping, one blow at a time: a cobble becomes an Oldowan chopper and then
 * an Acheulean handaxe. Each blow removes the stone outside a line, which is
 * a fair cartoon of how a flake comes off. The view is of one face only.
 */

const CENTER: Pt = [100, 110];

const COBBLE: Pt[] = Array.from({ length: 40 }, (_, i) => {
  const a = (i / 40) * Math.PI * 2;
  const k = 1 + 0.035 * Math.sin(3 * a + 1) + 0.025 * Math.cos(5 * a + 2);
  return [100 + Math.cos(a) * 78 * k, 106 + Math.sin(a) * 88 * k] as Pt;
});

/** Each blow removes whatever lies beyond the line a→b. */
const BLOWS: [Pt, Pt][] = [
  // three blows along one edge: a chopper
  [[88, 14], [150, 52]],
  [[140, 40], [170, 95]],
  [[112, 14], [55, 45]],
  // then round both edges toward a point: a handaxe
  [[100, 22], [128, 60]],
  [[72, 60], [100, 22]],
  [[128, 60], [146, 100]],
  [[54, 100], [72, 60]],
  [[146, 100], [148, 135]],
  [[52, 135], [54, 100]],
  [[148, 135], [135, 165]],
  [[65, 165], [52, 135]],
];

const CHOPPER_AT = 3;
const DONE = BLOWS.length;

function build() {
  const cores: { poly: Pt[]; flags: boolean[] }[] = [{ poly: COBBLE, flags: COBBLE.map(() => false) }];
  const flakes: { poly: Pt[]; hit: Pt; out: Pt }[] = [];
  BLOWS.forEach(([a, b], i) => {
    const prev = cores[i];
    const kept = clipPoly(prev.poly, prev.flags, a, b, CENTER);
    const off = clipPoly(prev.poly, prev.flags, a, b, CENTER, false);
    const chord = kept.chord ?? [a, b];
    const hit: Pt = [(chord[0][0] + chord[1][0]) / 2, (chord[0][1] + chord[1][1]) / 2];
    const len = Math.hypot(hit[0] - CENTER[0], hit[1] - CENTER[1]) || 1;
    const out: Pt = [(hit[0] - CENTER[0]) / len, (hit[1] - CENTER[1]) / len];
    cores.push({ poly: kept.poly, flags: kept.flags });
    flakes.push({ poly: off.poly, hit, out });
  });
  return { cores, flakes };
}

const BUILT = build();

const STAGES: { until: number; name: string; text: string }[] = [
  { until: 0, name: "A river cobble", text: "Start with a rounded cobble of fine-grained stone and a harder stone to hit it with." },
  { until: CHOPPER_AT - 1, name: "First flakes", text: "A blow just inside the edge, at the right angle, splits off a flake with a razor edge. Hit the wrong spot and nothing useful happens." },
  { until: CHOPPER_AT, name: "Oldowan chopper", text: "Three blows along one edge. The flakes are the knives; the core, with its jagged edge, will break bone and chop wood. This is the toolkit of 2.6 million years ago." },
  { until: DONE - 1, name: "Shaping", text: "Now the knapper works round both edges toward a point. Each blow is chosen for the shape it leaves behind, not for the flake it removes." },
  { until: DONE, name: "Acheulean handaxe", text: "A symmetrical tool made to a plan held in the mind, first seen 1.76 million years ago. The rounded butt keeps the cobble’s skin as a grip. A real one is flaked on both faces and takes many more blows than shown here." },
];

export function Knapping({ compact = false }: { compact?: boolean }) {
  const { cores, flakes } = BUILT;
  const [n, setN] = useState(0);
  const [swing, setSwing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  const strike = () => {
    if (busy.current || n >= DONE) return;
    busy.current = true;
    setSwing(true);
    timers.current.push(
      window.setTimeout(() => {
        setN((v) => Math.min(DONE, v + 1));
        setSwing(false);
        busy.current = false;
      }, 180),
    );
  };

  useEffect(() => {
    if (!playing) return;
    if (n >= DONE) {
      const t = window.setTimeout(() => setPlaying(false), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(strike, n === CHOPPER_AT ? 2200 : 950);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, n]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const core = cores[n];
  const stage = STAGES.find((s) => n <= s.until)!;
  const next = flakes[Math.min(n, DONE - 1)];
  const reach = swing ? 15 : 62;
  const hammer: Pt = swing
    ? [next.hit[0] + next.out[0] * reach, next.hit[1] + next.out[1] * reach]
    : [
        Math.min(196, Math.max(18, next.hit[0] + next.out[0] * reach)),
        Math.min(194, Math.max(18, next.hit[1] + next.out[1] * reach)),
      ];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white">
      <div className="relative">
        <svg viewBox="0 0 320 212" className="block w-full rounded-t-2xl bg-[var(--panel)]" role="img" aria-label={`Knapping: ${stage.name}, blow ${n} of ${DONE}`}>
          <defs>
            <linearGradient id="ta-shade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="kn-hammer" cx="0.35" cy="0.3">
              <stop offset="0" stopColor="#a9afb5" />
              <stop offset="1" stopColor="#5d646c" />
            </radialGradient>
          </defs>
          <ellipse cx={100} cy={198} rx={66} ry={6} fill="#0d2118" opacity={0.12} />
          <text x={262} y={20} textAnchor="middle" fontSize="9" fill="#6b7a71">
            flakes struck off: {n}
          </text>
          {/* flakes already struck, lying in a pile */}
          {flakes.slice(0, n).map((f, i) => {
            const c = centroid(f.poly);
            const slot: Pt = [232 + (i % 3) * 30, 48 + Math.floor(i / 3) * 40];
            const big = Math.max(...f.poly.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1])));
            const sc = Math.min(1, 15 / big);
            return (
              <g
                key={i}
                className="knap-flake"
                style={{
                  transformOrigin: `${c[0]}px ${c[1]}px`,
                  ["--t" as string]: `translate(${slot[0] - c[0]}px, ${slot[1] - c[1]}px) rotate(${70 + i * 47}deg) scale(${sc})`,
                }}
              >
                <path d={polyPath(f.poly)} fill={tone(QUARTZITE, 12)} stroke="#2b3440" strokeWidth={1.1 / sc} strokeLinejoin="round" />
                <path d={polyPath(f.poly)} fill="url(#ta-shade)" />
              </g>
            );
          })}
          <Stone
            outline={core.poly}
            spine={[[100, 62], [100, 150]]}
            stone={QUARTZITE}
            base="#b29c7c"
            knapped={core.flags}
            scar={24}
            depth={0.7}
            seed={9}
            speckle
            speckleBox={[20, 180, 16, 196]}
          />
          {/* the hammerstone */}
          <g
            className={`knap-hammer ${swing ? "" : "back"}`}
            style={{ transform: `translate(${hammer[0]}px, ${hammer[1]}px)`, opacity: n >= DONE ? 0 : 1 }}
          >
            <ellipse rx={15} ry={13} fill="url(#kn-hammer)" stroke="#2b3440" strokeWidth={1.1} />
            <ellipse cx={-4} cy={-4} rx={5} ry={3.4} fill="#fff" opacity={0.3} />
          </g>
          {swing ? (
            <g stroke="#e0a200" strokeWidth={2} strokeLinecap="round">
              {[-0.9, 0, 0.9].map((r) => {
                const ang = Math.atan2(next.out[1], next.out[0]) + Math.PI / 2 + r * 0.5;
                const s = r === 0 ? 0 : Math.sign(r);
                const bx = next.hit[0] + Math.cos(ang) * 10 * (s || 1);
                const by = next.hit[1] + Math.sin(ang) * 10 * (s || 1);
                return r === 0 ? null : <line key={r} x1={bx} y1={by} x2={bx + Math.cos(ang) * 9 * s} y2={by + Math.sin(ang) * 9 * s} />;
              })}
            </g>
          ) : null}
        </svg>
        <span className="absolute left-3 top-2.5 rounded-full bg-white/85 px-2.5 py-1 text-[11.5px] font-semibold text-[var(--ink)]">
          {stage.name}
        </span>
      </div>
      <div className="p-4">
        <p className={`text-[13.5px] leading-relaxed text-[var(--muted)] ${compact ? "min-h-[84px]" : "min-h-[66px]"}`}>{stage.text}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              strike();
            }}
            disabled={n >= DONE}
            className="rounded-full bg-[var(--ink)] px-4 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)] disabled:opacity-40"
          >
            Strike
          </button>
          <button
            type="button"
            onClick={() => {
              if (n >= DONE) setN(0);
              setPlaying((p) => !p);
            }}
            className="rounded-full bg-[var(--panel)] px-4 py-1.5 text-[12.5px] font-medium text-[var(--ink)] transition hover:bg-[var(--line)]"
          >
            {playing ? "Pause" : n >= DONE ? "Watch again" : "Play"}
          </button>
          {n > 0 ? (
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setN(0);
              }}
              className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-[var(--muted)] transition hover:bg-[var(--panel)]"
            >
              Start over
            </button>
          ) : null}
          <span className="ml-auto text-[12px] tabular-nums text-[var(--faint)]">
            blow {n} of {DONE}
          </span>
        </div>
      </div>
    </div>
  );
}
