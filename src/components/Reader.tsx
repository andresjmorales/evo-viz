"use client";

import type { ReactNode } from "react";
import { getClaim, getSource, getTaxon } from "@/data/catalog";
import { STATURE_CM } from "@/data/figures";
import { glossary } from "@/data/glossary";
import { CHAPTERS } from "@/data/story";
import { theories } from "@/data/theories";
import type { Claim, Source } from "@/data/types";
import { formatRange } from "@/lib/format";
import { THEORY_COLOR, taxonColor } from "@/lib/palette";
import { Footer, NAV } from "./App";
import { Ref, Rich } from "./Popups";
import { Workspace } from "./Workspace";
import { Figure, StatusBadge } from "./ui";

/** Which questions are discussed under which chapter. */
const CLAIMS_BY_CHAPTER: Record<string, string[]> = {
  split: ["sahel-hominin", "orrorin-biped", "not-a-chimp"],
  walk: ["bipedalism-first", "anamensis-afarensis", "lucy-ancestor"],
  bush: ["early-homo-mess", "sediba-homo", "tools-who", "paranthropus-side", "paranthropus-diet"],
  leave: ["out-of-africa-1", "erectus-one-species", "fire", "island-dwarfs", "climate-driver"],
  brains: ["heidelberg-real", "antecessor-position", "lca-neand-sapiens"],
  several: ["denisovan-distinct", "longi-denisovan", "african-origin", "structured-africa", "naledi-recent", "naledi-burial", "neanderthal-mind", "adna-trust"],
  meet: ["introgression", "ooa-timing", "sea-level-routes", "behavior-revolution", "oldest-art"],
  alone: ["neanderthal-extinction", "first-americans"],
};
const TAXA_BY_CHAPTER: Record<string, string[]> = {
  split: ["sahelanthropus", "orrorin"],
  walk: ["ardipithecus", "anamensis", "afarensis"],
  bush: ["africanus", "sediba", "boisei", "robustus", "habilis", "rudolfensis"],
  leave: ["erectus", "floresiensis"],
  brains: ["antecessor", "heidelbergensis"],
  several: ["neanderthal", "denisovan", "longi", "naledi", "sapiens"],
  meet: [],
  alone: [],
};
const THEOLOGY_CLAIMS = ["swamidass-gae", "craig-adam", "kemp-ensoulment"];

/** A block of text with a note set beside it in the margin on wide screens. */
function Row({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="grid gap-x-10 gap-y-3 xl:grid-cols-[minmax(0,640px)_250px]">
      <div className="min-w-0">{children}</div>
      {note ? <aside className="text-[12.5px] leading-relaxed text-[var(--muted)] xl:pt-1">{note}</aside> : <span className="hidden xl:block" />}
    </div>
  );
}

function SourceNotes({ ids }: { ids: string[] }) {
  const list = ids.map(getSource).filter((s): s is Source => !!s);
  return (
    <ol className="space-y-2 border-l-2 border-[var(--line)] pl-3.5">
      {list.map((s, i) => (
        <li key={s.id}>
          <span className="mr-1 tabular-nums text-[var(--green)]">{i + 1}</span>
          <Ref target={{ kind: "source", id: s.id }} className="text-[var(--ink)]">
            {[s.authors, s.year].filter(Boolean).join(" ") || s.title}
          </Ref>
          {s.authors ? <span className="block text-[var(--faint)]">{s.title}</span> : null}
        </li>
      ))}
    </ol>
  );
}

function ClaimBlock({ claim }: { claim: Claim }) {
  return (
    <Row note={<SourceNotes ids={claim.sourceIds} />}>
      <div id={`q-${claim.id}`} className="scroll-mt-24">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={claim.status} />
        </div>
        <h4 className="display mt-2 text-[23px] leading-snug text-[var(--ink)]">
          <Ref target={{ kind: "claim", id: claim.id }} plain className="cursor-pointer text-left hover:underline">
            {claim.question}
          </Ref>
        </h4>
        <p className="mt-2.5">
          <Rich text={claim.summary} sources={claim.sourceIds} />
        </p>
        <p className="mt-2.5 text-[15px] italic text-[var(--muted)]">
          <span className="not-italic font-semibold text-[var(--ink)]">Why this grade. </span>
          <Rich text={claim.statusRationale} />
        </p>
      </div>
    </Row>
  );
}

function TaxonBlock({ id }: { id: string }) {
  const t = getTaxon(id);
  if (!t) return null;
  const color = taxonColor(id);
  return (
    <Row
      note={
        <div className="flex items-end gap-3 border-l-2 pl-3.5" style={{ borderColor: color }}>
          <Figure taxonId={id} height={Math.round(STATURE_CM[id] * 0.5)} color={color} />
          <dl className="space-y-0.5">
            <div>{formatRange(t.rangeStartKa, t.rangeEndKa)}</div>
            {t.cranialCapacityCc ? <div>brain {t.cranialCapacityCc[0]}–{t.cranialCapacityCc[1]} cc</div> : null}
            <div className="text-[var(--faint)]">{t.regions.join(", ")}</div>
          </dl>
        </div>
      }
    >
      <h4 className="text-[18px] font-semibold italic" style={{ color }}>
        <Ref target={{ kind: "taxon", id }} plain className="cursor-pointer text-left italic hover:underline">
          {t.name}
        </Ref>
        {t.nickname ? <span className="ml-2 text-[13px] font-normal not-italic text-[var(--faint)]">{t.nickname}</span> : null}
      </h4>
      <p className="mt-1.5">
        <Rich text={t.summary} skip={id} />
      </p>
    </Row>
  );
}

