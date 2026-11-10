export interface Term {
  id: string;
  term: string;
  /** Other spellings to recognise in running text. */
  aliases?: string[];
  def: string;
}

/** Plain-language definitions, shown as hover notes wherever the word appears. */
export const glossary: Term[] = [
  { id: "hominin", term: "hominin", aliases: ["hominins"], def: "Any species more closely related to living humans than to chimpanzees. Every species on this site is a hominin." },
  { id: "bipedalism", term: "bipedalism", aliases: ["bipedal", "bipedality", "bipeds", "biped"], def: "Walking upright on two legs as the normal way of getting around. It leaves marks on the pelvis, knee, foot and the base of the skull, so it can be read from fossils." },
  { id: "ka", term: "ka", def: "Thousand years ago. 300 ka is 300,000 years before the present." },
  { id: "ma", term: "Ma", def: "Million years ago. 1.8 Ma is 1,800,000 years before the present." },
  { id: "cranial-capacity", term: "cranial capacity", aliases: ["brain volume", "brain size"], def: "The volume inside the braincase, in cubic centimetres. It is the usual stand-in for brain size in fossils. Living people average about 1,350 cc; chimpanzees about 400 cc." },
  { id: "foramen-magnum", term: "foramen magnum", def: "The hole at the base of the skull where the spinal cord exits. It sits further forward in animals that hold the head on top of an upright spine." },
  { id: "prognathism", term: "prognathism", aliases: ["prognathic"], def: "Forward projection of the jaws beyond the upper face. Strong in apes and early hominins, slight in modern humans." },
  { id: "sagittal-crest", term: "sagittal crest", def: "A ridge of bone along the top of the skull that anchors very large chewing muscles. Seen in gorillas and in Paranthropus." },
  { id: "brow-ridge", term: "brow ridge", aliases: ["brow ridges", "supraorbital torus"], def: "A bar of bone above the eye sockets. Heavy in Homo erectus and Neanderthals, nearly absent in modern humans." },
  { id: "occipital-bun", term: "occipital bun", def: "A rounded bulge at the back of the skull, typical of Neanderthals." },
  { id: "canine", term: "canines", aliases: ["canine teeth"], def: "The pointed teeth beside the incisors. Male apes have large, sharpened ones; reduced canines are one of the earliest hominin traits." },
  { id: "dimorphism", term: "sexual dimorphism", def: "Difference in size or shape between males and females of a species. High dimorphism in early hominins makes it hard to tell one variable species from two." },
  { id: "type-specimen", term: "type specimen", aliases: ["holotype", "type cranium"], def: "The single fossil a species name is formally tied to. If later finds are judged the same species, they take its name." },
  { id: "oldowan", term: "Oldowan", def: "The oldest widespread stone tool tradition, from about 2.6 million years ago: simple flakes struck from cobbles." },
  { id: "acheulean", term: "Acheulean", aliases: ["Acheulian", "handaxes", "handaxe"], def: "A stone tool tradition known for large, symmetrical handaxes, from about 1.76 million years ago. Usually associated with Homo erectus and later Middle Pleistocene people." },
  { id: "mousterian", term: "Mousterian", def: "A flake-based tool tradition of the Middle Palaeolithic, made mainly by Neanderthals and by early sapiens in the Levant." },
  { id: "pleistocene", term: "Pleistocene", aliases: ["Middle Pleistocene", "Late Pleistocene", "Early Pleistocene"], def: "The geological epoch from 2.58 million to 11,700 years ago, marked by repeated ice ages. The Middle Pleistocene runs from about 774 to 129 thousand years ago." },
  { id: "miocene", term: "Miocene", def: "The epoch from 23 to 5.3 million years ago. The human and chimpanzee lineages separated near its end." },
  { id: "pliocene", term: "Pliocene", def: "The epoch from 5.3 to 2.58 million years ago, the time of Ardipithecus and most Australopithecus." },
  { id: "mtdna", term: "mitochondrial DNA", aliases: ["mtDNA"], def: "A small loop of DNA inherited only from the mother. It is abundant in cells, so it is often the first DNA recovered from old bones, but it tells the story of a single line of descent." },
  { id: "nuclear-genome", term: "nuclear genome", aliases: ["nuclear genomes", "nuclear DNA"], def: "The bulk of an organism’s DNA, inherited from both parents. It records thousands of independent lines of descent and so gives a far fuller picture than mitochondrial DNA." },
  { id: "introgression", term: "introgression", aliases: ["admixture", "interbreeding", "gene flow"], def: "DNA passing from one population into another when they have children together. Non-African people carry about 1–2% Neanderthal DNA from such episodes." },
  { id: "proteomics", term: "proteomics", aliases: ["palaeoproteomics", "ancient proteins"], def: "Identifying a fossil from its surviving proteins. Proteins outlast DNA, so the method reaches fossils too old or too warm for genetics, though it resolves relationships less finely." },
  { id: "molecular-clock", term: "molecular clock", aliases: ["genetic clocks", "genetic clock"], def: "Estimating when two lineages split from the number of DNA differences between them and an assumed mutation rate. The dates shift when the assumed rate does." },
  { id: "effective-population", term: "effective population size", aliases: ["ancestral population size", "population bottleneck", "bottleneck"], def: "The size of an idealised breeding population that would hold the genetic variation actually observed. For human ancestors it has stayed in the thousands, which rules out descent from a single couple in the last several hundred thousand years." },
  { id: "genealogical-ancestor", term: "genealogical ancestor", aliases: ["genealogical ancestors", "genealogical ancestry"], def: "Anyone in your family tree, whether or not you inherited any DNA from them. A few thousand years back, almost everyone alive who left descendants is a genealogical ancestor of everyone living now." },
  { id: "monogenism", term: "monogenism", def: "The doctrine that all humans descend from one original couple. Its counterpart, polygenism, holds that humanity began as a population." },
  { id: "de-novo", term: "de novo", def: "Latin for “from new”. In this context, created directly instead of born to parents." },
  { id: "phylogeny", term: "phylogeny", aliases: ["phylogenetic", "clade"], def: "The branching pattern of descent that links species. A clade is one branch: an ancestor and all its descendants." },
  { id: "sundaland", term: "Sundaland", aliases: ["Sunda"], def: "The land exposed when ice-age sea levels dropped, joining Sumatra, Java and Borneo to mainland Asia." },
  { id: "sahul", term: "Sahul", def: "The ice-age continent formed when lower seas joined Australia, New Guinea and Tasmania. Reaching it from Asia always required crossing open water." },
  { id: "beringia", term: "Beringia", aliases: ["Beringian"], def: "The land bridge between Siberia and Alaska exposed during ice ages, and the route by which people entered the Americas." },
  { id: "levant", term: "Levant", aliases: ["Levantine"], def: "The eastern shore of the Mediterranean: modern Israel, Palestine, Lebanon, Syria and Jordan. It is the land corridor between Africa and Eurasia." },
  { id: "c4", term: "C4", def: "A photosynthetic pathway used by tropical grasses and sedges. It leaves a chemical signature in tooth enamel, so diets rich in these plants (or in animals that ate them) can be detected." },
];

