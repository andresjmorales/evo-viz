import type { Theory } from "./types";

export const theories: Theory[] = [
  {
    id: "consensus",
    name: "Paleoanthropology (working consensus)",
    author: "Field synthesis",
    kind: "scientific",
    shortLabel: "Science",
    color: "#d4c4a8",
    summary:
      "Humans are African apes. Bipedalism comes first, brains later. Several Homo species overlap. Sapiens originate in structured African populations, then mix with Neanderthals and Denisovans. There is no recent genetic bottleneck of two people. Species names are hypotheses.",
    howToRead:
      "This is the base map. Other overlays are readings of Adam and Eve placed onto that map, not replacements for it.",
    claims: [
      "Common descent with other hominins is the shared scientific frame.",
      "Status scores on this site are editorial readings of the literature, not votes.",
    ],
    critiques: [
      "Consensus hides genuine fights (heidelbergensis, Yunxian/longi, naledi behavior).",
    ],
    sourceIds: [
      "stringer-2016",
      "bergstrom-2021",
      "smithsonian-human-origins",
      "hhmi-transitions",
    ],
    status: "strong",
    statusRationale:
      "The backbone (Africa, bipedalism first, archaic admixture) is settled. Many named species are not.",
  },
  {
    id: "swamidass",
    name: "Genealogical Adam and Eve",
    author: "S. Joshua Swamidass",
    year: 2019,
    kind: "theistic-evolution",
    shortLabel: "Swamidass",
    color: "#e0a85c",
    summary:
      "A historical couple could have been created de novo in the ancient Near East as recently as ~6,000 years ago. Their descendants mixed with a large existing sapiens population “outside the garden.” Within a few thousand years they become genealogical ancestors of everyone alive, without being genetic ancestors in the DNA-segment sense. Scripture, on this reading, tracks Adam’s line; science tracks the whole biological species.",
    howToRead:
      "Look for a gold marker near the present on the sapiens bar, and a spreading genealogical “wave.” The rest of the timeline is ordinary evolutionary history, including people outside the garden.",
    overlay: {
      startKa: 10,
      endKa: 6,
      taxonId: "sapiens",
      region: "ancient Near East",
      label: "Genealogical Adam & Eve (de novo among existing sapiens)",
      kind: "wave",
    },
    coversTaxonIds: ["sapiens"],
    genealogicalWave: true,
    claims: [
      "Genealogical ancestry ≠ genetic ancestry (Rohde–Olson–Chang math).",
      "A recent couple is compatible with large ancestral population sizes.",
      "People outside the garden are fully biologically human.",
      "Interbreeding is required, and is theologically allowed in this model.",
    ],
    critiques: [
      "De novo creation of a couple is a miracle claim, not a scientific result.",
      "Catholic critics (e.g. Kemp) argue the model is still a kind of polygenism if outsiders are fully human.",
      "Placement at 6 ka is an upper-bound illustration, not a date from bones.",
    ],
    sourceIds: [
      "swamidass-2019",
      "swamidass-preprint",
      "rohde-2004",
      "swamidass-ct",
    ],
    status: "strong",
    statusRationale:
      "The genealogical math is solid. The miracle couple is theology riding on that math.",
  },
  {
    id: "craig",
    name: "Adam as Homo heidelbergensis",
    author: "William Lane Craig",
    year: 2021,
    kind: "theistic-evolution",
    shortLabel: "Craig",
    color: "#7eb8c9",
    summary:
      "Genesis 1–11 is mytho-history: not modern journalism, but about real progenitors. New Testament Adam must be historical. Craig locates Adam and Eve among large-brained Middle Pleistocene humans (H. heidelbergensis), about 1,000–750 ka, as last common ancestors of sapiens, Neanderthals, and Denisovans. God renovates two individuals biologically and spiritually (rational souls). Neanderthals and Denisovans then count as image-bearers for whom Christ died.",
    howToRead:
      "A band across the heidelbergensis lane in the early Middle Pleistocene, with a bracket covering Neanderthal, Denisovan, and sapiens descendants.",
    overlay: {
      startKa: 1000,
      endKa: 750,
      taxonId: "heidelbergensis",
      region: "Africa / western Eurasia",
      label: "Craig: historical pair in Heidelberg-grade humans",
      kind: "pair",
    },
    coversTaxonIds: ["heidelbergensis", "neanderthal", "denisovan", "longi", "sapiens"],
    claims: [
      "A pair more than ~500 ka ago is not ruled out by population genetics.",
      "Neanderthal and Denisovan minds look “human enough” on archaeological tests Craig accepts.",
      "If they descend from Adam, they share the image of God.",
    ],
    critiques: [
      "H. heidelbergensis may not be a single species or the LCA.",
      "Yunxian 2025 deepens and reshuffles splits, which moves the target.",
      "Archaeology is a blunt instrument for “rational soul.”",
      "A 750-ka Adam is remote from a plain reading of Genesis genealogies.",
    ],
    sourceIds: [
      "craig-2021",
      "craig-first-things",
      "craig-ct",
      "stringer-heidelberg",
      "li-durbin-2011",
    ],
    status: "speculative",
    statusRationale:
      "Internally coherent placement on a contested taxon. Not a result of paleontology.",
  },
  {
    id: "kemp",
    name: "Theological monogenism, biological polygenism",
    author: "Kenneth W. Kemp",
    year: 2011,
    kind: "theistic-evolution",
    shortLabel: "Kemp",
    color: "#c9a07e",
    summary:
      "A Catholic philosophical model: a large biologically human population evolves; God infuses rational souls into two, then into their descendants (including mixed children). All theological humans descend from that pair. Fossils cannot detect the soul, so the overlay is a band on sapiens (or late heidelbergensis) rather than a named specimen.",
    howToRead:
      "A soft band on late Middle Pleistocene sapiens. No claim about which skull is Adam.",
    overlay: {
      startKa: 315,
      endKa: 200,
      taxonId: "sapiens",
      region: "Africa (underspecified)",
      label: "Kemp: first ensouled pair within a larger population",
      kind: "band",
    },
    coversTaxonIds: ["sapiens"],
    claims: [
      "Keeps Humani generis-style monogenism without a two-person genetic bottleneck.",
      "Interbreeding with “animal” hominins is allowed; offspring are ensouled.",
    ],
    critiques: [
      "The soul is not an empirical overlay.",
      "Calling neighbors non-human is ethically and theologically sensitive.",
      "Date is not specified by Kemp with paleontological precision.",
    ],
    sourceIds: ["kemp-2011"],
    status: "speculative",
    statusRationale: "Philosophy of compatibility, not a dated fossil hypothesis.",
  },
  {
    id: "alexander",
    name: "Neolithic representative Adam",
    author: "Denis Alexander",
    year: 2008,
    kind: "theistic-evolution",
    shortLabel: "Alexander",
    color: "#8fbc8f",
    summary:
      "Adam as a Neolithic farmer (or a representative head) called from an existing sapiens population in the ancient Near East, around the dawn of agriculture. Sin and covenant begin there; the evolutionary origin of the species is earlier and separate. Related to readings by John Stott and some BioLogos writers.",
    howToRead:
      "A small marker on sapiens at ~10–8 ka in the Fertile Crescent. No change to earlier hominin bars.",
    overlay: {
      startKa: 12,
      endKa: 8,
      taxonId: "sapiens",
      region: "Fertile Crescent",
      label: "Alexander / Neolithic Adam (representative head)",
      kind: "pair",
    },
    coversTaxonIds: ["sapiens"],
    genealogicalWave: true,
    claims: [
      "Separates biological humanity from the start of a covenant history.",
      "Sits near the actual archaeological appearance of farming villages.",
    ],
    critiques: [
      "A recent representative Adam may not be ancestor of all living people unless genealogical mixing is assumed (Swamidass’s add-on).",
      "Pauline Adam-Christ typology is stretched if billions lived and died before Adam.",
    ],
    sourceIds: ["alexander-2008", "swamidass-2019"],
    status: "speculative",
    statusRationale: "A theological reading timed to the Neolithic, not a fossil ID.",
  },
  {
    id: "walton",
    name: "Archetypal / functional Adam",
    author: "John H. Walton",
    year: 2015,
    kind: "theistic-evolution",
    shortLabel: "Walton",
    color: "#b8a1d4",
    summary:
      "Genesis is ancient Near Eastern temple text: origins of functions and roles, not a materials science paper. Adam is archetypal (and may also be historical). The “dust” and “rib” scenes are about status and kinship, not surgery. This overlay does not pin a species or a date; it refuses the demand to find Adam on a phylogenetic bar.",
    howToRead:
      "No forced marker. When enabled, the timeline stays scientific and a note reminds you that Walton’s Adam is not a paleontological coordinate.",
    claims: [
      "Genre first: do not force modern questions onto a different kind of text.",
      "A historical Adam is optional on some Walton readings, required on others.",
    ],
    critiques: [
      "Readers who want a named fossil will find this overlay unsatisfying on purpose.",
      "Critics say it underplays New Testament historical claims about Adam.",
    ],
    sourceIds: ["walton-2015", "biologos-adam"],
    status: "speculative",
    statusRationale: "Hermeneutics, not a chronological hypothesis.",
  },
  {
    id: "biologos",
    name: "Evolutionary creation (BioLogos)",
    author: "BioLogos / Venema & McKnight",
    year: 2017,
    kind: "theistic-evolution",
    shortLabel: "BioLogos",
    color: "#6aa8a0",
    summary:
      "God creates through evolution. Ancestral human population sizes never drop to two in the last few hundred thousand years. Adam and Eve are often read as literary, representative, or as a pair within a population (never as sole genetic parents of all humans). Venema & McKnight popularized the genetic side of that argument.",
    howToRead:
      "No couple marker. A note on the sapiens origin band: large population, African structure, no recent two-person bottleneck.",
    overlay: {
      startKa: 315,
      endKa: 200,
      taxonId: "sapiens",
      region: "Africa",
      label: "Evolutionary creation: population origin, no two-person bottleneck",
      kind: "band",
    },
    coversTaxonIds: ["sapiens"],
    claims: [
      "Population genetics rules out a recent sole-genetic-pair.",
      "Theological models should not deny that result.",
    ],
    critiques: [
      "Swamidass agrees about genetics and then reopens a genealogical pair.",
      "Some evangelicals see this as abandoning a historical Fall.",
    ],
    sourceIds: ["biologos-adam", "venema-2017", "li-durbin-2011"],
    status: "strong",
    statusRationale:
      "The genetic bottleneck claim is mainstream. The preferred theology varies inside the evolutionary-creation tent.",
  },
];

export const theoryById = Object.fromEntries(theories.map((t) => [t.id, t]));
