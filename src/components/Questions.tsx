"use client";

import { useMemo, useState } from "react";
import { claims } from "@/data/claims";
import { theories } from "@/data/theories";
import type { Claim, Status } from "@/data/types";
import { STATUS_BLURB, STATUS_LABEL, stripCites } from "@/lib/format";
import { STATUS_COLOR, THEORY_COLOR } from "@/lib/palette";
import { Methods } from "./Methods";
import { SectionHeading, StatusBadge, type OpenFn } from "./ui";

const ORDER: Status[] = ["settled", "strong", "contested", "shaky", "speculative"];

export function ClaimCard({ claim, onOpen }: { claim: Claim; onOpen: OpenFn }) {
  return (
    <button
      type="button"
      onClick={() => onOpen({ kind: "claim", id: claim.id })}
      className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#b9d3c4] hover:shadow-[0_10px_30px_-18px_rgba(6,64,43,0.45)]"
    >
      <StatusBadge status={claim.status} />
      <h3 className="display mt-3 text-[19px] leading-snug text-[var(--ink)]">{claim.question}</h3>
      <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-[var(--muted)]">{stripCites(claim.summary)}</p>
      <span className="mt-auto flex items-center justify-between pt-4 text-[12px] text-[var(--faint)]">
        <span>{claim.sourceIds.length} sources</span>
        <span className="font-medium text-[var(--green)] opacity-0 transition group-hover:opacity-100">Read the evidence →</span>
      </span>
    </button>
  );
}

export function Questions({ onOpen }: { onOpen: OpenFn }) {
  const [filter, setFilter] = useState<Status | "all">("all");
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return claims
      .filter((c) => filter === "all" || c.status === filter)
      .filter((c) => !n || c.question.toLowerCase().includes(n) || c.summary.toLowerCase().includes(n))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [filter, q]);
  const shown = all || q || filter !== "all" ? list : list.slice(0, 9);

  return (
    <section id="questions" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="Questions & evidence" title="How sure are we, really?">
        Every claim here is graded, explained, and footnoted to papers, books,
        museum collections and lectures you can check yourself.
      </SectionHeading>

      <div className="mt-8 grid gap-2 sm:grid-cols-5">
        {ORDER.map((s) => {
          const c = STATUS_COLOR[s];
          const n = claims.filter((x) => x.status === s).length;
          const on = filter === s;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(on ? "all" : s)}
              className="rounded-2xl p-3.5 text-left ring-1 ring-inset transition"
              style={{
                background: on ? c.bg : "#fff",
                boxShadow: `inset 0 0 0 ${on ? 2 : 1}px ${on ? c.dot : "var(--line)"}`,
              }}
            >
              <span className="flex items-center justify-between">
                <StatusBadge status={s} />
                <span className="text-[12px] tabular-nums text-[var(--faint)]">{n}</span>
              </span>
              <span className="mt-2 block text-[12px] leading-snug text-[var(--muted)]">{STATUS_BLURB[s]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter questions: Denisovans, fire, burial…"
          aria-label="Filter questions"
          className="w-full max-w-[380px] rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-[14px] outline-none placeholder:text-[var(--faint)] focus:border-[var(--green)]"
        />
        <span className="text-[12.5px] text-[var(--faint)]">
          {list.length} of {claims.length} questions
          {filter !== "all" ? ` graded “${STATUS_LABEL[filter]}”` : ""}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <ClaimCard key={c.id} claim={c} onOpen={onOpen} />
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="mt-6 text-[14px] text-[var(--muted)]">No question matches that filter.</p>
      ) : null}
      {shown.length < list.length ? (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="mt-6 rounded-full bg-[var(--ink)] px-5 py-2.5 text-[13.5px] font-medium text-white transition hover:bg-[var(--green-deep)]"
        >
          Show all {list.length} questions
        </button>
      ) : null}
      <Methods />
    </section>
  );
}

const TH_TICKS = [2000, 1000, 500, 300, 100, 50, 10, 0];
// A log-like scale so both one million years and six thousand years are readable.
const thX = (ka: number) =>
  Math.round((1 - Math.log10(ka + 3) / Math.log10(2003) + Math.log10(3) / Math.log10(2003)) * 1e4) / 1e4;
const pc = (v: number) => `${(v * 100).toFixed(2)}%`;

