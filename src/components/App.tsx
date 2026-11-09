"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchAll } from "@/data/catalog";
import { taxonColor } from "@/lib/palette";
import { Drawer } from "./Drawer";
import { FamilyTree } from "./FamilyTree";
import { Questions, Theories } from "./Questions";
import { ShortVersion } from "./ShortVersion";
import { SkullLab } from "./SkullLab";
import { TimeMachine } from "./TimeMachine";
import { StatusBadge, type PanelTarget } from "./ui";

const NAV = [
  ["#story", "Story"],
  ["#short", "Short version"],
  ["#tree", "Family tree"],
  ["#skulls", "Skulls"],
  ["#questions", "Evidence"],
  ["#adam", "Adam & Eve"],
] as const;

export function App() {
  const [stack, setStack] = useState<PanelTarget[]>([]);
  const [activeTheories, setActiveTheories] = useState<string[]>([]);
  const [skull, setSkull] = useState("neanderthal");
  const [searching, setSearching] = useState(false);

  const open = useCallback((t: PanelTarget) => {
    setSearching(false);
    setStack((s) => {
      const top = s[s.length - 1];
      if (top && top.kind === t.kind && top.id === t.id) return s;
      return [...s.slice(-12), t];
    });
  }, []);
  const close = useCallback(() => setStack([]), []);
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const toggleTheory = useCallback(
    (id: string) =>
      setActiveTheories((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if ((e.key === "/" && tag !== "INPUT") || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setSearching(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = stack.length || searching ? "hidden" : "";
  }, [stack.length, searching]);

  const top = stack[stack.length - 1];
  const selectedTaxon = top?.kind === "taxon" ? top.id : null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-transparent bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-[60px] max-w-[1360px] items-center gap-6 px-5 sm:px-8">
          <a href="#story" className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
              <circle cx="13" cy="13" r="12" fill="#06402b" />
              <path d="M5 16.5c3-.2 4.6-1.6 6-4.2M11 12.3c1.2-2.4 3-4 6.5-4.3M11 12.3c1.6 1.2 3.4 1.7 6 1.5M11 12.3c.6 2.5 2.2 4.6 5.4 5.6" stroke="#8ff0bd" strokeWidth="1.7" fill="none" strokeLinecap="round" />
              <circle cx="17.6" cy="8" r="1.7" fill="#8ff0bd" /><circle cx="17.2" cy="13.8" r="1.7" fill="#8ff0bd" /><circle cx="16.6" cy="18" r="1.7" fill="#8ff0bd" />
            </svg>
            <span className="display text-[20px] text-[var(--ink)]">evo-viz</span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-3 py-1.5 text-[13.5px] text-[var(--muted)] transition hover:bg-[var(--green-soft)] hover:text-[var(--ink)]">
                {label}
              </a>
            ))}
          </nav>
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => setSearching(true)}
            className="flex items-center gap-2.5 rounded-full bg-[var(--panel)] py-2 pl-3.5 pr-2.5 text-[13.5px] text-[var(--muted)] ring-1 ring-inset ring-[var(--line)] transition hover:ring-[var(--green)]"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="5" /><path d="m11 11 3.5 3.5" /></svg>
            <span className="hidden sm:inline">Search species, questions, fossils</span>
            <span className="sm:hidden">Search</span>
            <kbd className="hidden rounded-md bg-white px-1.5 py-0.5 text-[11px] text-[var(--faint)] ring-1 ring-[var(--line)] sm:inline">/</kbd>
          </button>
          <Link href="/about" className="hidden text-[13.5px] text-[var(--muted)] hover:text-[var(--ink)] sm:inline">
            About
          </Link>
        </div>
      </header>

      <main>
        <TimeMachine onOpen={open} />
        <ShortVersion onOpen={open} />
        <FamilyTree onOpen={open} selectedId={selectedTaxon} activeTheories={activeTheories} onToggleTheory={toggleTheory} />
        <SkullLab onOpen={open} a={skull} onChangeA={setSkull} />
        <Questions onOpen={open} />
        <Theories onOpen={open} activeTheories={activeTheories} onToggleTheory={toggleTheory} />
      </main>

      <footer className="mx-auto max-w-[1240px] px-5 py-14 text-[13px] leading-relaxed text-[var(--faint)] sm:px-8">
        <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="display text-[20px] text-[var(--ink)]">evo-viz</p>
            <p className="mt-2 max-w-[360px]">
              A teaching and research companion to human origins. Grades are
              editorial readings of the literature, not probabilities. It will
              be wrong in places; the footnotes are there so you can check.
            </p>
            <Link href="/about" className="mt-3 inline-block font-medium text-[var(--green)] hover:underline">
              Method, sources and credits →
            </Link>
          </div>
          <p>
            Coastlines: Natural Earth (public domain). Silhouettes: T. Michael
            Keesey and contributors, PhyloPic (public domain). Scanned casts:
            Digital Atlas of Ancient Life, Cornell (CC BY-NC-SA), embedded from
            Sketchfab; Smithsonian Human Origins Program scans are linked, not
            copied. The in-app skulls are procedural teaching models. Dates and
            brain volumes are rounded mid-range figures from the cited
            literature. Sea level is shown as it is today; during ice ages it
            was up to 120 metres lower, joining Java to Asia and New Guinea to
            Australia.
          </p>
        </div>
      </footer>

      <Drawer stack={stack} onOpen={open} onBack={back} onClose={close} />
      {searching ? <Search onOpen={open} onClose={() => setSearching(false)} /> : null}
    </>
  );
}

