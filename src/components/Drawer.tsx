"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  claimsForTaxon,
  fossilsForTaxon,
  getClaim,
  getFossil,
  getSource,
  getTaxon,
  getTheory,
} from "@/data/catalog";
import { cultureById } from "@/data/culture";
import { figureFor, STATURE_CM } from "@/data/figures";
import { methodById } from "@/data/methods";
import { migrations } from "@/data/migrations";
import type { Fossil, Source } from "@/data/types";
import { commonsFileUrl, formatKa, formatRange, sketchfabEmbed, STATUS_BLURB } from "@/lib/format";
import { THEORY_COLOR, taxonColor, taxonSoft } from "@/lib/palette";
import { skullParams } from "@/lib/skull";
import { timeStore } from "@/lib/timeStore";
import { notebook, useNotebook } from "@/lib/notebook";
import { Ref, Rich } from "./Popups";
import { notice } from "./SkullLab";
import { Figure, StatusBadge, type OpenFn, type PanelTarget } from "./ui";

const SkullViewer = dynamic(() => import("./SkullViewer"), { ssr: false });

const KIND_LABEL: Record<Source["kind"], string> = {
  paper: "Paper",
  review: "Review",
  book: "Book",
  video: "Video",
  museum: "Museum",
  database: "Database",
  essay: "Essay",
};