glossary.push(
  { id: "gene", term: "gene", aliases: ["genes"], def: "A stretch of DNA that carries the instructions for one product, usually a protein. Humans have about 20,000." },
  { id: "allele", term: "allele", aliases: ["alleles", "gene variant", "gene variants", "variant", "variants"], def: "One of the alternative versions of a gene. You inherit one from each parent, and they may be the same or different." },
  { id: "mutation", term: "mutation", aliases: ["mutations"], def: "A change in the DNA sequence, most often a copying error when a cell divides. Mutations are the only source of brand-new genetic variation." },
  { id: "natural-selection", term: "natural selection", def: "The process by which heritable traits that help their carriers survive and reproduce become more common over generations." },
  { id: "genetic-drift", term: "genetic drift", aliases: ["drift"], def: "Change in how common a gene variant is that comes from chance alone: which individuals happen to have children, and which copy each child happens to inherit. It is strongest in small populations." },
  { id: "fitness", term: "fitness", def: "In biology, the number of surviving offspring an individual leaves compared with others. It has nothing to do with strength or worth." },
  { id: "modern-synthesis", term: "modern synthesis", def: "The joining, in the 1930s and 1940s, of Darwin’s natural selection with Mendel’s genetics. It recast evolution as change in the frequency of gene variants within populations." },
  { id: "common-descent", term: "common descent", aliases: ["common ancestors", "common ancestor"], def: "The finding that different species trace back to shared ancestral populations, so that all living things are related, some closely and some very distantly." },
  { id: "chromosome", term: "chromosome", aliases: ["chromosomes"], def: "One of the long packaged molecules of DNA in a cell. Humans have 23 pairs; chimpanzees and gorillas have 24." },
);

export const termById = Object.fromEntries(glossary.map((t) => [t.id, t]));
