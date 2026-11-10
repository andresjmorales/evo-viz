"use client";

import { LANE_COLORS } from "@/lib/palette";
import { Ref, Rich } from "./Popups";
import { SectionHeading } from "./ui";

const NEA = LANE_COLORS[6].ink;
const DEN = LANE_COLORS[7].ink;

/** Share of the genome inherited from each group, as published ranges. */
const REGIONS: { name: string; nea: [number, number]; den: [number, number] | null; note: string; sources: string[] }[] = [
  { name: "Sub-Saharan Africa", nea: [0.2, 0.4], den: null, note: "A little, carried back by people returning from Eurasia", sources: ["chen-2020"] },
  { name: "Europe and western Asia", nea: [1.8, 2.4], den: null, note: "", sources: ["prufer-2017"] },
  { name: "East Asia", nea: [2.3, 2.6], den: [0, 0.2], note: "Slightly more Neanderthal than Europeans, plus a trace of Denisovan", sources: ["prufer-2017", "meyer-2012"] },
  { name: "New Guinea and Australia", nea: [2.0, 2.6], den: [1.9, 5.0], note: "The most archaic ancestry of anyone alive", sources: ["prufer-2017", "vernot-2016", "reich-2010", "malaspinas-2016"] },
];
const MAX = 8;

const FACTS: { title: string; text: string }[] = [
  {
    title: "Everyone has different pieces",
    text: "Each person outside Africa carries about 2% Neanderthal DNA, but not the same 2%. Pooled across many people, at least a fifth of the Neanderthal genome is still in circulation.[@vernot-2014]",
  },
  {
    title: "Most of it arrived in one period",
    text: "Genomes from the earliest Europeans show a single main episode of mixing about 50 to 45 thousand years ago, soon after the expansion out of Africa.[@sumer-2024,iasi-2024]",
  },
  {
    title: "Some of it helped",
    text: "Tibetans owe a gene variant that copes with thin air to Denisovans.[@huerta-sanchez-2014] Immune genes picked up from both groups are common today,[@dannemann-2016,abi-rached-2011] as are Neanderthal versions of genes active in skin and hair.[@sankararaman-2014]",
  },
  {
    title: "Some of it was weeded out",
    text: "Long stretches of our genome hold no Neanderthal DNA at all, especially around genes active in the testes, a sign that some combinations lowered fertility.[@sankararaman-2014] One surviving Neanderthal segment is the largest known genetic risk factor for severe COVID-19.[@zeberg-2020]",
  },
  {
    title: "It ran both ways",
    text: "Neanderthals in Siberia carried DNA from an early group of sapiens who had left Africa more than 100 thousand years ago,[@kuhlwilm-2016] and Neanderthal mitochondria seem to descend from a similar early exchange.[@posth-2017]",
  },
  {
    title: "Denisovans, more than once",
    text: "The Denisovan DNA in Papuans comes from at least two distinct Denisovan populations, both only distantly related to the individual from Denisova Cave.[@jacobs-2019]",
  },
];

export function Dna() {
  return (
    <section id="dna" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="In our genes" title="What the others left in us">
        Neanderthals and Denisovans are gone as peoples, but most of us carry
        some of their DNA. How much depends on where your ancestors lived.
      </SectionHeading>

      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
        <figure className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-[var(--muted)]">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: NEA }} />Neanderthal</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: DEN }} />Denisovan</span>
            <span className="text-[var(--faint)]">share of the genome; faded tip shows the published range</span>
          </div>
          <div className="space-y-5">
            {REGIONS.map((r) => (
              <div key={r.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-semibold text-[var(--ink)]">{r.name}</span>
                  <span className="text-[11.5px] text-[var(--faint)]">
                    {r.sources.map((id, i) => (
                      <Ref key={id} target={{ kind: "source", id }} className="ml-1 text-[var(--green)]">
                        [{i + 1}]
                      </Ref>
                    ))}
                  </span>
                </div>
                {([["nea", NEA], ["den", DEN]] as const).map(([k, color]) => {
                  const v = r[k];
                  return (
                    <div key={k} className="mt-1.5 flex items-center gap-3">
                      <div className="relative h-3.5 flex-1 rounded-full bg-[var(--panel)]">
                        {v ? (
                          <>
                            <span className="absolute inset-y-0 left-0 rounded-full opacity-35" style={{ width: `${(v[1] / MAX) * 100}%`, background: color }} />
                            <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.max(v[0] / MAX, 0.006) * 100}%`, background: color }} />
                          </>
                        ) : null}
                      </div>
                      <span className="w-[86px] shrink-0 text-right text-[12.5px] tabular-nums text-[var(--muted)]">
                        {!v ? "none found" : v[0] === 0 ? `under ${v[1]}%` : `${v[0]}–${v[1]}%`}
                      </span>
                    </div>
                  );
                })}
                {r.note ? <p className="mt-1.5 text-[12px] text-[var(--faint)]">{r.note}</p> : null}
              </div>
            ))}
          </div>
          <figcaption className="mt-5 border-t border-[var(--line)] pt-3 text-[12.5px] leading-relaxed text-[var(--faint)]">
            Estimates differ between studies and methods, so read these as
            ranges. The scale runs from 0 to {MAX}% of the genome. Hover the
            numbered sources for the papers.
          </figcaption>
        </figure>

        <div className="grid gap-3 sm:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <h3 className="text-[14.5px] font-semibold text-[var(--ink)]">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">
                <Rich text={f.text} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
