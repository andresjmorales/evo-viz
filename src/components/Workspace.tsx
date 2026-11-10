"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getClaim, getFossil, getSource, getTaxon, getTheory, searchAll } from "@/data/catalog";
import { culture, cultureById } from "@/data/culture";
import { glossary, termById } from "@/data/glossary";
import { methodById, methods } from "@/data/methods";
import { migrations } from "@/data/migrations";
import { stripCites } from "@/lib/format";
import { notebook, useNotebook, type NoteItem } from "@/lib/notebook";
import { taxonColor } from "@/lib/palette";
import { Drawer } from "./Drawer";
import { PopupProvider, Ref, type RefTarget } from "./Popups";
import { StatusBadge, type PanelTarget } from "./ui";

interface WorkspaceCtx {
  open: (t: PanelTarget) => void;
  /** The species currently open in the drawer, if any. */
  selectedTaxon: string | null;
}
const Ctx = createContext<WorkspaceCtx>({ open: () => {}, selectedTaxon: null });
export const useWorkspace = () => useContext(Ctx);

const PAGE_KINDS = ["taxon", "claim", "theory", "fossil", "route", "culture", "method"];

function parseHash(): PanelTarget | null {
  const m = window.location.hash.match(/^#\/(\w+)\/([\w-]+)$/);
  return m && PAGE_KINDS.includes(m[1]) ? ({ kind: m[1], id: m[2] } as PanelTarget) : null;
}

/**
 * The frame shared by every page: header, search, the detail drawer, hover
 * notes and the notebook. Opening an item writes a shareable #/kind/id link.
 */
export function Workspace({
  nav,
  children,
}: {
  nav: readonly (readonly [string, string])[];
  children: ReactNode;
}) {
  const [stack, setStack] = useState<PanelTarget[]>([]);
  const [searching, setSearching] = useState(false);
  const [padOpen, setPadOpen] = useState(false);
  const nb = useNotebook();

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

  const top = stack[stack.length - 1];
  const synced = useRef(false);
  useEffect(() => {
    // First run: adopt a link someone shared. After that, mirror the drawer.
    if (!synced.current) {
      synced.current = true;
      const t = parseHash();
      if (t) queueMicrotask(() => open(t));
      return;
    }
    const want = top ? `#/${top.kind}/${top.id}` : "";
    const have = window.location.hash.startsWith("#/") ? window.location.hash : "";
    if (want !== have) {
      window.history.replaceState(null, "", want || window.location.pathname + window.location.search);
    }
  }, [top, open]);

  // Follow links to items that arrive while the page is already open.
  useEffect(() => {
    const onHash = () => {
      const t = parseHash();
      if (t) open(t);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
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

  const value = useMemo(
    () => ({ open, selectedTaxon: top?.kind === "taxon" ? top.id : null }),
    [open, top],
  );

  return (
    <Ctx.Provider value={value}>
      <PopupProvider onOpen={open}>
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex h-[60px] max-w-[1360px] items-center gap-4 px-5 sm:gap-6 sm:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
                <circle cx="13" cy="13" r="12" fill="#06402b" />
                <path d="M5 16.5c3-.2 4.6-1.6 6-4.2M11 12.3c1.2-2.4 3-4 6.5-4.3M11 12.3c1.6 1.2 3.4 1.7 6 1.5M11 12.3c.6 2.5 2.2 4.6 5.4 5.6" stroke="#8ff0bd" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                <circle cx="17.6" cy="8" r="1.7" fill="#8ff0bd" /><circle cx="17.2" cy="13.8" r="1.7" fill="#8ff0bd" /><circle cx="16.6" cy="18" r="1.7" fill="#8ff0bd" />
              </svg>
              <span className="display text-[20px] text-[var(--ink)]">evo-viz</span>
            </Link>
            <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Sections">
              {nav.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-full px-3 py-1.5 text-[13.5px] text-[var(--muted)] transition hover:bg-[var(--green-soft)] hover:text-[var(--ink)]">
                  {label}
                </Link>
              ))}
            </nav>
            <span className="flex-1" />
            <button
              type="button"
              onClick={() => setSearching(true)}
              className="flex items-center gap-2.5 rounded-full bg-[var(--panel)] py-2 pl-3.5 pr-2.5 text-[13.5px] text-[var(--muted)] ring-1 ring-inset ring-[var(--line)] transition hover:ring-[var(--green)]"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="5" /><path d="m11 11 3.5 3.5" /></svg>
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded-md bg-white px-1.5 py-0.5 text-[11px] text-[var(--faint)] ring-1 ring-[var(--line)] sm:inline">/</kbd>
            </button>
            <button
              type="button"
              onClick={() => setPadOpen((v) => !v)}
              aria-pressed={padOpen}
              className={`flex items-center gap-2 rounded-full py-2 pl-3 pr-3 text-[13.5px] ring-1 ring-inset transition ${
                padOpen ? "bg-[var(--ink)] text-white ring-[var(--ink)]" : "text-[var(--muted)] ring-[var(--line)] hover:ring-[var(--green)]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M3.5 1.5h9v13l-4.5-3-4.5 3z" /></svg>
              <span className="hidden sm:inline">Notebook</span>
              {nb.items.length ? (
                <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${padOpen ? "bg-white/20" : "bg-[var(--green-soft)] text-[var(--green)]"}`}>{nb.items.length}</span>
              ) : null}
            </button>
          </div>
        </header>

        {children}

        <Drawer stack={stack} onOpen={open} onBack={back} onClose={close} />
        {padOpen ? <NotebookPad onClose={() => setPadOpen(false)} /> : null}
        {searching ? <Search onOpen={open} onClose={() => setSearching(false)} /> : null}
      </PopupProvider>
    </Ctx.Provider>
  );
}

