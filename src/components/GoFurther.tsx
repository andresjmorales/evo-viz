"use client";

import { useState } from "react";
import { SectionHeading } from "./ui";

const GROUPS: { title: string; items: { name: string; url: string; what: string; host: string }[] }[] = [
  {
    title: "Handle real fossils",
    items: [
      { name: "Smithsonian 3D collection", url: "https://humanorigins.si.edu/evidence/3d-collection", what: "Scans of the Hall of Human Origins casts and artefacts, in a viewer with measuring tools.", host: "Smithsonian Human Origins Program" },
      { name: "African Fossils", url: "https://africanfossils.org/", what: "3D models of Turkana Basin hominins, animals and stone tools, many of them downloadable for printing.", host: "Turkana Basin Institute and National Museums of Kenya" },
      { name: "MorphoSource", url: "https://www.morphosource.org/", what: "The research repository for CT and surface scans. Search a specimen number to find the actual data behind a paper.", host: "Duke University" },
    ],
  },
  {
    title: "Trees and dates",
    items: [
      { name: "OneZoom", url: "https://www.onezoom.org/life/@Hominidae", what: "Every known living species on one zoomable tree. Useful for seeing how small our branch is.", host: "OneZoom charity, open source" },
      { name: "TimeTree", url: "https://timetree.org/", what: "Type two species and get the published estimates of when their lineages split, with the studies behind each.", host: "Temple University" },
      { name: "Open Tree of Life", url: "https://tree.opentreeoflife.org/", what: "A community-built synthesis of published phylogenies, with an open API.", host: "Open Tree of Life project" },
    ],
  },
  {
    title: "Lessons and lectures",
    items: [
      { name: "Smithsonian Human Origins", url: "https://humanorigins.si.edu/", what: "Species profiles, a fossil database and classroom material from a museum research team.", host: "Smithsonian Institution" },
      { name: "HHMI BioInteractive", url: "https://www.biointeractive.org/", what: "Short films, click-through interactives and data activities on human evolution, free for teachers.", host: "Howard Hughes Medical Institute" },
      { name: "Becoming Human", url: "https://becominghuman.org/", what: "An interactive documentary and learning centre narrated by Donald Johanson, who found Lucy.", host: "Institute of Human Origins, Arizona State University" },
    ],
  },
];

export function GoFurther() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section id="further" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="Go further" title="Zoom out, then go to the sources">
        Hominins are one twig on a very large tree. The explorer below places
        us among the great apes and lets you keep zooming out to all of life.
        Under it are the best free collections for looking at real specimens.
      </SectionHeading>

      <div className="mt-9 overflow-hidden rounded-3xl border border-[var(--line)]">
        {loaded ? (
          <iframe
            title="OneZoom tree of life, centred on the great apes"
            src="https://www.onezoom.org/life/@Hominidae?otthome=%40Hominidae"
            className="h-[560px] w-full bg-[var(--panel)]"
            loading="lazy"
          />
        ) : (
          <button type="button" onClick={() => setLoaded(true)} className="stage group grid h-[340px] w-full place-items-center">
            <span className="flex max-w-[440px] flex-col items-center gap-3 px-6 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--ink)] text-white transition group-hover:scale-105 group-hover:bg-[var(--green)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 21V11M12 11C12 7 9 5 5 5M12 11c0-3 2.5-6 7-6M12 15c-2 0-4-1-5-3M12 14c2 0 4-.6 5-2.5" /></svg>
              </span>
              <span className="display text-[22px] text-[var(--ink)]">Open the tree of life</span>
              <span className="text-[13px] leading-relaxed text-[var(--muted)]">
                Loads the OneZoom explorer, centred on the great apes. Pinch or scroll to zoom from our family out to every living species.
              </span>
            </span>
          </button>
        )}
        <p className="border-t border-[var(--line)] bg-white px-4 py-2.5 text-[12px] text-[var(--faint)]">
          Tree of life explorer by{" "}
          <a href="https://www.onezoom.org/" target="_blank" rel="noreferrer" className="underline hover:text-[var(--ink)]">OneZoom</a>
          , embedded from onezoom.org. It shows living species only, so extinct hominins do not appear on it.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h3 className="text-[15px] font-semibold text-[var(--ink)]">{g.title}</h3>
            <ul className="mt-3 space-y-3">
              {g.items.map((it) => (
                <li key={it.name}>
                  <a href={it.url} target="_blank" rel="noreferrer" className="group block rounded-2xl border border-[var(--line)] bg-white p-4 transition hover:border-[var(--green)]">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[15px] font-semibold text-[var(--ink)] group-hover:underline">{it.name}</span>
                      <span className="text-[13px] text-[var(--green)]">↗</span>
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-[var(--muted)]">{it.what}</span>
                    <span className="mt-1.5 block text-[11.5px] text-[var(--faint)]">{it.host}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
