import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-[var(--ink)]">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
        evo-viz
      </p>
      <h1 className="mt-2 font-serif text-4xl text-[var(--deep)]">About this atlas</h1>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--muted)]">
        <p>
          evo-viz is a teaching story first and a research atlas second. The
          home page walks a short African narrative with public-domain walking
          figures, a spinning globe, and a three-species overlap chart. Atlas
          mode keeps the full family tree, claims, and theory overlays.
        </p>
        <p>
          Status chips (settled → speculative) are editorial judgments about
          how a claim sits in the current literature, not a vote or a
          probability. Every claim carries footnotes to papers, books, museum
          collections, or films. Dates are rounded; hatched bar ends mean the
          range is especially uncertain.
        </p>
        <p>
          Walking silhouettes of <em>Homo erectus</em>, Neanderthals, and{" "}
          <em>H. sapiens</em> are by T. Michael Keesey on PhyloPic (CC0). The
          Lucy figure is an original teaching drawing (also CC0). 3D viewers
          embed Creative Commons casts from the Digital Atlas of Ancient Life
          (Hannah Teush, Cornell University, mostly CC BY-NC-SA) via Sketchfab.
          Smithsonian Human Origins scans are linked, not redistributed. In-app
          cranial profiles are side-view teaching drawings, not scans.
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
      <Link href="/" className="mt-8 inline-block text-[var(--green)] underline">
        Back to the story
      </Link>
    </main>
  );
}