// ---------- notebook ----------

function describe(i: { kind: string; id: string }): { title: string; meta: string; url?: string } | null {
  switch (i.kind) {
    case "taxon": {
      const t = getTaxon(i.id);
      return t ? { title: t.name, meta: "Species" } : null;
    }
    case "claim": {
      const c = getClaim(i.id);
      return c ? { title: c.question, meta: `Question · ${c.status}` } : null;
    }
    case "theory": {
      const t = getTheory(i.id);
      return t ? { title: t.name, meta: `Model · ${t.author}` } : null;
    }
    case "fossil": {
      const f = getFossil(i.id);
      return f ? { title: f.name, meta: `Fossil · ${f.site}` } : null;
    }
    case "route": {
      const m = migrations.find((x) => x.id === i.id);
      return m ? { title: m.label, meta: "Journey" } : null;
    }
    case "culture": {
      const c = cultureById[i.id];
      return c ? { title: c.label, meta: "Tools and behaviour" } : null;
    }
    case "method": {
      const m = methodById[i.id];
      return m ? { title: m.title, meta: "How we know" } : null;
    }
    case "source": {
      const s = getSource(i.id);
      return s ? { title: s.title, meta: [s.authors, s.year].filter(Boolean).join(", "), url: s.url } : null;
    }
    case "term": {
      const t = termById[i.id];
      return t ? { title: t.term, meta: "Glossary" } : null;
    }
    default:
      return null;
  }
}

function toMarkdown(items: NoteItem[], scratch: string): string {
  const lines = ["# evo-viz notebook", ""];
  if (scratch.trim()) lines.push(scratch.trim(), "");
  for (const i of items) {
    const d = describe(i);
    if (!d) continue;
    lines.push(`## ${d.title}`, `_${d.meta}_`, "");
    if (i.kind === "claim") {
      const c = getClaim(i.id)!;
      lines.push(stripCites(c.summary), "", `Why this grade: ${c.statusRationale}`, "");
      for (const sid of c.sourceIds) {
        const s = getSource(sid);
        if (s) lines.push(`- ${[s.authors, s.year].filter(Boolean).join(" ")}. ${s.title}. ${s.url}`);
      }
      lines.push("");
    } else if (i.kind === "term") {
      lines.push(termById[i.id].def, "");
    } else if (d.url) {
      lines.push(d.url, "");
    }
    if (i.note.trim()) lines.push(`> ${i.note.trim().replace(/\n/g, "\n> ")}`, "");
  }
  return lines.join("\n");
}

