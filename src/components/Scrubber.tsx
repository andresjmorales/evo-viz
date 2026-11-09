"use client";

import { useRef } from "react";
import { CHAPTERS, chapterIndexForKa } from "@/data/story";
import { taxa } from "@/data/taxa";
import { formatKa, timeParts } from "@/lib/format";
import { taxonGlow } from "@/lib/palette";
import { kaToX, xToKa } from "@/lib/timeScale";
import { timeStore, useKa, usePlaying } from "@/lib/timeStore";

const TICKS = [7000, 5000, 3000, 2000, 1000, 400, 200, 100, 50, 20, 0];
const pc = (ka: number) => `${kaToX(ka, 100).toFixed(2)}%`;
const ROW = 3.2;
const MAP_H = taxa.length * ROW + 4;

/** The time control: a miniature family tree you drag a playhead across. */
export function Scrubber() {
  const ka = useKa();
  const playing = usePlaying();
  const track = useRef<HTMLDivElement>(null);
  const pct = Number(kaToX(ka, 100).toFixed(2));
  const chapter = chapterIndexForKa(ka);
  const { value, unit } = timeParts(ka);

  const seek = (clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r) return;
    timeStore.pause();
    timeStore.setKa(xToKa(clientX - r.left, r.width));
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
      <div className="flex shrink-0 items-center gap-4 sm:w-[236px]">
        <button
          type="button"
          onClick={() => timeStore.toggle()}
          aria-label={playing ? "Pause" : "Play through time"}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[var(--hero)] shadow-[0_0_0_6px_rgba(143,240,189,0.14)] transition hover:scale-105 hover:bg-white"
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2.5" y="2" width="4" height="12" rx="1" /><rect x="9.5" y="2" width="4" height="12" rx="1" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.3v11.4a.8.8 0 0 0 1.2.7l9.3-5.7a.8.8 0 0 0 0-1.4L5.2 1.6A.8.8 0 0 0 4 2.3Z" /></svg>
          )}
        </button>
        <div className="leading-none">
          <div className="display text-[34px] tabular-nums text-white">{value}</div>
          <div className="mt-1.5 text-[12px] text-white/60">{unit || "the present day"}</div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative mb-1.5 h-6">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              title={c.title}
              aria-label={`Chapter ${i + 1}: ${c.title}`}
              onClick={() => {
                timeStore.pause();
                timeStore.setKa(c.ka);
              }}
              style={{ left: pc(c.ka) }}
              className={`absolute top-0 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full text-[11px] font-semibold transition ${
                i === chapter
                  ? "bg-[var(--mint)] text-[var(--hero)]"
                  : i < chapter
                    ? "bg-white/25 text-white hover:bg-white/40"
                    : "bg-white/10 text-white/60 hover:bg-white/25"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div
          ref={track}
          role="slider"
          tabIndex={0}
          aria-label="Time"
          aria-valuemin={0}
          aria-valuemax={7200}
          aria-valuenow={Math.round(ka)}
          aria-valuetext={formatKa(ka)}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            seek(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.buttons || e.pointerType === "touch") {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) seek(e.clientX);
            }
          }}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 0.05 : 0.01;
            const t = kaToX(ka, 1);
            if (e.key === "ArrowRight") timeStore.setKa(xToKa(t + step, 1));
            else if (e.key === "ArrowLeft") timeStore.setKa(xToKa(t - step, 1));
            else if (e.key === " ") timeStore.toggle();
            else return;
            e.preventDefault();
          }}
          className="relative cursor-ew-resize touch-none select-none rounded-xl bg-white/[0.06] px-0 py-2 ring-1 ring-white/10"
          style={{ height: MAP_H + 16 }}
        >
          <svg
            viewBox={`0 0 1000 ${MAP_H}`}
            preserveAspectRatio="none"
            className="block h-full w-full"
            aria-hidden
          >
            {taxa.map((t, i) => (
              <line
                key={t.id}
                x1={kaToX(t.rangeStartKa, 1000)}
                x2={Math.max(kaToX(t.rangeEndKa, 1000), kaToX(t.rangeStartKa, 1000) + 3)}
                y1={i * ROW + 3}
                y2={i * ROW + 3}
                stroke={taxonGlow(t.id)}
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 rounded-r-xl bg-[#04241a]/60"
            style={{ left: `${pct}%` }}
          />
          <div
            className="pointer-events-none absolute inset-y-[-5px] w-[2px] -translate-x-1/2 rounded bg-white"
            style={{ left: `${pct}%` }}
          >
            <span className="absolute -bottom-[7px] left-1/2 h-[14px] w-[14px] -translate-x-1/2 rounded-full border-[3px] border-white bg-[var(--green-bright)] shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
          </div>
        </div>
        <div className="relative mt-3 h-4 text-[10.5px] tabular-nums text-white/45">
          {TICKS.map((k) => (
            <span
              key={k}
              className={`absolute ${k === 0 ? "-translate-x-full" : k === 7000 ? "" : "-translate-x-1/2"} ${
                k === 50 ? "hidden xl:inline" : k === 5000 || k === 400 || k === 20 || k === 200 ? "hidden sm:inline" : ""
              }`}
              style={{ left: pc(k) }}
            >
              {k === 0 ? "now" : formatKa(k)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
