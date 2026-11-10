"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { getTaxon } from "@/data/catalog";
import { claims } from "@/data/claims";
import { culture } from "@/data/culture";
import { sites } from "@/data/fossils";
import { taxa } from "@/data/taxa";
import type { Status } from "@/data/types";
import { formatKa, formatRange, STATUS_LABEL, stripCites } from "@/lib/format";
import { skullParams } from "@/lib/skull";
import { SectionHeading, shortName, type OpenFn, type PanelTarget } from "./ui";

const SkullViewer = dynamic(() => import("./SkullViewer"), { ssr: false });

interface Question {
  kind: string;
  prompt: string;
  skull?: string;
  options: string[];
  answer: number;
  explain: string;
  more?: PanelTarget;
}

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];
function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function withOptions(correct: string, wrong: string[]): { options: string[]; answer: number } {
  const options = shuffle([correct, ...shuffle(wrong).slice(0, 3)]);
  return { options, answer: options.indexOf(correct) };
}

const SKULL_POOL = ["afarensis", "boisei", "habilis", "erectus", "floresiensis", "heidelbergensis", "neanderthal", "sapiens"];
const STATUSES: Status[] = ["settled", "strong", "contested", "shaky", "speculative"];

const makers: (() => Question | null)[] = [
  // Whose skull is this?
  () => {
    const id = pick(SKULL_POOL);
    const t = getTaxon(id)!;
    return {
      kind: "Name the skull",
      prompt: "Whose skull is this? Drag it to look around.",
      skull: id,
      ...withOptions(t.name, SKULL_POOL.filter((x) => x !== id).map((x) => getTaxon(x)!.name)),
      explain: stripCites(t.anatomy),
      more: { kind: "taxon", id },
    };
  },
  // Which appeared first?
  () => {
    const a = pick(taxa);
    const pool = taxa.filter((t) => Math.abs(t.rangeStartKa - a.rangeStartKa) > 400);
    if (!pool.length) return null;
    const b = pick(pool);
    const first = a.rangeStartKa > b.rangeStartKa ? a : b;
    const options = shuffle([a.name, b.name]);
    return {
      kind: "Put them in order",
      prompt: "Which of these appears first in the fossil record?",
      options,
      answer: options.indexOf(first.name),
      explain: `${shortName(a.name)} dates to ${formatRange(a.rangeStartKa, a.rangeEndKa)}; ${shortName(b.name)} to ${formatRange(b.rangeStartKa, b.rangeEndKa)}.`,
      more: { kind: "taxon", id: first.id },
    };
  },
  // Who was alive then?
  () => {
    const ka = pick([3200, 1800, 1500, 600, 300, 100, 45]);
    const alive = taxa.filter((t) => ka <= t.rangeStartKa && ka >= t.rangeEndKa);
    const dead = taxa.filter((t) => ka > t.rangeStartKa + 150 || ka < t.rangeEndKa - 30);
    if (!alive.length || dead.length < 3) return null;
    const c = pick(alive);
    return {
      kind: "Who was there?",
      prompt: `Which of these was alive ${formatKa(ka).replace("ka", "thousand years ago").replace("Ma", "million years ago")}?`,
      ...withOptions(c.name, dead.map((t) => t.name)),
      explain: `${c.name} is dated to ${formatRange(c.rangeStartKa, c.rangeEndKa)}. Alive at that moment: ${alive.map((t) => shortName(t.name)).join(", ")}.`,
      more: { kind: "taxon", id: c.id },
    };
  },
  // Where was it found?
  () => {
    const s = pick(sites.filter((x) => x.taxonIds.length === 1));
    const t = getTaxon(s.taxonIds[0]);
    if (!t) return null;
    return {
      kind: "Place the fossil",
      prompt: `Fossils of which species come from ${s.name}?`,
      ...withOptions(t.name, taxa.filter((x) => x.id !== t.id && !x.sites.includes(s.id)).map((x) => x.name)),
      explain: `${s.name} is one of the sites for ${t.name}, found in ${t.regions.join(", ")}.`,
      more: { kind: "taxon", id: t.id },
    };
  },
  // How settled is it?
  () => {
    const c = pick(claims);
    const options = STATUSES.map((s) => STATUS_LABEL[s]);
    return {
      kind: "Grade the claim",
      prompt: `How firmly is this answered? “${c.question}”`,
      options,
      answer: STATUSES.indexOf(c.status),
      explain: c.statusRationale,
      more: { kind: "claim", id: c.id },
    };
  },
  // Which came first, tools and behaviour
  () => {
    const a = pick(culture);
    const pool = culture.filter((c) => Math.abs(c.startKa - a.startKa) > 60);
    if (!pool.length) return null;
    const b = pick(pool);
    const first = a.startKa > b.startKa ? a : b;
    const options = shuffle([a.label, b.label]);
    return {
      kind: "Which came first?",
      prompt: "Which of these shows up earlier in the archaeological record?",
      options,
      answer: options.indexOf(first.label),
      explain: `${a.label}: from about ${formatKa(a.startKa)}. ${b.label}: from about ${formatKa(b.startKa)}.`,
      more: { kind: "culture", id: first.id },
    };
  },
];