function NotebookPad({ onClose }: { onClose: () => void }) {
  const nb = useNotebook();
  const { open } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const md = () => toMarkdown(nb.items, nb.scratch);
  return (
    <aside
      aria-label="Notebook"
      className="drawer-in fixed bottom-3 left-3 z-[45] flex max-h-[min(640px,calc(100vh-90px))] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_24px_70px_-24px_rgba(4,36,26,0.5)]"
    >
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-5 py-3.5">
        <h2 className="display flex-1 text-[19px] text-[var(--ink)]">Notebook</h2>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(md());
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            } catch {
              // Clipboard blocked: fall back to a download.
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([md()], { type: "text/markdown" }));
              a.download = "evo-viz-notebook.md";
              a.click();
            }
          }}
          className="rounded-full bg-[var(--panel)] px-3 py-1.5 text-[12px] font-medium text-[var(--ink)] transition hover:bg-[var(--green-soft)]"
        >
          {copied ? "Copied" : "Copy as Markdown"}
        </button>
        <button type="button" aria-label="Close notebook" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--panel)]">
          <svg width="13" height="13" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l12 12M13 1 1 13" /></svg>
        </button>
      </div>
      <div className="thin-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <textarea
          value={nb.scratch}
          onChange={(e) => notebook.setScratch(e.target.value)}
          placeholder="Scratch notes: what are you trying to find out?"
          rows={3}
          className="w-full resize-y rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-3.5 py-2.5 text-[13.5px] leading-relaxed outline-none placeholder:text-[var(--faint)] focus:border-[var(--green)]"
        />
        {nb.items.length === 0 ? (
          <p className="text-[13px] leading-relaxed text-[var(--muted)]">
            Nothing saved yet. Use the bookmark on any species, question, fossil or source to collect it here with your own notes. Everything stays in this browser.
          </p>
        ) : null}
        {nb.items.map((i) => {
          const d = describe(i);
          if (!d) return null;
          const page = PAGE_KINDS.includes(i.kind);
          return (
            <div key={`${i.kind}:${i.id}`} className="rounded-2xl border border-[var(--line)] p-3.5">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  {page ? (
                    <button type="button" onClick={() => open(i as PanelTarget)} className={`text-left text-[14px] font-semibold leading-snug text-[var(--ink)] hover:underline ${i.kind === "taxon" ? "italic" : ""}`}>
                      {d.title}
                    </button>
                  ) : (
                    <Ref target={i as RefTarget} className="text-[14px] font-semibold leading-snug text-[var(--ink)]">
                      {d.title}
                    </Ref>
                  )}
                  <p className="mt-0.5 text-[11.5px] capitalize text-[var(--faint)]">{d.meta}</p>
                </div>
                <button type="button" aria-label="Remove" onClick={() => notebook.toggle(i.kind, i.id)} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--faint)] hover:bg-[var(--panel)] hover:text-[var(--ink)]">
                  <svg width="10" height="10" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1l12 12M13 1 1 13" /></svg>
                </button>
              </div>
              <textarea
                value={i.note}
                onChange={(e) => notebook.setNote(i.kind, i.id, e.target.value)}
                placeholder="Your note…"
                rows={1}
                className="mt-2 w-full resize-y rounded-xl bg-[var(--panel)] px-3 py-2 text-[13px] leading-relaxed outline-none placeholder:text-[var(--faint)] focus:ring-1 focus:ring-[var(--green)]"
              />
            </div>
          );
        })}
      </div>
      {nb.items.length ? (
        <div className="border-t border-[var(--line)] px-5 py-2.5 text-right">
          <button type="button" onClick={() => window.confirm("Remove everything from the notebook?") && notebook.clear()} className="text-[12px] text-[var(--faint)] hover:text-[var(--ink)] hover:underline">
            Clear notebook
          </button>
        </div>
      ) : null}
    </aside>
  );
}

// ---------- search ----------

function Search({ onOpen, onClose }: { onOpen: (t: PanelTarget) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const r = useMemo(() => searchAll(q), [q]);
  const terms = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n.length < 2
      ? []
      : glossary.filter((g) => [g.term, ...(g.aliases ?? [])].some((a) => a.toLowerCase().includes(n)));
  }, [q]);
  const extra = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (n.length < 2) return { culture: [], methods: [] };
    return {
      culture: culture.filter((c) => (c.label + " " + c.summary).toLowerCase().includes(n)),
      methods: methods.filter((m) => (m.title + " " + m.short + " " + m.body.join(" ")).toLowerCase().includes(n)),
    };
  }, [q]);
  const total =
    r.taxa.length + r.claims.length + r.theories.length + r.fossils.length + terms.length + extra.culture.length + extra.methods.length;
  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const row = (key: string, onClick: () => void, main: ReactNode, meta: ReactNode) => (
    <button key={key} type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--panel)] focus-visible:bg-[var(--panel)]">
      <span className="min-w-0 flex-1 truncate text-[14.5px] text-[var(--ink)]">{main}</span>
      <span className="shrink-0 text-[12px] text-[var(--faint)]">{meta}</span>
    </button>
  );
  const group = (label: string, rows: ReactNode[]) =>
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
            <p className="px-3 py-4 text-[13.5px] text-[var(--muted)]">Search every species, graded question, fossil, glossary term and Adam-and-Eve model.</p>
          ) : total === 0 ? (
            <p className="px-3 py-4 text-[13.5px] text-[var(--muted)]">Nothing matches “{q}”.</p>
          ) : (
            <>
              {group("Species", r.taxa.map((t) => row(t.id, () => onOpen({ kind: "taxon", id: t.id }), <><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: taxonColor(t.id) }} /><em>{t.name}</em></>, t.nickname)))}
              {group("Questions", r.claims.map((c) => row(c.id, () => onOpen({ kind: "claim", id: c.id }), c.question, <StatusBadge status={c.status} compact />)))}
              {group("Fossils", r.fossils.map((f) => row(f.id, () => onOpen({ kind: "fossil", id: f.id }), f.name, f.site)))}
              {group("Tools and behaviour", extra.culture.map((c) => row(c.id, () => onOpen({ kind: "culture", id: c.id }), c.label, <StatusBadge status={c.status} compact />)))}
              {group("How we know", extra.methods.map((m) => row(m.id, () => onOpen({ kind: "method", id: m.id }), m.title, "method")))}
              {terms.length ? (
                <div className="mt-3">
                  <p className="kicker px-3 pb-1 text-[10.5px] text-[var(--faint)]">Glossary</p>
                  {terms.map((g) => (
                    <p key={g.id} className="px-3 py-2 text-[13.5px] leading-relaxed text-[var(--muted)]">
                      <strong className="font-semibold text-[var(--ink)]">{g.term}.</strong> {g.def}
                    </p>
                  ))}
                </div>
              ) : null}
              {group("Adam & Eve models", r.theories.map((t) => row(t.id, () => onOpen({ kind: "theory", id: t.id }), t.name, t.author)))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
