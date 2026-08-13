"use client";

import { theories } from "@/data/theories";

export function TheoryToggles({
  active,
  onToggle,
}: {
  active: string[];
  onToggle: (id: string) => void;
}) {
  const overlays = theories.filter((t) => t.id !== "consensus");
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
        Overlays
      </span>
      {overlays.map((t) => {
        const on = active.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            aria-pressed={on}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
              on
                ? "border-transparent text-stone-950"
                : "border-stone-700/80 bg-stone-950/40 text-stone-400 hover:border-stone-500 hover:text-stone-200"
            }`}
            style={
              on
                ? { background: t.color, boxShadow: `0 0 0 1px ${t.color}` }
                : undefined
            }
          >
            {t.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
