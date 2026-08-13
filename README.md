# evo-viz

A teaching story and research atlas of human evolution: a short erectus → Neanderthal → sapiens narrative, a pinch-zoom phylogenetic timeline, fossil sites on a globe, evidence grades with footnotes, rotatable 3D casts, and optional overlays for theistic-evolution models of Adam and Eve.

## What you can do

- Play a home-page story with walking figures, a time slider, and a spinning globe
- Read the classroom three as an overlap chart, not a ladder
- Pinch or Ctrl-scroll the full family tree from ~7 million years ago to now
- Click a species for anatomy, behavior, discovery history, and claims
- Open questions such as “Were Denisovans actually different from Neanderthals?”
- Read a **Status** chip on each claim: Settled, Strong, Contested, Shaky, Speculative
- Follow footnotes to papers, books, museum collections, and films
- Rotate public 3D casts (Digital Atlas of Ancient Life on Sketchfab) and open Smithsonian viewers
- Compare cranial profiles (teaching drawings, not scans)
- Toggle overlays: Swamidass (genealogical Adam), Craig (Heidelberg-grade Adam), Kemp, Alexander, Walton, BioLogos

Status scores are editorial readings of the literature, not probabilities.

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

## Image and 3D sources

- Walking outlines: [PhyloPic](https://www.phylopic.org/) figures by T. Michael Keesey (CC0)
- [Digital Atlas of Ancient Life hominid casts](https://www.digitalatlasofancientlife.org/vc/chordata/mammals/hominids/) (Hannah Teush, Cornell; Sketchfab; mostly CC BY-NC-SA)
- [Smithsonian 3D hominin fossils](https://3d.si.edu/collections/hominin-fossils) (view on si.edu; not redistributed)
- [African Fossils](https://africanfossils.org/) (Turkana Basin Institute / National Museums of Kenya)
- In-app cranial profiles are original teaching drawings

## License

MIT for the application code. Embedded 3D models and Wikimedia images remain under their own licenses.
