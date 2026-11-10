"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { getClaim, getFossil, getSource, getTaxon, getTheory } from "@/data/catalog";
import { cultureById } from "@/data/culture";
import { ToolArt } from "./ToolArt";
import { glossary, termById } from "@/data/glossary";
import { methodById } from "@/data/methods";
import { migrations } from "@/data/migrations";
import { taxa } from "@/data/taxa";
import { formatKa, formatRange, stripCites } from "@/lib/format";
import { notebook, useNotebook } from "@/lib/notebook";
import { taxonColor, taxonSoft } from "@/lib/palette";
import { Figure, StatusBadge, type PanelTarget } from "./ui";

/** Anything a hover note can describe. Sources and terms have no full page. */
export type RefTarget = PanelTarget | { kind: "source"; id: string } | { kind: "term"; id: string };

interface Popup {
  key: number;
  target: RefTarget;
  depth: number;
  x: number;
  y: number;
  pinned: boolean;
  /** Where the link that opened it sits, so the note can avoid covering it. */
  anchorTop: number;
  anchorBottom: number;
}

interface Ctx {
  show: (target: RefTarget, anchor: DOMRect, depth: number) => void;
  hoverRef: (depth: number, on: boolean) => void;
  pin: (target: RefTarget, anchor: DOMRect, depth: number) => void;
  openFull: (t: PanelTarget) => void;
}

const PopupCtx = createContext<Ctx | null>(null);
const DepthCtx = createContext(0);

const W = 372;
let nextKey = 1;

function place(anchor: DOMRect, depth = 0): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const x = Math.min(Math.max(12, anchor.left + anchor.width / 2 - W / 2), vw - W - 12);
  void vh;
  // A note opened from inside another note sits beside it, so both stay readable.
  if (depth > 0) {
    const right = anchor.right + 14;
    const left = anchor.left - W - 14;
    if (right + W <= vw - 12) return { x: right, y: Math.max(8, anchor.top - 56) };
    if (left >= 12) return { x: left, y: Math.max(8, anchor.top - 56) };
  }
  return { x, y: anchor.bottom + 8 };
}

function isPage(t: RefTarget): t is PanelTarget {
  return t.kind !== "source" && t.kind !== "term";
}

export function PopupProvider({
  children,
  onOpen,
}: {
  children: ReactNode;
  onOpen: (t: PanelTarget) => void;
}) {
  const [popups, setPopups] = useState<Popup[]>([]);
  const hover = useRef(0);
  const anchorDepth = useRef(0);
  const timer = useRef(0);

  // A popup survives while it, a deeper popup, or the link that opened it is hovered.
  const prune = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const keep = Math.max(hover.current, anchorDepth.current);
      setPopups((ps) => {
        const next = ps.filter((p) => p.pinned || p.depth <= keep);
        return next.length === ps.length ? ps : next;
      });
    }, 240);
  }, []);

  const show = useCallback((target: RefTarget, anchor: DOMRect, depth: number) => {
    const { x, y } = place(anchor, depth);
    setPopups((ps) => {
      const same = ps.find((p) => p.target.kind === target.kind && p.target.id === target.id);
      if (same) return ps;
      return [
        ...ps.filter((p) => p.pinned || p.depth <= depth),
        { key: nextKey++, target, depth: depth + 1, x, y, pinned: false, anchorTop: anchor.top, anchorBottom: anchor.bottom },
      ];
    });
  }, []);

  const pin = useCallback((target: RefTarget, anchor: DOMRect, depth: number) => {
    const { x, y } = place(anchor);
    setPopups((ps) => {
      const same = ps.find((p) => p.target.kind === target.kind && p.target.id === target.id);
      if (same) return ps.map((p) => (p === same ? { ...p, pinned: true } : p));
      return [...ps, { key: nextKey++, target, depth: depth + 1, x, y, pinned: true, anchorTop: anchor.top, anchorBottom: anchor.bottom }];
    });
  }, []);

  const hoverRef = useCallback(
    (depth: number, on: boolean) => {
      anchorDepth.current = on ? depth + 1 : 0;
      if (!on) prune();
    },
    [prune],
  );

  useEffect(() => {
    const close = () => setPopups((ps) => (ps.some((p) => !p.pinned) ? ps.filter((p) => p.pinned) : ps));
    const key = (e: KeyboardEvent) => e.key === "Escape" && setPopups([]);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("keydown", key);
    };
  }, []);

  const ctx = useMemo<Ctx>(
    () => ({ show, hoverRef, pin, openFull: onOpen }),
    [show, hoverRef, pin, onOpen],
  );

  return (
    <PopupCtx.Provider value={ctx}>
      {children}
      {typeof document !== "undefined" && popups.length
        ? createPortal(
            popups.map((p) => (
              <PopupCard
                key={p.key}
                popup={p}
                onEnter={() => {
                  hover.current = p.depth;
                  window.clearTimeout(timer.current);
                }}
                onLeave={() => {
                  hover.current = 0;
                  prune();
                }}
                onClose={() => setPopups((ps) => ps.filter((q) => q.key !== p.key))}
                onPin={() => setPopups((ps) => ps.map((q) => (q.key === p.key ? { ...q, pinned: !q.pinned } : q)))}
                onMove={(x, y) => setPopups((ps) => ps.map((q) => (q.key === p.key ? { ...q, x, y, pinned: true } : q)))}
                onPlace={(y) => setPopups((ps) => ps.map((q) => (q.key === p.key ? { ...q, y } : q)))}
                onOpenFull={(t) => {
                  setPopups((ps) => ps.filter((q) => q.pinned && q.key !== p.key));
                  onOpen(t);
                }}
              />
            )),
            document.body,
          )
        : null}
    </PopupCtx.Provider>
  );
}