function Sources({ ids }: { ids: string[] }) {
  const list = ids.map(getSource).filter((s): s is Source => !!s);
  if (!list.length) return null;
  return (
    <section className="mt-7">
      <h3 className="kicker text-[var(--faint)]">Sources</h3>
      <ol className="mt-3 space-y-2.5">
        {list.map((s, i) => (
          <li key={s.id} className="flex gap-3 text-[13px] leading-snug">
            <Ref target={{ kind: "source", id: s.id }} className="w-5 shrink-0 text-right tabular-nums text-[var(--faint)]">{i + 1}</Ref>
            <span className="min-w-0">
              <a href={s.url} target="_blank" rel="noreferrer" className="font-medium text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-[3px] hover:decoration-[var(--green)]">
                {s.title}
              </a>
              <span className="mt-0.5 block text-[12px] text-[var(--faint)]">
                <span className="mr-1.5 rounded bg-[var(--panel)] px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--muted)]">{KIND_LABEL[s.kind]}</span>
                {[s.authors, s.year].filter(Boolean).join(", ")}
                {s.note ? ` · ${s.note}` : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StatusBlock({ status, rationale }: { status: Parameters<typeof StatusBadge>[0]["status"]; rationale: string }) {
  return (
    <div className="mt-5 rounded-2xl bg-[var(--panel)] p-4">
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        <span className="text-[12px] text-[var(--faint)]">{STATUS_BLURB[status]}</span>
      </div>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--muted)]">
        <strong className="font-semibold text-[var(--ink)]">Why this grade. </strong>
        <Rich text={rationale} />
      </p>
    </div>
  );
}

function TaxonChip({ id }: { id: string; onOpen?: OpenFn }) {
  const t = getTaxon(id);
  if (!t) return null;
  return (
    <Ref target={{ kind: "taxon", id }} plain className="inline-flex cursor-pointer transition hover:brightness-95">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] italic"
        style={{ background: taxonSoft(id), color: taxonColor(id) }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: taxonColor(id) }} />
        {t.name}
      </span>
    </Ref>
  );
}

export function FossilViewer({ fossil }: { fossil: Fossil }) {
  const [loaded, setLoaded] = useState<string | null>(null);
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="space-y-3">
      {fossil.viewers.map((v, i) =>
        v.type === "sketchfab" && v.modelId ? (
          <figure key={i} className="overflow-hidden rounded-2xl border border-[var(--line)]">
            {loaded === v.modelId ? (
              <iframe
                title={v.caption}
                src={sketchfabEmbed(v.modelId)}
                className="aspect-[4/3] w-full bg-[#1a1f1c]"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setLoaded(v.modelId!)}
                className="stage group grid aspect-[4/3] w-full place-items-center"
              >
                <span className="flex flex-col items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--ink)] text-white transition group-hover:scale-105 group-hover:bg-[var(--green)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M12 2.5 3.5 7v10l8.5 4.5 8.5-4.5V7L12 2.5Z" /><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" /></svg>
                  </span>
                  <span className="text-[13.5px] font-medium text-[var(--ink)]">Load the 3D scan</span>
                  <span className="text-[11.5px] text-[var(--faint)]">Opens an interactive viewer from Sketchfab</span>
                </span>
              </button>
            )}
            <figcaption className="border-t border-[var(--line)] bg-white px-3.5 py-2.5 text-[12px] leading-snug text-[var(--muted)]">
              {v.caption}. <span className="text-[var(--faint)]">{v.credit}</span>
            </figcaption>
          </figure>
        ) : v.url ? (
          <a key={i} href={v.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 transition hover:border-[var(--green)]">
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-medium text-[var(--ink)]">{v.caption}</span>
              <span className="block text-[12px] text-[var(--faint)]">{v.credit}</span>
            </span>
            <span className="text-[13px] text-[var(--green)]">Open ↗</span>
          </a>
        ) : null,
      )}
      {fossil.image && imgOk ? (
        <figure className="overflow-hidden rounded-2xl border border-[var(--line)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={commonsFileUrl(fossil.image.filename, 900)}
            alt={fossil.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="max-h-[420px] w-full bg-[var(--panel)] object-contain"
          />
          <figcaption className="border-t border-[var(--line)] px-3.5 py-2.5 text-[12px] text-[var(--muted)]">
            {fossil.image.credit} · {fossil.image.license} · Wikimedia Commons
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}

function TaxonPage({ id, onOpen }: { id: string; onOpen: OpenFn }) {
  const t = getTaxon(id);
  const [tab, setTab] = useState<"about" | "evidence" | "fossils">("about");
  if (!t) return null;
  const color = taxonColor(id);
  const fig = figureFor(id);
  const fossils = fossilsForTaxon(id);
  const taxonClaims = claimsForTaxon(id);
  const routes = migrations.filter((m) => m.taxonId === id);
  const parent = t.parentId ? getTaxon(t.parentId) : undefined;
  const facts: [string, string][] = [
    ["Lived", formatRange(t.rangeStartKa, t.rangeEndKa)],
    ["Brain", t.cranialCapacityCc ? `${t.cranialCapacityCc[0]}–${t.cranialCapacityCc[1]} cc` : "unknown"],
    ["Height", t.heightCm ? `${t.heightCm[0]}–${t.heightCm[1]} cm` : `about ${STATURE_CM[id]} cm (estimate)`],
    ["Found in", t.regions.join(", ")],
  ];
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl" style={{ background: taxonSoft(id) }}>
        <div className="flex items-end">
          <div className="flex h-[210px] w-[36%] items-end justify-center pb-4 pl-3">
            <Figure taxonId={id} height={Math.min(182, STATURE_CM[id] * 1.05)} color={color} />
          </div>
          <SkullViewer items={[{ key: id, params: skullParams(id) }]} className="h-[210px] flex-1" />
        </div>
        <button
          type="button"
          onClick={() => {
            timeStore.pause();
            timeStore.setKa((t.rangeStartKa + t.rangeEndKa) / 2);
            document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1.5 text-[12px] font-medium text-[var(--ink)] backdrop-blur transition hover:bg-white"
        >
          Show on the globe
        </button>
      </div>
      {fig?.proxyFor ? (
        <p className="mt-2 text-[11.5px] text-[var(--faint)]">
          No silhouette exists for this species; the figure shown is its relative <em>{getTaxon(fig.proxyFor)?.name}</em>.
        </p>
      ) : null}

      <p className="kicker mt-6" style={{ color }}>{t.nickname ?? "Species"}</p>
      <h2 className="display mt-1.5 text-[32px] italic leading-tight text-[var(--ink)]">{t.name}</h2>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--line)] ring-1 ring-[var(--line)]">
        {facts.map(([k, v]) => (
          <div key={k} className="bg-white px-4 py-3">
            <dt className="text-[11px] text-[var(--faint)]">{k}</dt>
            <dd className="mt-0.5 text-[14px] font-medium leading-snug text-[var(--ink)]">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex gap-1 rounded-full bg-[var(--panel)] p-1">
        {([
          ["about", "About"],
          ["evidence", `Evidence (${taxonClaims.length})`],
          ["fossils", `Fossils (${fossils.length})`],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`flex-1 rounded-full px-3 py-2 text-[13px] font-medium transition ${
              tab === k ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "about" ? (
        <div className="mt-5 space-y-5 text-[15px] leading-[1.65] text-[var(--muted)]">
          <p className="text-[16px] text-[var(--ink)]"><Rich text={t.summary} skip={id} /></p>
          <section>
            <h3 className="mb-1.5 text-[14px] font-semibold text-[var(--ink)]">What to notice in the skull</h3>
            <ul className="space-y-1">
              {notice(skullParams(id)).map((n) => (
                <li key={n} className="flex gap-2.5 text-[14px]">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                  {n}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-1 text-[14px] font-semibold text-[var(--ink)]">Anatomy</h3>
            <p><Rich text={t.anatomy} skip={id} /></p>
          </section>
          <section>
            <h3 className="mb-1 text-[14px] font-semibold text-[var(--ink)]">Behaviour and setting</h3>
            <p><Rich text={t.behavior} skip={id} /></p>
          </section>
          <section>
            <h3 className="mb-1 text-[14px] font-semibold text-[var(--ink)]">How it was found</h3>
            <p><Rich text={t.discovery} skip={id} /></p>
          </section>
          {parent ? (
            <p className="rounded-2xl bg-[var(--panel)] p-4 text-[13.5px]">
              Often drawn as descending from <TaxonChip id={parent.id} onOpen={onOpen} />. Ancestor-and-descendant arrows are hypotheses; fossils rarely prove them.
            </p>
          ) : null}
          {routes.length ? (
            <section>
              <h3 className="mb-2 text-[14px] font-semibold text-[var(--ink)]">Journeys on the globe</h3>
              <div className="space-y-2">
                {routes.map((m) => (
                  <button key={m.id} type="button" onClick={() => onOpen({ kind: "route", id: m.id })} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-2.5 text-left text-[13.5px] transition hover:border-[var(--green)]">
                    <span className="min-w-0 flex-1 text-[var(--ink)]">{m.label}</span>
                    <span className="text-[12px] tabular-nums text-[var(--faint)]">{formatKa(m.startKa)}</span>
                    <StatusBadge status={m.status} compact />
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {tab === "evidence" ? (
        <div className="mt-5 space-y-2.5">
          {taxonClaims.length === 0 ? <p className="text-[14px] text-[var(--muted)]">No separate questions are filed under this species yet.</p> : null}
          {taxonClaims.map((c) => (
            <button key={c.id} type="button" onClick={() => onOpen({ kind: "claim", id: c.id })} className="block w-full rounded-2xl border border-[var(--line)] p-4 text-left transition hover:border-[var(--green)]">
              <StatusBadge status={c.status} />
              <span className="display mt-2 block text-[17px] leading-snug text-[var(--ink)]">{c.question}</span>
              <span className="mt-1 block text-[12px] text-[var(--faint)]">{c.sourceIds.length} sources</span>
            </button>
          ))}
        </div>
      ) : null}

      {tab === "fossils" ? (
        <div className="mt-5 space-y-6">
          {fossils.length === 0 ? <p className="text-[14px] text-[var(--muted)]">No individual fossils are catalogued here yet.</p> : null}
          {fossils.map((f) => (
            <FossilBlock key={f.id} fossil={f} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FossilBlock({ fossil }: { fossil: Fossil }) {
  return (
    <article>
      <h3 className="display text-[20px] text-[var(--ink)]">{fossil.name}</h3>
      <p className="mt-0.5 text-[12.5px] text-[var(--faint)]">
        {[fossil.specimen, fossil.site, formatKa(fossil.ageKa)].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">{fossil.notes}</p>
      <div className="mt-3">
        <FossilViewer fossil={fossil} />
      </div>
    </article>
  );
}

function Body({ target, onOpen }: { target: PanelTarget; onOpen: OpenFn }) {
  if (target.kind === "taxon") return <TaxonPage key={target.id} id={target.id} onOpen={onOpen} />;

  if (target.kind === "claim") {
    const c = getClaim(target.id);
    if (!c) return null;
    return (
      <div>
        <p className="kicker text-[var(--green)]">Question</p>
        <h2 className="display mt-2 text-[30px] leading-[1.12] text-[var(--ink)]">{c.question}</h2>
        <StatusBlock status={c.status} rationale={c.statusRationale} />
        <p className="mt-5 text-[15.5px] leading-[1.7] text-[var(--ink)]">
          <Rich text={c.summary} sources={c.sourceIds} />
        </p>
        {c.taxonIds?.length ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {c.taxonIds.map((id) => (
              <TaxonChip key={id} id={id} onOpen={onOpen} />
            ))}
          </div>
        ) : null}
        <Sources ids={c.sourceIds} />
        {c.relatedClaimIds?.length ? (
          <section className="mt-7">
            <h3 className="kicker text-[var(--faint)]">Keep asking</h3>
            <div className="mt-3 space-y-2">
              {c.relatedClaimIds.map((id) => {
                const r = getClaim(id);
                return r ? (
                  <Ref key={id} target={{ kind: "claim", id }} plain className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 text-left text-[14px] text-[var(--ink)] transition hover:border-[var(--green)]">
                    <span className="min-w-0 flex-1">{r.question}</span>
                    <StatusBadge status={r.status} compact />
                  </Ref>
                ) : null;
              })}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  if (target.kind === "theory") {
    const t = getTheory(target.id);
    if (!t) return null;
    const color = THEORY_COLOR[t.id];
    return (
      <div>
        <p className="kicker" style={{ color }}>
          {t.kind === "scientific" ? "Scientific consensus" : "Theological model"} · {t.author}{t.year ? `, ${t.year}` : ""}
        </p>
        <h2 className="display mt-2 text-[30px] leading-[1.12] text-[var(--ink)]">{t.name}</h2>
        <StatusBlock status={t.status} rationale={t.statusRationale} />
        <p className="mt-5 text-[15.5px] leading-[1.7] text-[var(--ink)]"><Rich text={t.summary} /></p>
        {t.overlay ? (
          <div className="mt-5 rounded-2xl border-l-4 bg-[var(--panel)] p-4 text-[13.5px] leading-relaxed text-[var(--muted)]" style={{ borderColor: color }}>
            <strong className="font-semibold text-[var(--ink)]">On the timeline: </strong>
            {t.overlay.label}, {formatRange(t.overlay.startKa, t.overlay.endKa)}, {t.overlay.region}. {t.howToRead}
          </div>
        ) : (
          <p className="mt-5 rounded-2xl bg-[var(--panel)] p-4 text-[13.5px] leading-relaxed text-[var(--muted)]">{t.howToRead}</p>
        )}
        <div className="mt-6 grid gap-5">
          <section>
            <h3 className="text-[14px] font-semibold text-[var(--ink)]">What it claims</h3>
            <ul className="mt-2 space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
              {t.claims.map((c) => (
                <li key={c} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} /><span><Rich text={c} /></span></li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-[14px] font-semibold text-[var(--ink)]">Where it is under pressure</h3>
            <ul className="mt-2 space-y-2 text-[14px] leading-relaxed text-[var(--muted)]">
              {t.critiques.map((c) => (
                <li key={c} className="flex gap-2.5"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#e8703a]" /><span><Rich text={c} /></span></li>
              ))}
            </ul>
          </section>
        </div>
        {t.coversTaxonIds?.length ? (
          <div className="mt-6">
            <h3 className="text-[14px] font-semibold text-[var(--ink)]">Who would count as Adam’s descendants</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {t.coversTaxonIds.map((id) => (
                <TaxonChip key={id} id={id} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ) : null}
        <Sources ids={t.sourceIds} />
      </div>
    );
  }

  if (target.kind === "fossil") {
    const f = getFossil(target.id);
    if (!f) return null;
    return (
      <div>
        <p className="kicker text-[var(--green)]">Fossil</p>
        <div className="mt-2">
          <FossilBlock fossil={f} />
        </div>
        <div className="mt-5">
          <TaxonChip id={f.taxonId} onOpen={onOpen} />
        </div>
      </div>
    );
  }

  if (target.kind === "culture") {
    const c = cultureById[target.id];
    if (!c) return null;
    const related = c.claimId ? getClaim(c.claimId) : undefined;
    return (
      <div>
        <p className="kicker text-[var(--green)]">
          Tools and behaviour · {c.startKa === c.endKa ? `about ${formatKa(c.startKa)}` : formatRange(c.startKa, c.endKa)}
        </p>
        <h2 className="display mt-2 text-[30px] leading-[1.12] text-[var(--ink)]">{c.label}</h2>
        <div className="mt-4 flex items-center gap-2">
          <StatusBadge status={c.status} />
          <span className="text-[12px] text-[var(--faint)]">{STATUS_BLURB[c.status]}</span>
        </div>
        <p className="mt-5 text-[15.5px] leading-[1.7] text-[var(--ink)]">
          <Rich text={c.summary} sources={c.sourceIds} />
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              timeStore.pause();
              timeStore.setKa(c.startKa);
              document.getElementById("tree")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full bg-[var(--ink)] px-3.5 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)]"
          >
            Show on the timeline
          </button>
        </div>
        {related ? (
          <section className="mt-7">
            <h3 className="kicker text-[var(--faint)]">Related question</h3>
            <Ref target={{ kind: "claim", id: related.id }} plain className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 text-left text-[14px] text-[var(--ink)] transition hover:border-[var(--green)]">
              <span className="min-w-0 flex-1">{related.question}</span>
              <StatusBadge status={related.status} compact />
            </Ref>
          </section>
        ) : null}
        <Sources ids={c.sourceIds} />
      </div>
    );
  }

  if (target.kind === "method") {
    const m = methodById[target.id];
    if (!m) return null;
    return (
      <div>
        <p className="kicker text-[var(--green)]">How we know</p>
        <h2 className="display mt-2 text-[30px] leading-[1.12] text-[var(--ink)]">{m.title}</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-[var(--muted)]">{m.short}</p>
        <div className="mt-5 space-y-4 text-[15.5px] leading-[1.7] text-[var(--ink)]">
          {m.body.map((para) => (
            <p key={para.slice(0, 40)}>
              <Rich text={para} sources={m.sourceIds} />
            </p>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border-l-4 border-[#e0a200] bg-[var(--panel)] p-4 text-[13.5px] leading-relaxed text-[var(--muted)]">
          <strong className="font-semibold text-[var(--ink)]">Limits. </strong>
          {m.limits}
        </div>
        <Sources ids={m.sourceIds} />
      </div>
    );
  }

  const m = migrations.find((x) => x.id === target.id);
  if (!m) return null;
  return (
    <div>
      <p className="kicker" style={{ color: taxonColor(m.taxonId) }}>Journey · {formatRange(m.startKa, m.endKa)}</p>
      <h2 className="display mt-2 text-[30px] leading-[1.12] text-[var(--ink)]">{m.label}</h2>
      <StatusBlock status={m.status} rationale="Routes are the least certain thing on the globe. Dated sites fix where people were; the line between them is the simplest path over land that fits." />
      <p className="mt-5 text-[15.5px] leading-[1.7] text-[var(--ink)]"><Rich text={m.notes} sources={m.sourceIds} /></p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <TaxonChip id={m.taxonId} onOpen={onOpen} />
        <button
          type="button"
          onClick={() => {
            timeStore.setKa(m.startKa);
            timeStore.play();
            document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="rounded-full bg-[var(--ink)] px-3.5 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--green-deep)]"
        >
          ▶ Watch it on the globe
        </button>
      </div>
      <Sources ids={m.sourceIds} />
    </div>
  );
}

export function Drawer({
  stack,
  onOpen,
  onBack,
  onClose,
}: {
  stack: PanelTarget[];
  onOpen: OpenFn;
  onBack: () => void;
  onClose: () => void;
}) {
  const target = stack[stack.length - 1];
  const scroll = useRef<HTMLDivElement>(null);
  const key = target ? `${target.kind}:${target.id}` : "";
  const nb = useNotebook();
  const [copied, setCopied] = useState(false);
  const saved = !!target && nb.items.some((i) => i.kind === target.kind && i.id === target.id);
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
  }, [key]);
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  if (!target) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#04241a]/30 backdrop-blur-[2px]" />
      <aside
        role="dialog"
        aria-modal="true"
        className="drawer-in absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-white shadow-[-30px_0_80px_-30px_rgba(4,36,26,0.45)] sm:inset-y-3 sm:right-3 sm:rounded-[26px]"
      >
        <div className="flex items-center gap-2 px-4 pb-2 pt-4">
          {stack.length > 1 ? (
            <button type="button" onClick={onBack} className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[var(--muted)] transition hover:bg-[var(--panel)]">
              ← Back
            </button>
          ) : null}
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(`${window.location.origin}${window.location.pathname}#/${target.kind}/${target.id}`)
                .then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                })
                .catch(() => {});
            }}
            className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-[var(--muted)] transition hover:bg-[var(--panel)]"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            aria-pressed={saved}
            onClick={() => notebook.toggle(target.kind, target.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
              saved ? "bg-[var(--green-soft)] text-[var(--green)]" : "text-[var(--muted)] hover:bg-[var(--panel)]"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M3.5 1.5h9v13l-4.5-3-4.5 3z" /></svg>
            {saved ? "Saved" : "Save"}
          </button>
          <button type="button" onClick={onClose} aria-label="Close panel" className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] transition hover:bg-[var(--panel)]">
            <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l12 12M13 1 1 13" /></svg>
          </button>
        </div>
        <div ref={scroll} className="thin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-1">
          <Body target={target} onOpen={onOpen} />
        </div>
      </aside>
    </div>
  );
}
