import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About · evo-viz" };

const SECTIONS: [string, string][] = [
  [
    "What this is",
    "evo-viz is a teaching tool first and a research notebook second. The home page tells the story in eight chapters on a globe you can spin and scrub through time. Below it are the full family tree, a skull lab, and every claim graded and footnoted.",
  ],
  [
    "How the grades work",
    "Each claim carries one of five grades, from Settled to Speculative. They are editorial readings of how the claim currently sits in the literature. They are not votes and not probabilities. Every grade comes with a sentence explaining it and links to the papers, books, museum pages and lectures behind it.",
  ],
  [
    "Dates, routes and the globe",
    "Dates are rounded mid-range figures and striped bar ends mark especially uncertain ones. Fossil sites are plotted at their real coordinates and light up for the period their fossils cover. Routes are the least certain element: the dated endpoints are evidence, the line between them is the simplest path over land. Coastlines are today’s; ice-age sea levels were up to 120 metres lower.",
  ],
  [
    "The 3D skulls",
    "The skulls in the lab are procedural models. Each species is described by a dozen proportions (brain volume, brow, jaw projection, tooth size and so on) drawn from published descriptions, and the shape is generated from those numbers. That is what lets any two be compared or blended, but no real specimen is being reproduced. For real bones, the fossil pages embed scanned casts from the Digital Atlas of Ancient Life (Cornell, CC BY-NC-SA, via Sketchfab) and link to the Smithsonian’s Human Origins scans.",
  ],
  [
    "Figures",
    "Body silhouettes are by T. Michael Keesey and other PhyloPic contributors, released to the public domain. They are life restorations: proportions follow the skeletons, but hair, skin and posture are informed guesses. Sahelanthropus and Orrorin borrow the Ardipithecus figure and Denisovans borrow Homo longi, and the species pages say so.",
  ],
  [
    "Adam and Eve models",
    "The models from Swamidass, Craig, Kemp, Alexander, Walton and BioLogos are presented so they can be compared against the same timeline. Including one is not an endorsement. Each is graded on how well its scientific footing holds, and its theological claims are left as theology.",
  ],
  [
    "Where it will be wrong",
    "This is a synthesis by a non-specialist tool, and the field moves. The 2025 reanalysis of the Yunxian skull, which may redraw the Denisovan branch, is a reminder that trees change. Follow the footnotes, and treat anything here as a starting point.",
  ],
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 pb-24 pt-14">
      <Link href="/" className="text-[13.5px] font-medium text-[var(--green)] hover:underline">
        ← Back to the atlas
      </Link>
      <p className="kicker mt-10 text-[var(--green)]">About</p>
      <h1 className="display mt-3 text-[44px] leading-[1.08] text-[var(--ink)]">
        Method, sources and credits
      </h1>
      <div className="mt-10 space-y-9">
        {SECTIONS.map(([title, body]) => (
          <section key={title}>
            <h2 className="text-[17px] font-semibold text-[var(--ink)]">{title}</h2>
            <p className="mt-2 text-[16px] leading-[1.7] text-[var(--muted)]">{body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