const KIND_LABEL: Record<RefTarget["kind"], string> = {
  taxon: "Species",
  claim: "Question",
  theory: "Model",
  fossil: "Fossil",
  route: "Journey",
  culture: "Tools and behaviour",
  method: "How we know",
  source: "Source",
  term: "Glossary",
};

function PopupCard({
  popup,
  onEnter,
  onLeave,
  onClose,
  onPin,
  onMove,
  onPlace,
  onOpenFull,
}: {
  popup: Popup;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
  onPin: () => void;
  onMove: (x: number, y: number) => void;
  onPlace: (y: number) => void;
  onOpenFull: (t: PanelTarget) => void;
}) {
  const { target } = popup;
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  // Once the real height is known, flip above the link if there is no room below.
  useLayoutEffect(() => {
    const h = box.current?.offsetHeight ?? 0;
    const vh = window.innerHeight;
    if (popup.y + h <= vh - 8) return;
    if (popup.depth === 1 && popup.anchorTop - 8 - h >= 8) onPlace(popup.anchorTop - 8 - h);
    else onPlace(Math.max(8, vh - h - 8));
    // Measured once, when the note first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const nb = useNotebook();
  const saved = nb.items.some((i) => i.kind === target.kind && i.id === target.id);
  return (
    <div
      ref={box}
      role="dialog"
      aria-label={`${KIND_LABEL[target.kind]} note`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="fade-up fixed z-[80] flex max-h-[min(440px,70vh)] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_18px_50px_-16px_rgba(4,36,26,0.4)]"
      style={{ left: popup.x, top: popup.y, width: `min(${W}px, calc(100vw - 24px))` }}
    >
      <div
        className="flex cursor-grab items-center gap-1 border-b border-[var(--line)] bg-[var(--panel)] py-1 pl-3.5 pr-1.5 active:cursor-grabbing"
        onPointerDown={(e) => {
          if ((e.target as Element).closest("button")) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { dx: e.clientX - popup.x, dy: e.clientY - popup.y };
        }}
        onPointerMove={(e) => {
          if (drag.current) onMove(e.clientX - drag.current.dx, Math.max(4, e.clientY - drag.current.dy));
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <span className="kicker flex-1 select-none text-[10px] text-[var(--faint)]">
          {KIND_LABEL[target.kind]}
          {popup.pinned ? " · pinned" : ""}
        </span>
        <IconButton label={saved ? "Remove from notebook" : "Save to notebook"} active={saved} onClick={() => notebook.toggle(target.kind, target.id)}>
          <path d="M4 2.5h8v11l-4-2.8-4 2.8z" fill={saved ? "currentColor" : "none"} />
        </IconButton>
        <IconButton label={popup.pinned ? "Unpin" : "Pin this note open"} active={popup.pinned} onClick={onPin}>
          <path d="M5.6 2h4.8l-.7 4.2 2.3 2.8H4l2.3-2.8z" fill={popup.pinned ? "currentColor" : "none"} />
          <path d="M8 9v5.2" />
        </IconButton>
        <IconButton label="Close" onClick={onClose}>
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </IconButton>
      </div>
      <DepthCtx.Provider value={popup.depth}>
        <div className="thin-scroll min-h-0 overflow-y-auto px-4 py-3.5">
          <Preview target={target} />
          {isPage(target) ? (
            <button
              type="button"
              onClick={() => onOpenFull(target)}
              className="mt-3 text-[12.5px] font-semibold text-[var(--green)] hover:underline"
            >
              Open the full page →
            </button>
          ) : null}
        </div>
      </DepthCtx.Provider>
    </div>
  );
}

function IconButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded-full transition hover:bg-white ${
        active ? "text-[var(--green)]" : "text-[var(--muted)]"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

function clip(text: string, n: number): string {
  if (text.length <= n) return text;
  const cut = text.slice(0, n);
  return cut.slice(0, Math.max(cut.lastIndexOf(". ") + 1, cut.lastIndexOf(" "))).trimEnd() + " …";
}

/** The body of a hover note. */
export function Preview({ target }: { target: RefTarget }) {
  if (target.kind === "taxon") {
    const t = getTaxon(target.id);
    if (!t) return null;
    return (
      <div>
        <div className="flex gap-3">
          <div className="flex h-[92px] w-[58px] shrink-0 items-end justify-center rounded-xl" style={{ background: taxonSoft(t.id) }}>
            <Figure taxonId={t.id} height={80} color={taxonColor(t.id)} />
          </div>
          <div className="min-w-0">
            <p className="display text-[19px] italic leading-tight text-[var(--ink)]">{t.name}</p>
            {t.nickname ? <p className="text-[12px] text-[var(--faint)]">{t.nickname}</p> : null}
            <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--muted)]">
              {formatRange(t.rangeStartKa, t.rangeEndKa)}
              {t.cranialCapacityCc ? ` · brain ${t.cranialCapacityCc[0]}–${t.cranialCapacityCc[1]} cc` : ""}
              <br />
              {t.regions.join(", ")}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink)]">
          <Rich text={clip(stripCites(t.summary), 330)} skip={t.id} />
        </p>
      </div>
    );
  }
  if (target.kind === "claim") {
    const c = getClaim(target.id);
    if (!c) return null;
    return (
      <div>
        <StatusBadge status={c.status} />
        <p className="display mt-2 text-[18px] leading-snug text-[var(--ink)]">{c.question}</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--ink)]">
          <Rich text={clip(stripCites(c.summary), 420)} />
        </p>
        <p className="mt-2 text-[12px] text-[var(--faint)]">
          {c.sourceIds.length} sources:{" "}
          {c.sourceIds.map((id, i) => (
            <Ref key={id} target={{ kind: "source", id }} className="mr-1">
              [{i + 1}]
            </Ref>
          ))}
        </p>
      </div>
    );
  }
  if (target.kind === "theory") {
    const t = getTheory(target.id);
    if (!t) return null;
    return (
      <div>
        <StatusBadge status={t.status} />
        <p className="display mt-2 text-[18px] leading-snug text-[var(--ink)]">{t.name}</p>
        <p className="text-[12px] text-[var(--faint)]">
          {t.author}
          {t.year ? `, ${t.year}` : ""}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--ink)]">
          <Rich text={clip(stripCites(t.summary), 380)} />
        </p>
      </div>
    );
  }
  if (target.kind === "fossil") {
    const f = getFossil(target.id);
    if (!f) return null;
    return (
      <div>
        <p className="display text-[18px] leading-snug text-[var(--ink)]">{f.name}</p>
        <p className="text-[12px] text-[var(--faint)]">
          {[f.specimen, f.site, formatKa(f.ageKa)].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--ink)]">{f.notes}</p>
      </div>
    );
  }
  if (target.kind === "route") {
    const m = migrations.find((x) => x.id === target.id);
    if (!m) return null;
    return (
      <div>
        <StatusBadge status={m.status} />
        <p className="display mt-2 text-[18px] leading-snug text-[var(--ink)]">{m.label}</p>
        <p className="text-[12px] text-[var(--faint)]">{formatRange(m.startKa, m.endKa)}</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--ink)]">{stripCites(m.notes)}</p>
      </div>
    );
  }
  if (target.kind === "culture") {
    const c = cultureById[target.id];
    if (!c) return null;
    return (
      <div>
        <div className="flex items-start gap-3">
          <span className="min-w-0 flex-1">
            <StatusBadge status={c.status} />
            <p className="display mt-2 text-[18px] leading-snug text-[var(--ink)]">{c.label}</p>
          </span>
          <ToolArt art={c.art} size={56} className="shrink-0" />
        </div>
        <p className="text-[12px] text-[var(--faint)]">
          {c.startKa === c.endKa ? `about ${formatKa(c.startKa)}` : formatRange(c.startKa, c.endKa)}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--ink)]">
          <Rich text={clip(stripCites(c.summary), 380)} />
        </p>
      </div>
    );
  }
  if (target.kind === "method") {
    const m = methodById[target.id];
    if (!m) return null;
    return (
      <div>
        <p className="display text-[18px] leading-snug text-[var(--ink)]">{m.title}</p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ink)]">{m.short}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">
          <Rich text={clip(stripCites(m.body[0]), 300)} />
        </p>
      </div>
    );
  }
  if (target.kind === "source") {
    const s = getSource(target.id);
    if (!s) return null;
    return (
      <div>
        <p className="text-[14.5px] font-semibold leading-snug text-[var(--ink)]">{s.title}</p>
        <p className="mt-1 text-[12.5px] text-[var(--muted)]">
          {[s.authors, s.year].filter(Boolean).join(", ")}
          <span className="ml-2 rounded bg-[var(--panel)] px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide">{s.kind}</span>
        </p>
        {s.note ? <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">{s.note}</p> : null}
        <a href={s.url} target="_blank" rel="noreferrer" className="mt-2.5 inline-block break-all text-[12.5px] font-medium text-[var(--green)] hover:underline">
          {s.url.replace(/^https?:\/\//, "")} ↗
        </a>
      </div>
    );
  }
  const term = termById[target.id];
  if (!term) return null;
  return (
    <div>
      <p className="display text-[18px] text-[var(--ink)]">{term.term}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ink)]">{term.def}</p>
    </div>
  );
}

