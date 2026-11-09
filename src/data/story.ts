export interface Chapter {
  id: string;
  /** The chapter begins at this time (ka) and runs until the next one. */
  ka: number;
  kicker: string;
  title: string;
  body: string;
  taxonIds: string[];
  claimId?: string;
  /** Where the globe should look: [lat, lon]. */
  focus: [number, number];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "split",
    ka: 7200,
    kicker: "7 million years ago",
    title: "An African ape stands apart",
    body: "Our lineage and the chimpanzee lineage part ways somewhere in Africa. The first candidates on our side are scraps: a crushed skull from Chad, a thigh bone from Kenya. Whether they walked upright is still argued.",
    taxonIds: ["sahelanthropus", "orrorin"],
    claimId: "sahel-hominin",
    focus: [8, 24],
  },
  {
    id: "walk",
    ka: 4500,
    kicker: "4.4 – 3 million years ago",
    title: "Walking comes first",
    body: "Long before big brains, there are upright bodies. Ardi still has a grasping foot. A million years later Lucy’s species leaves human-like footprints in volcanic ash at Laetoli, with a brain no bigger than a chimpanzee’s.",
    taxonIds: ["ardipithecus", "anamensis", "afarensis"],
    claimId: "bipedalism-first",
    focus: [4, 36],
  },
  {
    id: "bush",
    ka: 2800,
    kicker: "2.8 – 1.9 million years ago",
    title: "The family becomes a bush",
    body: "Several kinds of hominin now share Africa. Heavy-jawed Paranthropus chews tough plants. Early Homo has smaller teeth, a somewhat larger brain, and stone tools. Several branches of the family are alive at once.",
    taxonIds: ["africanus", "boisei", "robustus", "habilis", "rudolfensis"],
    claimId: "early-homo-mess",
    focus: [-6, 32],
  },
  {
    id: "leave",
    ka: 1950,
    kicker: "1.9 million years ago",
    title: "A human body leaves Africa",
    body: "Homo erectus has long legs, a large body and a taste for travel. Within a couple of hundred thousand years its relatives are in Georgia, then Java and China. It is the first hominin at home on more than one continent, and it lasts well over a million years.",
    taxonIds: ["erectus"],
    claimId: "out-of-africa-1",
    focus: [24, 62],
  },
  {
    id: "brains",
    ka: 800,
    kicker: "800 – 300 thousand years ago",
    title: "Bigger brains, colder places",
    body: "Brains pass 1,100 cubic centimetres. People with handaxes, spears and fire push into ice-age Europe. Somewhere in this poorly sorted crowd, often labelled Homo heidelbergensis, are the ancestors of Neanderthals, Denisovans and ourselves.",
    taxonIds: ["antecessor", "heidelbergensis"],
    claimId: "heidelberg-real",
    focus: [34, 20],
  },
  {
    id: "several",
    ka: 320,
    kicker: "300 thousand years ago",
    title: "A planet of several humans",
    body: "At least five kinds of human are alive at once. Neanderthals hold western Eurasia and Denisovans the east. Small-brained Homo naledi lives in southern Africa and tiny Homo floresiensis on an Indonesian island. In Africa, the earliest Homo sapiens appear.",
    taxonIds: ["neanderthal", "denisovan", "sapiens", "naledi", "floresiensis"],
    claimId: "denisovan-distinct",
    focus: [30, 62],
  },
  {
    id: "meet",
    ka: 72,
    kicker: "70 – 40 thousand years ago",
    title: "We leave Africa, and meet the cousins",
    body: "One expansion of Homo sapiens spreads along Asia’s southern coast to Australia and north into Europe and Siberia. Along the way they meet Neanderthals and Denisovans and have children with them. Most people alive today still carry that DNA.",
    taxonIds: ["sapiens", "neanderthal", "denisovan"],
    claimId: "introgression",
    focus: [16, 96],
  },
  {
    id: "alone",
    ka: 39,
    kicker: "40 thousand years ago to now",
    title: "The last ones standing",
    body: "Neanderthals fade out by about 40 thousand years ago and Denisovans soon after. Sapiens cross Beringia, run the length of the Americas, and finally sail to the far Pacific islands. For the first time in millions of years there is only one kind of human.",
    taxonIds: ["sapiens"],
    claimId: "neanderthal-extinction",
    focus: [28, -122],
  },
];

export function chapterIndexForKa(ka: number): number {
  let idx = 0;
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (ka <= CHAPTERS[i].ka) idx = i;
  }
  return idx;
}

export function isAlive(startKa: number, endKa: number, ka: number): boolean {
  return ka <= startKa && ka >= endKa;
}

/** Documented episodes of interbreeding, drawn as links on the family tree. */
export interface GeneFlow {
  id: string;
  a: string;
  b: string;
  ka: number;
  label: string;
  claimId: string;
}

export const GENE_FLOW: GeneFlow[] = [
  {
    id: "nea-sap",
    a: "neanderthal",
    b: "sapiens",
    ka: 50,
    label: "Neanderthal DNA enters sapiens (about 50–45 ka)",
    claimId: "introgression",
  },
  {
    id: "den-sap",
    a: "denisovan",
    b: "sapiens",
    ka: 45,
    label: "Denisovan DNA enters sapiens in Asia and Oceania",
    claimId: "introgression",
  },
  {
    id: "nea-den",
    a: "neanderthal",
    b: "denisovan",
    ka: 90,
    label: "“Denny”: Neanderthal mother, Denisovan father (about 90 ka)",
    claimId: "denisovan-distinct",
  },
];
