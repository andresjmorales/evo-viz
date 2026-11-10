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
- Silhouettes, drawn to a common height scale, in the "Alive at this moment" chips
- A Tools tab on every species page, with outline drawings of each tool or behaviour, its makers ("possible maker" where the link is argued) and a note for species with no tools
- Ten new behaviour entries: shaped bone tools (1.5 Ma), the crossing to Flores, notched logs at Kalambo Falls, the engraved Trinil shell, bow and arrow, the voyage to Australia, twisted cord, flutes, fishhooks and pottery; a new "Craft and travel" group on the lane
- Ice sheets on the globe: simplified last-glacial-maximum outlines that grow and shrink with sea level, plus the present Greenland and Antarctic ice; the ice-free corridor added as a route, and the Americas route text updated
- Sea-level labels on the globe now say when the figure is a rough estimate (before 800 ka) or missing (before 5.3 Ma)
- Species pages fact-checked and given inline citations with a source list; fixes include Schöningen's re-dating on the heidelbergensis page, Mode 1 (not Mode 2) tools for antecessor, the 2022 Sahelanthropus limb bones, the Harbin–Denisovan protein and DNA match, and Xiahe identified by proteins only
- Glossary read through; one definition corrected (modern human brow ridges)
- Tool drawings redrawn with shading and colour; stone tools use a shared flake-scar renderer (`src/lib/facets.ts`)
- Knapping animation (cobble to Oldowan chopper to Acheulean handaxe) on the stone-tool pages and the Tools tab
- "How evolution works" gains gene flow and speciation panels

## Still to do

### Content

- **Fossil media.** Wikimedia Commons rate-limits the build environment, so this could not be automated; it needs doing from a normal connection. Only 13 of the 29 fossils have a 3D scan linked and only two have a photo. The two Wikimedia photo filenames in `src/data/fossils.ts` were guessed and carry a "see Commons" licence note; confirm or replace them, and add verified photos (with author and licence) for the rest.
- **Fact-check the remaining unsourced numbers.**
  - Site date windows (`ka`) in `src/data/fossils.ts`
  - Mid-range stature figures in `src/data/figures.ts` (Will, Pablos & Stock 2017 is now in the source list as `will-2017` and is the place to check them)
  - Skull proportions in `src/lib/skull.ts`
  - Species pages now cite their key statements, but the anatomy sentences and the brain and height ranges still have no inline source
- **Non-paper sources.** Their links were checked and respond, except four that refuse automated requests and need a manual look: the two IVP book pages, the BioLogos page and the Smithsonian 3D collection. Their content has not been checked against how it is cited.
- **DNA section ranges.** The Neanderthal share for New Guinea and Australia and the "under 0.2%" Denisovan trace in East Asia are approximations from the cited papers; tighten them against the original tables.
- **More behaviour entries.** Still missing: eyed needles and sewn clothing, dog domestication, Levallois as its own entry, and ornaments by Neanderthals as a separate row.
- **Tool makers.** The "made by" links on the tools lane are judgement calls from the cited papers; a specialist should look them over.

### Globe

- **Ice sheets are a sketch.** The outlines are hand-simplified from Dyke 2004, Hughes et al. 2016 and Batchelor et al. 2019 and scaled with sea level, so every cold period gets the last glacial maximum's shape. The larger Eurasian ice of about 140 ka, mountain glaciers outside the Alps and Patagonia, and the real order of retreat are not shown.
- **Sea level before 800 thousand years ago** is scaled from the oxygen-isotope record and is rough; the globe now says so. Nothing is shown before 5.3 million years.
- **Route direction and choice.** Routes stay on land, but each is still one plausible path.

### Skulls

- Lower jaws are better but remain the weakest part of the procedural models.
- Look for scans with licences that allow redistribution (MorphoSource, African Fossils) to replace the procedural skull for key specimens.

### How evolution works and common questions

- The four panels are illustrations. The selection and drift simulations use simple textbook models, and the wording around them should be read by a biologist.
- The common-questions answers on faith are written to be fair to believing readers; they would benefit from review by someone in that audience.
- Neither section is on the Field notes page yet.
- No panel yet for sexual recombination.
- The gene flow and speciation panels are cartoons like the others: speciation in particular uses a made-up clock for how fast incompatibilities build up.
- The knapping animation shows one face and eleven blows; real handaxes are worked on both faces. An experimental knapper should check the sequence.

### Quiz

- Questions are generated from the data, so some are easy or oddly paired. A hand-written set with misconception-based distractors would teach more.
- No progress is saved between visits.

### Not yet tested

- Hover notes, the notebook, the quiz, the evolution panels and pinch-zoom on a real touch device
- Sketchfab and OneZoom embeds for real visitors
- Browsers other than Chromium
- Frame rate on a low-end phone with the new shelf texture (4096 px wide)
