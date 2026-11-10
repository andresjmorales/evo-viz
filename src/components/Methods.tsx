"use client";

import { methods } from "@/data/methods";
import { Ref } from "./Popups";

/** Primers on how the evidence is produced, shown under the graded questions. */
export function Methods() {
  return (
    <div id="methods" className="mt-20 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="display text-[26px] text-[var(--ink)]">How do we know any of this?</h3>
        <p className="max-w-[460px] text-[13px] text-[var(--faint)]">
          Ten short primers on the methods behind the claims, each with real studies from this site as worked examples.
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {methods.map((m, i) => (
          <Ref
            key={m.id}
            target={{ kind: "method", id: m.id }}
            plain
            className="group flex h-full cursor-pointer flex-col rounded-2xl border border-[var(--line)] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--green)]"
          >
            <span className="display text-[13px] tabular-nums text-[var(--green)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="mt-1.5 block text-[14.5px] font-semibold leading-snug text-[var(--ink)]">{m.title}</span>
            <span className="mt-1.5 block text-[12.5px] leading-relaxed text-[var(--muted)]">{m.short}</span>
          </Ref>
        ))}
      </div>
    </div>
  );
}