/**
 * An inline link with a hover note. Hovering previews; clicking opens the
 * full page, or pins the note for sources and glossary terms.
 */
export function Ref({
  target,
  children,
  className = "",
  plain = false,
}: {
  target: RefTarget;
  children: ReactNode;
  className?: string;
  /** Skip the dotted underline, for links that are already styled. */
  plain?: boolean;
}) {
  const ctx = useContext(PopupCtx);
  const depth = useContext(DepthCtx);
  const timer = useRef(0);
  const el = useRef<HTMLButtonElement>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  if (!ctx) return <>{children}</>;
  const enter = () => {
    ctx.hoverRef(depth, true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (el.current) ctx.show(target, el.current.getBoundingClientRect(), depth);
    }, 280);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    ctx.hoverRef(depth, false);
  };
  return (
    <button
      ref={el}
      type="button"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onClick={(e) => {
        e.stopPropagation();
        window.clearTimeout(timer.current);
        if (isPage(target)) ctx.openFull(target);
        else if (el.current) ctx.pin(target, el.current.getBoundingClientRect(), depth);
      }}
      className={
        plain
          ? className
          : `inline cursor-pointer text-left underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:decoration-solid ${
              target.kind === "term" ? "decoration-[#9fb3a8] hover:decoration-[var(--ink)]" : "decoration-[var(--green)]"
            } ${className}`
      }
      style={target.kind === "taxon" && !plain ? { fontStyle: "italic" } : undefined}
    >
      {children}
    </button>
  );
}

