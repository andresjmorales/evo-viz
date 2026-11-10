"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Rich } from "./Popups";
import { SectionHeading } from "./ui";

// ---------- shared ----------

/** Small seeded generator so first paint matches between server and browser. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Panel({
  step,
  title,
  lede,
  children,
  note,
}: {
  step: string;
  title: string;
  lede: string;
  children: ReactNode;
  note: string;
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6">
      <p className="kicker text-[var(--green)]">{step}</p>
      <h3 className="display mt-1.5 text-[24px] leading-tight text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--muted)]">
        <Rich text={lede} />
      </p>
      <div className="mt-4 flex-1">{children}</div>
      <p className="mt-4 border-t border-[var(--line)] pt-3 text-[13px] leading-relaxed text-[var(--muted)]">
        <Rich text={note} />
      </p>
    </article>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
        on ? "bg-[var(--ink)] text-white" : "bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

// ---------- 1. mutation ----------

const CODONS = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
const BASES = "TCAG";
const AMINO: Record<string, string> = {
  F: "Phe", L: "Leu", S: "Ser", Y: "Tyr", C: "Cys", W: "Trp", P: "Pro", H: "His", Q: "Gln", R: "Arg",
  I: "Ile", M: "Met", T: "Thr", N: "Asn", K: "Lys", V: "Val", A: "Ala", D: "Asp", E: "Glu", G: "Gly", "*": "Stop",
};
function translate(seq: string): string[] {
  const out: string[] = [];
  for (let i = 0; i + 3 <= seq.length; i += 3) {
    const c = CODONS[BASES.indexOf(seq[i]) * 16 + BASES.indexOf(seq[i + 1]) * 4 + BASES.indexOf(seq[i + 2])];
    out.push(AMINO[c]);
  }
  return out;
}

/** The opening of the human beta-globin gene (HBB), which builds part of haemoglobin. */
const HBB = "ATGGTGCATCTGACTCCTGAGGAGAAGTCT";
const BASE_COLOR: Record<string, string> = { A: "#0c9a56", T: "#e2562d", G: "#2a78e4", C: "#c58a09" };

type MutKind = "none" | "silent" | "swap" | "insert" | "delete";
const MUTATIONS: Record<MutKind, { label: string; seq: string; at: number[]; text: string }> = {
  none: { label: "Faithful copy", seq: HBB, at: [], text: "Nearly every letter is copied correctly. The protein is unchanged." },
  silent: {
    label: "One letter, no effect",
    seq: HBB.slice(0, 11) + "A" + HBB.slice(12),
    at: [11],
    text: "G became A, but both spellings code for the same amino acid (leucine). Most mutations are like this, or fall outside genes altogether, and have no effect.",
  },
  swap: {
    label: "One letter, new protein",
    seq: HBB.slice(0, 19) + "T" + HBB.slice(20),
    at: [19],
    text: "A became T, and glutamate became valine. This exact change is the sickle-cell variant: one letter out of three billion.",
  },
  insert: {
    label: "Insertion",
    seq: HBB.slice(0, 13) + "G" + HBB.slice(13, 29),
    at: [13],
    text: "An extra letter shifts the reading frame, so every amino acid after it is different. Changes like this usually wreck the protein.",
  },
  delete: {
    label: "Deletion",
    seq: HBB.slice(0, 13) + HBB.slice(14) + "G",
    at: [13],
    text: "A missing letter shifts the frame the other way, with the same drastic result downstream.",
  },
};

