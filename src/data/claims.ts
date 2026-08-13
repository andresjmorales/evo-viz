import type { Claim } from "./types";

export const claims: Claim[] = [
  {
    id: "denisovan-distinct",
    featured: true,
    question: "Were Denisovans actually different from Neanderthals?",
    summary:
      "Yes, as populations. Nuclear genomes show Denisovans as a sister group to Neanderthals, not a regional variant of them. They diverged on the order of 400–800 thousand years ago (genetic clocks vary). They mixed: Denisova Cave even yielded a first-generation daughter of a Neanderthal mother and a Denisovan father. Morphologically the picture is thinner, because Denisovans were named from a finger bone. The Xiahe mandible and the case that Harbin / Homo longi belongs on this branch are the main anatomical claims, and those assignments are still argued. So: genetic distinctness is settled; species rank and which skulls count as Denisovan are contested.",
    status: "settled",
    statusRationale:
      "The genetic split is replicated across mtDNA and high-coverage nuclear genomes. What remains open is how to name the fossils and whether “species” is the right rank for groups that clearly interbred.",
    taxonIds: ["denisovan", "neanderthal", "longi"],
    sourceIds: [
      "krause-2010",
      "reich-2010",
      "meyer-2012",
      "slon-2018",
      "chen-2019",
      "ji-2021",
      "feng-2025",
      "paabo-2014",
      "paabo-nobel",
    ],
    relatedClaimIds: ["longi-denisovan", "introgression", "craig-adam"],
  },
  {
    id: "longi-denisovan",
    featured: true,
    question: "Are Denisovans the same thing as Homo longi / Dragon Man?",
    summary:
      "Maybe. The 2021 Harbin cranium was named Homo longi. Proteomics already tied the Xiahe mandible to Denisovans. In 2025, a reconstruction of the ~1-million-year-old Yunxian 2 cranium led Feng, Stringer and colleagues to put Yunxian, Harbin, and Denisovans on one Asian “longi” clade, sister to sapiens, with Neanderthals branching earlier. That would push splits deeper than many genetic estimates. It is a major paper, not yet a textbook rewrite. Treat the identification as contested, and the deep dates as even more so.",
    status: "contested",
    statusRationale:
      "A single high-profile phylogenetic analysis plus a handful of fossils. Independent teams have not all signed on, and genetic split times still prefer a shallower Neanderthal–Denisovan node.",
    taxonIds: ["longi", "denisovan", "sapiens", "neanderthal"],
    sourceIds: ["ji-2021", "chen-2019", "feng-2025", "nhm-yunxian"],
    relatedClaimIds: ["denisovan-distinct", "lca-neand-sapiens"],
  },
  {
    id: "african-origin",
    featured: true,
    question: "Did Homo sapiens evolve in Africa?",
    summary:
      "Yes. The oldest fossils that most researchers accept as early H. sapiens are African (Jebel Irhoud ~315 ka; later Omo and Herto). Living human genetic diversity is deepest in Africa. After ~70–50 ka a subset of African variation expanded across the rest of the world, mixing with Neanderthals and Denisovans. “Out of Africa” for sapiens is settled as a continent of origin; a single small Garden-of-Eden tribe inside Africa is not.",
    status: "settled",
    statusRationale:
      "Fossils, archaeology, and genomes all point to Africa. The remaining debate is structure inside Africa and the timing of extra-African pulses.",
    taxonIds: ["sapiens"],
    sourceIds: [
      "hublin-2017",
      "stringer-2016",
      "bergstrom-2021",
      "scerri-2018",
      "smithsonian-human-origins",
    ],
    relatedClaimIds: ["structured-africa", "ooa-timing"],
  },
  {
    id: "structured-africa",
    featured: true,
    question: "Was there one cradle of sapiens, or many linked African populations?",
    summary:
      "The live model is structured: several African regions contributed, connected by episodic gene flow, rather than a single isolated origin. Irhoud is in Morocco, Omo and Herto in Ethiopia, Florisbad in South Africa. Genetics of living Africans also looks like deep structure, not one bottlenecked tribe. This matters for anyone who wants to drop a single couple into “the” origin of the species.",
    status: "strong",
    statusRationale:
      "Widely adopted in reviews since Scerri et al. 2018, but the map of which regions mattered most is still being redrawn.",
    taxonIds: ["sapiens"],
    sourceIds: ["scerri-2018", "hublin-2017", "bergstrom-2021", "stringer-2016"],
    relatedClaimIds: ["african-origin", "swamidass-gae", "craig-adam"],
  },
  {
    id: "introgression",
    featured: true,
    question: "Did sapiens, Neanderthals, and Denisovans mix?",
    summary:
      "Yes. Non-African living humans carry ~1–2% Neanderthal ancestry. Some Oceanian groups carry additional Denisovan ancestry (often ~3–6%, from more than one pulse). There were later contacts (Oase 1 in Romania had a Neanderthal ancestor a few generations back). Mixing does not make the groups “the same species” in every biologist’s vocabulary, but it does mean the branches were reproductively compatible.",
    status: "settled",
    statusRationale:
      "Replicated in many genomes. Amounts, dates, and number of pulses still get refined.",
    taxonIds: ["sapiens", "neanderthal", "denisovan"],
    sourceIds: [
      "green-2010",
      "reich-2010",
      "prufer-2014",
      "fu-2015",
      "jacobs-2019",
      "bergstrom-2021",
    ],
    relatedClaimIds: ["denisovan-distinct", "neanderthal-extinction"],
  },
  {
    id: "heidelberg-real",
    featured: true,
    question: "Is Homo heidelbergensis a real species?",
    summary:
      "It is a useful label and a messy taxon. The type is a German mandible. Fossils dumped into the name include African (Bodo, Kabwe), European (Petralona, Arago), and sometimes Asian specimens. Sima de los Huesos is now usually early Neanderthal. Some researchers split African forms as H. rhodesiensis or fold them into early sapiens. Craig’s Adam model needs a last common ancestor of Neanderthals, Denisovans, and sapiens in this grade; that ancestor almost certainly existed, whether or not we keep the name heidelbergensis.",
    status: "contested",
    statusRationale:
      "Specialists agree the Middle Pleistocene is a bush, not a ladder. They do not agree on species names.",
    taxonIds: ["heidelbergensis", "antecessor", "neanderthal", "sapiens"],
    sourceIds: ["rightmire-2008", "stringer-heidelberg", "stringer-2016", "craig-2021"],
    relatedClaimIds: ["lca-neand-sapiens", "craig-adam"],
  },
  {
    id: "lca-neand-sapiens",
    question: "When did the Neanderthal, Denisovan, and sapiens lineages split?",
    summary:
      "Genetic estimates often put the Neanderthal–sapiens split around 500–800 ka, with Denisovans as sister to Neanderthals. The 2025 Yunxian analysis pushes morphological splits past 1 Ma and rearranges who is sister to whom. Both clocks (bones vs DNA) have assumptions. A last common ancestor in the late Early or early Middle Pleistocene is the safe statement; pinning it on one named species is not.",
    status: "contested",
    statusRationale:
      "Order-of-magnitude agreement; point estimates and topology shifted in 2025 and will shift again.",
    taxonIds: ["heidelbergensis", "neanderthal", "denisovan", "sapiens", "longi"],
    sourceIds: ["prufer-2014", "bergstrom-2021", "feng-2025", "stringer-2016"],
    relatedClaimIds: ["heidelberg-real", "longi-denisovan", "craig-adam"],
  },
  {
    id: "neanderthal-mind",
    featured: true,
    question: "Were Neanderthals “fully human” in mind and culture?",
    summary:
      "They were not cartoon brutes. They hunted large game, used fire, hafted tools, cared for injured individuals, and in some places used pigment and ornaments. Whether they had language like ours is untestable in detail. Whether they buried their dead symbolically is site-by-site. “Image of God” is a theological question; paleoanthropology can only say they were highly intelligent, social hominins with a culture overlapping ours.",
    status: "strong",
    statusRationale:
      "Cognitive continuity is the mainstream view. Specific claims (flute, flower burial, cave art) range from strong to shaky.",
    taxonIds: ["neanderthal"],
    sourceIds: ["zilhao-2010", "paabo-2014", "mcbrearty-2000", "craig-2021"],
    relatedClaimIds: ["behavior-revolution", "craig-adam"],
  },
  {
    id: "behavior-revolution",
    question: "Did modern behavior appear in a sudden European “revolution”?",
    summary:
      "No. McBrearty and Brooks argued in 2000 that the pieces of “modern” behavior accumulate in Africa over a long Middle Stone Age. European Upper Paleolithic richness is real, but it is not the origin clock for humanity. Beads, pigment, and engraved ochre in Africa predate the classic Cro-Magnon package.",
    status: "settled",
    statusRationale:
      "The 1980s “human revolution at 40 ka” model has been dismantled by African archaeology. Timing of particular traits still moves.",
    taxonIds: ["sapiens"],
    sourceIds: ["mcbrearty-2000", "hublin-2017", "scerri-2018"],
    relatedClaimIds: ["neanderthal-mind"],
  },
  {
    id: "bipedalism-first",
    question: "Did upright walking evolve before big brains?",
    summary:
      "Yes. Australopiths (and likely earlier still) walked on two legs with brains in the ape range. The old “big brain first” story died with Australopithecus. How habitual the very earliest candidates (Sahelanthropus, Orrorin, Ardi) were is less settled.",
    status: "settled",
    statusRationale:
      "Lucy, Laetoli, and the anamensis tibia are enough. Miocene candidates add earlier, shakier hints.",
    taxonIds: ["sahelanthropus", "orrorin", "ardipithecus", "afarensis", "anamensis"],
    sourceIds: ["johanson-1976", "white-2009", "senut-2001", "brunet-2002", "hhmi-transitions"],
    relatedClaimIds: ["sahel-hominin"],
  },
  {
    id: "sahel-hominin",
    question: "Is Sahelanthropus really a hominin?",
    summary:
      "Possibly. The Chad cranium has a small brain and a somewhat human-like face. A femur from the same area has been argued both for and against bipedality, and the cranium is distorted. Some researchers would place it closer to the chimpanzee lineage or as a stem ape. It is the right age for the split, which makes the stakes high and the evidence thinner than the headlines.",
    status: "contested",
    statusRationale:
      "Type specimen is one crushed cranium plus disputed postcrania. Still in textbooks as a probable hominin, with an asterisk.",
    taxonIds: ["sahelanthropus"],
    sourceIds: ["brunet-2002", "smithsonian-human-origins"],
    relatedClaimIds: ["bipedalism-first"],
  },
  {
    id: "not-a-chimp",
    question: "Did humans evolve from chimpanzees?",
    summary:
      "No. Humans and chimpanzees share a last common ancestor several million years ago. That ancestor was not a living chimpanzee. Ardi was used to argue the ancestor was a woodland climber rather than a knuckle-walker; that reconstruction is influential and still debated. Living chimps and bonobos have their own derived traits.",
    status: "settled",
    statusRationale:
      "Common descent with chimpanzees is settled; the locomotor reconstruction of the ancestor is not.",
    taxonIds: ["ardipithecus", "sapiens"],
    sourceIds: ["white-2009", "smithsonian-human-origins"],
    relatedClaimIds: ["bipedalism-first"],
  },
  {
    id: "lucy-ancestor",
    question: "Is Lucy’s species our direct ancestor?",
    summary:
      "It is the usual textbook ancestor of later Homo, but the early Homo fossil record around 2.8–2.0 Ma is a thicket (Ledi-Geraru mandible, habilis, rudolfensis, sediba). Afarensis could be a direct ancestor, an aunt, or a grade. The Laetoli footprints still show that this kind of body was walking around 3.7 Ma.",
    status: "strong",
    statusRationale:
      "Best-sampled Pliocene hominin in the right time and place. Exact parent of Homo is not nailed down.",
    taxonIds: ["afarensis", "habilis", "sediba"],
    sourceIds: ["johanson-1976", "villmoare-2015", "wood-collard-1999"],
    relatedClaimIds: ["early-homo-mess"],
  },
  {
    id: "early-homo-mess",
    question: "When does the genus Homo begin?",
    summary:
      "There is no clean line. Leakey’s 1964 definition bundled a slightly larger brain with stone tools. Wood and Collard later argued habilis does not belong in Homo. Spoor’s OH 7 reconstruction made habilis look more primitive. Ledi-Geraru at 2.8 Ma may be early Homo or a late australopith. Species names around 2 Ma are a hypothesis, not a barcode.",
    status: "contested",
    statusRationale:
      "The fossils are real; the genus boundary is a human decision with several defensible cuts.",
    taxonIds: ["habilis", "rudolfensis", "sediba", "erectus"],
    sourceIds: ["leakey-1964", "wood-collard-1999", "spoor-2015", "villmoare-2015"],
    relatedClaimIds: ["tools-who", "lucy-ancestor"],
  },
  {
    id: "tools-who",
    question: "Who made the first stone tools?",
    summary:
      "Oldowan tools appear by ~2.6 Ma in East Africa. They overlap australopiths, paranthropines, and early Homo. Lomekwi 3 (~3.3 Ma) would push toolmaking before Homo if the dates and artifacts hold; many remain cautious. Cut-marked bones at Dikika (~3.4 Ma) are also disputed. Default: early Homo is the usual suspect, not the only possible author.",
    status: "contested",
    statusRationale:
      "Association is circumstantial until a hominin is found holding the hammerstone.",
    taxonIds: ["habilis", "afarensis", "boisei"],
    sourceIds: ["leakey-1964", "villmoare-2015", "smithsonian-human-origins"],
    relatedClaimIds: ["early-homo-mess"],
  },
  {
    id: "paranthropus-side",
    question: "Are the “robust” australopiths our ancestors?",
    summary:
      "No. Paranthropus is a side branch of heavy chewers that went extinct around 1.2 Ma. They overlap early Homo in the same landscapes, which is a useful reminder that several hominin experiments ran at once.",
    status: "settled",
    statusRationale:
      "Morphology and chronology make a descendant relationship with sapiens implausible. Whether Paranthropus is a true clade is a smaller taxonomic quarrel.",
    taxonIds: ["boisei", "robustus"],
    sourceIds: ["smithsonian-human-origins", "wood-collard-1999"],
  },
  {
    id: "out-of-africa-1",
    question: "When did hominins first leave Africa?",
    summary:
      "By about 1.8 million years ago at Dmanisi, Georgia, and not much later on Java. These people are erectus-grade, not sapiens. Earlier Levantine claims exist and are evaluated case by case. This is a different event from the sapiens dispersal tens of thousands of years ago.",
    status: "strong",
    statusRationale:
      "Dmanisi and Java are securely dated in this ballpark. The exact first footfall is not.",
    taxonIds: ["erectus"],
    sourceIds: ["lordkipanidze-2013", "anton-2003", "henn-2012"],
    relatedClaimIds: ["erectus-one-species"],
  },
  {
    id: "erectus-one-species",
    question: "Is Homo erectus one species or many?",
    summary:
      "It depends how you like your species. African “ergaster,” Georgian Dmanisi, Chinese “Peking Man,” and Javan fossils span huge time and geography. Dmanisi’s own variation has been used to argue that early Homo is oversplit. Others keep regional names. For a timeline, one wide bar with internal diversity is the honest picture.",
    status: "contested",
    statusRationale:
      "A classic lumper–splitter fight. Biology does not force a single answer.",
    taxonIds: ["erectus"],
    sourceIds: ["anton-2003", "lordkipanidze-2013"],
    relatedClaimIds: ["out-of-africa-1"],
  },
  {
    id: "fire",
    question: "When did humans control fire?",
    summary:
      "Habitual fire is solid in the last few hundred thousand years. Wonderwerk Cave in South Africa has a strong ~1 Ma claim. Earlier “hearths” are often natural burns. Anatomy of erectus (smaller guts, bigger bodies) is sometimes read as cooking, which is a hypothesis, not a photograph.",
    status: "contested",
    statusRationale:
      "Late fire is settled; the date of first control is a sliding window.",
    taxonIds: ["erectus", "heidelbergensis", "sapiens"],
    sourceIds: ["anton-2003", "smithsonian-human-origins"],
  },
  {
    id: "island-dwarfs",
    question: "What is Homo floresiensis?",
    summary:
      "A real, tiny Late Pleistocene hominin, not a diseased modern human. Leading model: island dwarfism from an erectus-like ancestor. Alternative: a more primitive (habilis-grade) Asian remnant. Related: H. luzonensis in the Philippines, known from teeth and foot bones, another island experiment.",
    status: "strong",
    statusRationale:
      "Pathology model has collapsed. Ancestor and dwarfing mechanism remain discussed.",
    taxonIds: ["floresiensis", "erectus"],
    sourceIds: ["brown-2004", "detroit-2019"],
  },
  {
    id: "naledi-recent",
    question: "How can Homo naledi be so recent and so small-brained?",
    summary:
      "Because evolution is not a ladder. Dates of ~335–236 ka put naledi alongside early sapiens. A small brain in the genus Homo at that date surprised everyone and is now a fact to accommodate, not a reason to throw out the dates.",
    status: "strong",
    statusRationale:
      "Direct dates from Rising Star are the best evidence. Phylogenetic placement is still discussed.",
    taxonIds: ["naledi", "sapiens"],
    sourceIds: ["berger-2015", "dirks-2017"],
    relatedClaimIds: ["naledi-burial"],
  },
  {
    id: "naledi-burial",
    question: "Did Homo naledi bury its dead and make art?",
    summary:
      "The excavation team has argued for deliberate body disposal and, more recently, engravings. Many specialists are unconvinced: the cave is a nightmare to access, taphonomy is hard, and extraordinary claims need cleaner context. Treat burial/art as shaky pending independent replication.",
    status: "shaky",
    statusRationale:
      "Primary team vs a sizable skeptical literature. The bones are real; the ritual reading is not established.",
    taxonIds: ["naledi"],
    sourceIds: ["berger-2015", "dirks-2017"],
    relatedClaimIds: ["naledi-recent", "neanderthal-mind"],
  },
  {
    id: "neanderthal-extinction",
    question: "What happened to the Neanderthals?",
    summary:
      "As a distinct population they are gone by ~40 ka in most of Europe (Higham et al.). Causes on the table: climate swings, small population size, competition with incoming sapiens, absorption by mixing, or all of the above. They are not gone from our genomes.",
    status: "strong",
    statusRationale:
      "The disappearance date is strong. The cause list is still a committee.",
    taxonIds: ["neanderthal", "sapiens"],
    sourceIds: ["higham-2014", "fu-2015", "green-2010"],
    relatedClaimIds: ["introgression"],
  },
  {
    id: "ooa-timing",
    question: "When did Homo sapiens leave Africa for good?",
    summary:
      "There were earlier forays (Misliya ~180 ka, Skhul/Qafzeh ~120–90 ka) that may have gone extinct or been absorbed. The expansion that peopled Eurasia, Australia, and later the Americas is usually placed around 70–50 ka, with Australia possibly occupied by ~65 ka. Routes (Nile vs Bab-el-Mandeb) are still argued.",
    status: "strong",
    statusRationale:
      "A major late-Pleistocene wave is clear; earlier failed or limited exits are documented and easy to over-read.",
    taxonIds: ["sapiens"],
    sourceIds: ["henn-2012", "bergstrom-2021", "clarkson-2017"],
    relatedClaimIds: ["african-origin"],
  },
  {
    id: "swamidass-gae",
    featured: true,
    question: "Could a recent Adam and Eve be ancestors of everyone alive without contradicting genetics?",
    summary:
      "Swamidass’s distinction: genetic ancestry (DNA segments) is not genealogical ancestry (places on a family tree). Rohde, Olson and Chang showed that genealogical ancestry becomes universal surprisingly fast. Under models of realistic migration, a couple living in the Middle East as recently as ~6,000 years ago could be genealogical ancestors of all living people, while contributing essentially no distinctive genes, if their descendants mixed with a large existing human population. This does not prove such a couple existed. It removes one popular scientific objection to a recent de novo couple, provided one accepts people “outside the garden.”",
    status: "strong",
    statusRationale:
      "The population-genetic math is mainstream. The de novo couple is a theological hypothesis sitting on top of it, not a paleontological finding.",
    taxonIds: ["sapiens"],
    sourceIds: [
      "swamidass-2019",
      "swamidass-preprint",
      "rohde-2004",
      "swamidass-ct",
      "venema-2017",
    ],
    relatedClaimIds: ["structured-africa", "kemp-ensoulment"],
  },
  {
    id: "craig-adam",
    featured: true,
    question: "Could Adam and Eve have been Homo heidelbergensis?",
    summary:
      "William Lane Craig reads Genesis 1–11 as mytho-history and then asks where a primordial pair could sit so that Neanderthals, Denisovans, and sapiens all count as their descendants and as image-bearers. He picks large-brained Middle Pleistocene humans, usually called H. heidelbergensis, around 1.0–0.75 Ma, and allows a biological plus spiritual “renovation” of two individuals. Population genetics does not rule out a pair that far back (the recent-pair bottleneck is the one genetics forbids). The weaknesses are the squishy taxon, the moving split dates (see Yunxian 2025), and the theological load placed on archaeological “humanity” tests.",
    status: "speculative",
    statusRationale:
      "A coherent philosophical placement, not a scientific inference. Compatible with a deep pair; not demanded by fossils or genes.",
    taxonIds: ["heidelbergensis", "neanderthal", "denisovan", "sapiens"],
    sourceIds: [
      "craig-2021",
      "craig-first-things",
      "craig-ct",
      "stringer-heidelberg",
      "li-durbin-2011",
    ],
    relatedClaimIds: ["heidelberg-real", "lca-neand-sapiens", "neanderthal-mind"],
  },
  {
    id: "kemp-ensoulment",
    question: "Could God ensoul two people inside a larger hominin population?",
    summary:
      "Kenneth Kemp’s Catholic model: evolution produces a biologically human population; God infuses rational souls into two, and then into descendants (including mixed offspring). Theological monogenism plus biological polygenism. It is close in structure to Swamidass (a pair among many) but usually placed at the origin of rational humanity rather than in the Neolithic, and it insists on a metaphysical difference the fossils cannot show.",
    status: "speculative",
    statusRationale:
      "A philosophical reconciliation. No empirical test for a soul. Timing is underspecified on purpose.",
    taxonIds: ["sapiens"],
    sourceIds: ["kemp-2011"],
    relatedClaimIds: ["swamidass-gae", "craig-adam"],
  },
];

export const claimById = Object.fromEntries(claims.map((c) => [c.id, c]));
export const featuredClaims = claims.filter((c) => c.featured);