// ---------- automatic linking of prose ----------

const GENUS_ABBR: Record<string, string[]> = {
  Australopithecus: ["Au.", "A."],
  Paranthropus: ["P."],
  Homo: ["H."],
  Ardipithecus: ["Ar."],
};
const EXTRA_NAMES: Record<string, string[]> = {
  neanderthal: ["Neanderthals", "Neanderthal"],
  denisovan: ["Denisovans", "Denisovan"],
  longi: ["Dragon Man"],
  afarensis: ["Lucy"],
  ardipithecus: ["Ardi", "Ardipithecus"],
  sahelanthropus: ["Sahelanthropus", "Toumaï"],
  orrorin: ["Orrorin"],
  floresiensis: ["hobbit", "Hobbit"],
  sapiens: ["sapiens"],
  erectus: ["erectus"],
  heidelbergensis: ["heidelbergensis"],
  habilis: ["habilis"],
  naledi: ["naledi"],
};

const lookup = new Map<string, RefTarget>();
for (const t of taxa) {
  const [genus, ...rest] = t.name.split(" ");
  const names = [t.name, ...(EXTRA_NAMES[t.id] ?? [])];
  for (const a of GENUS_ABBR[genus] ?? []) names.push(`${a} ${rest.join(" ")}`);
  for (const n of names) if (!lookup.has(n)) lookup.set(n, { kind: "taxon", id: t.id });
}
for (const g of glossary) {
  for (const n of [g.term, ...(g.aliases ?? [])]) {
    if (!lookup.has(n)) lookup.set(n, { kind: "term", id: g.id });
    const cap = n[0].toUpperCase() + n.slice(1);
    if (!lookup.has(cap)) lookup.set(cap, { kind: "term", id: g.id });
  }
}
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PATTERN = new RegExp(
  `(?<![\\p{L}\\p{N}])(${[...lookup.keys()].sort((a, b) => b.length - a.length).map(esc).join("|")})(?![\\p{L}\\p{N}])`,
  "gu",
);

