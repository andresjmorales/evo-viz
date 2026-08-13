"use client";

import { theories } from "@/data/theories";

export function TheoryToggles({
  active,
  onToggle,
  onOpen,
}: {
  active: string[];
  onToggle: (id: string) => void;
  onOpen?: (id: string) => void;
}) {
  const overlays = theories.filter((t) => t.id !== "consensus");
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        Overlays
      </span>
      {overlays.map((t) => {
        const on = active.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={(e) => {
              if (e.shiftKey && onOpen) onOpen(t.id);
              else onToggle(t.id);
            }}
            aria-pressed={on}
            className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
              on
                ? "border-transparent text-[#163226]"
                : "border-[var(--line)] bg-white text-[var(--muted)] hover:border-[var(--green)] hover:text-[var(--deep)]"
            }`}
            title={`${on ? "Hide" : "Show"} ${t.name}. Shift-click opens the notebook.`}
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
