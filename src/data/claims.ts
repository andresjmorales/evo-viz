import type { Claim } from "./types";

export const claims: Claim[] = [
  {
    id: "denisovan-distinct",
    featured: true,
    question: "Were Denisovans actually different from Neanderthals?",
    summary:
      "Yes, as populations. A finger bone from Denisova Cave first yielded mitochondrial DNA unlike that of any Neanderthal or modern human.[@krause-2010] Nuclear genomes then showed Denisovans as a sister group to Neanderthals.[@reich-2010,meyer-2012] They diverged on the order of 400–800 thousand years ago (genetic clocks vary). They mixed: Denisova Cave even yielded a first-generation daughter of a Neanderthal mother and a Denisovan father.[@slon-2018] For years the anatomy was almost unknown, because Denisovans were named from a finger bone. The Xiahe mandible from Tibet was tied to them by its proteins,[@chen-2019] and in 2025 proteins and mitochondrial DNA did the same for the Harbin skull.[@fu-2025-proteome,fu-2025-mtdna] So: genetic distinctness is settled; species rank, and which other skulls count as Denisovan, are still argued.[@feng-2025]",
    status: "settled",
    statusRationale:
      "The genetic split is replicated across mtDNA and high-coverage nuclear genomes. What remains open is how to name the fossils and whether “species” is the right rank for groups that clearly interbred.",
    taxonIds: ["denisovan", "neanderthal", "longi"],
    sourceIds: ["krause-2010", "reich-2010", "meyer-2012", "slon-2018", "chen-2019", "fu-2025-proteome", "fu-2025-mtdna", "ji-2021", "feng-2025", "paabo-2014", "paabo-nobel"],
    relatedClaimIds: ["longi-denisovan", "introgression", "craig-adam"],
  },
  {
    id: "longi-denisovan",
    featured: true,
    question: "Are Denisovans the same thing as Homo longi / Dragon Man?",
    summary:
      "Increasingly, yes. The Harbin cranium was named Homo longi in 2021.[@ji-2021] Proteomics had already tied the Xiahe mandible to Denisovans.[@chen-2019] In 2025 two studies of the Harbin skull itself found Denisovan-type proteins in the bone and Denisovan mitochondrial DNA in its dental calculus, which gives Denisovans a face for the first time.[@fu-2025-proteome,fu-2025-mtdna] The same year, a reconstruction of the ~1-million-year-old Yunxian 2 cranium led Feng, Stringer and colleagues to put Yunxian, Harbin, and Denisovans on one Asian “longi” clade, sister to sapiens, with Neanderthals branching earlier.[@feng-2025] That arrangement would push splits deeper than most genetic estimates, and it is the part still in dispute. The link between Harbin and Denisovans is now strong; the deep dates and the shape of the tree are contested.",
    status: "strong",
    statusRationale:
      "Two independent molecular results from the Harbin skull itself, proteins and mitochondrial DNA, both published in 2025. Whether Homo longi should become the formal name for Denisovans, and the tree built on Yunxian, remain open.",
    taxonIds: ["longi", "denisovan", "sapiens", "neanderthal"],
    sourceIds: ["ji-2021", "chen-2019", "fu-2025-proteome", "fu-2025-mtdna", "feng-2025", "nhm-yunxian"],
    relatedClaimIds: ["denisovan-distinct", "lca-neand-sapiens"],
  },
  {
    id: "african-origin",
    featured: true,
    question: "Did Homo sapiens evolve in Africa?",
    summary:
      "Yes. The oldest fossils that most researchers accept as early H. sapiens are African: Jebel Irhoud at about 315 ka,[@hublin-2017] then Omo Kibish, now dated to at least 233 ka,[@vidal-2022] and Herto. Living human genetic diversity is deepest in Africa.[@henn-2012] After ~70–50 ka a subset of African variation expanded across the rest of the world, mixing with Neanderthals and Denisovans.[@bergstrom-2021] “Out of Africa” for sapiens is settled as a continent of origin; a single small Garden-of-Eden tribe inside Africa is not.[@scerri-2018]",
    status: "settled",
    statusRationale:
      "Fossils, archaeology, and genomes all point to Africa. The remaining debate is structure inside Africa and the timing of extra-African pulses.",
    taxonIds: ["sapiens"],
    sourceIds: ["hublin-2017", "vidal-2022", "henn-2012", "stringer-2016", "bergstrom-2021", "scerri-2018", "smithsonian-human-origins"],
    relatedClaimIds: ["structured-africa", "ooa-timing"],
  },
  {
    id: "structured-africa",
    featured: true,
    question: "Was there one cradle of sapiens, or many linked African populations?",
    summary:
      "The live model is structured: several African regions contributed, connected by episodic gene flow, rather than a single isolated origin.[@scerri-2018] Irhoud is in Morocco,[@hublin-2017] Omo and Herto in Ethiopia, Florisbad in South Africa. Genetics of living Africans also points to deep structure.[@bergstrom-2021] This matters for anyone who wants to drop a single couple into “the” origin of the species.",
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
      "Yes. Non-African living humans carry roughly 2% Neanderthal ancestry.[@green-2010,prufer-2017] Some Oceanian groups carry additional Denisovan ancestry (estimates run from about 2% to 5%, from more than one pulse).[@reich-2010,vernot-2016,jacobs-2019] Genomes from the earliest Europeans date the main Neanderthal mixing to about 50–45 thousand years ago.[@sumer-2024,iasi-2024] There were later contacts too: Oase 1 in Romania had a Neanderthal ancestor a few generations back.[@fu-2015] Gene flow also ran the other way, from early sapiens into Neanderthals.[@kuhlwilm-2016] Mixing does not make the groups “the same species” in every biologist’s vocabulary, but it does mean the branches were reproductively compatible.",
    status: "settled",
    statusRationale:
      "Replicated in many genomes. Amounts, dates, and number of pulses still get refined.",
    taxonIds: ["sapiens", "neanderthal", "denisovan"],
    sourceIds: ["green-2010", "prufer-2017", "reich-2010", "vernot-2016", "jacobs-2019", "sumer-2024", "iasi-2024", "fu-2015", "kuhlwilm-2016", "prufer-2014", "bergstrom-2021"],
    relatedClaimIds: ["denisovan-distinct", "neanderthal-extinction"],
  },
  {
    id: "heidelberg-real",
    featured: true,
    question: "Is Homo heidelbergensis a real species?",
    summary:
      "It is a useful label and a messy taxon. The type is a German mandible.[@stringer-heidelberg] Fossils dumped into the name include African (Bodo, Kabwe), European (Petralona, Arago), and sometimes Asian specimens.[@rightmire-2008] Sima de los Huesos is now usually early Neanderthal, a call its nuclear DNA confirmed.[@meyer-2016] Kabwe turned out to be only about 300 thousand years old, a contemporary of early sapiens.[@grun-2020] Some researchers split African forms as H. rhodesiensis or fold them into early sapiens.[@stringer-2016] Craig’s Adam model needs a last common ancestor of Neanderthals, Denisovans, and sapiens in this grade;[@craig-2021] that ancestor almost certainly existed, whether or not we keep the name heidelbergensis.",
    status: "contested",
    statusRationale:
      "Specialists agree the Middle Pleistocene held several branching lineages. They do not agree on species names.",
    taxonIds: ["heidelbergensis", "antecessor", "neanderthal", "sapiens"],
    sourceIds: ["stringer-heidelberg", "rightmire-2008", "meyer-2016", "grun-2020", "stringer-2016", "craig-2021"],
    relatedClaimIds: ["lca-neand-sapiens", "craig-adam"],
  },
  {
    id: "lca-neand-sapiens",
    question: "When did the Neanderthal, Denisovan, and sapiens lineages split?",
    summary:
      "Genetic estimates often put the Neanderthal–sapiens split around 500–800 ka, with Denisovans as sister to Neanderthals.[@prufer-2014,bergstrom-2021] Nuclear DNA from the 430-thousand-year-old Sima de los Huesos bones shows the Neanderthal line was already separate by then.[@meyer-2016] The 2025 Yunxian analysis pushes morphological splits past 1 Ma and rearranges who is sister to whom.[@feng-2025] Both clocks (bones vs DNA) have assumptions. A last common ancestor in the late Early or early Middle Pleistocene is the safe statement; pinning it on one named species is not.",
    status: "contested",
    statusRationale:
      "Order-of-magnitude agreement; point estimates and topology shifted in 2025 and will shift again.",
    taxonIds: ["heidelbergensis", "neanderthal", "denisovan", "sapiens", "longi"],
    sourceIds: ["prufer-2014", "bergstrom-2021", "meyer-2016", "feng-2025", "stringer-2016"],
    relatedClaimIds: ["heidelberg-real", "longi-denisovan", "craig-adam"],
  },
  {
    id: "neanderthal-mind",
    featured: true,
    question: "Were Neanderthals “fully human” in mind and culture?",
    summary:
      "The brutish caveman of old cartoons has no support in the evidence. Neanderthals hunted large game, used fire, hafted tools, cared for injured individuals, and in some places used pigment and ornaments.[@zilhao-2010] Dated crusts over cave paintings in Spain have been used to argue that they painted, a claim others dispute.[@hoffmann-2018] Whether they had language like ours is untestable in detail. Whether they buried their dead symbolically is site-by-site. “Image of God” is a theological question; paleoanthropology can only say they were highly intelligent, social hominins with a culture overlapping ours.[@paabo-2014]",
    status: "strong",
    statusRationale:
      "Cognitive continuity is the mainstream view. Specific claims (flute, flower burial, cave art) range from strong to shaky.",
    taxonIds: ["neanderthal"],
    sourceIds: ["zilhao-2010", "hoffmann-2018", "paabo-2014", "mcbrearty-2000", "craig-2021"],
    relatedClaimIds: ["behavior-revolution", "craig-adam"],
  },
  {
    id: "behavior-revolution",
    question: "Did modern behavior appear in a sudden European “revolution”?",
    summary:
      "No. McBrearty and Brooks argued in 2000 that the pieces of “modern” behavior accumulate in Africa over a long Middle Stone Age.[@mcbrearty-2000] Finds since have borne that out: pigment and long-distance transport of stone by about 300 ka at Olorgesailie,[@brooks-2018] shell beads at about 142 ka in Morocco,[@sehasseh-2021] and engraved ochre at about 77 ka at Blombos.[@henshilwood-2002] European Upper Paleolithic richness is real, and it began long after modern behaviour appeared in Africa.",
    status: "settled",
    statusRationale:
      "The 1980s “human revolution at 40 ka” model has been dismantled by African archaeology. Timing of particular traits still moves.",
    taxonIds: ["sapiens"],
    sourceIds: ["mcbrearty-2000", "brooks-2018", "sehasseh-2021", "henshilwood-2002", "hublin-2017", "scerri-2018"],
    relatedClaimIds: ["neanderthal-mind"],
  },
  {
    id: "bipedalism-first",
    question: "Did upright walking evolve before big brains?",
    summary:
      "Yes. Australopiths (and likely earlier still) walked on two legs with brains in the ape range.[@johanson-1976] The old “big brain first” story died with Australopithecus. How habitual the very earliest candidates were is less settled: Sahelanthropus,[@brunet-2002] Orrorin,[@senut-2001,richmond-2008] and Ardi.[@white-2009]",
    status: "settled",
    statusRationale:
      "Lucy, Laetoli, and the anamensis tibia are enough. Miocene candidates add earlier, shakier hints.",
    taxonIds: ["sahelanthropus", "orrorin", "ardipithecus", "afarensis", "anamensis"],
    sourceIds: ["johanson-1976", "brunet-2002", "senut-2001", "richmond-2008", "white-2009", "hhmi-transitions"],
    relatedClaimIds: ["sahel-hominin"],
  },
  {
    id: "sahel-hominin",
    question: "Is Sahelanthropus really a hominin?",
    summary:
      "Possibly. The Chad cranium has a small brain and a somewhat human-like face.[@brunet-2002] A femur from the same area has been argued both for and against bipedality, and the cranium is distorted. Some researchers would place it closer to the chimpanzee lineage or as a stem ape. It is the right age for the split, which makes the stakes high and the evidence thinner than the headlines.",
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
      "No. Humans and chimpanzees share a last common ancestor several million years ago. That ancestor was not a living chimpanzee. Ardi was used to argue the ancestor was a woodland climber rather than a knuckle-walker;[@white-2009] that reconstruction is influential and still debated. Living chimps and bonobos have their own derived traits.",
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
      "It is the usual textbook ancestor of later Homo,[@johanson-1976] but the early Homo fossil record around 2.8–2.0 Ma is a thicket (Ledi-Geraru mandible,[@villmoare-2015] habilis, rudolfensis, sediba). Afarensis could be a direct ancestor, an aunt, or a grade. Its own presumed parent, Au. anamensis, turned out to overlap with it for about 100 thousand years.[@haile-selassie-2019] The Laetoli footprints still show that this kind of body was walking around 3.7 Ma.",
    status: "strong",
    statusRationale:
      "Best-sampled Pliocene hominin in the right time and place. Exact parent of Homo is not nailed down.",
    taxonIds: ["afarensis", "habilis", "sediba"],
    sourceIds: ["johanson-1976", "villmoare-2015", "haile-selassie-2019", "wood-collard-1999"],
    relatedClaimIds: ["early-homo-mess"],
  },
  {
    id: "early-homo-mess",
    question: "When does the genus Homo begin?",
    summary:
      "There is no clean line. Leakey’s 1964 definition bundled a slightly larger brain with stone tools.[@leakey-1964] Wood and Collard later argued habilis does not belong in Homo.[@wood-collard-1999] Spoor’s OH 7 reconstruction made habilis look more primitive.[@spoor-2015] Fossils from Koobi Fora confirmed that at least two kinds of early Homo lived side by side.[@leakey-2012] Ledi-Geraru at 2.8 Ma may be early Homo or a late australopith.[@villmoare-2015] Species names around 2 Ma are hypotheses.",
    status: "contested",
    statusRationale:
      "The fossils are real; the genus boundary is a human decision with several defensible cuts.",
    taxonIds: ["habilis", "rudolfensis", "sediba", "erectus"],
    sourceIds: ["leakey-1964", "wood-collard-1999", "spoor-2015", "leakey-2012", "villmoare-2015"],
    relatedClaimIds: ["tools-who", "lucy-ancestor"],
  },
  {
    id: "tools-who",
    question: "Who made the first stone tools?",
    summary:
      "Oldowan tools appear by ~2.6 Ma in East Africa.[@semaw-1997,braun-2019] They overlap australopiths, paranthropines, and early Homo. Lomekwi 3 (~3.3 Ma) would push toolmaking before Homo if the dates and artifacts hold; many remain cautious.[@harmand-2015] Cut-marked bones at Dikika (~3.4 Ma) are also disputed. Early Homo is the usual suspect;[@leakey-1964] other toolmakers remain possible.",
    status: "contested",
    statusRationale:
      "Association is circumstantial until a hominin is found holding the hammerstone.",
    taxonIds: ["habilis", "afarensis", "boisei"],
    sourceIds: ["semaw-1997", "braun-2019", "harmand-2015", "leakey-1964", "villmoare-2015", "smithsonian-human-origins"],
    relatedClaimIds: ["early-homo-mess"],
  },
  {
    id: "paranthropus-side",
    question: "Are the “robust” australopiths our ancestors?",
    summary:
      "No. Paranthropus is a side branch of heavy chewers that went extinct around 1.2 Ma.[@smithsonian-human-origins] Chemical traces in their teeth show a diet dominated by grasses or sedges, unlike that of any living ape.[@cerling-2011] They overlap early Homo in the same landscapes, which is a useful reminder that several hominin experiments ran at once.",
    status: "settled",
    statusRationale:
      "Morphology and chronology make a descendant relationship with sapiens implausible. Whether Paranthropus is a true clade is a smaller taxonomic quarrel.",
    taxonIds: ["boisei", "robustus"],
    sourceIds: ["smithsonian-human-origins", "cerling-2011", "wood-collard-1999"],
  },
  {
    id: "out-of-africa-1",
    question: "When did hominins first leave Africa?",
    summary:
      "By about 1.8 million years ago at Dmanisi, Georgia,[@lordkipanidze-2013] and by about 1.3 million on Java.[@matsuura-2020] Stone tools on China’s Loess Plateau may be older still, at about 2.1 million years.[@zhu-2018] These people are erectus-grade.[@anton-2003] Earlier Levantine claims exist and are evaluated case by case. This is a different event from the sapiens dispersal tens of thousands of years ago.",
    status: "strong",
    statusRationale:
      "Dmanisi and Java are securely dated in this ballpark. The exact first footfall is not.",
    taxonIds: ["erectus"],
    sourceIds: ["lordkipanidze-2013", "matsuura-2020", "zhu-2018", "anton-2003", "henn-2012"],
    relatedClaimIds: ["erectus-one-species"],
  },
  {
    id: "erectus-one-species",
    question: "Is Homo erectus one species or many?",
    summary:
      "It depends how you like your species. African “ergaster,” Georgian Dmanisi, Chinese “Peking Man,” and Javan fossils span huge time and geography. Dmanisi’s own variation has been used to argue that early Homo is oversplit.[@lordkipanidze-2013] Others keep regional names.[@anton-2003] For a timeline, one wide bar with internal diversity is the honest picture.",
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
      "Habitual fire is solid in the last few hundred thousand years.[@roebroeks-2011] Wonderwerk Cave in South Africa has a strong ~1 Ma claim,[@berna-2012] and Gesher Benot Ya‘aqov in Israel one at about 790 ka.[@goren-inbar-2004] Earlier “hearths” are often natural burns. Anatomy of erectus (smaller guts, bigger bodies) is sometimes read as cooking, which remains a hypothesis.",
    status: "contested",
    statusRationale:
      "Late fire is settled; the date of first control is a sliding window.",
    taxonIds: ["erectus", "heidelbergensis", "sapiens"],
    sourceIds: ["roebroeks-2011", "berna-2012", "goren-inbar-2004", "anton-2003", "smithsonian-human-origins"],
  },
  {
    id: "island-dwarfs",
    question: "What is Homo floresiensis?",
    summary:
      "A real, tiny Late Pleistocene hominin.[@brown-2004] The idea that the bones belonged to a diseased modern human has been abandoned. Leading model: island dwarfism from an erectus-like ancestor. Fossils 700 thousand years old show the small body was already in place,[@van-den-bergh-2016] and stone tools put hominins on Flores by a million years ago.[@brumm-2010] Alternative: a more primitive (habilis-grade) Asian remnant. Related: H. luzonensis in the Philippines, known from teeth and foot bones, another island experiment.[@detroit-2019]",
    status: "strong",
    statusRationale:
      "Pathology model has collapsed. Ancestor and dwarfing mechanism remain discussed.",
    taxonIds: ["floresiensis", "erectus"],
    sourceIds: ["brown-2004", "van-den-bergh-2016", "brumm-2010", "detroit-2019"],
  },
  {
    id: "naledi-recent",
    question: "How can Homo naledi be so recent and so small-brained?",
    summary:
      "Because lineages change at different rates, and old forms can persist beside new ones. Dates of ~335–236 ka put naledi alongside early sapiens.[@dirks-2017] A small brain in the genus Homo at that date surprised everyone[@berger-2015] and is now an accepted fact.",
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
      "The excavation team has argued for deliberate body disposal[@berger-2015] and, more recently, engravings. Many specialists are unconvinced: the cave is a nightmare to access, taphonomy is hard, and extraordinary claims need cleaner context. Treat burial/art as shaky pending independent replication.",
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
      "As a distinct population they are gone by ~40 ka in most of Europe.[@higham-2014] Sapiens were already in northern Europe by 45 ka, so the two overlapped for several thousand years.[@mylopotamitaki-2024] Causes on the table: climate swings, small population size, competition with incoming sapiens, absorption by mixing, or all of the above. Their DNA survives in us.[@green-2010]",
    status: "strong",
    statusRationale:
      "The disappearance date is strong. The cause list is still a committee.",
    taxonIds: ["neanderthal", "sapiens"],
    sourceIds: ["higham-2014", "mylopotamitaki-2024", "fu-2015", "green-2010"],
    relatedClaimIds: ["introgression"],
  },
  {
    id: "ooa-timing",
    question: "When did Homo sapiens leave Africa for good?",
    summary:
      "There were earlier forays: Apidima in Greece at perhaps 210 ka,[@harvati-2019] Misliya at about 180 ka,[@hershkovitz-2018] and Skhul and Qafzeh at about 120–90 ka. They seem to have died out or been absorbed. The expansion that peopled Eurasia, Australia, and later the Americas is usually placed around 70–50 ka,[@henn-2012,bergstrom-2021] with Australia possibly occupied by ~65 ka.[@clarkson-2017] Routes (Nile vs Bab-el-Mandeb) are still argued.",
    status: "strong",
    statusRationale:
      "A major late-Pleistocene wave is clear; earlier failed or limited exits are documented and easy to over-read.",
    taxonIds: ["sapiens"],
    sourceIds: ["harvati-2019", "hershkovitz-2018", "henn-2012", "bergstrom-2021", "clarkson-2017"],
    relatedClaimIds: ["african-origin"],
  },
  {
    id: "swamidass-gae",
    featured: true,
    question: "Could a recent Adam and Eve be ancestors of everyone alive without contradicting genetics?",
    summary:
      "Swamidass’s distinction: genetic ancestry (DNA segments) is not genealogical ancestry (places on a family tree).[@swamidass-2019] Rohde, Olson and Chang showed that genealogical ancestry becomes universal surprisingly fast.[@rohde-2004] Under models of realistic migration, a couple living in the Middle East as recently as ~6,000 years ago could be genealogical ancestors of all living people, while contributing essentially no distinctive genes, if their descendants mixed with a large existing human population.[@swamidass-preprint] This does not prove such a couple existed. It removes one popular scientific objection to a recent de novo couple, provided one accepts people “outside the garden.”",
    status: "strong",
    statusRationale:
      "The population-genetic math is mainstream. The de novo couple is a theological hypothesis sitting on top of it.",
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
      "William Lane Craig reads Genesis 1–11 as mytho-history and then asks where a primordial pair could sit so that Neanderthals, Denisovans, and sapiens all count as their descendants and as image-bearers.[@craig-2021] He picks large-brained Middle Pleistocene humans, usually called H. heidelbergensis, around 1.0–0.75 Ma, and allows a biological plus spiritual “renovation” of two individuals. Population genetics does not rule out a pair that far back (the recent-pair bottleneck is the one genetics forbids).[@li-durbin-2011] The weaknesses are the squishy taxon,[@stringer-heidelberg] the moving split dates (see Yunxian 2025), and the theological load placed on archaeological “humanity” tests.",
    status: "speculative",
    statusRationale:
      "A coherent philosophical placement. Compatible with a deep pair; not demanded by fossils or genes.",
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
      "Kenneth Kemp’s Catholic model: evolution produces a biologically human population; God infuses rational souls into two, and then into descendants (including mixed offspring).[@kemp-2011] Theological monogenism plus biological polygenism. It is close in structure to Swamidass (a pair among many) but usually placed at the origin of rational humanity rather than in the Neolithic, and it insists on a metaphysical difference the fossils cannot show.",
    status: "speculative",
    statusRationale:
      "A philosophical reconciliation. No empirical test for a soul. Timing is underspecified on purpose.",
    taxonIds: ["sapiens"],
    sourceIds: ["kemp-2011"],
    relatedClaimIds: ["swamidass-gae", "craig-adam"],
  },
  {
    id: "orrorin-biped",
    question: "Did Orrorin walk upright six million years ago?",
    summary:
      "Probably, at least some of the time. Orrorin is known from teeth and limb bones, with no skull.[@senut-2001] The case rests on a thigh bone. Measured against apes, australopiths and later Homo, its shape groups with the australopiths, which is what a biped’s femur should do.[@richmond-2008] What cannot be read from one bone is how much time the animal spent on the ground and how it moved in trees.",
    status: "contested",
    statusRationale:
      "A careful quantitative study supports bipedal hip mechanics, but the sample is a handful of bones from one site and no foot, pelvis or skull is known.",
    taxonIds: ["orrorin"],
    sourceIds: ["senut-2001", "richmond-2008"],
    relatedClaimIds: ["bipedalism-first", "sahel-hominin"],
  },
  {
    id: "anamensis-afarensis",
    question: "Did Australopithecus anamensis simply turn into Lucy’s species?",
    summary:
      "For years the two were treated as one lineage changing through time, the textbook case of one species grading into the next. A nearly complete 3.8-million-year-old anamensis cranium from Woranso-Mille changed that. Its features, set against a frontal bone already assigned to afarensis at about 3.9 million years, imply the two overlapped for at least 100 thousand years.[@haile-selassie-2019] If so, afarensis budded off while the parent species carried on. The overlap depends on the identification of one fragmentary frontal bone.",
    status: "contested",
    statusRationale:
      "One excellent cranium and one disputed frontal bone. The ancestor-descendant link itself is widely accepted; the mode of the transition is what is argued.",
    taxonIds: ["anamensis", "afarensis"],
    sourceIds: ["haile-selassie-2019", "johanson-1976"],
    relatedClaimIds: ["lucy-ancestor", "bipedalism-first"],
  },
  {
    id: "sediba-homo",
    question: "Is Australopithecus sediba the ancestor of our genus?",
    summary:
      "Its discoverers proposed it as a possible ancestor of Homo, pointing to a mix of australopith and Homo-like features in the hand, pelvis and teeth.[@berger-2010] The difficulty is timing. The Malapa skeletons are about 1.98 million years old, while a jaw from Ledi-Geraru in Ethiopia puts Homo at 2.8 million years.[@villmoare-2015] An ancestor cannot be younger than its descendant, so sediba would have to be a late survivor of an older, unsampled population. Most researchers treat it as a close cousin that evolved some similar features on its own.",
    status: "shaky",
    statusRationale:
      "The anatomy is real and well described, but the dates run the wrong way for direct ancestry and no older sediba fossils are known.",
    taxonIds: ["sediba", "habilis"],
    sourceIds: ["berger-2010", "villmoare-2015", "wood-collard-1999"],
    relatedClaimIds: ["early-homo-mess", "lucy-ancestor"],
  },
  {
    id: "antecessor-position",
    question: "Where does Homo antecessor sit on the family tree?",
    summary:
      "The Gran Dolina fossils have a strikingly modern-looking mid-face, which led their finders to propose antecessor as the last common ancestor of Neanderthals and sapiens. They are too old for DNA, but proteins survive longer. Enamel proteins recovered from an 800-thousand-year-old tooth place antecessor as a close sister lineage to the group containing sapiens, Neanderthals and Denisovans, close to their common ancestor without being it.[@welker-2020] The modern-looking face would then be an old feature that Neanderthals later lost.",
    status: "strong",
    statusRationale:
      "Direct molecular evidence from the fossils themselves, though ancient proteins resolve relationships less finely than DNA and the result rests on a small number of informative positions.",
    taxonIds: ["antecessor", "heidelbergensis"],
    sourceIds: ["welker-2020", "stringer-2016"],
    relatedClaimIds: ["heidelberg-real", "lca-neand-sapiens"],
  },
  {
    id: "climate-driver",
    question: "Did climate change drive human evolution?",
    summary:
      "It set the stage, and how much more is argued. Deep-sea cores record the planet cooling and its ice ages lengthening over the last five million years.[@lisiecki-2005] One influential view ties steps in African drying, at roughly 2.8, 1.7 and 1.0 million years ago, to bursts of hominin speciation and new tools.[@demenocal-1995] A rival view holds that the trend mattered less than the instability: landscapes that kept flipping between wet and dry favoured flexible, inventive species.[@potts-2013] For the later dispersals the link is clearer. Climate models show green corridors opening out of Africa on a rhythm set by the Earth’s orbit, at times that match the fossil and genetic evidence for people moving.[@timmermann-2016]",
    status: "contested",
    statusRationale:
      "The climate record is solid and the timing of some dispersals fits it well. Tying particular species or adaptations to particular climate shifts is much harder, because the fossil record is too coarse to test cause and effect.",
    taxonIds: ["erectus", "sapiens"],
    sourceIds: ["lisiecki-2005", "demenocal-1995", "potts-2013", "timmermann-2016"],
    relatedClaimIds: ["ooa-timing", "sea-level-routes"],
  },
  {
    id: "sea-level-routes",
    question: "Did low sea levels open the routes people took?",
    summary:
      "Some of them. During ice ages so much water was locked in ice sheets that the sea stood as much as 120 to 130 metres lower than today.[@spratt-2016] That joined Sumatra, Java and Borneo to mainland Asia, New Guinea to Australia, and Siberia to Alaska. Homo erectus could walk to Java, and the first Americans could walk across Beringia. Low seas never closed the deep channels of island Southeast Asia, though: reaching Flores or Australia always meant crossing open water.[@brumm-2010,clarkson-2017] On the globe, drag the timeline through the last ice age to watch the coasts move.",
    status: "strong",
    statusRationale:
      "Past sea levels are well reconstructed for the last 800 thousand years and sea-floor depths are measured. Earlier sea levels are rougher estimates, and which shore a given group actually walked is inferred.",
    taxonIds: ["erectus", "floresiensis", "sapiens"],
    sourceIds: ["spratt-2016", "lisiecki-2005", "brumm-2010", "clarkson-2017"],
    relatedClaimIds: ["out-of-africa-1", "ooa-timing", "first-americans"],
  },
  {
    id: "first-americans",
    question: "When did people first reach the Americas?",
    summary:
      "Later than anywhere else, and the date keeps moving back. For decades the answer was about 13 thousand years ago. Monte Verde in Chile broke that at 14.5 thousand,[@dillehay-2008] and Cooper’s Ferry in Idaho is about 16 thousand.[@davis-2019] The sharpest challenge is a set of human footprints at White Sands, New Mexico, dated to 23 to 21 thousand years ago, the height of the last ice age.[@bennett-2021] The first dates came from seeds that can absorb old carbon; a follow-up using pollen and a different dating method gave the same answer.[@pigati-2023] If the footprints are that old, people were south of the ice sheets before the ice-free corridor opened, which points to a coastal route.",
    status: "contested",
    statusRationale:
      "Entry from Siberia through Beringia is settled by genetics. The White Sands dates have now been reproduced with independent methods, but a single site carries the pre-glacial case and some archaeologists still doubt it.",
    taxonIds: ["sapiens"],
    sourceIds: ["dillehay-2008", "davis-2019", "bennett-2021", "pigati-2023", "bergstrom-2021"],
    relatedClaimIds: ["ooa-timing", "sea-level-routes"],
  },
  {
    id: "paranthropus-diet",
    question: "What did “Nutcracker Man” actually eat?",
    summary:
      "Mostly grasses or sedges, it turns out. Paranthropus boisei has the largest cheek teeth and the most massive jaw of any hominin, and it was nicknamed for the hard foods it was assumed to crack. Carbon isotopes in its tooth enamel tell another story: about three quarters of its diet came from plants that use the C4 pathway, meaning tropical grasses and sedges, a higher share than in any other hominin measured.[@cerling-2011] Its South African cousin P. robustus ate a more mixed diet.[@sponheimer-2013] The huge jaw seems to have been for grinding large amounts of tough, low-quality food.",
    status: "strong",
    statusRationale:
      "Isotope results are consistent across many individuals and sites. They identify the type of plant, and whether that meant grass blades, sedge tubers, or something else is inferred.",
    taxonIds: ["boisei", "robustus"],
    sourceIds: ["cerling-2011", "sponheimer-2013"],
    relatedClaimIds: ["paranthropus-side"],
  },
  {
    id: "adna-trust",
    question: "How can DNA tens of thousands of years old be trusted?",
    summary:
      "Because old DNA carries marks that fresh DNA lacks. It survives only as very short fragments, and the ends of those fragments accumulate a characteristic chemical damage that makes one DNA letter read as another.[@briggs-2007] A sequence with that pattern is ancient; a long, undamaged one is contamination from the people who handled the bone. Laboratories work in clean rooms, estimate contamination statistically, and repeat key results on different bones. The first Neanderthal genome was assembled this way,[@green-2010] and later methods that capture single DNA strands gave genomes as accurate as those of living people.[@meyer-2012] There is a limit: the oldest hominin nuclear DNA so far, from Sima de los Huesos, is about 430 thousand years old and comes from an unusually cold, stable cave.[@meyer-2016]",
    status: "settled",
    statusRationale:
      "The damage patterns are chemically understood, the results are reproduced across laboratories, and independent bones from the same population give consistent genomes.",
    taxonIds: ["neanderthal", "denisovan"],
    sourceIds: ["briggs-2007", "green-2010", "meyer-2012", "meyer-2016", "paabo-2014"],
    relatedClaimIds: ["introgression", "denisovan-distinct"],
  },
  {
    id: "oldest-art",
    question: "Who made the first art?",
    summary:
      "The oldest securely dated pictures are in Indonesia: a painted scene of human-like figures and a pig on Sulawesi is at least 51 thousand years old,[@oktaviana-2024] and a painted pig nearby at least 45 thousand.[@brumm-2021] Abstract marking is older. A piece of ochre from Blombos Cave in South Africa was engraved with a cross-hatched pattern about 77 thousand years ago.[@henshilwood-2002] Whether Neanderthals made art is disputed. Mineral crusts over red marks in three Spanish caves were dated to more than 64 thousand years, before sapiens reached Iberia,[@hoffmann-2018] but the dating method and the samples have both been challenged. Their use of pigments and shell ornaments is on firmer ground.[@zilhao-2010]",
    status: "contested",
    statusRationale:
      "The Indonesian and South African dates are widely accepted as minimum ages. Neanderthal authorship of cave paintings rests on contested uranium-thorium dates.",
    taxonIds: ["sapiens", "neanderthal"],
    sourceIds: ["oktaviana-2024", "brumm-2021", "henshilwood-2002", "hoffmann-2018", "zilhao-2010"],
    relatedClaimIds: ["behavior-revolution", "neanderthal-mind"],
  },
];

export const claimById = Object.fromEntries(claims.map((c) => [c.id, c]));
export const featuredClaims = claims.filter((c) => c.featured);
