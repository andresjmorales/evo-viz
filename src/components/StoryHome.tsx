"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { taxa } from "@/data/taxa";
import { STORY_BEATS, TRIO, beatForKa, isAlive } from "@/data/story";
import { formatKa } from "@/lib/format";
import { BrainChart } from "./BrainChart";
import { HomininFigure } from "./HomininFigure";
import { TimeScrubber } from "./TimeScrubber";
import { TrioChart } from "./TrioChart";

const LivingGlobe = dynamic(
  () => import("./LivingGlobe").then((m) => m.LivingGlobe),
  { ssr: false },
);

const MIN = 0;
const MAX = 3600;

export function StoryHome({
  onOpenTaxon,
  onOpenAtlas,
  onOpenQuestions,
}: {
  onOpenTaxon: (id: string) => void;
  onOpenAtlas: () => void;
  onOpenQuestions: () => void;
}) {
  const [ka, setKa] = useState(3200);
  const [playing, setPlaying] = useState(true);
  const beat = useMemo(() => beatForKa(ka), [ka]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setKa((cur) => {
        const next = cur - MAX / 240;
        if (next <= MIN) {
          setPlaying(false);
          return MIN;
        }
        return next;
      });
    }, 50);
    return () => window.clearInterval(id);
  }, [playing]);

  const living = taxa.filter((t) => isAlive(t.rangeStartKa, t.rangeEndKa, ka));

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-6 md:pt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--green)]">
          The short version
        </p>
        <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-tight text-[var(--ink)] md:text-5xl">
          We are a late chapter in a long African story.
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">
          Not a ladder. A bush. Feet first, then a traveler&apos;s body, then
          several large-brained cousins who met and mixed. Press play and watch
          time run toward the present.
        </p>

        <div className="mt-8 grid items-end gap-2 sm:grid-cols-4">
          <HomininFigure
            taxonId="afarensis"
            label="Au. afarensis"
            caption="Before the classic three: Lucy’s walk, an ape-sized brain."
            height={170}
            active={isAlive(3900, 3000, ka) || ka > 1900}
            onClick={() => onOpenTaxon("afarensis")}
          />
          {TRIO.map((item, i) => {
            const taxon = taxa.find((t) => t.id === item.id);
            const live = taxon
              ? isAlive(taxon.rangeStartKa, taxon.rangeEndKa, ka)
              : false;
            return (
              <div key={item.id} className="relative">
                {i < 2 ? (
                  <div className="pointer-events-none absolute top-16 right-[-12%] hidden text-2xl text-[var(--green)] sm:block">
                    →
                  </div>
                ) : null}
                <HomininFigure
                  taxonId={item.id}
                  label={`Homo ${item.label}`}
                  caption={`${item.when}. ${item.line}`}
                  height={200}
                  active={live || beat.taxonIds.includes(item.id)}
                  onClick={() => onOpenTaxon(item.id)}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[12px] text-[var(--muted)]">
          A classroom shorthand, not the whole tree. Click a figure to open the
          notebook. Walking outlines: PhyloPic / T. Michael Keesey, CC0.
        </p>

        <div className="mt-8">
          <TimeScrubber
            ka={ka}
            minKa={MIN}
            maxKa={MAX}
            playing={playing}
            onChange={(v) => {
              setPlaying(false);
              setKa(v);
            }}
            onTogglePlay={() => {
              if (!playing && ka <= MIN) setKa(MAX);
              setPlaying((p) => !p);
            }}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rise-in rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[var(--line)]">
            <p className="font-mono text-xs text-[var(--green)]">{formatKa(ka)}</p>
            <h2 className="mt-1 font-serif text-3xl text-[var(--ink)]">{beat.title}</h2>
            <p className="mt-2 text-lg text-[var(--deep)]">{beat.lede}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
              {beat.body}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {living.slice(0, 8).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onOpenTaxon(t.id)}
                  className="rounded-full bg-[var(--green-soft)] px-3 py-1 text-[12px] text-[var(--deep)]"
                >
                  {t.name.replace("Australopithecus ", "Au. ").replace("Homo ", "H. ")}
                </button>
              ))}
            </div>
          </article>
          <LivingGlobe ka={ka} focusTaxonId={beat.taxonIds[0]} />
        </div>

        <div className="mt-8">
          <TrioChart ka={ka} onSelect={onOpenTaxon} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <BrainChart
            highlight={beat.taxonIds.includes("sapiens") ? "sapiens" : beat.taxonIds[0]}
          />
          <BushVsLadder />
        </div>

        <ol className="mt-8 grid gap-3 md:grid-cols-4">
          {STORY_BEATS.map((b, i) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setKa(b.ka);
                }}
                className={`h-full w-full rounded-2xl border p-4 text-left ${
                  beat.id === b.id
                    ? "border-[var(--green)] bg-white shadow-sm"
                    : "border-[var(--line)] bg-white/60"
                }`}
              >
                <span className="font-mono text-[11px] text-[var(--green)]">
                  {i + 1} · {formatKa(b.ka)}
                </span>
                <div className="mt-1 font-serif text-lg">{b.title}</div>
                <p className="mt-1 text-[12px] leading-snug text-[var(--muted)]">
                  {b.lede}
                </p>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenAtlas}
            className="rounded-full bg-[var(--green)] px-5 py-2.5 text-sm text-white"
          >
            Open the full family tree
          </button>
          <button
            type="button"
            onClick={onOpenQuestions}
            className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm text-[var(--ink)]"
          >
            Browse questions
          </button>
        </div>
      </section>
    </div>
  );
}

