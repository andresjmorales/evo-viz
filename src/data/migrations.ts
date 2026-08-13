import type { Migration } from "./types";

export const migrations: Migration[] = [
  {
    id: "ooa1",
    taxonId: "erectus",
    label: "First extra-African Homo",
    startKa: 1850,
    endKa: 1600,
    fromSiteId: "koobi-fora",
    toSiteId: "dmanisi",
    via: [
      [15, 36],
      [30, 35],
      [37, 38],
    ],
    status: "strong",
    notes:
      "Dmanisi at ~1.8 Ma is the best-dated early exit. Java is in the same broad window. This is erectus-grade, not sapiens.",
    sourceIds: ["lordkipanidze-2013", "anton-2003"],
  },
  {
    id: "acheulean-spread",
    taxonId: "heidelbergensis",
    label: "Acheulean into Europe",
    startKa: 800,
    endKa: 500,
    fromSiteId: "bodo",
    toSiteId: "atapuerca",
    status: "contested",
    notes:
      "Handaxe-making populations move through the Levant into Europe. Who carries them (erectus vs heidelbergensis vs antecessor) depends on the species names you like.",
    sourceIds: ["rightmire-2008", "stringer-2016"],
  },
  {
    id: "neanderthal-east",
    taxonId: "neanderthal",
    label: "Neanderthals across Eurasia",
    startKa: 250,
    endKa: 50,
    fromSiteId: "atapuerca",
    toSiteId: "altai",
    via: [
      [45, 20],
      [48, 40],
      [50, 60],
    ],
    status: "strong",
    notes:
      "From Iberia to the Altai. They meet Denisovans in the east (Denisova 11, “Denny”).",
    sourceIds: ["prufer-2014", "slon-2018", "higham-2014"],
  },
  {
    id: "denisovan-asia",
    taxonId: "denisovan",
    label: "Denisovan range (inferred)",
    startKa: 300,
    endKa: 40,
    fromSiteId: "denisova",
    toSiteId: "xiahe",
    via: [[43, 95]],
    status: "contested",
    notes:
      "Fossils are Siberian and Tibetan; genetics imply a wide Asian range including ancestors of people who later reached Sahul. The map is mostly DNA, not skulls.",
    sourceIds: ["reich-2010", "chen-2019", "jacobs-2019"],
  },
  {
    id: "ooa2",
    taxonId: "sapiens",
    label: "Major sapiens expansion",
    startKa: 70,
    endKa: 50,
    fromSiteId: "omo",
    toSiteId: "qafzeh",
    via: [
      [15, 38],
      [22, 38],
      [28, 35],
    ],
    status: "strong",
    notes:
      "The wave that peopled Eurasia, with Neanderthal mixing near the first contacts. Earlier Levantine sapiens (Skhul, Qafzeh, Misliya) may be separate pulses.",
    sourceIds: ["henn-2012", "bergstrom-2021", "green-2010"],
  },
  {
    id: "europe-up",
    taxonId: "sapiens",
    label: "Into Europe",
    startKa: 47,
    endKa: 40,
    fromSiteId: "qafzeh",
    toSiteId: "atapuerca",
    status: "strong",
    notes:
      "Overlaps the last Neanderthals. Mixing happened (Oase 1). Replacement was not instantaneous.",
    sourceIds: ["higham-2014", "fu-2015"],
  },
  {
    id: "sahul",
    taxonId: "sapiens",
    label: "Into Sahul (Australia / New Guinea)",
    startKa: 65,
    endKa: 50,
    fromSiteId: "qafzeh",
    toSiteId: "madjedbebe",
    via: [
      [20, 70],
      [10, 100],
      [0, 120],
    ],
    status: "strong",
    notes:
      "Madjedbebe ~65 ka is the headline date (still discussed). Denisovan ancestry in Papuan and Australian peoples records meetings along the way.",
    sourceIds: ["clarkson-2017", "jacobs-2019"],
  },
  {
    id: "americas",
    taxonId: "sapiens",
    label: "Into the Americas",
    startKa: 23,
    endKa: 14,
    fromSiteId: "altai",
    toSiteId: "clovis-range",
    via: [
      [55, 140],
      [65, -170],
      [60, -140],
    ],
    status: "contested",
    notes:
      "Beringian entry is settled as the route; the exact first date is a live fight (pre-Last Glacial Maximum claims vs a later pulse).",
    sourceIds: ["henn-2012", "bergstrom-2021"],
  },
];

export const migrationById = Object.fromEntries(
  migrations.map((m) => [m.id, m]),
);