export function Reader() {
  const tm = theories.filter((t) => t.kind !== "scientific");
  return (
    <Workspace nav={NAV}>
      <div className="mx-auto flex max-w-[1240px] gap-10 px-5 pb-10 pt-12 sm:px-8">
        <nav aria-label="Contents" className="sticky top-24 hidden h-[calc(100vh-7rem)] w-[190px] shrink-0 overflow-y-auto pr-2 text-[13px] lg:block">
          <p className="kicker mb-3 text-[10.5px] text-[var(--faint)]">Contents</p>
          <ol className="space-y-1.5">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a href={`#ch-${c.id}`} className="flex gap-2 leading-snug text-[var(--muted)] hover:text-[var(--ink)]">
                  <span className="tabular-nums text-[var(--faint)]">{i + 1}</span>
                  {c.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#ch-adam" className="flex gap-2 leading-snug text-[var(--muted)] hover:text-[var(--ink)]">
                <span className="tabular-nums text-[var(--faint)]">{CHAPTERS.length + 1}</span>
                Adam and Eve
              </a>
            </li>
            <li>
              <a href="#ch-glossary" className="flex gap-2 leading-snug text-[var(--muted)] hover:text-[var(--ink)]">
                <span className="text-[var(--faint)]">A</span>
                Glossary
              </a>
            </li>
          </ol>
        </nav>

        <article className="min-w-0 flex-1 text-[16.5px] leading-[1.72] text-[var(--ink)]">
          <Row>
            <p className="kicker text-[var(--green)]">Field notes</p>
            <h1 className="display mt-3 text-[44px] leading-[1.06] sm:text-[54px]">Seven million years, read straight through</h1>
            <p className="mt-5 text-[18px] leading-relaxed text-[var(--muted)]">
              Everything in the atlas as one document. Hover a species name
              or a dotted term for a note. Small numbers are sources; they
              are listed in the margin and open on hover. Use the bookmark on
              any note to keep it in your notebook.
            </p>
          </Row>

          {CHAPTERS.map((c, i) => (
            <section key={c.id} id={`ch-${c.id}`} className="scroll-mt-24 pt-16">
              <Row>
                <p className="kicker text-[var(--green)]">
                  {i + 1} · {c.kicker}
                </p>
                <h2 className="display mt-2 text-[36px] leading-[1.1]">{c.title}</h2>
                <p className="mt-4 text-[18px] leading-relaxed">
                  <Rich text={c.body} />
                </p>
              </Row>
              {TAXA_BY_CHAPTER[c.id].length ? (
                <div className="mt-9 space-y-7">
                  <h3 className="kicker text-[var(--faint)]">Who was there</h3>
                  {TAXA_BY_CHAPTER[c.id].map((id) => (
                    <TaxonBlock key={id} id={id} />
                  ))}
                </div>
              ) : null}
              <div className="mt-10 space-y-10">
                <h3 className="kicker text-[var(--faint)]">Open questions</h3>
                {CLAIMS_BY_CHAPTER[c.id].map((id) => {
                  const claim = getClaim(id);
                  return claim ? <ClaimBlock key={id} claim={claim} /> : null;
                })}
              </div>
            </section>
          ))}

          <section id="ch-adam" className="scroll-mt-24 pt-16">
            <Row>
              <p className="kicker text-[var(--green)]">{CHAPTERS.length + 1} · Faith and science</p>
              <h2 className="display mt-2 text-[36px] leading-[1.1]">Adam and Eve</h2>
              <p className="mt-4 text-[18px] leading-relaxed">
                Six ways Christian thinkers have placed, or declined to
                place, a first couple within the history above. The grade on
                each covers its scientific footing only.
              </p>
            </Row>
            <div className="mt-9 space-y-9">
              {tm.map((t) => (
                <Row key={t.id} note={<SourceNotes ids={t.sourceIds} />}>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={t.status} />
                    <span className="text-[13px]" style={{ color: THEORY_COLOR[t.id] }}>
                      {t.author}
                      {t.year ? `, ${t.year}` : ""}
                    </span>
                  </div>
                  <h4 className="display mt-2 text-[23px] leading-snug">
                    <Ref target={{ kind: "theory", id: t.id }} plain className="cursor-pointer text-left hover:underline">
                      {t.name}
                    </Ref>
                  </h4>
                  <p className="mt-2.5">
                    <Rich text={t.summary} />
                  </p>
                  <p className="mt-2.5 text-[15px] text-[var(--muted)]">
                    <span className="font-semibold text-[var(--ink)]">Under pressure from: </span>
                    {t.critiques.join(" ")}
                  </p>
                </Row>
              ))}
            </div>
            <div className="mt-10 space-y-10">
              <h3 className="kicker text-[var(--faint)]">Open questions</h3>
              {THEOLOGY_CLAIMS.map((id) => {
                const claim = getClaim(id);
                return claim ? <ClaimBlock key={id} claim={claim} /> : null;
              })}
            </div>
          </section>

          <section id="ch-glossary" className="scroll-mt-24 pt-16">
            <Row>
              <h2 className="display text-[36px] leading-[1.1]">Glossary</h2>
              <dl className="mt-6 space-y-4 text-[15.5px]">
                {[...glossary]
                  .sort((a, b) => a.term.localeCompare(b.term))
                  .map((g) => (
                    <div key={g.id}>
                      <dt className="font-semibold">{g.term}</dt>
                      <dd className="text-[var(--muted)]">{g.def}</dd>
                    </div>
                  ))}
              </dl>
            </Row>
          </section>
        </article>
      </div>
      <Footer />
    </Workspace>
  );
}