function MutationLab() {
  const [kind, setKind] = useState<MutKind>("swap");
  const [shown, setShown] = useState(HBB.length);
  const m = MUTATIONS[kind];
  const before = translate(HBB);
  const after = translate(m.seq);

  // Replay the copying sweep whenever a different outcome is chosen.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= HBB.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [kind]);

  const row = (seq: string, marks: number[], limit: number, dim = false) => (
    <div className="flex">
      {seq.split("").map((b, i) => (
        <span
          key={i}
          className={`grid h-7 flex-1 place-items-center font-mono text-[13px] font-semibold transition-opacity duration-150 ${
            i % 3 === 0 && i ? "ml-[3px]" : ""
          } ${marks.includes(i) ? "rounded-md text-white" : ""}`}
          style={{
            color: marks.includes(i) ? "#fff" : BASE_COLOR[b],
            background: marks.includes(i) ? "#0d2118" : undefined,
            opacity: i < limit ? (dim ? 0.55 : 1) : 0,
          }}
        >
          {b}
        </span>
      ))}
    </div>
  );
  const aminoRow = (list: string[], compare: string[] | null, limit: number) => (
    <div className="flex">
      {list.map((a, i) => {
        const changed = compare ? compare[i] !== a : false;
        return (
          <span
            key={i}
            className={`ml-[3px] flex-1 rounded-md py-1 text-center text-[10.5px] font-medium transition first:ml-0 ${
              changed ? "bg-[#fde8dc] text-[#a2441a]" : "bg-[var(--panel)] text-[var(--muted)]"
            }`}
            style={{ opacity: (i + 1) * 3 <= limit ? 1 : 0.15 }}
          >
            {a}
          </span>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(MUTATIONS) as MutKind[]).map((k) => (
          <Pill
            key={k}
            on={kind === k}
            onClick={() => {
              setShown(0);
              setKind(k);
            }}
          >
            {MUTATIONS[k].label}
          </Pill>
        ))}
      </div>
      <div className="mt-4 space-y-1.5" aria-live="polite">
        <p className="text-[11px] text-[var(--faint)]">Original DNA, read three letters at a time</p>
        {row(HBB, [], HBB.length, true)}
        {aminoRow(before, null, HBB.length)}
        <p className="pt-2 text-[11px] text-[var(--faint)]">The copy passed to the next generation</p>
        {row(m.seq, m.at, shown)}
        {aminoRow(after, before, shown)}
      </div>
      <p className="mt-3 min-h-[60px] text-[13.5px] leading-relaxed text-[var(--ink)]">{m.text}</p>
    </div>
  );
}

// ---------- 2. inheritance ----------

type Geno = "AA" | "AS" | "SS";
const GENO_INFO: Record<Geno, { label: string; color: string; text: string }> = {
  AA: { label: "AA", color: "#2a78e4", text: "Typical haemoglobin. No protection from malaria." },
  AS: { label: "AS", color: "#0c9a56", text: "Carrier. Healthy, and resistant to severe malaria." },
  SS: { label: "SS", color: "#e2562d", text: "Sickle-cell disease." },
};
const sortGeno = (a: string, b: string): Geno => [a, b].sort().join("") as Geno;

function PunnettLab() {
  const [p1, setP1] = useState<Geno>("AS");
  const [p2, setP2] = useState<Geno>("AS");
  const [kids, setKids] = useState<Geno[]>([]);
  const g1 = p1.split("");
  const g2 = p2.split("");
  const cells = g2.flatMap((b) => g1.map((a) => sortGeno(a, b)));
  const counts = (["AA", "AS", "SS"] as Geno[]).map((g) => ({ g, n: cells.filter((c) => c === g).length }));
  const key = p1 + p2;

  const choose = (set: (g: Geno) => void, cur: Geno, who: string) => (
    <div className="flex items-center gap-1.5">
      <span className="w-[58px] text-[12px] text-[var(--muted)]">{who}</span>
      {(["AA", "AS", "SS"] as Geno[]).map((g) => (
        <Pill
          key={g}
          on={cur === g}
          onClick={() => {
            set(g);
            setKids([]);
          }}
        >
          {g}
        </Pill>
      ))}
    </div>
  );

  return (
    <div>
      <div className="space-y-1.5">
        {choose(setP1, p1, "Mother")}
        {choose(setP2, p2, "Father")}
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-5">
        <div key={key} className="grid grid-cols-[28px_1fr_1fr] grid-rows-[28px_1fr_1fr] gap-1.5">
          <span />
          {g1.map((a, i) => (
            <span key={`m${i}`} className="pop grid place-items-center rounded-lg bg-[var(--panel)] font-mono text-[14px] font-semibold text-[var(--ink)]" style={{ animationDelay: `${i * 80}ms` }}>
              {a}
            </span>
          ))}
          {g2.map((b, r) => [
            <span key={`f${r}`} className="pop grid place-items-center rounded-lg bg-[var(--panel)] font-mono text-[14px] font-semibold text-[var(--ink)]" style={{ animationDelay: `${160 + r * 80}ms` }}>
              {b}
            </span>,
            ...g1.map((a, c) => {
              const g = sortGeno(a, b);
              return (
                <span
                  key={`c${r}${c}`}
                  className="pop grid aspect-square place-items-center rounded-xl font-mono text-[17px] font-bold text-white"
                  style={{ background: GENO_INFO[g].color, animationDelay: `${340 + (r * 2 + c) * 110}ms` }}
                >
                  {g}
                </span>
              );
            }),
          ])}
        </div>
        <div className="space-y-2">
          {counts.map(({ g, n }) => (
            <div key={g} className={n ? "" : "opacity-35"}>
              <div className="flex items-baseline justify-between text-[12.5px]">
                <span className="font-mono font-bold" style={{ color: GENO_INFO[g].color }}>{g}</span>
                <span className="tabular-nums text-[var(--muted)]">{n * 25}% chance per child</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[var(--panel)]">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${n * 25}%`, background: GENO_INFO[g].color }} />
              </div>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--faint)]">{GENO_INFO[g].text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setKids(Array.from({ length: 12 }, () => cells[Math.floor(Math.random() * 4)]))}
          className="rounded-full bg-[var(--panel)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] ring-1 ring-inset ring-[var(--line)] transition hover:ring-[var(--green)]"
        >
          Have twelve children
        </button>
        <span className="flex min-h-[22px] flex-wrap gap-1">
          {kids.map((g, i) => (
            <span key={i} className="pop h-[18px] w-[18px] rounded-full" title={g} style={{ background: GENO_INFO[g].color, animationDelay: `${i * 40}ms` }} />
          ))}
        </span>
        {kids.length ? (
          <span className="text-[12px] text-[var(--faint)]">
            {(["AA", "AS", "SS"] as Geno[]).map((g) => `${kids.filter((k) => k === g).length} ${g}`).join(" · ")}. Real families rarely match the odds exactly.
          </span>
        ) : null}
      </div>
    </div>
  );
}

// ---------- 3. natural selection ----------

interface Bug {
  id: number;
  x: number;
  y: number;
  shade: number;
  dead: boolean;
}
const N_BUGS = 44;
const shadeColor = (s: number) => {
  const l = 86 - s * 64;
  return `hsl(${38 - s * 14} ${34 + s * 14}% ${l}%)`;
};
function freshBugs(r: () => number, start: number): Bug[] {
  return Array.from({ length: N_BUGS }, (_, i) => ({
    id: start + i,
    x: 4 + r() * 92,
    y: 10 + r() * 80,
    shade: Math.min(1, Math.max(0, 0.5 + (r() - 0.5) * 0.9)),
    dead: false,
  }));
}

function SelectionLab() {
  const [bugs, setBugs] = useState<Bug[]>(() => freshBugs(rng(11), 0));
  const [env, setEnv] = useState(0.85);
  const [gen, setGen] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const envRef = useRef(env);
  const bugsRef = useRef(bugs);
  const idRef = useRef(N_BUGS);
  useEffect(() => {
    envRef.current = env;
  }, [env]);
  useEffect(() => {
    bugsRef.current = bugs;
  }, [bugs]);

  const mean = bugs.reduce((s, b) => s + b.shade, 0) / bugs.length;

  useEffect(() => {
    if (!playing) return;
    let breed = 0;
    const tick = window.setInterval(() => {
      // Predators take the half that stands out most against the ground.
      const scored = bugsRef.current
        .map((b) => ({ b, s: Math.abs(b.shade - envRef.current) + Math.random() * 0.22 }))
        .sort((a, b) => a.s - b.s);
      const keep = new Set(scored.slice(0, N_BUGS / 2).map((x) => x.b.id));
      const culled = bugsRef.current.map((b) => ({ ...b, dead: !keep.has(b.id) }));
      bugsRef.current = culled;
      setBugs(culled);
      breed = window.setTimeout(() => {
        // Each survivor leaves two offspring that resemble it, with small differences.
        const next = bugsRef.current
          .filter((b) => !b.dead)
          .flatMap((p) =>
            [0, 1].map(() => ({
              id: idRef.current++,
              x: 4 + Math.random() * 92,
              y: 10 + Math.random() * 80,
              shade: Math.min(1, Math.max(0, p.shade + (Math.random() - 0.5) * 0.14)),
              dead: false,
            })),
          );
        bugsRef.current = next;
        setBugs(next);
        setHistory((h) => [...h.slice(-59), next.reduce((s, b) => s + b.shade, 0) / next.length]);
        setGen((g) => g + 1);
      }, 520);
    }, 1150);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(breed);
    };
  }, [playing]);

  const reset = () => {
    setPlaying(false);
    idRef.current = N_BUGS;
    setBugs(freshBugs(rng(11), 0));
    setGen(0);
    setHistory([]);
  };

  return (
    <div>
      <div
        className="relative h-[170px] overflow-hidden rounded-2xl transition-colors duration-700"
        style={{ background: shadeColor(env) }}
        role="img"
        aria-label={`A population of beetles on ${env > 0.5 ? "dark" : "pale"} ground, generation ${gen}`}
      >
        {bugs.map((b) => (
          <span
            key={b.id}
            className="absolute h-[13px] w-[17px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] transition-all duration-500"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              background: shadeColor(b.shade),
              boxShadow: "0 0 0 1px rgba(13,33,24,0.28)",
              opacity: b.dead ? 0 : 1,
              transform: `translate(-50%,-50%) scale(${b.dead ? 0.3 : 1})`,
            }}
          />
        ))}
        <span className="absolute left-3 top-2 rounded-full bg-white/75 px-2 py-0.5 text-[11px] tabular-nums text-[var(--ink)]">
          Generation {gen}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPlaying((p) => !p)} className="rounded-full bg-[var(--ink)] px-4 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)]">
          {playing ? "Pause" : gen ? "Continue" : "Let the birds hunt"}
        </button>
        <button type="button" onClick={() => setEnv((e) => (e > 0.5 ? 0.15 : 0.85))} className="rounded-full bg-[var(--panel)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] ring-1 ring-inset ring-[var(--line)] transition hover:ring-[var(--green)]">
          Change the ground to {env > 0.5 ? "pale sand" : "dark soil"}
        </button>
        <button type="button" onClick={reset} className="px-2 text-[12.5px] text-[var(--faint)] hover:text-[var(--ink)] hover:underline">
          Reset
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="w-[108px] shrink-0 text-[11.5px] leading-tight text-[var(--faint)]">Average colour of the population</span>
        <div className="relative h-9 flex-1 overflow-hidden rounded-lg" style={{ background: "linear-gradient(180deg, hsl(24 48% 22%), hsl(38 34% 86%))" }}>
          <svg viewBox="0 0 60 1" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <polyline
              points={[...history, mean].map((v, i, a) => `${(i / Math.max(1, a.length - 1)) * 60},${1 - v}`).join(" ")}
              fill="none"
              stroke="#fff"
              strokeWidth={2.2}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ---------- 4. drift ----------

function DriftLab() {
  const [size, setSize] = useState(20);
  const [edge, setEdge] = useState(0);
  const [seed, setSeed] = useState(3);
  const GENS = 100;
  const runs = useMemo(() => {
    const r = rng(seed * 7919 + size * 31 + edge);
    const gauss = () => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
    return Array.from({ length: 8 }, () => {
      let p = edge ? 0.1 : 0.5;
      const line = [p];
      for (let g = 0; g < GENS; g++) {
        const s = edge / 100;
        const w = (p * (1 + s)) / (p * (1 + s) + (1 - p));
        const n = 2 * size;
        let k = 0;
        if (n > 300) k = Math.round(n * w + gauss() * Math.sqrt(n * w * (1 - w)));
        else for (let i = 0; i < n; i++) if (r() < w) k++;
        p = Math.min(1, Math.max(0, k / n));
        line.push(p);
      }
      return line;
    });
  }, [size, edge, seed]);
  const fixed = runs.filter((l) => l[GENS] === 1).length;
  const lost = runs.filter((l) => l[GENS] === 0).length;
  const COLORS = ["#2a78e4", "#0c9a56", "#e2562d", "#8556d6", "#c58a09", "#0b9aa8", "#cf3d88", "#6f7c90"];

  return (
    <div>
      <div className="relative">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="h-[170px] w-full rounded-2xl bg-[var(--panel)]" role="img" aria-label="Frequency of one gene variant over 100 generations in eight populations">
          {[0.25, 0.5, 0.75].map((v) => (
            <line key={v} x1={0} x2={100} y1={50 - v * 50} y2={50 - v * 50} stroke="#dde7e0" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          <g key={`${seed}-${size}-${edge}`} className="reveal">
          {runs.map((l, i) => (
            <polyline
              key={i}
              points={l.map((p, g) => `${g},${(49 - p * 48).toFixed(2)}`).join(" ")}
              fill="none"
              stroke={COLORS[i]}
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          ))}
          </g>
        </svg>
        <span className="absolute left-2 top-1.5 text-[10.5px] text-[var(--faint)]">everyone has it</span>
        <span className="absolute bottom-1.5 left-2 text-[10.5px] text-[var(--faint)]">gone</span>
        <span className="absolute bottom-1.5 right-2 text-[10.5px] text-[var(--faint)]">100 generations →</span>
      </div>
      <div className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
        <label className="text-[12.5px] text-[var(--muted)]">
          Population size: <strong className="tabular-nums text-[var(--ink)]">{size.toLocaleString("en-US")}</strong>
          <input
            type="range"
            min={0}
            max={3}
            step={1}
            value={[10, 20, 200, 2000].indexOf(size)}
            onChange={(e) => setSize([10, 20, 200, 2000][Number(e.target.value)])}
            className="mt-1 block h-1.5 w-full cursor-pointer accent-[var(--green)]"
          />
        </label>
        <label className="text-[12.5px] text-[var(--muted)]">
          Survival advantage: <strong className="tabular-nums text-[var(--ink)]">{edge ? `${edge}%` : "none"}</strong>
          <input type="range" min={0} max={10} step={1} value={edge} onChange={(e) => setEdge(Number(e.target.value))} className="mt-1 block h-1.5 w-full cursor-pointer accent-[var(--green)]" />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setSeed((s) => s + 1)} className="rounded-full bg-[var(--ink)] px-4 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)]">
          Run it again
        </button>
        <span className="text-[12.5px] text-[var(--muted)]">
          Of eight populations: the variant took over in <strong className="text-[var(--ink)]">{fixed}</strong> and vanished from <strong className="text-[var(--ink)]">{lost}</strong>.
        </span>
      </div>
    </div>
  );
}

// ---------- 5. gene flow ----------

const VALLEY = 48;
const FLOW_GENS = 60;
const FLOW_RATES: { label: string; m: number }[] = [
  { label: "None", m: 0 },
  { label: "1 in 50", m: 0.02 },
  { label: "1 in 10", m: 0.1 },
  { label: "1 in 4", m: 0.25 },
];
interface Dot {
  blue: boolean;
  /** Has a parent from the other valley. */
  moved: boolean;
}
const startValley = (blueShare: number): Dot[] =>
  Array.from({ length: VALLEY }, (_, i) => ({ blue: i < VALLEY * blueShare, moved: false }));
const share = (v: Dot[]) => v.filter((d) => d.blue).length / v.length;

function GeneFlowLab() {
  const [a, setA] = useState<Dot[]>(() => startValley(0.9));
  const [b, setB] = useState<Dot[]>(() => startValley(0.1));
  const [rate, setRate] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [hist, setHist] = useState<[number, number][]>([[0.9, 0.1]]);
  const state = useRef({ a, b });
  useEffect(() => {
    state.current = { a, b };
  }, [a, b]);
  const gen = hist.length - 1;

  const step = () => {
    const m = FLOW_RATES[rate].m;
    const { a: pa, b: pb } = state.current;
    const breed = (home: Dot[], away: Dot[]): Dot[] =>
      home.map(() => {
        const moved = Math.random() < m;
        const src = moved ? away : home;
        return { blue: src[Math.floor(Math.random() * src.length)].blue, moved };
      });
    const na = breed(pa, pb);
    const nb = breed(pb, pa);
    setA(na);
    setB(nb);
    setHist((h) => [...h, [share(na), share(nb)] as [number, number]]);
  };
  useEffect(() => {
    if (!playing) return;
    if (gen >= FLOW_GENS) {
      const t = window.setTimeout(() => setPlaying(false), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(step, 260);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, gen]);
  const reset = () => {
    setPlaying(false);
    setA(startValley(0.9));
    setB(startValley(0.1));
    setHist([[0.9, 0.1]]);
  };

  const valley = (v: Dot[], x0: number, label: string) => (
    <g>
      <rect x={x0} y={6} width={118} height={88} rx={14} fill="#fff" stroke="#dde7e0" />
      <text x={x0 + 10} y={20} fontSize="8.5" fill="#6b7a71">
        {label} · {Math.round(share(v) * 100)}% blue
      </text>
      {v.map((d, i) => {
        const cx = x0 + 13 + (i % 8) * 13.1;
        const cy = 31 + Math.floor(i / 8) * 10.8;
        return (
          <g key={i}>
            {d.moved ? <circle cx={cx} cy={cy} r={5.2} fill="none" stroke="#0d2118" strokeWidth={0.9} strokeDasharray="2 1.5" /> : null}
            <circle cx={cx} cy={cy} r={3.7} fill={d.blue ? "#2a78e4" : "#e8703a"} />
          </g>
        );
      })}
    </g>
  );
  const m = FLOW_RATES[rate].m;
  const line = (k: 0 | 1) => hist.map((h, g) => `${(g / FLOW_GENS) * 100},${(39 - h[k] * 38).toFixed(2)}`).join(" ");

  return (
    <div>
      <svg viewBox="0 0 300 100" className="w-full rounded-2xl bg-[var(--panel)]" role="img" aria-label="Two valley populations exchanging migrants">
        {valley(a, 8, "West valley")}
        {valley(b, 174, "East valley")}
        {/* the pass between them */}
        <g opacity={m ? 1 : 0.25} stroke="#0d2118" strokeLinecap="round" fill="none" strokeWidth={m ? 0.8 + m * 9 : 0.8}>
          <path d="M132 40 H166 M160 35 l6 5 l-6 5" />
          <path d="M168 62 H134 M140 57 l-6 5 l6 5" />
        </g>
        {m === 0 ? (
          <text x={150} y={54} textAnchor="middle" fontSize="7.5" fill="#6b7a71">
            no contact
          </text>
        ) : null}
      </svg>
      <div className="relative mt-2">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-[84px] w-full rounded-2xl bg-[var(--panel)]" role="img" aria-label="Share of the blue variant in each valley over time">
          <line x1={0} x2={100} y1={20} y2={20} stroke="#dde7e0" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <polyline points={line(0)} fill="none" stroke="#0d2118" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <polyline points={line(1)} fill="none" stroke="#0c9a56" strokeWidth={2} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
        <span className="absolute left-2 top-1.5 text-[10.5px] text-[var(--faint)]">all blue</span>
        <span className="absolute bottom-1.5 left-2 text-[10.5px] text-[var(--faint)]">no blue</span>
        <span className="absolute right-2 top-1.5 text-[10.5px] tabular-nums text-[var(--faint)]">generation {gen}</span>
      </div>
      <p className="mt-1.5 text-[11.5px] text-[var(--faint)]">Share of blue in each valley. Solid line: west. Dashed: east.</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[12.5px] text-[var(--muted)]">Children with a parent from over the pass:</span>
        {FLOW_RATES.map((r, i) => (
          <Pill key={r.label} on={rate === i} onClick={() => setRate(i)}>
            {r.label}
          </Pill>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (gen >= FLOW_GENS) reset();
            setPlaying((p) => !p);
          }}
          className="rounded-full bg-[var(--ink)] px-4 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)]"
        >
          {playing ? "Pause" : gen >= FLOW_GENS ? "Run again" : gen ? "Continue" : "Play"}
        </button>
        <button type="button" onClick={reset} className="rounded-full bg-[var(--panel)] px-4 py-1.5 text-[12.5px] font-medium text-[var(--ink)] transition hover:bg-[var(--line)]">
          Reset
        </button>
        <span className="text-[12px] text-[var(--faint)]">Dashed ring: has a parent from the other valley.</span>
      </div>
    </div>
  );
}

// ---------- 6. speciation ----------

const SPLIT_TICKS = 240;
const ISOLATION_AT = 80;
interface SplitState {
  a: number;
  b: number;
  /** Time spent apart, which builds up incompatibilities. */
  apart: number;
  barrier: boolean;
  hist: { a: number; b: number; barrier: boolean }[];
}
const SPLIT_START: SplitState = { a: 0, b: 0, apart: 0, barrier: false, hist: [{ a: 0, b: 0, barrier: false }] };

function SpeciationLab() {
  const [st, setSt] = useState<SplitState>(SPLIT_START);
  const [playing, setPlaying] = useState(false);
  const t = st.hist.length - 1;
  const two = st.apart >= ISOLATION_AT;
  const compat = Math.max(0, 1 - st.apart / ISOLATION_AT);

  useEffect(() => {
    if (!playing) return;
    if (t >= SPLIT_TICKS) {
      const id = window.setTimeout(() => setPlaying(false), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setSt((s) => {
        const noise = () => (Math.random() - 0.5) * 1.5;
        const split = s.apart >= ISOLATION_AT;
        let { a, b, apart } = s;
        if (s.barrier || split) {
          // different conditions on each side pull the two apart
          a += -0.2 + noise();
          b += 0.2 + noise();
          if (s.barrier && !split) apart += 1;
        } else {
          // interbreeding pulls them back together and washes out differences
          const mid = (a + b) / 2;
          a += (mid - a) * 0.1 + noise();
          b += (mid - b) * 0.1 + noise();
          apart = Math.max(0, apart - 1.5);
          if (Math.abs(a - b) < 2.5) b = a;
        }
        a = Math.max(-44, Math.min(44, a));
        b = Math.max(-44, Math.min(44, b));
        return { a, b, apart, barrier: s.barrier, hist: [...s.hist, { a, b, barrier: s.barrier }] };
      });
    }, 85);
    return () => window.clearTimeout(id);
  }, [playing, t]);

  const X = (i: number) => 6 + (i / SPLIT_TICKS) * 268;
  const Y = (v: number) => 50 + v;
  const path = (k: "a" | "b") => st.hist.map((h, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(h[k]).toFixed(1)}`).join(" ");
  // spans of time with the barrier up
  const spans: [number, number][] = [];
  st.hist.forEach((h, i) => {
    if (!h.barrier) return;
    const last = spans[spans.length - 1];
    if (last && last[1] === i - 1) last[1] = i;
    else spans.push([i, i]);
  });
  const merged = !st.barrier && !two && st.a === st.b;
  const status = two ? "Two species" : st.barrier ? "One species, split in two" : merged ? "One species" : "One species, mixing again";

  return (
    <div>
      <div className="relative">
        <svg viewBox="0 0 300 100" className="w-full rounded-2xl bg-[var(--panel)]" role="img" aria-label={`Branching diagram of a population through time: ${status}`}>
          {spans.map(([i0, i1]) => (
            <rect key={i0} x={X(i0)} y={4} width={Math.max(0.5, X(i1) - X(i0))} height={92} fill="#6f7c90" opacity={0.13} />
          ))}
          {st.barrier ? <line x1={X(t)} x2={300} y1={50} y2={50} stroke="#6f7c90" strokeWidth={2.5} strokeDasharray="1 4" strokeLinecap="round" /> : null}
          <path d={path("a")} fill="none" stroke="#2a78e4" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={path("b")} fill="none" stroke={merged && !spans.length ? "#2a78e4" : "#e8703a"} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
          {/* the living populations */}
          {(["a", "b"] as const).map((k) =>
            k === "b" && merged ? null : (
              <g key={k}>
                {[-5, 0, 5].map((dy, i) => (
                  <circle key={dy} cx={X(t) + 7 + (i % 2) * 5} cy={Y(st[k]) + dy} r={2.6} fill={k === "a" ? "#2a78e4" : merged && !spans.length ? "#2a78e4" : "#e8703a"} stroke="#fff" strokeWidth={0.6} />
                ))}
              </g>
            ),
          )}
        </svg>
        <span className="absolute left-3 top-2 rounded-full bg-white/85 px-2.5 py-1 text-[11.5px] font-semibold text-[var(--ink)]">{status}</span>
        <span className="absolute bottom-1.5 left-3 text-[10.5px] text-[var(--faint)]">time →</span>
        <span className="absolute bottom-1.5 right-3 text-[10.5px] text-[var(--faint)]">shaded: barrier up · up/down: how they differ</span>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline justify-between text-[12.5px] text-[var(--muted)]">
          <span>Could the two still have fertile children together?</span>
          <strong className="tabular-nums text-[var(--ink)]">{two ? "No" : `${Math.round(compat * 100)}%`}</strong>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--panel)]">
          <div className="h-full rounded-full transition-all" style={{ width: `${compat * 100}%`, background: compat > 0.5 ? "#0c9a56" : compat > 0.2 ? "#e0a200" : "#e8703a" }} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (t >= SPLIT_TICKS) return;
            setSt((s) => ({ ...s, barrier: !s.barrier }));
            setPlaying(true);
          }}
          disabled={t >= SPLIT_TICKS}
          className="rounded-full bg-[var(--ink)] px-4 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)] disabled:opacity-40"
        >
          {st.barrier ? "Remove the barrier" : "Raise a barrier"}
        </button>
        <button type="button" onClick={() => setPlaying((p) => !p)} disabled={t >= SPLIT_TICKS} className="rounded-full bg-[var(--panel)] px-4 py-1.5 text-[12.5px] font-medium text-[var(--ink)] transition hover:bg-[var(--line)] disabled:opacity-40">
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setSt(SPLIT_START);
          }}
          className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-[var(--muted)] transition hover:bg-[var(--panel)]"
        >
          Start over
        </button>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--faint)]">
        Try removing the barrier early, then late. A sea, a desert, an ice sheet or sheer distance can all be the barrier.
      </p>
    </div>
  );
}

// ---------- section ----------

const SEEN: { title: string; text: string }[] = [
  {
    title: "In a flask",
    text: "Twelve lines of E. coli bacteria have been grown in a laboratory since 1988. After about 31,000 generations one line evolved the ability to eat citrate, a new trait that depended on earlier mutations in that line.[@blount-2008]",
  },
  {
    title: "On an island",
    text: "Thirty years of measuring finches on a Galápagos island showed beak size shifting back and forth as droughts changed which seeds were available.[@grant-2002]",
  },
  {
    title: "In ourselves",
    text: "The ability to digest milk as an adult arose separately in European and East African herders within the last few thousand years, through different mutations with the same effect.[@tishkoff-2006]",
  },
  {
    title: "In our genomes",
    text: "Humans have 23 pairs of chromosomes and other great apes 24. Our chromosome 2 turns out to be two ape chromosomes joined end to end, with the fused tips still readable in the middle.[@ijdo-1991]",
  },
];

export function Mechanics() {
  return (
    <section id="how" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="How evolution works" title="A few simple processes, a very long time">
        Darwin saw that species change by natural selection but had no idea
        how traits are inherited. Mendel worked out inheritance and nobody
        noticed. In the 1930s and 40s the two were joined into what biologists
        call the modern synthesis: evolution is the change, generation by
        generation, in which gene variants are common in a population. Try
        each of the processes that cause it.
      </SectionHeading>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <Panel
          step="1 · Variation"
          title="Mutation: copying is almost perfect"
          lede="Every cell division copies three billion letters of DNA. A handful of errors slip through. They are the only source of new genetic variation."
          note="Each child is born with about 60 new mutations that neither parent had.[@kong-2012] The great majority change nothing that matters, and drift decides their fate.[@kimura-1968] Mutations do not arise because they are needed; they simply happen, and what follows sorts them."
        >
          <MutationLab />
        </Panel>
        <Panel
          step="2 · Inheritance"
          title="Mendel’s square: shuffling the deck"
          lede="You carry two copies of most genes and pass on one of them, chosen at random, to each child. A Punnett square lists the combinations. This one uses the sickle-cell variant (S) from the first panel."
          note="Carriers of one S copy are protected against severe malaria, which is why the variant is common where malaria is.[@allison-1954] Inheritance alone does not change how common a variant is across a population. Something else has to do that."
        >
          <PunnettLab />
        </Panel>
        <Panel
          step="3 · Selection"
          title="Natural selection: the part that is not chance"
          lede="When a heritable difference affects who survives and has offspring, the helpful version becomes more common. Here birds eat the beetles they can see most easily."
          note="Nothing chooses or plans the outcome. The population tracks its surroundings because of who is left to breed, and if the surroundings change, so does the direction. Field experiments with peppered moths measured exactly this.[@cook-2012]"
        >
          <SelectionLab />
        </Panel>
        <Panel
          step="4 · Chance"
          title="Genetic drift: luck matters in small groups"
          lede="Each line is a separate population in which half the gene copies start out as one variant. With no advantage at all, chance alone makes it wander, and eventually take over or disappear."
          note="Raise the population size and the lines settle down. Add a small advantage and selection starts to win, but only reliably in large populations. Human ancestors lived in small groups for most of their history, so drift shaped us a good deal."
        >
          <DriftLab />
        </Panel>
        <Panel
          step="5 · Mixing"
          title="Gene flow: populations leak into each other"
          lede="Two valleys start out different: one mostly blue, one mostly orange. Whenever someone crosses the pass and has children on the other side, variants travel with them."
          note="With no contact, chance fixes a different variant in each valley. Even a trickle of migrants keeps the two alike, and a steady flow makes them one population. This is how Neanderthal variants came to be in people living today.[@green-2010] Gene flow works against the splitting shown in the next panel."
        >
          <GeneFlowLab />
        </Panel>
        <Panel
          step="6 · Splitting"
          title="Speciation: one becomes two"
          lede="When a barrier stops two parts of a population from interbreeding, mutation, selection and drift take them separate ways. Differences pile up, and some of them make hybrids less healthy or less fertile."
          note="Take the barrier away early and the two halves blend back together. Leave it long enough and they stay separate even when they meet: two species. There is no single moment when it happens. Neanderthals and sapiens were partway along: apart for several hundred thousand years, still able to have children, but with signs that some hybrids were less fertile.[@sankararaman-2014] This is a cartoon; real barriers leak and real timing varies enormously."
        >
          <SpeciationLab />
        </Panel>
      </div>

      <div className="mt-5 rounded-3xl bg-[var(--panel)] p-5 sm:p-6">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--ink)]">How long is long enough?</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--muted)]">
            <Rich text="Human and chimpanzee DNA differ at a little over one letter in a hundred.[@chimp-genome-2005] With about 60 new mutations per birth and several hundred thousand generations on each lineage since the two separated, the processes above are enough to account for that difference. The same arithmetic, run on other pairs of species, gives a family tree that matches the one drawn from fossils." />
          </p>
        </div>
      </div>

      <h3 className="display mt-14 text-[26px] text-[var(--ink)]">Seen happening</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SEEN.map((s) => (
          <div key={s.title} className="rounded-2xl border border-[var(--line)] bg-white p-4">
            <h4 className="text-[14.5px] font-semibold text-[var(--ink)]">{s.title}</h4>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">
              <Rich text={s.text} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
