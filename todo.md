# To do

Temporary working list. Delete this file once the items are done or moved to issues.

## Done since the first version of this list

- Ice-age coastlines on the globe, driven by measured sea-floor depth and the sea-level record
- Climate strip and a tools-and-behaviour lane on the family tree
- Sentence-level citations in every question, route and method note
- "What the others left in us" DNA section
- Self-test quiz
- Ten "how we know" method primers
- Ten new graded questions, covering the species that had none and the thin topics (climate, diet, ancient DNA, first Americans, earliest art)
- Routes redrawn to stay on land, with a repeatable check (`npm run check:routes`)
- 68 new sources, each verified against Crossref; two wrong DOIs among the original sources corrected (Senut 2001, Ji 2021)
- "How evolution works": interactive mutation, Punnett square, natural selection and genetic drift panels
- "Common questions": twelve frequent questions about evolution, including faith-related ones, answered directly
- Schöningen spears re-dated to about 200 thousand years with the 2025 study cited
- Hafted tools and farming added to the tools lane; the northern out-of-Africa route added to the globe
- Two dead book links (Alexander 2008, Venema 2017) replaced with Open Library records
- Jaw rework: broader ramus joined to the body, slimmer joint, upper teeth seated in the bone

## Still to do

### Content

- **Fossil media.** Wikimedia Commons rate-limits the build environment, so this could not be automated; it needs doing from a normal connection. Only 13 of the 29 fossils have a 3D scan linked and only two have a photo. The two Wikimedia photo filenames in `src/data/fossils.ts` were guessed and carry a "see Commons" licence note; confirm or replace them, and add verified photos (with author and licence) for the rest.
- **Fact-check the remaining unsourced numbers.**
  - Site date windows (`ka`) in `src/data/fossils.ts`
  - Glossary definitions in `src/data/glossary.ts`
  - Mid-range stature figures in `src/data/figures.ts` (Will, Pablos & Stock 2017 is now in the source list as `will-2017` and is the place to check them)
  - Skull proportions in `src/lib/skull.ts`
  - Species summaries in `src/data/taxa.ts` have no inline citations yet; only questions, routes, methods and the tools lane do
- **Non-paper sources.** Their links were checked and respond, except four that refuse automated requests and need a manual look: the two IVP book pages, the BioLogos page and the Smithsonian 3D collection. Their content has not been checked against how it is cited.
- **DNA section ranges.** The Neanderthal share for New Guinea and Australia and the "under 0.2%" Denisovan trace in East Asia are approximations from the cited papers; tighten them against the original tables.
- **More behaviour entries.** The bow and seafaring are not on the tools lane.

### Globe

- **Ice sheets are not drawn.** At the last glacial maximum the globe shows Hudson Bay and the Barents shelf as dry land when they were under ice, and the route into the Americas crosses where the ice stood.
- **Sea level before 800 thousand years ago** is scaled from the oxygen-isotope record and is rough. Nothing is shown before 5.3 million years.
- **Route direction and choice.** Routes stay on land, but each is still one plausible path.

### Skulls

- Lower jaws are better but remain the weakest part of the procedural models.
- Look for scans with licences that allow redistribution (MorphoSource, African Fossils) to replace the procedural skull for key specimens.

### How evolution works and common questions

- The four panels are illustrations. The selection and drift simulations use simple textbook models, and the wording around them should be read by a biologist.
- The common-questions answers on faith are written to be fair to believing readers; they would benefit from review by someone in that audience.
- Neither section is on the Field notes page yet.
- No panel yet for sexual recombination, gene flow or speciation.

### Quiz

- Questions are generated from the data, so some are easy or oddly paired. A hand-written set with misconception-based distractors would teach more.
- No progress is saved between visits.

### Not yet tested

- Hover notes, the notebook, the quiz, the evolution panels and pinch-zoom on a real touch device
- Sketchfab and OneZoom embeds for real visitors
- Browsers other than Chromium
- Frame rate on a low-end phone with the new shelf texture (4096 px wide)