export function Theories({
  onOpen,
  activeTheories,
  onToggleTheory,
}: {
  onOpen: OpenFn;
  activeTheories: string[];
  onToggleTheory: (id: string) => void;
}) {
  const list = theories.filter((t) => t.kind !== "scientific");
  return (
    <section id="adam" className="mt-24 bg-[var(--panel)] py-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <SectionHeading kicker="Faith & science" title="Where would Adam and Eve fit?">
          Several Christian thinkers accept the science above and ask how a
          historical or archetypal Adam and Eve might fit within it. Each is a
          theological proposal laid over the timeline, graded here on how
          well its scientific footing holds.
        </SectionHeading>

        <div className="mt-9 overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
          <div className="thin-scroll overflow-x-auto">
            <div className="min-w-[720px] px-5 py-5">
              <div className="relative ml-[150px] h-5 text-[11px] tabular-nums text-[var(--faint)]">
                {TH_TICKS.map((k) => (
                  <span key={k} className="absolute -translate-x-1/2" style={{ left: pc(thX(k)) }}>
                    {k === 0 ? "now" : k >= 1000 ? `${k / 1000} Ma` : `${k} ka`}
                  </span>
                ))}
              </div>
              {list.map((t) => {
                const color = THEORY_COLOR[t.id];
                const o = t.overlay;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onOpen({ kind: "theory", id: t.id })}
                    className="group flex w-full items-center border-t border-[var(--line)] py-2.5 text-left first:border-t-0"
                  >
                    <span className="w-[150px] shrink-0 pr-3">
                      <span className="block text-[13.5px] font-semibold text-[var(--ink)] group-hover:underline">{t.shortLabel}</span>
                      <span className="block text-[11.5px] text-[var(--faint)]">{t.year ?? ""}</span>
                    </span>
                    <span className="relative h-8 flex-1">
                      {TH_TICKS.map((k) => (
                        <span key={k} className="absolute inset-y-0 w-px bg-[#edf2ee]" style={{ left: pc(thX(k)) }} />
                      ))}
                      {o ? (
                        <>
                          {t.genealogicalWave ? (
                            <span
                              className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full"
                              style={{ left: pc(thX(o.endKa)), right: 0, backgroundImage: `linear-gradient(90deg, ${color}, ${color}22)` }}
                            />
                          ) : null}
                          <span
                            className="absolute top-1/2 h-5 -translate-y-1/2 rounded-full"
                            style={{
                              left: pc(thX(o.startKa)),
                              width: pc(thX(o.endKa) - thX(o.startKa)),
                              minWidth: 20,
                              backgroundColor: color,
                            }}
                          />
                          <span
                            className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-2 text-[12px] text-[var(--muted)]"
                            style={
                              thX(o.startKa) > 0.55
                                ? { right: pc(1 - thX(o.startKa)), marginRight: 6 }
                                : { left: pc(thX(o.endKa)), marginLeft: 22 }
                            }
                          >
                            {o.kind === "band" ? "somewhere in this window" : `${o.region}`}
                          </span>
                        </>
                      ) : (
                        <span className="absolute inset-y-0 left-0 right-0 flex items-center">
                          <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: color }} />
                          <span className="bg-white px-3 text-[12px] text-[var(--muted)]">deliberately not placed on the timeline</span>
                          <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: color }} />
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => {
            const color = THEORY_COLOR[t.id];
            const on = activeTheories.includes(t.id);
            return (
              <article key={t.id} className="flex flex-col rounded-2xl border border-[var(--line)] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-medium" style={{ color }}>{t.author}{t.year ? ` · ${t.year}` : ""}</p>
                    <h3 className="display mt-1 text-[20px] leading-snug text-[var(--ink)]">{t.name}</h3>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
                <p className="mt-3 line-clamp-5 text-[13.5px] leading-relaxed text-[var(--muted)]">{t.summary}</p>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <button type="button" onClick={() => onOpen({ kind: "theory", id: t.id })} className="rounded-full bg-[var(--ink)] px-3.5 py-2 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)]">
                    Claims &amp; critiques
                  </button>
                  {t.overlay ? (
                    <a
                      href="#tree"
                      onClick={() => !on && onToggleTheory(t.id)}
                      className="rounded-full px-3.5 py-2 text-[12.5px] font-medium ring-1 ring-inset ring-[var(--line)] transition hover:ring-[var(--green)]"
                    >
                      {on ? "Shown on the tree ↑" : "Show on the tree ↑"}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
