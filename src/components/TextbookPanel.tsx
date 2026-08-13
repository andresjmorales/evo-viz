"use client";

import { useMemo, useState } from "react";
import {
  claimsForTaxon,
  fossilsForTaxon,
  getClaim,
  getFossil,
  getSource,
  getTaxon,
  getTheory,
} from "@/data/catalog";
import { claims, featuredClaims } from "@/data/claims";
import { taxa } from "@/data/taxa";
import { theories } from "@/data/theories";
import type { Claim, Fossil, Taxon, Theory } from "@/data/types";
import { formatRange } from "@/lib/format";
import { ClaimCard } from "./ClaimCard";
import { FossilViewer } from "./FossilViewer";
import { MorphospaceKeyed } from "./Morphospace";
import { StatusBadge } from "./StatusBadge";

export type PanelTarget =
  | { kind: "taxon"; id: string }
  | { kind: "claim"; id: string }
  | { kind: "theory"; id: string }
  | { kind: "fossil"; id: string }
  | { kind: "questions" };

export function TextbookPanel({
  target,
  onOpen,
  onClose,
  compareId,
  onCompare,
}: {
  target: PanelTarget | null;
  onOpen: (t: PanelTarget) => void;
  onClose: () => void;
  compareId: string | null;
  onCompare: (id: string | null) => void;
}) {
  if (!target) {
    return (
      <aside className="hidden w-[420px] shrink-0 overflow-auto border-l border-stone-800 bg-[#efe6d4] text-stone-800 xl:block">
        <Welcome onOpen={onOpen} />
      </aside>
    );
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-30 w-full max-w-[460px] overflow-auto border-l border-stone-700 bg-[#efe6d4] text-stone-800 shadow-2xl md:w-[460px] xl:static xl:z-0 xl:shadow-none">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-300 bg-[#efe6d4]/95 px-4 py-2 backdrop-blur">
        <span className="font-serif text-sm tracking-wide text-stone-600">
          Field notebook
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-200"
        >
          Close
        </button>
      </div>
      <div className="p-4">
        {target.kind === "taxon" ? (
          <TaxonPages
            taxon={getTaxon(target.id)}
            onOpen={onOpen}
            compareId={compareId}
            onCompare={onCompare}
          />
        ) : null}
        {target.kind === "claim" ? (
          <ClaimPage claim={getClaim(target.id)} onOpen={onOpen} />
        ) : null}
        {target.kind === "theory" ? (
          <TheoryPage theory={getTheory(target.id)} onOpen={onOpen} />
        ) : null}
        {target.kind === "fossil" ? (
          <FossilPage fossil={getFossil(target.id)} onOpen={onOpen} />
        ) : null}
        {target.kind === "questions" ? <QuestionsPage onOpen={onOpen} /> : null}
      </div>
    </aside>
  );
}

function Welcome({ onOpen }: { onOpen: (t: PanelTarget) => void }) {
  return (
    <div className="p-5">
      <h2 className="font-serif text-2xl text-stone-900">How to read this</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">
        The horizontal bars are species (or useful grades) through time. Click
        any bar for anatomy, behavior, fossils, and claims. Hatched ends mean
        the date is fuzzy. Status chips run from <strong>settled</strong> to{" "}
        <strong>speculative</strong> — they are editorial, with footnotes back to
        papers, books, and films.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">
        Theory overlays do not replace the science layer. They show where
        different theistic-evolution models would place Adam and Eve, or refuse
        to place them.
      </p>
      <button
        type="button"
        onClick={() => onOpen({ kind: "questions" })}
        className="mt-4 w-full rounded-md bg-stone-900 px-3 py-2 text-left text-sm text-amber-50"
      >
        Open the question list
      </button>
      <div className="mt-4 space-y-2">
        {featuredClaims.slice(0, 4).map((c) => (
          <ClaimCard
            key={c.id}
            claim={c}
            compact
            onOpen={(id) => onOpen({ kind: "claim", id })}
          />
        ))}
      </div>
    </div>
  );
}

function TaxonPages({
  taxon,
  onOpen,
  compareId,
  onCompare,
}: {
  taxon?: Taxon;
  onOpen: (t: PanelTarget) => void;
  compareId: string | null;
  onCompare: (id: string | null) => void;
}) {
  const [tab, setTab] = useState<"overview" | "evidence" | "3d" | "compare">(
    "overview",
  );
  const fossilList = taxon ? fossilsForTaxon(taxon.id) : [];
  const taxonClaims = taxon ? claimsForTaxon(taxon.id) : [];
  const other = compareId ? getTaxon(compareId) : undefined;
  const [blend, setBlend] = useState(0);

  if (!taxon) return <p>Unknown taxon.</p>;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
        {formatRange(taxon.rangeStartKa, taxon.rangeEndKa)}
        {taxon.regions.length ? ` · ${taxon.regions.join(", ")}` : ""}
      </p>
      <h2 className="mt-1 font-serif text-2xl italic text-stone-950">
        {taxon.name}
      </h2>
      {taxon.nickname ? (
        <p className="text-sm text-stone-600">{taxon.nickname}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1">
        {(["overview", "evidence", "3d", "compare"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${
              tab === t
                ? "bg-stone-900 text-amber-50"
                : "bg-stone-200 text-stone-700"
            }`}
          >
            {t === "3d" ? "3D / scans" : t}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="mt-4 space-y-3 text-[13.5px] leading-relaxed">
          <p>{taxon.summary}</p>
          <section>
            <h3 className="font-serif text-lg">Anatomy</h3>
            <p className="mt-1">{taxon.anatomy}</p>
            {taxon.cranialCapacityCc ? (
              <p className="mt-1 text-stone-600">
                Cranial capacity {taxon.cranialCapacityCc[0]}–
                {taxon.cranialCapacityCc[1]} cc
                {taxon.heightCm
                  ? ` · stature roughly ${taxon.heightCm[0]}–${taxon.heightCm[1]} cm`
                  : ""}
              </p>
            ) : null}
          </section>
          <section>
            <h3 className="font-serif text-lg">Behavior &amp; setting</h3>
            <p className="mt-1">{taxon.behavior}</p>
          </section>
          <section>
            <h3 className="font-serif text-lg">How we met them</h3>
            <p className="mt-1">{taxon.discovery}</p>
          </section>
          {taxon.parentId ? (
            <p className="text-sm">
              Often drawn as descending from{" "}
              <button
                type="button"
                className="underline"
                onClick={() => onOpen({ kind: "taxon", id: taxon.parentId! })}
              >
                {getTaxon(taxon.parentId)?.name}
              </button>
              . Treat arrows on popular posters as hypotheses.
            </p>
          ) : null}
        </div>
      ) : null}

      {tab === "evidence" ? (
        <div className="mt-4 space-y-3">
          {taxonClaims.length === 0 ? (
            <p className="text-sm">No standalone claims tagged yet.</p>
          ) : null}
          {taxonClaims.map((c) => (
            <ClaimCard
              key={c.id}
              claim={c}
              onOpen={(id) => onOpen({ kind: "claim", id })}
            />
          ))}
        </div>
      ) : null}

      {tab === "3d" ? (
        <div className="mt-4 space-y-4">
          <MorphospaceKeyed a={taxon.morph} label={taxon.name} />
          {fossilList.map((f) => (
            <div key={f.id} className="rounded-md border border-stone-300 p-2">
              <button
                type="button"
                className="font-serif text-base underline"
                onClick={() => onOpen({ kind: "fossil", id: f.id })}
              >
                {f.name}
              </button>
              <p className="text-[12px] text-stone-600">
                {f.site} · {f.notes}
              </p>
              <div className="mt-2">
                <FossilViewer fossil={f} />
              </div>
            </div>
          ))}
          <p className="text-[11px] text-stone-500">
            Casts: Digital Atlas of Ancient Life (Cornell) on Sketchfab, CC
            BY-NC-SA. Smithsonian scans of Hall of Human Origins casts are
            view-only on si.edu. African Fossils (Turkana / NMK) is another
            public 3D lab.
          </p>
        </div>
      ) : null}

      {tab === "compare" ? (
        <div className="mt-4 space-y-3">
          <label className="block text-sm">
            Compare with
            <select
              className="mt-1 w-full rounded border border-stone-400 bg-white p-1.5 text-sm"
              value={compareId ?? ""}
              onChange={(e) => onCompare(e.target.value || null)}
            >
              <option value="">Choose a taxon…</option>
              {taxa
                .filter((t) => t.id !== taxon.id)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </label>
          {other ? (
            <>
              <label className="block text-xs text-stone-600">
                Morph blend ({taxon.name} → {other.name})
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(blend * 100)}
                  onChange={(e) => setBlend(Number(e.target.value) / 100)}
                  className="mt-1 w-full"
                />
              </label>
              <MorphospaceKeyed
                a={taxon.morph}
                b={other.morph}
                blend={blend}
                label={`${taxon.name} ↔ ${other.name}`}
              />
              <CompareTable a={taxon} b={other} onOpen={onOpen} />
            </>
          ) : (
            <p className="text-sm text-stone-600">
              Tip: compare Neanderthals with Denisovans, or habilis with
              erectus.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CompareTable({
  a,
  b,
  onOpen,
}: {
  a: Taxon;
  b: Taxon;
  onOpen: (t: PanelTarget) => void;
}) {
  const rows = [
    [
      "Range",
      formatRange(a.rangeStartKa, a.rangeEndKa),
      formatRange(b.rangeStartKa, b.rangeEndKa),
    ],
    [
      "Brain (cc)",
      a.cranialCapacityCc ? a.cranialCapacityCc.join("–") : "—",
      b.cranialCapacityCc ? b.cranialCapacityCc.join("–") : "—",
    ],
    ["Regions", a.regions.join(", "), b.regions.join(", ")],
  ];
  return (
    <div>
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="text-stone-500">
            <th className="py-1 font-medium"> </th>
            <th className="py-1 font-medium">{a.name}</th>
            <th className="py-1 font-medium">{b.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-stone-300 align-top">
              <td className="py-1 pr-2 text-stone-500">{r[0]}</td>
              <td className="py-1 pr-2">{r[1]}</td>
              <td className="py-1">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 grid gap-2">
        <p className="text-[12px] leading-relaxed">{a.anatomy}</p>
        <p className="text-[12px] leading-relaxed">{b.anatomy}</p>
      </div>
      <button
        type="button"
        className="mt-2 text-sm underline"
        onClick={() => onOpen({ kind: "taxon", id: b.id })}
      >
        Open {b.name}
      </button>
    </div>
  );
}

function ClaimPage({
  claim,
  onOpen,
}: {
  claim?: Claim;
  onOpen: (t: PanelTarget) => void;
}) {
  if (!claim) return <p>Unknown claim.</p>;
  return (
    <div>
      <ClaimCard claim={claim} />
      {claim.taxonIds?.length ? (
        <div className="mt-4">
          <h3 className="font-serif text-lg">Related taxa</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {claim.taxonIds.map((id) => {
              const t = getTaxon(id);
              if (!t) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOpen({ kind: "taxon", id })}
                  className="rounded-full px-2 py-0.5 text-[11px] text-stone-900"
                  style={{ background: t.color }}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {claim.relatedClaimIds?.length ? (
        <div className="mt-4 space-y-2">
          <h3 className="font-serif text-lg">Related questions</h3>
          {claim.relatedClaimIds.map((id) => {
            const c = getClaim(id);
            if (!c) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onOpen({ kind: "claim", id })}
                className="block text-left text-sm underline"
              >
                {c.question}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function TheoryPage({
  theory,
  onOpen,
}: {
  theory?: Theory;
  onOpen: (t: PanelTarget) => void;
}) {
  if (!theory) return <p>Unknown theory.</p>;
  const sources = theory.sourceIds.map((id) => getSource(id)).filter(Boolean);
  return (
    <div className="space-y-3 text-[13.5px] leading-relaxed">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
        {theory.kind.replace("-", " ")}
        {theory.year ? ` · ${theory.year}` : ""}
      </p>
      <h2 className="font-serif text-2xl text-stone-950">{theory.name}</h2>
      <p className="text-sm text-stone-600">{theory.author}</p>
      <StatusBadge status={theory.status} showHint />
      <p>{theory.summary}</p>
      <p className="rounded-md bg-stone-200/70 p-2 text-sm">{theory.howToRead}</p>
      <h3 className="font-serif text-lg">What it claims</h3>
      <ul className="list-disc space-y-1 pl-5">
        {theory.claims.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <h3 className="font-serif text-lg">Pressures on the model</h3>
      <ul className="list-disc space-y-1 pl-5">
        {theory.critiques.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p className="text-[12px] italic text-stone-500">{theory.statusRationale}</p>
      <ol className="space-y-1 text-[12px]">
        {sources.map((s, i) =>
          s ? (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                [{i + 1}] {s.title}
                {s.year ? ` (${s.year})` : ""}
              </a>
            </li>
          ) : null,
        )}
      </ol>
      {theory.coversTaxonIds?.map((id) => {
        const t = getTaxon(id);
        if (!t) return null;
        return (
          <button
            key={id}
            type="button"
            className="mr-1 text-sm underline"
            onClick={() => onOpen({ kind: "taxon", id })}
          >
            {t.name}
          </button>
        );
      })}
    </div>
  );
}

function FossilPage({
  fossil,
  onOpen,
}: {
  fossil?: Fossil;
  onOpen: (t: PanelTarget) => void;
}) {
  if (!fossil) return <p>Unknown fossil.</p>;
  const taxon = getTaxon(fossil.taxonId);
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-2xl">{fossil.name}</h2>
      <p className="text-sm text-stone-600">
        {fossil.specimen ? `${fossil.specimen} · ` : ""}
        {fossil.site}
      </p>
      <p className="text-[13.5px] leading-relaxed">{fossil.notes}</p>
      <FossilViewer fossil={fossil} />
      {taxon ? (
        <button
          type="button"
          className="text-sm underline"
          onClick={() => onOpen({ kind: "taxon", id: taxon.id })}
        >
          Back to {taxon.name}
        </button>
      ) : null}
    </div>
  );
}

function QuestionsPage({ onOpen }: { onOpen: (t: PanelTarget) => void }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    if (!q.trim()) return claims;
    const n = q.toLowerCase();
    return claims.filter(
      (c) =>
        c.question.toLowerCase().includes(n) ||
        c.summary.toLowerCase().includes(n),
    );
  }, [q]);

  return (
    <div>
      <h2 className="font-serif text-2xl">Questions</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Denisovans, fire, Adam…"
        className="mt-2 w-full rounded border border-stone-400 bg-white px-2 py-1.5 text-sm"
      />
      <div className="mt-3 space-y-2">
        {list.map((c) => (
          <ClaimCard
            key={c.id}
            claim={c}
            compact
            onOpen={(id) => onOpen({ kind: "claim", id })}
          />
        ))}
      </div>
      <h3 className="mt-6 font-serif text-lg">Theory overlays</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {theories
          .filter((t) => t.id !== "consensus")
          .map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="underline"
                onClick={() => onOpen({ kind: "theory", id: t.id })}
              >
                {t.name}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
