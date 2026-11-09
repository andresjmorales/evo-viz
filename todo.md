# To do

Temporary working list. Delete this file once the items are done or moved to issues.

## Features, in suggested order

1. **Ice-age coastlines on the globe.** Show Sundaland, Sahul, Beringia and Doggerland when sea level was low. Most routes only make sense with them. Needs a bathymetry source (for example the Natural Earth 200 m contour, or a −120 m contour from ETOPO) drawn into the globe texture in `src/components/Globe.tsx`, switched by the clock.
2. **Climate strip under the timeline.** Plot the published ice-age temperature record (the LR04 benthic δ18O stack) beneath the family tree and scrubber, so dispersals and extinctions can be read against glacial cycles.
3. **Tools and behaviour lane on the family tree.** Oldowan, Acheulean, Mousterian, controlled fire, burial, pigment and art, as dated bars in `src/components/FamilyTree.tsx`, each linked to a graded question.
4. **Sentence-level citations.** Let a sentence in a claim or species summary point at the specific source that supports it, instead of listing sources for the whole answer. Needs a markup convention in `src/data/claims.ts` and `src/data/taxa.ts`, and support in `Rich` (`src/components/Popups.tsx`).
5. **"Your DNA" explainer.** How much Neanderthal and Denisovan ancestry people in each region carry, and what a few of the inherited variants do.
6. **Self-test mode.** Identify the skull, put species in order, place a fossil on the map.

## Information and education gaps

- **Fossil media is uneven.** Only 13 of the 29 fossils have a 3D scan linked and only two have a photo. The two Wikimedia photo filenames in `src/data/fossils.ts` were guessed and carry a "see Commons" licence note; confirm or replace them.
- **Thin topics.** Almost nothing yet on stone tools, climate, diet, or how the ancient-DNA evidence actually works (sequencing, contamination, dating).
- **Species with few questions.** Several species have one or no graded questions attached (for example *Orrorin*, *Au. anamensis*, *Au. sediba*, *H. rudolfensis*, *H. antecessor*).
- **Uncited material to fact-check.** These were written from general knowledge and cite only sources already in the list, or none:
  - route waypoints, dates and notes in `src/data/migrations.ts` (the remote-Pacific and Americas routes lean on one general review)
  - site date windows (`ka`) in `src/data/fossils.ts`
  - glossary definitions in `src/data/glossary.ts`
  - mid-range stature figures in `src/data/figures.ts`
  - skull proportions in `src/lib/skull.ts`
- **Missing sources.** Add primary references for White Sands, Monte Verde, Bacho Kiro, early Java dates, Flores tools, and the settlement of Polynesia.
- **No worked examples of method.** Nothing yet explains how a fossil is dated, how a species is named, or how a split date is estimated. A short "how we know" primer per method would help learners.

## Skulls

- Lower jaws are the weakest part of the procedural models (blocky body, plank-like ramus).
- Look for scans with licences that allow redistribution (MorphoSource, African Fossils) to replace the procedural skull for key specimens.
- Smithsonian hominin pages block framing, so they stay as links unless their Voyager viewer can be self-hosted with permitted models.

## Embeds and outside data

- OneZoom is embedded and shows its own cookie prompt on first load. It covers living species only.
- TimeTree and Open Tree of Life could supply split-date estimates with their studies. Open Tree has an open API; whether TimeTree does is unchecked.

## Not yet tested

- Hover notes, the notebook and pinch-zoom on a real touch device
- Sketchfab embeds loading for real visitors
- Browsers other than Chromium
