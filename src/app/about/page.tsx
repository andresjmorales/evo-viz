import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-stone-200">
      <p className="text-[10px] uppercase tracking-[0.18em] text-stone-500">
        evo-viz
      </p>
      <h1 className="mt-2 font-serif text-4xl text-amber-50">About this atlas</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-stone-300">
        <p>
          evo-viz is a reading aid for human evolution: a horizontal phylogeny,
          a schematic map, a notebook of claims, and optional overlays for
          theistic-evolution models of Adam and Eve.
        </p>
        <p>
          Status chips (settled → speculative) are editorial judgments about
          how a claim sits in the current literature, not a vote or a
          probability. Every claim carries footnotes to papers, books, museum
          collections, or films. Dates are rounded; hatched bar ends mean the
          range is especially uncertain.
        </p>
        <p>
          3D viewers embed Creative Commons casts from the Digital Atlas of
          Ancient Life (Hannah Teush, Cornell University, mostly CC BY-NC-SA)
          via Sketchfab. Smithsonian Human Origins scans are linked, not
          redistributed — those files are casts of specimens owned by other
          museums. The in-app morphospace skulls are schematic teaching models,
          not scans.
        </p>
        <p>
          Theistic overlays (Swamidass, Craig, Kemp, Alexander, Walton,
          BioLogos) are presented as models to compare, not as endorsements.
          The science layer stays on even when overlays are off.
        </p>
        <p>
          This is a synthesis for learning. It will be wrong in places, and the
          2025 Yunxian / Homo longi discussion is a reminder that trees move.
        </p>
      </div>
      <Link href="/" className="mt-8 inline-block text-amber-200 underline">
        Back to the timeline
      </Link>
    </main>
  );
}
