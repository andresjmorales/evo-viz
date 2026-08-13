export interface StoryBeat {
  id: string;
  ka: number;
  title: string;
  lede: string;
  body: string;
  taxonIds: string[];
}

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "walk",
    ka: 3200,
    title: "Walk first",
    lede: "Big brains come later. Feet come first.",
    body: "By about 3.2 million years ago, Australopithecus afarensis (Lucy’s species) is already a biped with an ape-sized brain. The Laetoli footprints are a walk, not a guess. Climbing arms remain. This is the first beat of the human story: upright, small-headed, African.",
    taxonIds: ["afarensis"],
  },
  {
    id: "leave",
    ka: 1750,
    title: "A human body leaves Africa",
    lede: "Homo erectus is the first long-legged traveler.",
    body: "Around 1.8 million years ago an erectus-grade body — long legs, a projecting nose, a still-thick brow — is in the Caucasus (Dmanisi) and soon after on Java. This is not us. It is the first time a hominin is at home outside Africa. Fire, handaxes, and a spreading geographic range belong to this chapter.",
    taxonIds: ["erectus"],
  },
  {
    id: "cousins",
    ka: 80,
    title: "Cousins, not rungs on a ladder",
    lede: "Neanderthals, Denisovans, and sapiens overlap.",
    body: "In the last few hundred thousand years, large-brained humans share Eurasia. Neanderthals are western. Denisovans are eastern (named from DNA, now maybe Dragon Man / Homo longi). Sapiens arise in structured African populations, then mix with both. The old poster of one species replacing the last is a cartoon. The real picture is a bush with gene flow.",
    taxonIds: ["neanderthal", "denisovan", "sapiens"],
  },
  {
    id: "now",
    ka: 0,
    title: "We remain",
    lede: "One species, with archaic DNA still in us.",
    body: "Neanderthals are gone as a people by about 40,000 years ago. Denisovans vanish from the fossil record. Sapiens keep going, carrying ~1–2% Neanderthal ancestry outside Africa and extra Denisovan ancestry in some Oceanian groups. The family did not disappear. It folded in.",
    taxonIds: ["sapiens"],
  },
];

export const TRIO = [
  {
    id: "erectus",
    label: "erectus",
    when: "1.8 Ma – 110 ka",
    line: "First human body plan. First out of Africa.",
  },
  {
    id: "neanderthal",
    label: "Neanderthal",
    when: "400 – 40 ka",
    line: "Eurasian cousin. Large brain. We mixed.",
  },
  {
    id: "sapiens",
    label: "sapiens",
    when: "315 ka – now",
    line: "Us. African origin, then a worldwide wave.",
  },
] as const;

export function beatForKa(ka: number): StoryBeat {
  let current = STORY_BEATS[0];
  for (const beat of STORY_BEATS) {
    if (ka <= beat.ka) current = beat;
  }
  return current;
}

export function isAlive(rangeStartKa: number, rangeEndKa: number, ka: number): boolean {
  return ka <= rangeStartKa && ka >= rangeEndKa;
}