const CITE = /\[@([\w,-]+)\]/g;

function linkProse(text: string, seen: Set<string>, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const target = lookup.get(m[1]);
    if (!target) continue;
    const id = `${target.kind}:${target.id}`;
    if (seen.has(id)) continue;
    // "ka" and "Ma" only count as units when they follow a number.
    if ((m[1] === "ka" || m[1] === "Ma") && !/\d\s$/.test(text.slice(0, m.index))) continue;
    seen.add(id);
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    out.push(
      <Ref key={`${keyBase}-${i}`} target={target}>
        {m[1]}
      </Ref>,
    );
    last = i + m[1].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Prose with species names and technical terms turned into hover notes, and
 * inline citations such as [@smith-2020] turned into numbered footnote marks.
 * Each name or term is linked once per passage, on its first mention.
 * `sources` fixes the footnote numbering to match a list shown elsewhere.
 */
export function Rich({ text, skip, sources }: { text: string; skip?: string; sources?: string[] }) {
  const parts = useMemo(() => {
    const out: ReactNode[] = [];
    const seen = new Set<string>(skip ? [`taxon:${skip}`] : []);
    const order = [...(sources ?? [])];
    let last = 0;
    let n = 0;
    for (const m of text.matchAll(CITE)) {
      const i = m.index ?? 0;
      out.push(...linkProse(text.slice(last, i), seen, n++));
      out.push(
        <sup key={`c${i}`} className="whitespace-nowrap text-[0.68em]">
          {m[1].split(",").map((id, j) => {
            if (!order.includes(id)) order.push(id);
            return (
              <Ref key={id} target={{ kind: "source", id }} className="px-[1.5px] leading-[1.6] text-[var(--green)]">
                {j ? "," : ""}
                {order.indexOf(id) + 1}
              </Ref>
            );
          })}
        </sup>,
      );
      last = i + m[0].length;
    }
    out.push(...linkProse(text.slice(last), seen, n));
    return out;
  }, [text, skip, sources]);
  return <>{parts}</>;
}
