/**
 * Short primers on how the evidence is produced. Each names real studies on
 * this site that used the method, so the reader can see it at work.
 */
export interface Method {
  id: string;
  title: string;
  short: string;
  body: string[];
  limits: string;
  sourceIds: string[];
}

export const methods: Method[] = [
  {
    id: "dating-ash",
    title: "Dating volcanic ash",
    short: "How a layer of ash puts a number on a fossil millions of years old.",
    body: [
      "East Africa’s fossil beds are stacked with layers of volcanic ash. Crystals in the ash contain radioactive potassium, which decays to argon gas at a fixed rate. When the crystal forms in an eruption it holds no argon, so the amount that has built up since is a clock.",
      "The ash is dated, and the fossil takes its age from the layers above and below it. Omo Kibish was re-dated this way: the skeleton lies under an ash from a huge eruption now matched to 233 thousand years ago, so it must be at least that old.[@vidal-2022] Each ash also has a chemical fingerprint, which lets one eruption tie together sites hundreds of kilometres apart.",
    ],
    limits:
      "It dates the eruption, so the fossil’s age is a bracket. It needs volcanoes: most of the South African caves and all of the Chinese and European sites must be dated another way.",
    sourceIds: ["vidal-2022", "lepre-2011"],
  },
  {
    id: "dating-magnetic",
    title: "Reading magnetic reversals",
    short: "The Earth’s magnetic field has flipped many times, and sediment remembers.",
    body: [
      "Every few hundred thousand years the Earth’s magnetic poles swap. Iron grains settling in mud line up with the field of the day and are locked in. A thick sequence of sediment therefore carries a striped pattern of normal and reversed layers, and the pattern is the same worldwide and dated independently.",
      "Matching a site’s stripes to the global sequence gave the 1.76-million-year age for the oldest handaxes[@lepre-2011] and the 2.1-million-year age for stone tools on China’s Loess Plateau.[@zhu-2018]",
    ],
    limits:
      "A stripe tells you which interval you are in, so the method needs a long, unbroken sequence and usually one other date to anchor the match.",
    sourceIds: ["lepre-2011", "zhu-2018"],
  },
  {
    id: "dating-radiocarbon",
    title: "Radiocarbon",
    short: "The best clock for the last 50,000 years, and its pitfalls.",
    body: [
      "Living things take in a little radioactive carbon-14 and stop when they die. Half of it decays every 5,730 years, so the fraction left gives the time since death. The raw result is then corrected against tree rings and other records, because the amount of carbon-14 in the air has varied.",
      "After about 50 thousand years too little remains to measure, and even a trace of modern carbon makes an old sample look young. Cleaning methods introduced in the 2000s pushed many Neanderthal sites thousands of years older and produced the current figure of about 40 thousand years for their disappearance.[@higham-2014] The White Sands footprints show the method being cross-checked: dates on seeds were questioned, then confirmed with pollen and with a second, unrelated technique.[@pigati-2023]",
    ],
    limits: "Useless beyond about 50 thousand years, and very sensitive to contamination near that limit.",
    sourceIds: ["higham-2014", "pigati-2023"],
  },
  {
    id: "dating-trapped",
    title: "Luminescence and uranium clocks",
    short: "Dating sand grains, teeth and cave crusts where there is no ash and no carbon.",
    body: [
      "Buried sand grains soak up natural radiation and store the energy; sunlight empties the store. Measuring the stored energy tells how long a grain has been in the dark. This is how sediment around the oldest artefacts in northern Australia was dated to about 65 thousand years.[@clarkson-2017]",
      "Uranium dissolves in water and its decay product thorium does not, so a cave crust or a tooth starts with uranium only and thorium builds up at a known rate. That clock dated the Kabwe skull to about 300 thousand years[@grun-2020] and the crusts over painted marks in Spanish caves.[@hoffmann-2018] Homo naledi was dated by combining several such methods, which is now standard for cave sites.[@dirks-2017]",
    ],
    limits:
      "Each method depends on assumptions about past radiation or about uranium moving in and out of the sample. Results are most trusted when independent methods agree.",
    sourceIds: ["clarkson-2017", "grun-2020", "hoffmann-2018", "dirks-2017"],
  },
  {
    id: "ancient-molecules",
    title: "Ancient DNA and ancient proteins",
    short: "What can be recovered from a bone, how far back, and how it is checked.",
    body: [
      "DNA starts breaking down at death. What survives is short fragments with a telltale pattern of chemical damage at their ends, which is how genuine old DNA is told from contamination.[@briggs-2007] Cold, stable caves preserve it best. The oldest hominin nuclear DNA so far is about 430 thousand years old, from Sima de los Huesos in Spain.[@meyer-2016]",
      "Proteins last longer. The sequence of amino acids in tooth enamel or bone collagen differs slightly between lineages, enough to place a fossil on a tree. Proteins tied a jaw from the Tibetan Plateau to the Denisovans[@chen-2019] and placed 800-thousand-year-old Homo antecessor near the common ancestor of later humans.[@welker-2020]",
    ],
    limits:
      "DNA is gone from almost all African and Asian fossils older than a few tens of thousands of years, because heat destroys it. Proteins reach further but carry far less information.",
    sourceIds: ["briggs-2007", "meyer-2016", "chen-2019", "welker-2020"],
  },
  {
    id: "split-dates",
    title: "Estimating when lineages split",
    short: "Counting DNA differences, and why the answer comes with wide error bars.",
    body: [
      "Mutations accumulate at a roughly steady rate. Count the differences between two genomes, divide by the rate, and you have the time since they shared an ancestor. The Neanderthal and Denisovan genomes were dated against ours this way.[@prufer-2014]",
      "The difficulty is the rate. Estimates from comparing parents with their children are about half those once inferred from fossils, and switching between them doubles a date. Populations also do not split cleanly: they separate gradually and keep exchanging genes. A single genome does, though, record the size of its ancestral population through time, which is how we know our ancestors were never reduced to a single couple.[@li-durbin-2011]",
      "Dated fossils set limits. Because the Sima de los Huesos people were already on the Neanderthal side at 430 thousand years, the split from our lineage must be older than that.[@meyer-2016]",
    ],
    limits:
      "Genetic dates describe when populations stopped sharing genes, which can be long after or before a visible change in the bones. They shift whenever the assumed mutation rate does.",
    sourceIds: ["prufer-2014", "li-durbin-2011", "meyer-2016"],
  },
  {
    id: "reading-bipedalism",
    title: "Telling a biped from its bones",
    short: "Which parts of a skeleton show that an animal walked upright.",
    body: [
      "Upright walking reshapes the body from the skull down. The hole where the spinal cord leaves the skull moves forward and underneath. The pelvis becomes short and bowl-shaped. The thigh bone angles inward so the knees sit under the body, and its neck thickens in a particular pattern. The foot gains an arch and the big toe lines up with the others.",
      "Lucy’s skeleton shows most of these at 3.2 million years.[@johanson-1976] Ardi, at 4.4 million, has an upright pelvis above a foot that could still grasp.[@white-2009] For Orrorin, at six million years, the case rests on the shape of one thigh bone.[@richmond-2008] Footprints, as at Laetoli, are the most direct evidence there is.",
    ],
    limits:
      "A single bone shows that a joint was loaded as in a biped, and says little about how much of the day the animal spent upright or in trees.",
    sourceIds: ["johanson-1976", "white-2009", "richmond-2008"],
  },
  {
    id: "reading-diet",
    title: "Reading diet from teeth",
    short: "Chemistry and scratches record what an animal ate.",
    body: [
      "Tropical grasses and sedges use a different kind of photosynthesis from trees and shrubs, and it leaves a distinct ratio of carbon isotopes in the plant. That ratio is passed up the food chain and locked into tooth enamel as it forms. A sliver of enamel from a fossil therefore shows how much of the diet came from each kind of plant.[@sponheimer-2013]",
      "The method overturned a famous nickname. Paranthropus boisei, the “Nutcracker Man”, turned out to have eaten mostly grasses or sedges.[@cerling-2011] Microscopic scratches and pits on the chewing surface add a second line of evidence, recording how hard or tough the last few weeks of meals were.",
    ],
    limits:
      "Isotopes distinguish broad plant types. They cannot tell grass from sedge, or a plant-eater from an animal that ate plant-eaters.",
    sourceIds: ["sponheimer-2013", "cerling-2011"],
  },
  {
    id: "naming-species",
    title: "How a fossil species gets its name",
    short: "Type specimens, lumpers and splitters, and why names keep changing.",
    body: [
      "A species name is tied to one fossil, the type specimen, and a published list of the features that set it apart. Homo habilis was defined in 1964 on a jaw and skull fragments from Olduvai Gorge.[@leakey-1964] Every later find is then compared with the type and judged to fall inside or outside the range of variation one species could show.",
      "That judgement is where specialists differ. Living species cannot be tested for interbreeding once extinct, and bones from one population vary with age and sex. The five skulls from Dmanisi differ so much that their describers argued several African “species” should be merged.[@lordkipanidze-2013] Others have argued that habilis should not be in Homo at all.[@wood-collard-1999] The names on this site are best read as hypotheses that the evidence is still testing.",
    ],
    limits:
      "Species boundaries in fossils are inferred from shape alone. DNA has shown that groups named as separate species, such as Neanderthals and sapiens, could and did have children together.",
    sourceIds: ["leakey-1964", "lordkipanidze-2013", "wood-collard-1999"],
  },
  {
    id: "climate-record",
    title: "Reconstructing past climate and sea level",
    short: "How mud from the ocean floor yields a temperature record five million years long.",
    body: [
      "Water containing the lighter form of oxygen evaporates more easily. During an ice age that lighter water is locked up in ice sheets, leaving the ocean enriched in the heavy form. Tiny shelled organisms on the sea floor build that ratio into their shells, and their remains pile up layer by layer. A core drilled through the mud is a continuous record of ice volume and deep-sea temperature.",
      "Fifty-seven such cores from around the world were combined into the single curve drawn under the family tree on this site.[@lisiecki-2005] Sea level follows from ice volume, and for the last 800 thousand years it has been reconstructed directly from several independent records.[@spratt-2016] Combined with measured sea-floor depths, that gives the shifting coastlines on the globe.",
    ],
    limits:
      "The curve is a global average. Local climate, which is what an animal experiences, could differ. Sea level before 800 thousand years ago is scaled from the oxygen record and is a rough guide.",
    sourceIds: ["lisiecki-2005", "spratt-2016"],
  },
];

export const methodById = Object.fromEntries(methods.map((m) => [m.id, m]));
