"use client";

import { useEffect, useMemo, useState } from "react";
import { searchAll } from "@/data/catalog";
import { taxa } from "@/data/taxa";
import { theories } from "@/data/theories";
import { MigrationMap } from "./MigrationMap";
import { TextbookPanel, type PanelTarget } from "./TextbookPanel";
import { TheoryToggles } from "./TheoryToggles";
import { Timeline } from "./Timeline";

export function EvoApp() {
  const [target, setTarget] = useState<PanelTarget | null>(null);
  const [activeTheories, setActiveTheories] = useState<string[]>([]);
  const [compareId, setCompareId] = useState<string | null>("denisovan");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const selectedTaxonId = target?.kind === "taxon" ? target.id : null;
  const selectedTaxon = taxa.find((t) => t.id === selectedTaxonId) ?? null;
  const results = useMemo(() => searchAll(query), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTarget(null);
        setSearchOpen(false);
      }
      if (e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        setSearchOpen(true);
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

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#100e0c] text-stone-200">
      <header className="flex flex-wrap items-center gap-3 border-b border-stone-800 px-4 py-2.5">
        <div className="min-w-[10rem]">
          <div className="font-serif text-xl tracking-tight text-amber-50">
            evo-viz
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
            Human origins, claims, overlays
          </div>
        </div>
        <div className="relative min-w-[12rem] flex-1">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search taxa, questions, fossils…  (/)"
            className="w-full rounded-md border border-stone-700 bg-stone-950/60 px-3 py-1.5 text-sm text-stone-100 outline-none ring-amber-200/30 placeholder:text-stone-600 focus:ring-2"
          />
          {searchOpen && query.trim().length >= 2 ? (
            <div className="absolute z-40 mt-1 max-h-80 w-full overflow-auto rounded-md border border-stone-700 bg-[#1a1612] p-2 text-sm shadow-xl">
              <ResultGroup
                title="Taxa"
                items={results.taxa.map((t) => ({
                  id: t.id,
                  label: t.name,
                  onClick: () => {
                    setTarget({ kind: "taxon", id: t.id });
                    setSearchOpen(false);
                  },
                }))}
              />
              <ResultGroup
                title="Questions"
                items={results.claims.map((c) => ({
                  id: c.id,
                  label: c.question,
                  onClick: () => {
                    setTarget({ kind: "claim", id: c.id });
                    setSearchOpen(false);
                  },
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
                  onClick: () => {
                    setTarget({ kind: "fossil", id: f.id });
                    setSearchOpen(false);
                  },
                }))}
              />
            </div>
          ) : null}
        </div>
        <TheoryToggles
          active={activeTheories}
          onToggle={toggleTheory}
          onOpen={(id) => setTarget({ kind: "theory", id })}
        />
        <button
          type="button"
          onClick={() => setTarget({ kind: "taxon", id: "sapiens" })}
          className="rounded-full border border-amber-200/40 px-3 py-1 text-[11px] text-amber-100 hover:border-amber-200"
        >
          H. sapiens
        </button>
        <button
          type="button"
          onClick={() => setTarget({ kind: "questions" })}
          className="rounded-full border border-stone-700 px-3 py-1 text-[11px] text-stone-300 hover:border-stone-500"
        >
          Questions
        </button>
        <a
          href="/about"
          className="text-[11px] text-stone-500 underline-offset-2 hover:text-stone-300 hover:underline"
        >
          About
        </a>
      </header>

      {activeTheories.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-b border-stone-800 px-4 py-1.5 text-[11px] text-stone-400">
          {activeTheories.map((id) => {
            const t = theories.find((x) => x.id === id);
            if (!t) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTarget({ kind: "theory", id })}
                className="underline decoration-stone-600 underline-offset-2"
                style={{ color: t.color }}
              >
                {t.shortLabel}: {t.overlay?.label ?? t.name} (open note)
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <Timeline
            selectedId={selectedTaxonId}
            onSelect={(id) => setTarget({ kind: "taxon", id })}
            activeTheories={activeTheories}
            onSelectTheory={(id) => setTarget({ kind: "theory", id })}
          />
          <div className="flex items-center justify-between gap-3 border-t border-stone-800 bg-[#161310] px-4 py-1.5 text-xs">
            <div className="min-w-0 truncate text-stone-300">
              {selectedTaxon ? (
                <>
                  <span className="text-stone-500">Selected </span>
                  <em className="font-serif text-amber-100">{selectedTaxon.name}</em>
                  <span className="text-stone-500">
                    {" "}
                    — click Evidence or 3D in the notebook
                  </span>
                </>
              ) : (
                <span className="text-stone-500">
                  Click a colored bar (or a lane name) to open the notebook.
                </span>
              )}
            </div>
            {selectedTaxon ? (
              <button
                type="button"
                onClick={() => setTarget({ kind: "taxon", id: selectedTaxon.id })}
                className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-stone-900"
              >
                Open notebook
              </button>
            ) : null}
          </div>
          <MigrationMap taxon={selectedTaxon} activeTheories={activeTheories} />
        </div>
        <TextbookPanel
          target={target}
          onOpen={setTarget}
          onClose={() => setTarget(null)}
          compareId={compareId}
          onCompare={setCompareId}
        />
      </div>
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
      <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500">
        {title}
      </div>
      {items.slice(0, 6).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className="block w-full truncate rounded px-2 py-1 text-left text-stone-200 hover:bg-stone-800"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
