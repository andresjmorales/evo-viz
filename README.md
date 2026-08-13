# evo-viz

A textbook-style atlas of human evolution: a horizontal phylogenetic timeline, fossil sites and migrations, evidence grades with footnotes, rotatable 3D casts, and optional overlays for theistic-evolution models of Adam and Eve.

## What you can do

- Scroll a piecewise timeline from ~7 million years ago to the present
- Click a species bar for anatomy, behavior, discovery history, and claims
- Open questions such as “Were Denisovans actually different from Neanderthals?”
- Read a **Status** chip on each claim: Settled, Strong, Contested, Shaky, Speculative
- Follow footnotes to papers, books, museum collections, and films
- Rotate public 3D casts (Digital Atlas of Ancient Life on Sketchfab) and open Smithsonian viewers
- Blend schematic skulls in a morphospace (teaching models, not scans)
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

## 3D sources

- [Digital Atlas of Ancient Life hominid casts](https://www.digitalatlasofancientlife.org/vc/chordata/mammals/hominids/) (Hannah Teush, Cornell; Sketchfab; mostly CC BY-NC-SA)
- [Smithsonian 3D hominin fossils](https://3d.si.edu/collections/hominin-fossils) (view on si.edu; not redistributed)
- [African Fossils](https://africanfossils.org/) (Turkana Basin Institute / National Museums of Kenya)
- In-app morphospace skulls are original schematics

## License

MIT for the application code. Embedded 3D models and Wikimedia images remain under their own licenses.