function Search({ onOpen, onClose }: { onOpen: (t: PanelTarget) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const r = useMemo(() => searchAll(q), [q]);
  const total = r.taxa.length + r.claims.length + r.theories.length + r.fossils.length;
  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const row = (key: string, onClick: () => void, main: React.ReactNode, meta: React.ReactNode) => (
    <button key={key} type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--panel)] focus-visible:bg-[var(--panel)]">
      <span className="min-w-0 flex-1 truncate text-[14.5px] text-[var(--ink)]">{main}</span>
      <span className="shrink-0 text-[12px] text-[var(--faint)]">{meta}</span>
    </button>
  );
  const group = (label: string, rows: React.ReactNode[]) =>
    rows.length ? (
      <div className="mt-3 first:mt-0">
        <p className="kicker px-3 pb-1 text-[10.5px] text-[var(--faint)]">{label}</p>
        {rows}
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 cursor-default bg-[#04241a]/35 backdrop-blur-[3px]" />
      <div role="dialog" aria-modal="true" aria-label="Search" className="fade-up relative w-full max-w-[620px] overflow-hidden rounded-3xl bg-white shadow-2xl">
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “Denisovan”, “fire”, “Lucy”, “Swamidass”…"
          className="w-full border-b border-[var(--line)] px-6 py-5 text-[17px] outline-none placeholder:text-[var(--faint)]"
        />
        <div className="thin-scroll max-h-[52vh] overflow-y-auto p-3">
          {q.trim().length < 2 ? (
            <p className="px-3 py-4 text-[13.5px] text-[var(--muted)]">Search every species, graded question, fossil and Adam-and-Eve model.</p>
          ) : total === 0 ? (
            <p className="px-3 py-4 text-[13.5px] text-[var(--muted)]">Nothing matches “{q}”.</p>
          ) : (
            <>
              {group("Species", r.taxa.map((t) => row(t.id, () => onOpen({ kind: "taxon", id: t.id }), <><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: taxonColor(t.id) }} /><em>{t.name}</em></>, t.nickname)))}
              {group("Questions", r.claims.map((c) => row(c.id, () => onOpen({ kind: "claim", id: c.id }), c.question, <StatusBadge status={c.status} compact />)))}
              {group("Fossils", r.fossils.map((f) => row(f.id, () => onOpen({ kind: "fossil", id: f.id }), f.name, f.site)))}
              {group("Adam & Eve models", r.theories.map((t) => row(t.id, () => onOpen({ kind: "theory", id: t.id }), t.name, t.author)))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