const ROUND = 8;

function makeRound(): Question[] {
  const out: Question[] = [];
  const order = shuffle([0, 1, 2, 3, 4, 5, 0, 2, 4, 3, 1, 5]);
  for (const i of order) {
    if (out.length >= ROUND) break;
    const q = makers[i]();
    if (q && !out.some((o) => o.prompt === q.prompt && o.skull === q.skull)) out.push(q);
  }
  return out;
}

export function Quiz({ onOpen }: { onOpen: OpenFn }) {
  const [round, setRound] = useState<Question[] | null>(null);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const start = () => {
    setRound(makeRound());
    setI(0);
    setChosen(null);
    setScore(0);
  };
  const q = round?.[i];
  const done = round && i >= round.length;

  return (
    <section id="quiz" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="Test yourself" title="How much of it stuck?">
        Eight questions drawn at random from everything on this page: skulls
        to identify, species to put in order, fossils to place, and claims to
        grade. Every answer links back to the evidence.
      </SectionHeading>

      <div className="mt-9 overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
        {!round ? (
          <div className="stage grid place-items-center px-6 py-16 text-center">
            <button type="button" onClick={start} className="rounded-full bg-[var(--ink)] px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-[var(--green-deep)]">
              Start a round
            </button>
            <p className="mt-4 text-[13px] text-[var(--muted)]">No sign-in and no score kept. A new set every time.</p>
          </div>
        ) : done ? (
          <div className="stage grid place-items-center px-6 py-16 text-center">
            <p className="display text-[56px] leading-none text-[var(--ink)]">
              {score}
              <span className="text-[28px] text-[var(--faint)]"> / {round.length}</span>
            </p>
            <p className="mt-3 max-w-[420px] text-[15px] text-[var(--muted)]">
              {score === round.length
                ? "A clean sweep."
                : score >= round.length - 2
                  ? "Strong. The ones you missed are worth a second look."
                  : score >= round.length / 2
                    ? "A solid start. The family tree and the skull lab are good places to shore things up."
                    : "This is hard material. Play the story again, then come back."}
            </p>
            <button type="button" onClick={start} className="mt-6 rounded-full bg-[var(--ink)] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-[var(--green-deep)]">
              Another round
            </button>
          </div>
        ) : q ? (
          <div className={`grid ${q.skull ? "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : ""}`}>
            {q.skull ? (
              <div className="stage">
                <SkullViewer key={`${i}-${q.skull}`} items={[{ key: q.skull, params: skullParams(q.skull) }]} className="h-[260px] md:h-full md:min-h-[380px]" />
              </div>
            ) : null}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3 text-[12px] text-[var(--faint)]">
                <span className="kicker text-[var(--green)]">{q.kind}</span>
                <span className="tabular-nums">
                  Question {i + 1} of {round.length} · {score} right
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--panel)]">
                <div className="h-full rounded-full bg-[var(--green)] transition-all" style={{ width: `${(i / round.length) * 100}%` }} />
              </div>
              <h3 className="display mt-5 text-[24px] leading-snug text-[var(--ink)]">{q.prompt}</h3>
              <div className={`mt-5 grid gap-2 ${q.options.length > 4 ? "sm:grid-cols-5" : "sm:grid-cols-2"}`}>
                {q.options.map((o, k) => {
                  const answered = chosen !== null;
                  const right = k === q.answer;
                  const mine = k === chosen;
                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={answered}
                      onClick={() => {
                        setChosen(k);
                        if (right) setScore((s) => s + 1);
                      }}
                      className={`rounded-2xl px-4 py-3 text-left text-[14.5px] ring-1 ring-inset transition ${
                        !answered
                          ? "bg-white text-[var(--ink)] ring-[var(--line)] hover:ring-[var(--green)]"
                          : right
                            ? "bg-[var(--green-soft)] font-semibold text-[#0a6b3c] ring-[var(--green)]"
                            : mine
                              ? "bg-[#fde8dc] text-[#a2441a] ring-[#e8703a]"
                              : "bg-white text-[var(--faint)] ring-[var(--line)]"
                      } ${q.kind === "Grade the claim" ? "" : "italic"}`}
                    >
                      {o}
                      {answered && right ? " ✓" : answered && mine ? " ✗" : ""}
                    </button>
                  );
                })}
              </div>
              {chosen !== null ? (
                <div className="fade-up mt-5">
                  <p className="text-[14px] leading-relaxed text-[var(--muted)]">
                    <strong className="font-semibold text-[var(--ink)]">{chosen === q.answer ? "Right. " : "Not quite. "}</strong>
                    {q.explain}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setI((n) => n + 1);
                        setChosen(null);
                      }}
                      className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-[13.5px] font-medium text-white transition hover:bg-[var(--green-deep)]"
                    >
                      {i + 1 === round.length ? "See your score" : "Next question"}
                    </button>
                    {q.more ? (
                      <button type="button" onClick={() => onOpen(q.more!)} className="rounded-full px-4 py-2.5 text-[13.5px] font-medium text-[var(--green)] ring-1 ring-inset ring-[var(--line)] transition hover:ring-[var(--green)]">
                        Read the evidence
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