function BushVsLadder() {
  return (
    <figure className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <svg viewBox="0 0 360 180" className="h-44 w-full">
        <text x="20" y="22" fontSize="12" fill="#163226" fontFamily="serif">
          Not this
        </text>
        <line x1="40" y1="150" x2="40" y2="40" stroke="#9aa89e" strokeWidth="2" />
        {["ape", "erectus", "Neanderthal", "us"].map((label, i) => (
          <g key={label}>
            <circle cx="40" cy={140 - i * 32} r="5" fill="#9aa89e" />
            <text x="54" y={144 - i * 32} fontSize="10" fill="#4a6656">
              {label}
            </text>
          </g>
        ))}
        <text x="190" y="22" fontSize="12" fill="#163226" fontFamily="serif">
          This
        </text>
        <line x1="210" y1="150" x2="210" y2="70" stroke="#1f7a4d" strokeWidth="2.2" />
        <line x1="210" y1="88" x2="270" y2="50" stroke="#1f7a4d" strokeWidth="2.2" />
        <line x1="210" y1="88" x2="300" y2="88" stroke="#1f7a4d" strokeWidth="2.2" />
        <line x1="210" y1="120" x2="168" y2="96" stroke="#1f7a4d" strokeWidth="2.2" />
        <circle cx="210" cy="150" r="5" fill="#1f7a4d" />
        <circle cx="168" cy="96" r="5" fill="#1f7a4d" />
        <circle cx="210" cy="70" r="5" fill="#1f7a4d" />
        <circle cx="270" cy="50" r="5" fill="#1f7a4d" />
        <circle cx="300" cy="88" r="5" fill="#1f7a4d" />
        <text x="218" y="154" fontSize="10" fill="#163226">
          early Homo
        </text>
        <text x="276" y="48" fontSize="10" fill="#163226">
          sapiens
        </text>
        <text x="308" y="92" fontSize="10" fill="#163226">
          Denisovan
        </text>
        <text x="218" y="68" fontSize="10" fill="#163226">
          Neanderthal
        </text>
      </svg>
      <figcaption className="text-[11px] leading-snug text-[var(--muted)]">
        A ladder hides overlap and mixing. A bush keeps extinct cousins in the
        picture.
      </figcaption>
    </figure>
  );
}
