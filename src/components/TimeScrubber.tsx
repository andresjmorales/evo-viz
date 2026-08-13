"use client";

import { formatKa } from "@/lib/format";

export function TimeScrubber({
  ka,
  minKa,
  maxKa,
  playing,
  onChange,
  onTogglePlay,
}: {
  ka: number;
  minKa: number;
  maxKa: number;
  playing?: boolean;
  onChange: (ka: number) => void;
  onTogglePlay?: () => void;
}) {
  const visual = maxKa - (ka - minKa);

  return (
    <div className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-white px-3 py-2 shadow-sm">
      {onTogglePlay ? (
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white"
          aria-label={playing ? "Pause story" : "Play story"}
        >
          {playing ? "❚❚" : "▶"}
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
          <span>older</span>
          <span>now</span>
        </div>
        <input
          type="range"
          min={minKa}
          max={maxKa}
          value={visual}
          onChange={(e) => {
            const nextVisual = Number(e.target.value);
            onChange(maxKa - (nextVisual - minKa));
          }}
          className="time-range w-full cursor-pointer"
          aria-label="Time"
        />
      </div>
      <div className="w-20 shrink-0 text-right font-mono text-xs text-[var(--deep)]">
        {formatKa(ka)}
      </div>
    </div>
  );
}
