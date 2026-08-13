"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { searchAll } from "@/data/catalog";
import { taxa } from "@/data/taxa";
import { theories } from "@/data/theories";
import { isAlive } from "@/data/story";
import { TextbookPanel, type PanelTarget } from "./TextbookPanel";
import { TheoryToggles } from "./TheoryToggles";
import { Timeline } from "./Timeline";
import { StoryHome } from "./StoryHome";
import { TimeScrubber } from "./TimeScrubber";

const LivingGlobe = dynamic(
  () => import("./LivingGlobe").then((m) => m.LivingGlobe),
  { ssr: false },
);

type Mode = "story" | "atlas";

export function EvoApp() {
  const [mode, setMode] = useState<Mode>("story");
  const [target, setTarget] = useState<PanelTarget | null>(null);
  const [activeTheories, setActiveTheories] = useState<string[]>([]);
  const [compareId, setCompareId] = useState<string | null>("denisovan");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [ka, setKa] = useState(800);

  const selectedTaxonId = target?.kind === "taxon" ? target.id : null;
  const results = useMemo(() => searchAll(query), [query]);
  const living = taxa.filter((t) => isAlive(t.rangeStartKa, t.rangeEndKa, ka));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTarget(null);
        setSearchOpen(false);
      }
      if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        setSearchOpen(true);
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheory = (id: string) => {
    setActiveTheories((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  function openTarget(next: PanelTarget, preferAtlas = false) {
    setTarget(next);
    setSearchOpen(false);
    if (preferAtlas) setMode("atlas");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col grain text-[var(--ink)]">
      <header className="z-30 border-b border-[var(--line)] bg-white/90 px-4 py-2.5 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[8.5rem]">
            <div className="font-serif text-xl tracking-tight text-[var(--deep)]">
              evo-viz
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Teach, then inspect
            </div>
          </div>

          <div className="flex rounded-full bg-[var(--green-soft)] p-0.5 text-[11px] font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setMode("story")}
              className={`rounded-full px-3 py-1 ${
                mode === "story"
                  ? "bg-[var(--green)] text-white"
                  : "text-[var(--deep)]"
              }`}
            >
              Story
            </button>
            <button
              type="button"
              onClick={() => setMode("atlas")}
              className={`rounded-full px-3 py-1 ${
                mode === "atlas"
                  ? "bg-[var(--green)] text-white"
                  : "text-[var(--deep)]"
              }`}
            >
              Atlas
            </button>
          </div>

          <div className="relative min-w-[12rem] flex-1">
            <input
              id="global-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search taxa, questions, fossils…  (/)"
              className="w-full rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--ink)] outline-none ring-[var(--green)] placeholder:text-[#7a9a86] focus:ring-2"
            />
            {searchOpen && query.trim().length >= 2 ? (
              <div className="absolute z-40 mt-1 max-h-80 w-full overflow-auto rounded-2xl border border-[var(--line)] bg-white p-2 text-sm shadow-xl">
                <ResultGroup
                  title="Taxa"
                  items={results.taxa.map((t) => ({
                    id: t.id,
                    label: t.name,
                    onClick: () => openTarget({ kind: "taxon", id: t.id }, true),
                  }))}
                />
                <ResultGroup
                  title="Questions"
                  items={results.claims.map((c) => ({
                    id: c.id,
                    label: c.question,
                    onClick: () => openTarget({ kind: "claim", id: c.id }, true),
                  }))}
                />
                <ResultGroup
                  title="Theories"
                  items={results.theories.map((t) => ({
                    id: t.id,
                    label: t.name,
                    onClick: () => {
                      setTarget({ kind: "theory", id: t.id });
                      setSearchOpen(false);
                    },
                  }))}
                />
                <ResultGroup
                  title="Fossils"
                  items={results.fossils.map((f) => ({
                    id: f.id,
                    label: f.name,
                    onClick: () => openTarget({ kind: "fossil", id: f.id }, true),
                  }))}
                />
              </div>
            ) : null}
          </div>

          {mode === "atlas" ? (
            <TheoryToggles
              active={activeTheories}
              onToggle={toggleTheory}
              onOpen={(id) => setTarget({ kind: "theory", id })}
            />
          ) : null}

          <button
            type="button"
            onClick={() => setTarget({ kind: "questions" })}
            className="rounded-full border border-[var(--line)] px-3 py-1 text-[11px] text-[var(--deep)] hover:border-[var(--green)]"
          >
            Questions
          </button>
          <a
            href="/about"
            className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--deep)]"
          >
            About
          </a>
        </div>
      </header>

      {mode === "atlas" && activeTheories.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-b border-[var(--line)] bg-white px-4 py-1.5 text-[11px] text-[var(--muted)]">
          {activeTheories.map((id) => {
            const t = theories.find((x) => x.id === id);
            if (!t) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTarget({ kind: "theory", id })}
                className="underline decoration-[var(--line)] underline-offset-2"
                style={{ color: t.color }}
              >
                {t.shortLabel}: {t.overlay?.label ?? t.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {mode === "story" ? (
        <StoryHome
          onOpenTaxon={(id) => setTarget({ kind: "taxon", id })}
          onOpenAtlas={() => setMode("atlas")}
          onOpenQuestions={() => setTarget({ kind: "questions" })}
        />
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <Timeline
              selectedId={selectedTaxonId}
              onSelect={(id) => setTarget({ kind: "taxon", id })}
              activeTheories={activeTheories}
              onSelectTheory={(id) => setTarget({ kind: "theory", id })}
              playheadKa={ka}
            />
            <div className="grid shrink-0 border-t border-[var(--line)] bg-white lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
              <div className="min-h-[220px] border-b border-[var(--line)] lg:border-b-0 lg:border-r">
                <LivingGlobe ka={ka} focusTaxonId={selectedTaxonId} compact />
              </div>
              <div className="flex flex-col justify-between gap-3 p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                    Atlas clock · {living.length} lineages at this slice
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Drag time to ask who is on Earth. Pinch or Ctrl-scroll the
                    family tree to zoom. Click a bar for the notebook.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {living.slice(0, 8).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTarget({ kind: "taxon", id: t.id })}
                        className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[11px] italic text-[var(--ink)] hover:border-[var(--green)]"
                      >
                        {t.name.replace("Australopithecus ", "Au. ").replace("Homo ", "H. ")}
                      </button>
                    ))}
                  </div>
                </div>
                <TimeScrubber ka={ka} minKa={0} maxKa={7200} onChange={setKa} />
              </div>
            </div>
          </div>
          <TextbookPanel
            target={target}
            onOpen={setTarget}
            onClose={() => setTarget(null)}
            compareId={compareId}
            onCompare={setCompareId}
            variant="docked"
          />
        </div>
      )}

      {mode === "story" && target ? (
        <TextbookPanel
          target={target}
          onOpen={setTarget}
          onClose={() => setTarget(null)}
          compareId={compareId}
          onCompare={setCompareId}
          variant="sheet"
        />
      ) : null}
    </div>
  );
}

function ResultGroup({
  title,
  items,
}: {
  title: string;
  items: { id: string; label: string; onClick: () => void }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-2">
      <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {title}
      </div>
      {items.slice(0, 6).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className="block w-full truncate rounded-lg px-2 py-1.5 text-left text-[var(--ink)] hover:bg-[var(--green-soft)]"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
