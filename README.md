# evo-viz

An interactive atlas of human evolution: seven million years told on a globe you can spin and scrub through time, with a zoomable family tree, 3D skulls to compare, graded evidence, and optional overlays for theistic-evolution models of Adam and Eve.

## What you can do

- **Play the story.** Eight chapters run on a 3D globe. Fossil sites light up when their fossils date from, and dispersal routes draw themselves as the clock moves. Drag the timeline, which doubles as a miniature family tree.
- **See the shape of it.** A simple branching diagram, nine relatives drawn to one scale, and a chart of brain size through time.
- **Explore the family tree.** Every species on one timeline. Pinch or Ctrl/⌘-scroll to zoom into the crowded last half-million years. Interbreeding and proposed descent are drawn in.
- **Handle the skulls.** Rotate a procedural skull for any species, set two side by side, or blend one into another.
- **Check the evidence.** Each question carries a grade (Settled, Strong, Contested, Shaky, Speculative), the reason for it, and footnotes to papers, books, museums and lectures.
- **Overlay Adam and Eve.** Compare where Swamidass, Craig, Kemp, Alexander, Walton and BioLogos would place a first couple, on the same timeline as the science.
- **Watch the coasts move.** The globe redraws coastlines from measured sea-floor depth as sea level falls and rises, so Sundaland, Sahul and Beringia appear when they were dry. Water crossings on routes are dashed.
- **Read climate and culture beside the species.** Under the family tree run a lane of tools and behaviours and the deep-sea climate record.
- **See what is left in us.** How much Neanderthal and Denisovan DNA people carry by region, and what some of it does.
- **Learn the methods.** Ten primers on dating, ancient DNA, diet, naming species and more, each tied to studies cited on the site.
- **Test yourself.** A randomised eight-question round with skulls to identify and claims to grade.
- **Read it straight through.** `/read` sets the whole atlas out as one long document with sources in the margin.
- **Hover for notes.** Species names, technical terms and footnote numbers open small notes on hover. Notes can open further notes, be pinned, and be dragged around.
- **Keep a notebook.** Save any species, question, fossil or source with your own notes, then copy the lot as Markdown. It is stored in your browser only.
- **Share a link.** Opening any item writes a `#/kind/id` link that reopens it.

Grades are editorial readings of the literature, not probabilities.

## Develop

```bash
npm ci
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## How it is built

- Next.js (App Router), React, Tailwind CSS, three.js, d3-geo
- `src/data` holds all content: species, fossils and sites, routes, claims, sources, theories, story chapters
- `src/lib/timeStore.ts` is the shared clock; the globe reads it every frame without re-rendering React
- `src/lib/skull.ts` generates skulls from a dozen proportions per species (signed-distance field, meshed with surface nets in a web worker); bone grain and sutures are added in the shader
- `src/components/Popups.tsx` provides hover notes and automatic linking of names and glossary terms in prose; `src/data/glossary.ts` holds the definitions
- `src/components/Globe.tsx` draws Natural Earth coastlines to a texture and animates routes and sites

## Data and checks

- `public/geo/shelf.png` encodes sea-floor depth down to 140 m, derived from NOAA ETOPO2v2 (public domain)
- `src/data/climate.json` holds the LR04 benthic oxygen-isotope stack (Lisiecki & Raymo 2005) and the Spratt & Lisiecki (2016) sea-level stack
- Inline citations are written as `[@source-id]` in the data and rendered as numbered footnotes
- `npm run check:routes` fails if any dispersal route crosses water outside a crossing marked in its `sea` field

## Image and 3D sources

- Coastlines: [Natural Earth](https://www.naturalearthdata.com/) via `world-atlas` (public domain)
- Silhouettes: [PhyloPic](https://www.phylopic.org/), mostly T. Michael Keesey (public domain); see `public/figures/CREDITS.md`
- Scanned casts: [Digital Atlas of Ancient Life](https://www.digitalatlasofancientlife.org/vc/chordata/mammals/hominids/) (Cornell; Sketchfab; mostly CC BY-NC-SA), loaded on request
- The tree-of-life explorer is embedded from [OneZoom](https://www.onezoom.org/) on request
- [Smithsonian 3D hominin fossils](https://3d.si.edu/collections/hominin-fossils) are linked, not redistributed
- The in-app skulls are procedural teaching models, not scans

## License

MIT for the application code. Embedded 3D models and Wikimedia images remain under their own licenses.
